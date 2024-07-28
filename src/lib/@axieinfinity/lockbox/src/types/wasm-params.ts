import type { AccessList, Address, Hex } from "viem"

export interface TrackingOpts {
  enable: boolean
  timeout: number
}

interface CommonParams {
  accessToken: string
  optionalParams: string
}

interface WithTrackingParams extends CommonParams {
  timeout: number
  trackParams: TrackingOpts
}

export interface KeygenParams extends WithTrackingParams {
  websocketUrl: string
}

export interface RefreshKeyParams extends WithTrackingParams {
  websocketUrl: string
  key: string
}

export interface KeyDistributionParams extends WithTrackingParams {
  websocketUrl: string
  privateKey: string
}

export interface EncryptDataV1Params extends CommonParams {
  key: string
  password: string
}

export interface EncryptDataV2Params extends CommonParams {
  key: string
  password: string
  recoveryPhraseLength: number
}

export interface DecryptDataV2Params extends CommonParams {
  encryptedKey: string
  password?: string
  recoveryPhrase?: string
}

export interface CreateBackupKeyParams extends WithTrackingParams {
  websocketUrl: string
  accessToken: string
  encryptedKey: string
  key: string
}

export interface GetAddressFromKeyParams {
  key: string
  optionalParams: string
}

export interface SignMessageParams extends WithTrackingParams {
  websocketUrl: string
  key: string
  signMessage: string
}

export interface SendTransactionParams extends WithTrackingParams {
  websocketUrl: string
  key: string
  txJsonData: string
  chainRpcUrl: string
  payerAccessToken?: string
}

export interface WasmTransaction {
  // "0x64" for ronin gas sponsor
  type: "0x0" | "0x1" | "0x2" | "0x64"

  nonce: Hex
  to: Address | null
  from: Address

  value: Hex
  input: Hex

  gas: Hex
  gasPrice: Hex

  r: Hex
  v: Hex
  s: Hex

  chainId: Hex

  // EIP-2930; Type 1 & EIP-1559; Type 2
  accessList: AccessList

  // EIP-1559; Type 2
  maxPriorityFeePerGas: Hex
  maxFeePerGas: Hex

  // EIP-1559; Type 100
  payerS: Hex
  payerR: Hex
  payerV: Hex
  expiredTime: Hex
}

export interface SiweParams {
  domain: string
  uri: string
  resources?: Array<string>
}

export interface GetPayerAccessTokenParams extends WithTrackingParams {
  websocketUrl: string
  siweParams: SiweParams
  key: string
}
