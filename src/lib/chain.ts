import { Lockbox } from "@axieinfinity/lockbox";
// import {
//   ExactPartial,
//   TransactionRequest,
//   createPublicClient,
//   custom,
//   defineChain,
//   defineTransactionRequest,
//   formatTransactionRequest,
// } from "viem";
// import {
//   RoninRpcTransactionRequest,
//   RoninTransactionRequest,
// } from "../types/chain";

// const roninRpcTransactionType = {
//   legacy: "0x0",
//   eip2930: "0x1",
//   eip1559: "0x2",
//   eip4844: "0x3",
//   eip2718: "0x64", // https://skymavis.atlassian.net/wiki/spaces/R/pages/159907860/Transaction+pass+POC+documentation
// } as const;

// const roninChain = defineChain({
//   id: 2020,
//   name: "Ronin",
//   nativeCurrency: { name: "RON", symbol: "RON", decimals: 18 },
//   rpcUrls: {
//     default: {
//       http: ["https://api.roninchain.com/rpc"],
//     },
//   },
//   blockExplorers: {
//     default: {
//       name: "Ronin Explorer",
//       url: "https://app.roninchain.com",
//     },
//   },
//   contracts: {
//     multicall3: {
//       address: "0xca11bde05977b3631167028862be2a173976ca11",
//       blockCreated: 26023535,
//     },
//   },
//   formatters: {
//     transactionRequest: defineTransactionRequest({
//       format: (request: ExactPartial<RoninTransactionRequest>) => {
//         const rpcRequest = formatTransactionRequest(
//           request as TransactionRequest
//         ) as RoninRpcTransactionRequest;

//         if (typeof request.type !== "undefined")
//           rpcRequest.type = roninRpcTransactionType[request.type];

//         return rpcRequest;
//       },
//     }),
//   },
// });

// const commonConfig: Partial<LockboxInitOpts> = {
//   serviceEnv: "stag",
//   wasmUrl: "https://storage.googleapis.com/thien-cdn/mpc/wasm/staging/mpc.wasm",
// } as const;

