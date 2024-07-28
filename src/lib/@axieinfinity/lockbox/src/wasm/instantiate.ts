import { LockboxClientError } from "../common/error-client"
import { setupGoWasmEnv } from "./wasm-exec"

export const wasmBrowserInstantiate = async (
  wasmModuleUrl: string,
  importObject: WebAssembly.Imports,
) => {
  if (!WebAssembly) {
    throw new LockboxClientError("WasmInitFail", "getWasmInstance: WebAssembly is undefined")
  }

  if (WebAssembly.instantiateStreaming) {
    const wasmFetcher = fetch(wasmModuleUrl)

    // Fetch the module, and instantiate it as it is downloading
    const newInstance = await WebAssembly.instantiateStreaming(wasmFetcher, importObject)
    return newInstance
  }

  // Fallback to using fetch to download the entire module
  // And then instantiate the module
  const wasmResponse = await fetch(wasmModuleUrl)
  const wasmArrayBuffer = await wasmResponse.arrayBuffer()

  return await WebAssembly.instantiate(wasmArrayBuffer, importObject)
}

export const injectSkymavisMpc = async (wasmModuleUrl: string) => {
  if (!globalThis.Go) {
    setupGoWasmEnv()
  }

  if (!globalThis.Go) {
    throw new LockboxClientError("WasmInitFail", "getWasmInstance: globalThis.Go is undefined")
  }

  const go = new globalThis.Go()
  const wasmSource = await wasmBrowserInstantiate(wasmModuleUrl, go.importObject)

  go.run(wasmSource.instance)
}
