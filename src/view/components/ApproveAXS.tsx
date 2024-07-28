import { useState } from "react";
import useIdProvider from "../context/useProvider";
import AppShell from "../common/AppShell";
import { addressConfig } from "../../constants/address";
import { fromFracAmount } from "../../lib/utils/currency";
import { encodeFunctionData } from "viem";
import { AXS_ABI } from "../contracts/abis/Axs";
import { requestIdTransaction } from "../../lib/transaction/sendtransaction";
const TESTNET_HOST = import.meta.env.VITE_TESTNET_HOST || origin;

const ApproveAXS = () => {
  const { signer } = useIdProvider();
  const [amount, setAmount] = useState(0.1);
  const [spender, setSpenderAddress] = useState(addressConfig.axs);
  const [txHash, setTxHash] = useState("");

  const approveAxsHandler = async () => {
    if (!signer) return;
    const amountToTransfer = fromFracAmount(amount, 18);
    const data = encodeFunctionData({
      abi: AXS_ABI,
      functionName: "approve",
      args: [spender, amountToTransfer],
    });

    const txHash = await requestIdTransaction({
      to: addressConfig.axs,
      data,
    });
    setTxHash(txHash);

    // const contract = AXS__factory.connect(addressConfig.axs, signer);
    // const txData = await contract.approve(spender, BigInt(amount * 10 ** 18));
    // console.log({ txData });
    // setTxHash(txData.hash);
  };

  return (
    <AppShell
      result={
        <a href={`${TESTNET_HOST}/tx/${txHash}`} target="_blank">
          {txHash}
        </a>
      }
      title="Approve ERC20 Token"
      description="Approve AXS to be spent by another address."
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
        placeholder="Spender Address"
        value={spender}
        onChange={(event) => setSpenderAddress(event.target.value)}
        className="px-2 py-1 border rounded-md min-h-10"
      ></input>
      <button onClick={approveAxsHandler}>Approve AXS</button>
    </AppShell>
  );
};

export default ApproveAXS;
