type ClientErrorName =
  | "WasmInitFail"
  | "KeygenFail"
  | "WsInitFail"
  | "UndefinedAccessToken"
  | "UndefinedClientShard"
  | "ChainNotSupported"
  | "OutOfSponsoredTxs"
  | "NotSameAddress"
  | "RequestAccountFail"
  | "UnknownError"

const ERROR_CODE_MAPPING: Record<ClientErrorName, number> = {
  WasmInitFail: 5000,
  WsInitFail: 5010,
  KeygenFail: 5020,

  UndefinedAccessToken: 5050,
  UndefinedClientShard: 5051,
  ChainNotSupported: 5060,
  OutOfSponsoredTxs: 5061,

  RequestAccountFail: 5070,
  NotSameAddress: 5080,
  UnknownError: 5081,
}

export class LockboxClientError extends Error {
  code: number

  constructor(name: ClientErrorName, message: string) {
    super(message)

    this.code = ERROR_CODE_MAPPING[name]

    this.name = name
  }
}
