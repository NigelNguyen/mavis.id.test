/* eslint-disable @typescript-eslint/no-explicit-any */
import { Struct } from "@bufbuild/protobuf"

import { DEFAULT_OPTIONAL_PARAMS, DEFAULT_TRACKING_OPTS } from "../common/default-opts"
import { LockboxClientError } from "../common/error-client"
import { LockboxServerError } from "../common/error-server"
import { AuthenticateRequest, AuthenticateResponse } from "../proto/rpc/proto/v1/auth_pb"
import { Error as ProtoError, Frame, Session, Type } from "../proto/rpc/proto/v1/rpc_pb"
import { TrackingOpts } from "../types/wasm-params"
import { validateToken } from "../utils/access-token"
import { base64ToBytes, bytesToBase64 } from "../utils/base64"
import { bytesToJson, jsonToBytes } from "../utils/json"
import { openWebsocket } from "../utils/socket"
import { getWasmInstance } from "../wasm"
import {
  DoResponse,
  KeygenHandler,
  KeygenResult,
  Kind,
  WasmAuthResult,
  WasmKgResult,
} from "./keygen-typed"

// * get handler utils from wasm
const getKeygenHandler = async (wasmUrl: string) => {
  const instance = (await getWasmInstance(wasmUrl)) as any

  try {
    const result = await instance.keygen()

    if (result) {
      return result as KeygenHandler
    }
  } catch (error) {
    /* empty */
  }

  throw new LockboxClientError("KeygenFail", "genMpc: could not get keygen handler")
}

const startKeygen = async (kgHandler: KeygenHandler, paramStr: string) => {
  try {
    const doResponse = await kgHandler.do(paramStr)

    const result = bytesToJson(doResponse) as DoResponse

    if (result.data) {
      return result.data
    }
  } catch (error) {
    /* empty */
  }

  throw new LockboxClientError("KeygenFail", "genMpc: could not get 'do' response")
}

// * wasm => socket
const sendAuth = async (kgHandler: KeygenHandler, socket: WebSocket) => {
  console.debug("🔒 KEYGEN: auth start")
  // * get authentication data from wasm
  let authData: WasmAuthResult | undefined

  try {
    const rx = await kgHandler.rx()
    authData = bytesToJson(rx) as WasmAuthResult
  } catch (error) {
    throw new LockboxClientError("KeygenFail", "genMpc: could NOT get auth data")
  }

  const { kind, data } = authData ?? {}
  if (kind !== Kind.Authenticate || !data) {
    throw new LockboxClientError("KeygenFail", "genMpc: auth data is NOT valid")
  }

  // * forward auth data to lockbox service
  try {
    const authWsRequest = new AuthenticateRequest({
      token: data.accessToken,
      optionalData: Struct.fromJson({ requestId: data.requestID }),
    })
    const authWsRequestFrame = new Frame({
      type: Type.DATA,
      data: authWsRequest.toBinary(),
    })

    socket.send(authWsRequestFrame.toBinary())
  } catch (error) {
    throw new LockboxClientError("KeygenFail", "genMpc: could NOT auth with server")
  }
}
const sendKeygen = async (kgHandler: KeygenHandler, socket: WebSocket) => {
  console.debug("🔒 KEYGEN: keygen round start")
  let kgR1Data: WasmKgResult | undefined

  try {
    const rx = await kgHandler.rx()
    kgR1Data = bytesToJson(rx) as WasmKgResult
  } catch (error) {
    throw new LockboxClientError("KeygenFail", "genMpc: could NOT get keygen data")
  }

  const { kind, data } = kgR1Data ?? {}
  if (kind !== Kind.Protocol || !data) {
    throw new LockboxClientError("KeygenFail", "genMpc: keygen data is NOT valid")
  }

  // * forward keygen data to lockbox service
  try {
    const kgFrame = new Frame({
      type: Type.DATA,
      data: base64ToBytes(data),
    })

    socket.send(kgFrame.toBinary())
  } catch (error) {
    throw new LockboxClientError("KeygenFail", "genMpc: could NOT send keygen data to server")
  }
}

