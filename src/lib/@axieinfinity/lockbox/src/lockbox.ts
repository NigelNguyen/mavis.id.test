import type { Address, Client, Hex, TypedDataDefinition } from "viem"
import { createClient, http } from "viem"
import { saigon } from "viem/chains"

import { VIEM_CHAIN_MAPPING } from "./common/chain"
import { LockboxClientError } from "./common/error-client"
import { LockboxServerError } from "./common/error-server"
import { getServiceEnv, LockboxServiceEnv } from "./common/lockbox-service"
import { WASM_PROD_CDN_URL } from "./common/wasm-cdn"
import { LockboxProviderImpl } from "./provider"
import { getBackupClientShard } from "./services/backup-shard"
import { getPayerInfo } from "./services/payer-info"
import { getSponsorTxs } from "./services/sponsor-txs"
import { getUserProfile } from "./services/user-profile"
import { InMemShardStorage } from "./shard-storage"
import { ShardStorage } from "./types/shard-storage"
import type { GenericTransaction } from "./types/tx"
import type {
  CreateBackupKeyParams,
  DecryptDataV2Params,
  EncryptDataV1Params,
  EncryptDataV2Params,
  GetAddressFromKeyParams,
  GetPayerAccessTokenParams,
  KeyDistributionParams,
  KeygenParams,
  RefreshKeyParams,
  SendTransactionParams,
  SignMessageParams,
  TrackingOpts,
} from "./types/wasm-params"
import type {
  CreateBackupKeyResult,
  DecryptDataV2Result,
  EncryptDataV2Result,
  GetPayerAccessTokenResult,
  KeygenResult,
  SendTransactionResult,
  SignMessageResult,
} from "./types/wasm-result"
import { validateToken } from "./utils/access-token"
import { base64ToHex } from "./utils/base64"
import { validateShard } from "./utils/client-shard"
import { handleWasmCall } from "./utils/handle-wasm-response"
import { toWasmSignMessage } from "./utils/personal-sign"
import { fillDefaultTxInfo, toWasmTx } from "./utils/tx"
import { toWasmSignTypedData } from "./utils/typed-data"
import { getWasmInstance } from "./wasm"

interface WasmParams {
  trackParams: TrackingOpts
  timeout: number
  optionalParams: string
}

export interface LockboxInitOpts {
  chainId: number
  overrideRpcUrl?: string

  accessToken?: string
  shardStorage?: ShardStorage

  serviceEnv?: LockboxServiceEnv
  wasmUrl?: string

  wasmParams?: WasmParams
}

export class Lockbox {
  readonly chainId: number
  readonly rpcUrl: string

  private accessToken?: string
  private readonly shardStorage: ShardStorage

  private readonly httpUrl: string
  private readonly socketUrl: string
  private readonly wasmUrl: string

  private readonly wasmParams: WasmParams

  readonly viemClient: Client

  private cachedAddress?: Address
  private cachedPayerToken?: string

  protected constructor(
    chainId: number,
    rpcUrl: string,

    accessToken: string | undefined,
    shardStorage: ShardStorage,

    httpUrl: string,
    socketUrl: string,
    wasmUrl: string,

    wasmParams: WasmParams,
  ) {
    this.chainId = chainId
    this.rpcUrl = rpcUrl

    this.accessToken = accessToken
    this.shardStorage = shardStorage

    this.httpUrl = httpUrl
    this.socketUrl = socketUrl
    this.wasmUrl = wasmUrl

    this.wasmParams = wasmParams

    this.viemClient = createClient({
      chain: VIEM_CHAIN_MAPPING[chainId],
      transport: http(rpcUrl),
    })
  }

  static init = (initOpts: LockboxInitOpts): Lockbox => {
    const {
      chainId,
      overrideRpcUrl = VIEM_CHAIN_MAPPING[chainId].rpcUrls.default.http[0],

      shardStorage = new InMemShardStorage(),

      serviceEnv = "prod",
      wasmUrl = WASM_PROD_CDN_URL,

      wasmParams = {
        trackParams: {
          enable: true,
          timeout: 3,
        },
        timeout: 20,
        optionalParams: '{"enableVerboseLog":false}',
      },

      accessToken,
    } = initOpts

    const { httpUrl, socketUrl } = getServiceEnv(serviceEnv)

    return new Lockbox(
      chainId,
      overrideRpcUrl,

      accessToken,
      shardStorage,

      httpUrl,
      socketUrl,
      wasmUrl,

      wasmParams,
    )
  }

  setAccessToken = (newAccessToken: string) => {
    this.accessToken = newAccessToken

    this.cachedAddress = undefined
    this.cachedPayerToken = undefined
  }

  setClientShard = (newShard: string) => {
    this.shardStorage.set(newShard)
  }

  isSignable = () => {
    const shard = this.shardStorage.get()

    return !!shard
  }

  genMpc = async () => {
    const accessToken = validateToken(this.accessToken)
    const wasmInstance = await getWasmInstance(this.wasmUrl)

    const params: KeygenParams = {
      websocketUrl: this.socketUrl,
      accessToken,
      ...this.wasmParams,
    }

    const response = await handleWasmCall<KeygenResult>(wasmInstance.keygen(JSON.stringify(params)))

    // ? set client shard for future action
    this.setClientShard(response.key)

    return response
  }

