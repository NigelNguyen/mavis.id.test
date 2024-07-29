import { useState } from "react";
import useIdProvider from "../context/useProvider";
import AppShell from "../common/AppShell";
import { ethers } from "ethers";
import { tryCatch } from "../../lib/utils/tryCatch";
import toast from "react-hot-toast";

const SignMessage = () => {
  const { provider } = useIdProvider();
  const [message, setMessage] = useState("");
  const [hashedMessage, setHashedMessage] = useState("");

  const signMessageHandler = () =>
    tryCatch(async () => {
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
      toast.success("Singed message successfully.");
    });
  // useEffect(() => {
  //   window.addEventListener("message", (event) => {
  //     console.log({data:event.data, source: event.data, origin: event.origin, lastEventId: event.lastEventId});
  //   });
  // }, []);

  return (
    <AppShell result={hashedMessage} title="Sign Your Message">
      <input
        placeholder="Your Message"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        className="px-2 py-1 border rounded-md min-h-10"
      ></input>
      <button onClick={signMessageHandler}>Sign</button>
    </AppShell>
  );
};

export default SignMessage;
