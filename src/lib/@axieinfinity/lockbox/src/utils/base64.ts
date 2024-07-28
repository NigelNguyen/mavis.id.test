import { toHex } from "viem"

import { bytesToString, stringToBytes } from "./bytes"

// WHY: bytesToString from "viem" not working since it decode string
export const bytesToBase64 = (bytes: Uint8Array) => btoa(bytesToString(bytes))

// WHY: stringToBytes from "viem" not working. DON'T KNOW WHY
export const base64ToBytes = (base64: string) => stringToBytes(atob(base64))

export const base64ToHex = (base64: string) => toHex(base64ToBytes(base64))