  resetMpc = async () => {
    const accessToken = validateToken(this.accessToken)
    const clientShard = validateShard(this.shardStorage.get())
    const wasmInstance = await getWasmInstance(this.wasmUrl)

    const params: RefreshKeyParams = {
      ...this.wasmParams,
      websocketUrl: this.socketUrl,
      accessToken,
      key: clientShard,
    }

    const response = await handleWasmCall<KeygenResult>(
      wasmInstance.refreshKey(JSON.stringify(params)),
    )

    // ? set client shard for future action
    this.setClientShard(response.key)

    return response
  }

  genMpcFromPrivateKey = async (privateKey: string) => {
    const accessToken = validateToken(this.accessToken)
    const wasmInstance = await getWasmInstance(this.wasmUrl)

    const params: KeyDistributionParams = {
      ...this.wasmParams,
      accessToken,
      privateKey: privateKey,
      websocketUrl: this.socketUrl,
    }

    const wasmResponse = await handleWasmCall<KeygenResult>(
      wasmInstance.keyDistribution(JSON.stringify(params)),
    )

    // ? set client shard for future action
    this.setClientShard(wasmResponse.key)

    return wasmResponse
  }

  encryptClientShard = async (passphrase: string, recoveryPhraseLength?: number) => {
    const accessToken = validateToken(this.accessToken)
    const clientShard = validateShard(this.shardStorage.get())
    const wasmInstance = await getWasmInstance(this.wasmUrl)

    if (recoveryPhraseLength) {
      const params: EncryptDataV2Params = {
        accessToken,
        key: clientShard,
        password: passphrase,
        recoveryPhraseLength: recoveryPhraseLength,
        optionalParams: this.wasmParams.optionalParams,
      }

      return await handleWasmCall<EncryptDataV2Result>(
        wasmInstance.encryptDataV2(JSON.stringify(params)),
      )
    }

    const params: EncryptDataV1Params = {
      accessToken,
      key: clientShard,
      password: passphrase,
      optionalParams: this.wasmParams.optionalParams,
    }

    const v1Result = await handleWasmCall<string>(wasmInstance.encryptData(JSON.stringify(params)))

    return {
      encryptedKey: v1Result,
      recoveryPhrase: undefined,
    }
  }

  decryptClientShard = async (
    encryptedClientShard: string,
    passphrase = "",
    recoveryPhrase = "",
  ) => {
    const accessToken = validateToken(this.accessToken)
    const wasmInstance = await getWasmInstance(this.wasmUrl)

    const params: DecryptDataV2Params = {
      accessToken,
      encryptedKey: encryptedClientShard,
      password: passphrase,
      recoveryPhrase: recoveryPhrase,
      optionalParams: this.wasmParams.optionalParams,
    }

    const wasmResponse = await handleWasmCall<DecryptDataV2Result>(
      wasmInstance.decryptDataV2(JSON.stringify(params)),
    )

    // ? set client shard for future action
    this.setClientShard(wasmResponse.key)

    return wasmResponse.key
  }

  backupClientShard = async (encryptedClientShard: string) => {
    const accessToken = validateToken(this.accessToken)
    const clientShard = validateShard(this.shardStorage.get())
    const wasmInstance = await getWasmInstance(this.wasmUrl)

    const params: CreateBackupKeyParams = {
      ...this.wasmParams,
      websocketUrl: this.socketUrl,
      accessToken,
      key: clientShard,
      encryptedKey: encryptedClientShard,
    }

    const wasmResponse = await handleWasmCall<CreateBackupKeyResult>(
      wasmInstance.createBackupKey(JSON.stringify(params)),
    )

    return wasmResponse.encryptedKey
  }

  getBackupClientShard = async () => {
    const accessToken = validateToken(this.accessToken)

    const { data, error } = await getBackupClientShard(this.httpUrl, accessToken)

    if (data) {
      return data.data
    }

    throw new LockboxServerError(error.code, error.errorMessage, error.meta)
  }

  getUserProfile = async () => {
    const accessToken = validateToken(this.accessToken)

    const { data, error } = await getUserProfile(this.httpUrl, accessToken)

    if (data) {
      return data.data
    }

    throw new LockboxServerError(error.code, error.errorMessage, error.meta)
  }

  getAddressFromClientShard = async () => {
    const clientShard = validateShard(this.shardStorage.get())
    const wasmInstance = await getWasmInstance(this.wasmUrl)

    const params: GetAddressFromKeyParams = {
      key: clientShard,
      optionalParams: this.wasmParams.optionalParams,
    }

    const address = await handleWasmCall<string>(
      wasmInstance.getAddressFromKey(JSON.stringify(params)),
    )

    return address as Address
  }

