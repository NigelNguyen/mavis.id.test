import type {
  Address,
  EIP1193Events,
  EIP1193Parameters,
  Hash,
  Hex,
  PublicRpcSchema,
  TypedDataDefinition,
} from "viem"

import type { GenericTransaction } from "./tx"

export interface LockboxProvider extends EIP1193Events {
  request: <ReturnType = unknown>(args: EIP1193Parameters<LockboxSchema>) => Promise<ReturnType>
}

export type LockboxSchema = [
  ...PublicRpcSchema,

  {
    Method: "eth_accounts"
    Parameters?: undefined
    ReturnType: Address[]
  },
  {
    Method: "eth_requestAccounts"
    Parameters?: undefined
    ReturnType: Address[]
  },
  {
    Method: "eth_sendTransaction"
    Parameters: [transaction: GenericTransaction]
    ReturnType: Hash
  },
  {
    Method: "eth_signTypedData_v4"
    Parameters: [address: Address, typedData: TypedDataDefinition]
    ReturnType: Hex
  },
  {
    Method: "personal_sign"
    Parameters: [data: Hex, address: Address]
    ReturnType: Hex
  },
]
