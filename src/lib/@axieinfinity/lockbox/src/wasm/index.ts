import { LockboxClientError } from "../common/error-client"
import { SkyMavisMpc } from "../types/wasm-global"
import { injectSkymavisMpc } from "./instantiate"

let currentInstance: SkyMavisMpc | undefined
let currentUrl: string

export const getWasmInstance = async (url: string) => {
  const cached = currentInstance !== undefined
  const sameUrl = currentUrl === url

  if (cached && sameUrl) {
    return currentInstance as SkyMavisMpc
  }

  await injectSkymavisMpc(url)

  if (globalThis.skymavismpc) {
    currentInstance = globalThis.skymavismpc
    currentUrl = url

    return currentInstance as SkyMavisMpc
  }

  throw new LockboxClientError(
    "WasmInitFail",
    "getWasmInstance: globalThis.skymavismpc is undefined",
  )
}
