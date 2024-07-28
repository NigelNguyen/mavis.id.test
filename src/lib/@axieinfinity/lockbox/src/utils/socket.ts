import { LockboxClientError } from "../common/error-client"

export const openWebsocket = (url: string, timeout = 5_000): Promise<WebSocket> => {
  const socket = new WebSocket(url)
  socket.binaryType = "arraybuffer"

  return new Promise((resolve, reject) => {
    socket.onopen = () => {
      resolve(socket)
    }

    setTimeout(() => {
      reject(new LockboxClientError("WsInitFail", "openWebsocket: reach timeout"))
    }, timeout)
  })
}
