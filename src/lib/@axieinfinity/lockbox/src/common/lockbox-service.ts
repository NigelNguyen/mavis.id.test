const LOCKBOX_PROD_HTTP_URL = "https://lockbox.skymavis.com"
const LOCKBOX_PROD_WS_URL = "wss://lockbox.skymavis.com"

const LOCKBOX_STAG_HTTP_URL = "https://project-x.skymavis.one"
const LOCKBOX_STAG_WS_URL = "wss://project-x.skymavis.one"

export interface CustomServiceEnv {
  httpUrl: string
  socketUrl: string
}

export type LockboxServiceEnv = "prod" | "stag" | CustomServiceEnv

export const getServiceEnv = (env: LockboxServiceEnv): CustomServiceEnv => {
  switch (env) {
    case "prod":
      return {
        httpUrl: LOCKBOX_PROD_HTTP_URL,
        socketUrl: LOCKBOX_PROD_WS_URL,
      }
    case "stag":
      return {
        httpUrl: LOCKBOX_STAG_HTTP_URL,
        socketUrl: LOCKBOX_STAG_WS_URL,
      }
    default:
      return env
  }
}
