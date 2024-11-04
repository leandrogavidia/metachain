"use client"

import { createThirdwebClient } from "thirdweb";
import { ConnectButton } from "thirdweb/react";
 
const thirdwebClientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID

if (!thirdwebClientId) {
  throw new Error("THIRDWEB_CLIENT_ID is not set");
}

const client = createThirdwebClient({
  clientId: thirdwebClientId,
});

export function ConnectWeb3Button() {
  return (
    <ConnectButton client={client} />
  )
}