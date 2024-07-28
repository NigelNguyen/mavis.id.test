import { Address, parseGwei, toHex } from "viem"

import { FilledTransaction, GenericTransaction } from "../types/tx"
import { WasmTransaction } from "../types/wasm-params"

interface OverrideValue {
  from: Address
  chainId: number
}

const DEFAULT_RONIN_GAS = toHex(parseGwei("20"))
const ZERO_HEX = toHex(0)

const DEFAULT_PAYER_S = "0x3caeb99cc6659c5ca4c66b91b1686a86fe0493e1122bdd09f2babdf72e54041a"
const DEFAULT_PAYER_R = "0xdbdbd0989f595c0921acaf9c80342bbeff3b8ea6d2a9ad3167e63010715de3fd"
const DEFAULT_PAYER_V = "0x1"

// FIXME: Handle more transaction type
export const fillDefaultTxInfo = (
  tx: GenericTransaction,
  override: OverrideValue,
): FilledTransaction => {
  const {
    to,
    accessList = [],
    data = "0x",
    blobVersionedHashes = [],
    blobs = [],
    maxFeePerBlobGas = DEFAULT_RONIN_GAS,
    maxFeePerGas = DEFAULT_RONIN_GAS,
    maxPriorityFeePerGas = DEFAULT_RONIN_GAS,
    gasPrice = DEFAULT_RONIN_GAS,
    value = ZERO_HEX,
    input,
    type = "0x0",
    ...rest
  } = tx

  return {
    ...rest,
    type,

    chainId: toHex(override.chainId),
    from: override.from,
    to,

    value,
    input: input ?? data,

    gasPrice: type !== "0x2" ? gasPrice : undefined,

    accessList,
    maxFeePerGas: type === "0x2" ? maxFeePerGas : undefined,
    maxPriorityFeePerGas: type === "0x2" ? maxPriorityFeePerGas : undefined,

    maxFeePerBlobGas,
    blobVersionedHashes,
    blobs,
  }
}

// WHY: Wasm require all transaction fields
export const toWasmTx = (tx: FilledTransaction): string => {
  const wasmTx: WasmTransaction = {
    ...tx,
    nonce: tx.nonce ?? ZERO_HEX,
    gas: tx.gas ?? ZERO_HEX,
    gasPrice: tx.gasPrice ?? DEFAULT_RONIN_GAS,
    maxFeePerGas: tx.maxFeePerGas ?? DEFAULT_RONIN_GAS,
    maxPriorityFeePerGas: tx.maxPriorityFeePerGas ?? DEFAULT_RONIN_GAS,
    r: ZERO_HEX,
    v: ZERO_HEX,
    s: ZERO_HEX,
    payerS: DEFAULT_PAYER_S,
    payerR: DEFAULT_PAYER_R,
    payerV: DEFAULT_PAYER_V,
    expiredTime: ZERO_HEX,
  }

  return JSON.stringify(wasmTx)
}
