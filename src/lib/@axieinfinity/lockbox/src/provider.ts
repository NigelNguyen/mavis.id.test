import { EventEmitter } from "events"
import type { Address, EIP1193Parameters, Hex, TypedDataDefinition } from "viem"
import { InternalRpcError, isAddressEqual, toHex, UnauthorizedProviderError } from "viem"

import { LockboxClientError } from "./common/error-client"
import { Lockbox } from "./lockbox"
import type { LockboxProvider, LockboxSchema } from "./types/lockbox-provider"
import type { GenericTransaction } from "./types/tx"

export class LockboxProviderImpl extends EventEmitter implements LockboxProvider {
  private core: Lockbox

  protected constructor(core: Lockbox) {
    super()

    this.core = core
  }

  static fromLockboxCore = (core: Lockbox) => {
    return new LockboxProviderImpl(core) as LockboxProvider
  }

  getAccounts = async () => {
    try {
      const address = await this.core.getAddress()

      return [address]
    } catch (error) {
      return []
    }
  }

  requestAccounts = async () => {
    try {
      const address = await this.core.getAddress()
      const signable = await this.core.isSignable()

      if (address && signable) {
        return [address]
      }
    } catch (err) {
      if (err instanceof Error) {
        throw new UnauthorizedProviderError(err)
      }
    }

    const err = new LockboxClientError(
      "RequestAccountFail",
      "current address or client shard is NOT defined",
    )
    throw new UnauthorizedProviderError(err)
  }

  personalSign = async (params: [data: Hex, address: Address]) => {
    const [data, address] = params
    const [currentAddress] = await this.requestAccounts()

    if (!isAddressEqual(address, currentAddress)) {
      const err = new LockboxClientError(
        "NotSameAddress",
        "current address is different from required address",
      )
      throw new UnauthorizedProviderError(err)
    }

    try {
      const signResult = await this.core.signMessage(data)
      return signResult.signature
    } catch (err) {
      if (err instanceof Error) {
        throw new InternalRpcError(err)
      }

      const unknownErr = new LockboxClientError("UnknownError", "personal_sign fail")
      throw new InternalRpcError(unknownErr)
    }
  }

  signTypedDataV4 = async (params: [address: Address, data: TypedDataDefinition | string]) => {
    const [address, data] = params

    let typedData: TypedDataDefinition
    try {
      if (typeof data === "string") {
        typedData = JSON.parse(data) as TypedDataDefinition
      } else {
        typedData = data
      }
    } catch (error) {
      const unknownErr = new LockboxClientError(
        "UnknownError",
        "eth_signTypedData_v4: could NOT parse typed data",
      )
      throw new InternalRpcError(unknownErr)
    }

    const [currentAddress] = await this.requestAccounts()
    if (!isAddressEqual(address, currentAddress)) {
      const err = new LockboxClientError(
        "NotSameAddress",
        "current address is different from required address",
      )
      throw new UnauthorizedProviderError(err)
    }

    try {
      const signResult = await this.core.signTypedData(typedData)
      return signResult.signature
    } catch (err) {
      if (err instanceof Error) {
        throw new InternalRpcError(err)
      }

      const unknownErr = new LockboxClientError("UnknownError", "eth_signTypedData_v4 fail")
      throw new InternalRpcError(unknownErr)
    }
  }

  request = async <ReturnType = unknown>(args: EIP1193Parameters<LockboxSchema>) => {
    const { params, method } = args

    switch (method) {
      case "eth_accounts": {
        const result = await this.getAccounts()
        return result as ReturnType
      }

      case "eth_requestAccounts": {
        const result = await this.requestAccounts()

        return result as ReturnType
      }

      case "eth_chainId": {
        return toHex(this.core.chainId) as ReturnType
      }

      case "personal_sign": {
        return this.personalSign(params) as ReturnType
      }

      case "eth_signTypedData_v4": {
        return this.signTypedDataV4(params) as ReturnType
      }

      case "eth_sendTransaction": {
        try {
          const [tx] = params as [transaction: GenericTransaction]

          const transaction = await this.core.sendTransaction(tx)
          return transaction.txHash as ReturnType
        } catch (err) {
          if (err instanceof Error) {
            throw new InternalRpcError(err)
          }

          const unknownErr = new LockboxClientError("UnknownError", "eth_sendTransaction fail")
          throw new InternalRpcError(unknownErr)
        }
      }

      default:
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return this.core.viemClient.request(args as any) as ReturnType
    }
  }
}
