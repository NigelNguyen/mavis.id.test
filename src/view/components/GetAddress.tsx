import { useState } from "react";
import useIdProvider from "../context/useProvider";
import AppShell from "../common/AppShell";
import { tryCatch } from "../../lib/utils/tryCatch";
import toast from "react-hot-toast";

const GetAddress = () => {
  const { provider } = useIdProvider();
  const [address, setAddress] = useState<string>();

  const getAddressHandler = () =>
    tryCatch(async () => {
      const account = await provider?.getSigner().getAddress();
      setAddress(account);
      toast.success("Get address successfully.")
    });

  return (
    <AppShell result={address} title="Get Address">
      <button onClick={getAddressHandler}>Get Address</button>
    </AppShell>
  );
};

export default GetAddress;
