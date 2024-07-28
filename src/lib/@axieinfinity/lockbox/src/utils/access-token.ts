import { LockboxClientError } from "../common/error-client"

const addBearerPrefix = (accessToken: string) => {
  return accessToken.startsWith("Bearer ") ? accessToken : "Bearer " + accessToken
}

export const validateToken = (accessToken: string | undefined) => {
  if (!accessToken) {
    throw new LockboxClientError("UndefinedAccessToken", "This action required AccessToken")
  }

  return addBearerPrefix(accessToken)
}
