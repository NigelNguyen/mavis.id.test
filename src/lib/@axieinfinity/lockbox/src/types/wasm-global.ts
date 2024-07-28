export declare class GoWasm {
  constructor()
  importObject: WebAssembly.Imports
  run(instance: WebAssembly.Instance): void
}

export interface SkyMavisMpc {
  keygen: (args: string) => Promise<Response>

  signMessage: (args: string) => Promise<Response>
  sendTransaction: (args: string) => Promise<Response>

  getAddressFromKey: (args: string) => Promise<Response>
  getCurrentUserProfile: (args: string) => Promise<Response>

  encryptData: (args: string) => Promise<Response>
  encryptDataV2: (args: string) => Promise<Response>

  decryptData: (args: string) => Promise<Response>
  decryptDataV2: (args: string) => Promise<Response>

  createBackupKey: (args: string) => Promise<Response>
  getBackupKey: (args: string) => Promise<Response>

  keyDistribution: (args: string) => Promise<Response>
  refreshKey: (args: string) => Promise<Response>

  getPayerAccessToken: (args: string) => Promise<Response>
}
