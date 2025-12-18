import { createThirdwebClient } from "thirdweb";
import { inAppWallet, createWallet } from "thirdweb/wallets";

export const client = createThirdwebClient({
  clientId: "f9526bb1508c21f89bdb0762fbee6278",
});

export const wallets = [
  inAppWallet({
    auth: { options: ["google", "email", "passkey", "phone"] }
  }),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
];