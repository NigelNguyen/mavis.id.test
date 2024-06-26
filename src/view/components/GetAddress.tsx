import { useState } from "react";
import useIdProvider from "../context/useProvider";
import AppShell from "../common/AppShell";

const GetAddress = () => {
  const { provider } = useIdProvider();
  const [address, setAddress] = useState<string>();

  const getAddressHandler = async () => {
    const account = await provider?.getSigner().getAddress();
    setAddress(account);
  };

  return (
    <AppShell result={address} title="Get Address">
      <button onClick={getAddressHandler}>Get Address</button>
    </AppShell>
  );
};

export default GetAddress;
