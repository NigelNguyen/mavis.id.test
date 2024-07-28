import type { Address } from "viem"

import { RawServerError } from "../common/error-server"
import { AbortKey } from "./request/abort-key"
import { request } from "./request/request"

export interface GetPayerInfoResult {
  jsonrpc: 0
  result: { payer: Address; balance: string }
}

export const getPayerInfo = (baseUrl: string, payerAccessToken: string) => {
  return request<GetPayerInfoResult, RawServerError>(`post ${baseUrl}/v1/public/proxy/payer`, {
    headers: { authorizationPayer: payerAccessToken },
    body: {
      jsonrpc: 0,
      id: 0,
      method: "ronin_getPayerInfo",
      params: [],
    },
    key: AbortKey.getPayerInfo,
  })
}