  getAddress = async () => {
    if (this.cachedAddress) {
      return this.cachedAddress
    }

    try {
      const address = await this.getAddressFromClientShard()

      this.cachedAddress = address
      return address
    } catch (error) {
      /* empty */
    }

    const userProfile = await this.getUserProfile()

    this.cachedAddress = userProfile.address
    return userProfile.address
  }

  signMessage = async (message: Hex | string) => {
    const accessToken = validateToken(this.accessToken)
    const clientShard = validateShard(this.shardStorage.get())
    const wasmInstance = await getWasmInstance(this.wasmUrl)

    const wasmSignMessage = toWasmSignMessage(message)
    const params: SignMessageParams = {
      websocketUrl: this.socketUrl,
      accessToken,
      key: clientShard,
      signMessage: wasmSignMessage,
      ...this.wasmParams,
    }

    const wasmResponse = await handleWasmCall<SignMessageResult>(
      wasmInstance.signMessage(JSON.stringify(params)),
    )

    return {
      ...wasmResponse,
      signature: base64ToHex(wasmResponse.signature),
    }
  }

  signTypedData = async (signData: TypedDataDefinition) => {
    const accessToken = validateToken(this.accessToken)
    const clientShard = validateShard(this.shardStorage.get())
    const wasmInstance = await getWasmInstance(this.wasmUrl)

    const wasmSignData = toWasmSignTypedData(signData)
    const params: SignMessageParams = {
      websocketUrl: this.socketUrl,
      accessToken,
      key: clientShard,
      signMessage: wasmSignData,
      ...this.wasmParams,
    }

    const wasmResponse = await handleWasmCall<SignMessageResult>(
      wasmInstance.signMessage(JSON.stringify(params)),
    )

    return {
      ...wasmResponse,
      signature: base64ToHex(wasmResponse.signature),
    }
  }

  sendTransaction = async (tx: GenericTransaction) => {
    const accessToken = validateToken(this.accessToken)
    const clientShard = validateShard(this.shardStorage.get())
    const wasmInstance = await getWasmInstance(this.wasmUrl)

    const from = await this.getAddress()

    const filledTx = fillDefaultTxInfo(tx, {
      chainId: this.chainId,
      from,
    })

    // ? fill nonce for transaction
    if (!filledTx.nonce) {
      const nonce = await this.viemClient.request({
        method: "eth_getTransactionCount",
        params: [from, "latest"],
      })

      filledTx.nonce = nonce
    }

    // ? Need to estimateGas before send
    // TODO: Handle more transaction type
    if (!filledTx.gas && filledTx.type !== "0x64") {
      const estimatedGas = await this.viemClient.request({
        method: "eth_estimateGas",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        params: [filledTx] as any,
      })

      filledTx.gas = estimatedGas
    }

    let payerAccessToken
    if (filledTx.type === "0x64") {
      payerAccessToken = await this.getPayerAccessToken()
    }

    const params: SendTransactionParams = {
      websocketUrl: this.socketUrl,
      accessToken,
      key: clientShard,
      txJsonData: toWasmTx(filledTx),
      chainRpcUrl: this.rpcUrl,
      payerAccessToken: payerAccessToken,
      ...this.wasmParams,
    }

    return await handleWasmCall<SendTransactionResult>(
      wasmInstance.sendTransaction(JSON.stringify(params)),
    )
  }

  getProvider = () => {
    return LockboxProviderImpl.fromLockboxCore(this)
  }

  getPayerAccessToken = async () => {
    if (this.cachedPayerToken) {
      return this.cachedPayerToken
    }

    if (this.chainId !== saigon.id) {
      throw new LockboxClientError(
        "ChainNotSupported",
        `getPayerAccessToken is not support chainId: ${this.chainId}`,
      )
    }

    const accessToken = validateToken(this.accessToken)
    const clientShard = validateShard(this.shardStorage.get())
    const wasmInstance = await getWasmInstance(this.wasmUrl)

    const params: GetPayerAccessTokenParams = {
      websocketUrl: this.socketUrl,
      accessToken,
      key: clientShard,
      // TODO: configurable siweParams
      siweParams: {
        domain: "saigon-ronin-payer.roninchain.com",
        uri: "https://saigon-ronin-payer.roninchain.com/",
      },
      ...this.wasmParams,
    }

    const { accessToken: payerAccessToken } = await handleWasmCall<GetPayerAccessTokenResult>(
      wasmInstance.getPayerAccessToken(JSON.stringify(params)),
    )

    this.cachedPayerToken = payerAccessToken
    return payerAccessToken
  }

  getPayerInfo = async () => {
    const payerToken = await this.getPayerAccessToken()
    const { data, error } = await getPayerInfo(this.httpUrl, payerToken)

    if (data) {
      return data.result
    }

    throw new LockboxServerError(error.code, error.errorMessage, error.meta)
  }

  getSponsoredTxs = async () => {
    const payerToken = await this.getPayerAccessToken()
    const currentAddress = await this.getAddress()

    const { data, error } = await getSponsorTxs(this.httpUrl, payerToken, currentAddress)

    if (data) {
      return data.result?.MPCProfile
    }

    throw new LockboxServerError(error.code, error.errorMessage, error.meta)
  }
}
