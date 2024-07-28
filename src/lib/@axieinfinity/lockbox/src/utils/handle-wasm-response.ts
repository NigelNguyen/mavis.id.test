import { LockboxServerError, RawServerError } from "../common/error-server"

export const handleWasmCall = <ReturnType = unknown>(wasmCall: Promise<Response>) => {
  return wasmCall
    .then(response => response.json())
    .then(jsonResponse => jsonResponse.data as ReturnType)
    .catch(e => {
      if (e instanceof Error) {
        let rawServerError

        try {
          rawServerError = JSON.parse(e.message) as RawServerError
        } catch (parseE) {
          /* empty */
        }

        if (rawServerError && rawServerError.code !== undefined) {
          const { code, errorMessage, meta } = rawServerError

          throw new LockboxServerError(code, errorMessage, meta)
        }
      }

      throw e
    })
}
