import { RawServerError } from "../common/error-server"
import { AbortKey } from "./request/abort-key"
import { request } from "./request/request"

export interface GetBackupKeyResult {
  data: {
    key: string
    updatedAt: string
  }
}

export const getBackupClientShard = (baseUrl: string, accessToken: string) => {
  return request<GetBackupKeyResult, RawServerError>(`get ${baseUrl}/v1/public/backup/keys`, {
    headers: { authorization: accessToken },
    key: AbortKey.getBackupClientShard,
  })
}
