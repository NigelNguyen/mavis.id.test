import { bytesToString, stringToBytes } from "viem"

export const bytesToJson = (bytes: Uint8Array) => {
  const jsonInStr = bytesToString(bytes)

  return JSON.parse(jsonInStr)
}

export const jsonToBytes = (json: unknown) => {
  const jsonInStr = JSON.stringify(json, null, 0)

  return stringToBytes(jsonInStr)
}
