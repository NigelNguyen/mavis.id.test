import type { Address } from "viem"

import { RawServerError } from "../common/error-server"
import { AbortKey } from "./request/abort-key"
import { request } from "./request/request"

export interface GetCurrentUserProfileResult {
  data: {
    address: Address
    updatedAt: number
    uuid: string
  }
}

export const getUserProfile = (baseUrl: string, accessToken: string) => {
  return request<GetCurrentUserProfileResult, RawServerError>(
    `get ${baseUrl}/v1/public/profiles/me`,
    {
      headers: { authorization: accessToken },
      key: AbortKey.getUserProfile,
    },
  )
}
