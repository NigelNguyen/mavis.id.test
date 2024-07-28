import { LockboxClientError } from "../common/error-client"

export const validateShard = (shard: string | undefined) => {
  if (!shard) {
    throw new LockboxClientError("UndefinedClientShard", "This action required ClientShard")
  }

  return shard
}
