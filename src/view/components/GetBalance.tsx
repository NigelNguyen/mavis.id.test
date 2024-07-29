import { useState } from "react";
import useIdProvider from "../context/useProvider";
import AppShell from "../common/AppShell";
import { tryCatch } from "../../lib/utils/tryCatch";
import toast from "react-hot-toast";

const GetBalance = () => {
  const { provider } = useIdProvider();
  const [balance, setBalance] = useState<number>();

  const getBalanceHandler = () =>
    tryCatch(async () => {
      const balance = await provider?.getSigner().getBalance();
      const balance_ = Number(balance) || 0;
      setBalance(balance_ / Math.pow(10, 18));
      toast.success("Get RON balance successfully.")
    });

  return (
    <AppShell
      result={balance !== undefined ? `${balance.toString()} RON` : ""}
      title="Get Balance"
    >
      <button onClick={getBalanceHandler}>Get Balance</button>
    </AppShell>
  );
};

export default GetBalance;
