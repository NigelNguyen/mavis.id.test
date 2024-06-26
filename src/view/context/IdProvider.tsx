import { MavisIdProvider } from "@axieinfinity/mavis-id-sdk";
import * as ethers from "ethers";
import { createContext } from "react";

const VITE_CLIENT_ID = import.meta.env.VITE_CLIENT_ID;

type Props = { children: React.ReactNode };
type IdContext = {
  provider: ethers.ethers.providers.Web3Provider | null;
  signer: ethers.providers.JsonRpcSigner | null;
};

export const IdContext = createContext<IdContext>({
  provider: null,
  signer: null,
});

const IdProvider = ({ children }: Props) => {
  const mavisIdProvider = MavisIdProvider.create({
    clientId: VITE_CLIENT_ID || "",
    chainId: 2021,
    gateOrigin: "https://id.skymavis.one",
  });
  const provider = new ethers.providers.Web3Provider(mavisIdProvider);
  const signer = provider.getSigner();

  return (
    <IdContext.Provider
      value={{
        provider,
        signer,
      }}
    >
      {children}
    </IdContext.Provider>
  );
};

export default IdProvider;
