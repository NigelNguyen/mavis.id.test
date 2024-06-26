import "./App.css";
import GetAddress from "./view/components/GetAddress";
import useIdProvider from "./view/context/useProvider";
import GetBalance from "./view/components/GetBalance";
import SignMessage from "./view/components/SignMessage";
import SendTransaction from "./view/components/SendTransaction";
import ApproveAXS from "./view/components/ApproveAXS";
import { TransferAXS } from "./view/components/TransferAXS";
import { SwapToken } from "./view/components/SwapToken";
// import SignTypeData from "./view/components/SignTypeData";

function App() {
  const { provider } = useIdProvider();

  const connect = async () => {
    if (!provider) {
      alert("Provider not found");
      return;
    }
    await provider.send("eth_requestAccounts", []);
  };

  const disconnect = async () => {
    localStorage.removeItem("MAVIS.ID:PROFILE");
    location.reload();
  };

  return (
    <div className="flex justify-between w-full gap-8">
      <div className="w-full">
        <div className="flex flex-col items-center gap-4 p-4 mt-24 justify-self-start">
          <button onClick={connect}>Connect Your ID Wallet</button>
          <button onClick={disconnect}>Disconnect Your Wallet</button>
        </div>
      </div>

      <div className="flex flex-col w-full h-screen gap-8 p-4 overflow-y-scroll justify-self-center no-scrollbar">
        <GetAddress />
        <GetBalance />
        <SendTransaction />
        <SignMessage />
        {/* <SignTypeData /> */}
        <ApproveAXS />
        <TransferAXS />
        <SwapToken />
      </div>
    </div>
  );
}

export default App;
