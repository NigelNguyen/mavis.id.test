/* eslint-disable no-var */
import { GoWasm, SkyMavisMpc } from "./types/wasm-global"

export declare global {
  var Go: typeof GoWasm
  var skymavismpc: SkyMavisMpc | undefined
}
