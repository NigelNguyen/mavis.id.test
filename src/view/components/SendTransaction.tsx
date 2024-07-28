import { useState } from "react";
import useIdProvider from "../context/useProvider";
import AppShell from "../common/AppShell";
import { fromFracAmount } from "../../lib/utils/currency";
import { requestIdTransaction } from "../../lib/transaction/sendtransaction";
const TESTNET_HOST = import.meta.env.VITE_TESTNET_HOST || origin;

const SendTransaction = () => {
  const { signer } = useIdProvider();
  const [amount, setAmount] = useState<number>(0.1);
  const [address, setAddress] = useState(
    "0x42d53d15cD7d441305c4998217F14c5Af292fF84"
  );
  const [txAddress, setTxAddress] = useState("");

  const sendTransactionHandler = async () => {
    // const tx = await signer?.sendTransaction({
    //   to: address,
    //   value: BigInt(amount * 10 ** 18),
    //   chainId: 2021,
    // });
    // const txReceipt = await tx?.wait();
    // if (txReceipt) {
    //   setTxAddress(txReceipt.transactionHash);
    // } else {
    //   alert("Transaction failed");
    // }
    if (!signer) return;
    const amountToTransfer = fromFracAmount(amount, 18);

    const txHash = await requestIdTransaction({
      to: address,
      value: amountToTransfer.toString()
    });
    setTxAddress(txHash);
  };

  return (
    <AppShell
      result={
        <a href={`${TESTNET_HOST}/tx/${txAddress}`} target="_blank">
          {txAddress}
        </a>
      }
      title="Transfer RON"
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

export default SendTransaction;
