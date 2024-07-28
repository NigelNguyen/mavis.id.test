export interface KeygenHandler {
  do: (agrs: string) => Promise<Uint8Array>
  isConnClosed: () => boolean
  rx: () => Promise<Uint8Array>
  tx: (args: Uint8Array) => void
}

export enum Kind {
  Authenticate = "authenticate",
  Protocol = "mpc_protocol",
  Error = "error",
  Done = "done",
}

export interface WasmAuthResult {
  kind: Kind.Authenticate
  data: {
    accessToken: string
    requestID: string
  }
}

export interface WasmKgResult {
  kind: Kind.Protocol
  data: string
}

export interface Meta {
  requestID: string
  uuid: string
}

export interface KeygenResult {
  key: string
  meta: Meta
}

export interface DoResponse {
  data: KeygenResult
}
