/* eslint-disable */
import { useState } from "react";
import useIdProvider from "../context/useProvider";
import AppShell from "../common/AppShell";
import { ethers } from "ethers";
const contractAddress = "0xfff9ce5f71ca6178d3beecedb61e7eff1602950e";
const SignTypeData = () => {
  const { provider } = useIdProvider();
  const [message, _setMessage] = useState("");
  const [hashedMessage, setHashedMessage] = useState("");

  const signMessageHandler = async () => {
    const contract = await provider?.getBalance(contractAddress);
    console.log({ contract: contract?.toHexString() });
    const messageSigned = await provider?.getSigner().signMessage(message);
    const address = await provider?.getSigner().getAddress();
    const returnAddress = ethers.utils.verifyMessage(
      message,
      messageSigned || ""
    );

    if (address !== returnAddress) {
      alert("Invalid Signature");
      return;
    }
    setHashedMessage(messageSigned || "");
  };

  return (
    <AppShell result={hashedMessage} title="Sign Data">
      <p>
        Sign data to{" "}
        <a
          href={`https://app.roninchain.com/address/${contractAddress}`}
          target="_blank"
        >
          Smart contract
        </a>
      </p>
      <button onClick={signMessageHandler}>Sign</button>
    </AppShell>
  );
};

export default SignTypeData;
