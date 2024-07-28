import type { Hash } from "viem"

export interface Meta {
  requestId: string
  uuid: string
}

export interface KeygenResult {
  key: string
  meta: Meta
}

export interface EncryptDataV2Result {
  encryptedKey: string
  recoveryPhrase: string
}

export interface CreateBackupKeyResult {
  encryptedKey: string
}

export interface DecryptDataV2Result {
  key: string
}

export interface SignMessageResult {
  meta: Meta
  signature: string
}

export interface SendTransactionResult {
  meta: Meta
  txHash: Hash
}

export interface GetPayerAccessTokenResult {
  accessToken: string
  meta: Meta
}
