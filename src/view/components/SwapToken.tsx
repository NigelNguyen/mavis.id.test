import { useState } from "react";
import useIdProvider from "../context/useProvider";
import AppShell from "../common/AppShell";
import { KatanaRouter__factory } from "../contracts";
import { addressConfig } from "../../constants/address";
import { BigNumber, constants } from "ethers";
import { parseUnits } from "ethers/lib/utils";
const TESTNET_HOST = import.meta.env.VITE_TESTNET_HOST || origin;

export const SwapToken = () => {
  const { signer } = useIdProvider();
  const [amount, setAmount] = useState(0.1);
  const [txHash, setTxHash] = useState("");

  const handleSwapRonToAxs = async () => {
    const account = await signer?.getAddress();

    if (!signer || !account) return;
    const katanaRouter = KatanaRouter__factory.connect(
      addressConfig.katana,
      signer
    );

    const slippageTolerance = parseUnits("2", 18);
    const amountToSwap = parseUnits(amount.toString(), 18);
    // If you want to set a minimum based on slippage tolerance, you can do something like this:
    const slippageAmount = amountToSwap
      .mul(slippageTolerance)
      .div(constants.WeiPerEther);
    let amountOutMin = amountToSwap.sub(slippageAmount);

    // Ensure amountOutMin is never negative
    if (amountOutMin.lt(0)) {
      amountOutMin = BigNumber.from(0);
    }
    const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10 minutes from now
    const path = [addressConfig.WRON, addressConfig.axs];
    const swapTX = await katanaRouter.swapExactRONForTokens(
      amountOutMin,
      path,
      account,
      deadline,
      {
        gasPrice: parseUnits("20", "gwei"),
        value: amountToSwap,
      }
    );
    setTxHash(swapTX.hash);
  };

  return (
    <AppShell
      result={
        <a href={`${TESTNET_HOST}/tx/${txHash}`} target="_blank">
          {txHash}
        </a>
      }
      title="Katana"
      description="Swap AXS & RON on Katana."
    >
      <input
        placeholder="Amount"
        value={amount}
        type="number"
        step={0.0001}
        onChange={(event) => setAmount(Number(event.target.value))}
        className="px-2 py-1 border rounded-md min-h-10"
      ></input>
      <button onClick={handleSwapRonToAxs}>Swap to AXS</button>
    </AppShell>
  );
};