export const LOCK_BOX_CORE = Lockbox.init({
  chainId: 2021,
  serviceEnv: "stag",
  accessToken:
  "eyJhbGciOiJSUzI1NiIsImtpZCI6IjAxOGZjOTAxLTVlODgtNzc2Yi04MDBjLWI3NDFkN2ExMDFhOSIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2lkLnNreW1hdmlzLmNvbSIsInN1YiI6IjFlZjFmMDFlLWRkNTEtNjIyOC1hM2EzLTI4NzNmYjBiZWIwYSIsImF1ZCI6WyJpZCJdLCJleHAiOjE3MTgxNzg5NTcsIm5iZiI6MTcxODE3ODA1NywiaWF0IjoxNzE4MTc4MDU3LCJqdGkiOiIwMTkwMGI2NC04YmViLTdjOWUtODFjOC0wZjgzYmYwOGViMTAiLCJzaWQiOiIwMTkwMGE5ZS00NDA2LTdkNjUtODAxZS0wYTY3OWE2NTUwNGQiLCJlbWFpbCI6ImtlbG9mNjA5ODRAYXZhc3R1LmNvbSIsInNjcCI6Im9wZW5pZCBwcm9maWxlIHdhbGxldCBlbWFpbCJ9.nnkY1GADz3r-lewykMIoAm3iIAphazI5JS9iSZo4pHXE3-_A-wG6YbOq8rOlH12TGbt1SiueM3y1alt8ujhQ9quc7KMQDsBqD_RkE6Kxm9R8ILLpbH7onYtz3qdTDGBGZSKOo2JxFyVuOTy2Ho3PUiHXAxdfaMMN21M7KnZxidLB-4Omvz8bb4Wpqz-W1R-9Jm4KctvZTB7HxTTXNHg6Lj0AcHfphCCnHzP1xISzLm4YeaHhpBmQ6Ax1zIBHMJhEnokUkP2k1fqDJu5Pm3OMfg6tjKdWhVNjUtaukV9jaOHKtINb6-KtEO3mNcbdpXk--ujtZCo3TwOP4TBD4swSgfHaoJehk5pDJKZquVWnlvLCzPtmfbHub1uML8uSNNVJGHEgtqXUfyS9hjnY-1BgH7pwOaWv1u09SV61DSfaL-_ax95qu67OpPQEad4u4Wkwz-tlJ4XRKI8XiVs-w2pERTpmg40QrL-glgQOzCYT7zk_qzBh5fFBYIHmiQdStivCOKEXJ7K_WfPy_QKuy8phUmimZdVm4CtoEIuuJ7s6FVJDxFT3Xrkeo2XCJ2vjUraEvCEGxnPM4H8sqOSESMRPEnxGEb6WNz8G7-k7JqW0wDqcLTT7VMb9oeINND4vGW1__QZ-hu38VZWjmpCWBnTOzA5Ct7_Ac8TAPXqu59139U8",
  wasmUrl: "https://storage.googleapis.com/thien-cdn/mpc/wasm/staging/mpc.wasm",
});
// Lockbox.init({
//   chainId: 2021,
//   accessToken:
//     "eyJhbGciOiJSUzI1NiIsImtpZCI6IjAxOGZjOTAxLTVlODgtNzc2Yi04MDBjLWI3NDFkN2ExMDFhOSIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2lkLnNreW1hdmlzLmNvbSIsInN1YiI6IjFlZjFmMDFlLWRkNTEtNjIyOC1hM2EzLTI4NzNmYjBiZWIwYSIsImF1ZCI6WyJpZCJdLCJleHAiOjE3MTgxNjczNTMsIm5iZiI6MTcxODE2NjQ1MywiaWF0IjoxNzE4MTY2NDUzLCJqdGkiOiIwMTkwMGFiMy03ZTBkLTcwNTAtODEwNy1lYzZlYTEzNGIyNTkiLCJzaWQiOiIwMTkwMGE5ZS00NDA2LTdkNjUtODAxZS0wYTY3OWE2NTUwNGQiLCJlbWFpbCI6ImtlbG9mNjA5ODRAYXZhc3R1LmNvbSIsInNjcCI6Im9wZW5pZCBwcm9maWxlIHdhbGxldCBlbWFpbCJ9.RJaucJIXD-Emfe7HbeJ76hTwcdGBWKuXGgupdhdO7HxnW_AbqFxuMYJlysvw6Ws7GNEU1eyhq5kr13RpBx7fn_eY2_CorJpKZm7-rZG8ZxSJjkbIFiCfoCDeTzJCTLBjr08fYy_61s39t24gKtS4Po34ZY7W0C8rIrOgovvdskvH-MidVcGufQLSIiQla7cVKOKLSou5Tm1wnOZn6eXx0A80kWxh2NHtVy1KzwQDEoIS4ZxxaBDsr_x8lxtB2b28Xw6AJMuUE_Y7VGlJnkE2f7xPu_rslSx6agFbFOsuU2MEA5boclU-jntyDWRLuMsF7lAZELH5ttBGYime20vqeILB-s-Rldy5_aEUii6HUwdc0bds_nKnRaEfPc-lJAsKXZsJPT3maXmzV2_Kybg9co8xXL80OAvbai9lmgq_Qzbry5KtQsdpa7EQghiVFS26Mbm66IvPqqEO9Bw6Bq7JLL9XQgoZ7khfFJENKSyu3oW5bWr1PJNRs-3xuKbxv5vGMPpj78mN_0io1qu823M1eo89vgV1iEQT6ci0O_KwGr2Hn-7oHrCYyCsYzSYTovdm9Xj0rQ0kpre8YpEZdtapxrGgd9B8xnTBY7lyGMDrPwJPFciRaRgnTc6PJFJKtzv-YFlg-uf80p2XCTxa970IaLExOON2_PUy8Bc5U4vEORg",
//   //   ...commonConfig,
//   wasmUrl: WASM_DEV_CDN_URL,
// });

// export const PUBLIC_CLIENT = createPublicClient({
//   chain: roninChain,
//   transport: custom(LOCK_BOX.getProvider()),
// });