// * socket => wasm
const receiveAuthResult = (kgHandler: KeygenHandler, authInBytes: Uint8Array) => {
  const authWsRes = AuthenticateResponse.fromBinary(authInBytes)

  kgHandler.tx(
    jsonToBytes({
      kind: Kind.Authenticate,
      data: {
        uuid: authWsRes.uuid,
        appID: authWsRes.appId,
      },
    }),
  )

  console.debug("🔒 KEYGEN: auth success")
}
const receiveSessionResult = (kgHandler: KeygenHandler, ssInBytes: Uint8Array) => {
  const sessionData = Session.fromBinary(ssInBytes)

  kgHandler.tx(
    jsonToBytes({
      kind: Kind.Protocol,
      data: {
        sessionID: sessionData.sessionId,
      },
    }),
  )

  console.debug("🔒 KEYGEN: session valid")
}
const receiveKgResult = (kgHandler: KeygenHandler, bytes: Uint8Array) => {
  kgHandler.tx(
    jsonToBytes({
      kind: Kind.Protocol,
      data: bytesToBase64(bytes),
    }),
  )

  console.debug("🔒 KEYGEN: keygen round success")
}
const receiveError = (kgHandler: KeygenHandler, errInBytes: Uint8Array) => {
  const error = ProtoError.fromBinary(errInBytes)
  const code = Number(error.code)

  kgHandler.tx(
    jsonToBytes({
      kind: Kind.Error,
      data: {
        code,
        message: error.message,
      },
    }),
  )

  throw new LockboxServerError(code, error.message)
}
const receiveFinish = (kgHandler: KeygenHandler) => {
  kgHandler.tx(
    jsonToBytes({
      kind: Kind.Done,
    }),
  )

  console.debug("🔒 KEYGEN: finish")
}

interface GenMpcOpts {
  wasmUrl: string
  accessToken: string
  wsUrl: string

  trackParams?: TrackingOpts
  timeout?: number
  optionalParams?: string
}

export const genMpc = async (opts: GenMpcOpts): Promise<KeygenResult> => {
  const {
    wasmUrl,
    wsUrl,
    accessToken: rawAccessToken,
    trackParams = DEFAULT_TRACKING_OPTS,
    optionalParams = DEFAULT_OPTIONAL_PARAMS,
    timeout = 10,
  } = opts
  const accessToken = validateToken(rawAccessToken)

  console.debug("🔒 KEYGEN: start")

  const kgHandler = await getKeygenHandler(wasmUrl)
  console.debug("🔒 KEYGEN: wasm is ready")

  const socket = await openWebsocket(`${wsUrl}/v1/public/ws/keygen`, timeout * 1_000)
  console.debug("🔒 KEYGEN: socket is ready")

  let step = 1
  socket.onmessage = event => {
    const responseInBuffer = new Uint8Array(event.data)
    const response = Frame.fromBinary(responseInBuffer)

    switch (response.type) {
      case Type.DATA: {
        if (step == 1) {
          receiveAuthResult(kgHandler, response.data)
          step++
        } else if (step == 2) {
          receiveSessionResult(kgHandler, response.data)
          sendKeygen(kgHandler, socket)
          step++
        } else if (step == 3) {
          receiveKgResult(kgHandler, response.data)
          sendKeygen(kgHandler, socket)
          step++
        } else if (step == 4) {
          receiveKgResult(kgHandler, response.data)
          step++
        } else if (step == 5) {
          receiveKgResult(kgHandler, response.data)
          step++
        }

        break
      }
      case Type.ERROR:
        receiveError(kgHandler, response.data)

        socket.close()
        break
      case Type.DONE:
        receiveFinish(kgHandler)

        socket.close()
        break
      case Type.UNSPECIFIED:
        socket.close()

        throw new LockboxClientError("KeygenFail", "genMpc: UNSPECIFIED server response")
    }
  }

  const params = {
    accessToken: accessToken,
    optionalParams: optionalParams,
  }

  const keygenPromise = startKeygen(kgHandler, JSON.stringify(params))
  sendAuth(kgHandler, socket)

  return await keygenPromise
}
