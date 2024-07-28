import type { Address } from "viem"

import { RawServerError } from "../common/error-server"
import { AbortKey } from "./request/abort-key"
import { request } from "./request/request"

export interface GetSponsorTxsResult {
  jsonrpc: 0
  result: { MPCProfile: number }
}

export const getSponsorTxs = (baseUrl: string, payerAccessToken: string, address: Address) => {
  return request<GetSponsorTxsResult, RawServerError>(`post ${baseUrl}/v1/public/proxy/payer`, {
    headers: { authorizationPayer: payerAccessToken },
    body: {
      jsonrpc: 0,
      id: 0,
      method: "ronin_getSponsoringData",
      params: [address],
    },
    key: AbortKey.getSponsorTxs,
  })
}
