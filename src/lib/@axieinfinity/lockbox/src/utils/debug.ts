const toMessage = (error: unknown) => {
  if (error instanceof Error) return error.message

  return String(error)
}

export const debugError = (place: string, error: unknown) => {
  console.debug(place, toMessage(error))
}
