export const stringToBytes = (value: string) => {
  const charCode = Array.from(value, m => m.codePointAt(0) as number)

  return Uint8Array.from(charCode)
}

export const bytesToString = (bytes: Uint8Array) => {
  return Array.from(bytes, b => String.fromCodePoint(b)).join("")
}
