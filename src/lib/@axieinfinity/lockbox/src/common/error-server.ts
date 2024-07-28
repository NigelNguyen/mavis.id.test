interface ErrorMeta {
  requestId: string
  uuid: string
}

export interface RawServerError {
  code: number
  errorMessage: string
  meta: ErrorMeta | null
  serverErrorCode?: number
  closedReason?: string
}

type ServerErrorCode =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30
  | 31
  | 100
  | 101
  | 102
  | 103
  | 104
  | 105
  | 106
  | 107
  | 108
  | 109
  | 110
  | 111
  | 1000
  | 1001

const SERVER_ERROR_NAME_MAPPING: Record<ServerErrorCode, string> = {
  0: "OK",

  1: "Canceled",
  2: "Unknown",
  3: "InvalidArgument",

  4: "DeadlineExceeded",

  5: "NotFound",
  6: "AlreadyExists",
  7: "PermissionDenied",
  8: "ResourceExhausted",

  9: "FailedPrecondition",
  10: "Aborted",
  11: "OutOfRange",
  12: "Unimplemented",
  13: "Internal",
  14: "Unavailable",
  15: "DataLoss",
  16: "Unauthenticated",

  // Custom Error Code
  20: "MpcInitializeProtocolFailed",
  21: "MpcHandshakeProtocolFailed",
  22: "MpcBadSignature",
  23: "MpcSignatureVerifyFailed",
  24: "MpcServerStoreKeyFailed",
  25: "MpcBadResult",
  26: "MpcSendTxRequestFailed",
  27: "MpcBadKey",
  28: "MpcSignMessageFailed",
  29: "MpcSendTxFailed",
  30: "MpcAddressAlreadyExisted",
  31: "MpcChallengeFailed",

  100: "DialSocketFailed",
  101: "WriteDataFailed",
  102: "ReadDataFailed",
  103: "BadRpcData",
  104: "BadSignMessageData",
  105: "BadTxData",
  106: "InitHttpFailed",
  107: "DoHttpFailed",
  108: "BadHttpData",
  109: "DialRpcNodeFailed",
  110: "HitRateLimitUuid",
  111: "InvalidNonce",

  // Policy rules
  1000: "DailyNativeTokenTransferredReachLimit",
  1001: "PolicyFailed",
}

export class LockboxServerError extends Error {
  code: number
  meta?: ErrorMeta

  constructor(code: number, message: string, meta?: ErrorMeta | null) {
    super(message)

    this.code = code
    this.name = SERVER_ERROR_NAME_MAPPING[code as ServerErrorCode] ?? "Unspecified"
    this.meta = meta ?? undefined
  }
}
