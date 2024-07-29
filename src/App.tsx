import "./App.css";
import GetAddress from "./view/components/GetAddress";
import useIdProvider from "./view/context/useProvider";
import GetBalance from "./view/components/GetBalance";
import SignMessage from "./view/components/SignMessage";
import SendTransaction from "./view/components/SendTransaction";
import ApproveAXS from "./view/components/ApproveAXS";
import { TransferAXS } from "./view/components/TransferAXS";
import { SwapToken } from "./view/components/SwapToken";
import toast, { Toaster } from "react-hot-toast";
// import SignTypeData from "./view/components/SignTypeData";

function App() {
  const { provider, isAuthenticated } = useIdProvider();

  const connect = async () => {
    if (!provider) {
      alert("Provider not found");
      return;
    }
    await provider.send("eth_requestAccounts", []);
    toast.success("Connected with Mavis ID.");
    location.reload();
  };

  const disconnect = async () => {
    localStorage.removeItem("MAVIS.ID:PROFILE");
    toast("Disconnected.");
    location.reload();
  };

  return (
    <>
      <Toaster position="bottom-left" />
      <div className="flex flex-col justify-between w-full md:flex-row">
        <div className="w-full border-b shadow-lg md:border-r h-1/6 md:h-screen">
          <div className="flex flex-col items-center gap-4 p-4 md:mt-24 justify-self-start">
            <button onClick={connect} disabled={!!isAuthenticated}>
              Connect Your ID Wallet
            </button>
            <button onClick={disconnect} disabled={!isAuthenticated}>
              Disconnect Your Wallet
            </button>
          </div>
        </div>

        <div className="flex flex-col w-full h-full gap-8 p-4 pt-8 overflow-y-scroll md:h-screen justify-self-center no-scrollbar md:pl-8">
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
    </>
  );
}

export default App;
