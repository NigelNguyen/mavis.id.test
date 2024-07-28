import { useState } from "react";
import useIdProvider from "../context/useProvider";
import AppShell from "../common/AppShell";
import { addressConfig } from "../../constants/address";
import { fromFracAmount } from "../../lib/utils/currency";
import { requestIdTransaction } from "../../lib/transaction/sendtransaction";
import { encodeFunctionData } from "viem";
import { AXS_ABI } from "../contracts/abis/Axs";
const TESTNET_HOST = import.meta.env.VITE_TESTNET_HOST || origin;
const DEFAULT_ADDRESS = "0x42d53d15cD7d441305c4998217F14c5Af292fF84";

export const TransferAXS = () => {
  const { signer } = useIdProvider();
  const [amount, setAmount] = useState(0.1);
  const [address, setAddress] = useState(DEFAULT_ADDRESS);
  const [txHash, setTxHash] = useState("");

  const sendTransactionHandler = async () => {
    if (!signer) return;
    const amountToTransfer = fromFracAmount(amount, 18);
    const data = encodeFunctionData({
      abi: AXS_ABI,
      functionName: "transfer",
      args: [address, amountToTransfer],
    });

    const txHash = await requestIdTransaction({
      data,
      to: addressConfig.axs,
    });
    setTxHash(txHash);

    // const contract = AXS__factory.connect(addressConfig.axs, signer);
    // const txData = await contract.transfer(address, fromFracAmount(amount, 18));
    // setTxHash(txData.hash);
  };

  return (
    <AppShell
      result={
        <a href={`${TESTNET_HOST}/tx/${txHash}`} target="_blank">
          {txHash}
        </a>
      }
      title="Transfer ERC20 Token"
      description="Transfer your AXS to another address."
    >
      <input
        placeholder="Amount"
        value={amount}
        type="number"
        step={0.0001}
        onChange={(event) => setAmount(Number(event.target.value))}
        className="px-2 py-1 border rounded-md min-h-10"
      ></input>
      <input
        placeholder="Address"
        value={address}
        onChange={(event) => setAddress(event.target.value)}
        className="px-2 py-1 border rounded-md min-h-10"
      ></input>
      <button onClick={sendTransactionHandler}>Send</button>
    </AppShell>
  );
};
