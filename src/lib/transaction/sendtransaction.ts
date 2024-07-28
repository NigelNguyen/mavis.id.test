import { CommunicateHelper } from "../@axieinfinity/mavis-id-sdk/src/common/communicate-helper";
import { CLIENT_ID } from "../../constants/config";

const communicateHelper = new CommunicateHelper("https://id.skymavis.one");

export const requestIdTransaction = async ({
  to = "",
  value,
  data,
  gas,
}: {
  to: string;
  value?: string;
  data?: string;
  gas?: string;
}) => {
  const txHash = await communicateHelper.sendRequest<string>((requestId) => {
    const url = new URL(`https://id.skymavis.one/wallet/call?state=${requestId}&clientId=${CLIENT_ID}&origin=${encodeURIComponent(
      window.origin
    )}&to=${to.toLowerCase()}&chainId=${2021}`)

    if (data) url.searchParams.set("data",data)
    if (value) url.searchParams.set("value",value)
    if (gas) url.searchParams.set("gas",gas)

    const popup = window.open(
      url,
      "_blank"
    );

    if (!popup) throw new Error(`Failed to open Popup`);

    popup.focus();
    return popup;
  });
  return txHash;
};
