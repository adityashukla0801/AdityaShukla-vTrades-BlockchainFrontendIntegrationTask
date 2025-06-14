"use client";

import { useEffect } from "react";
import { useAccount } from "wagmi";
import { useWalletStore } from "@/store/walletStore";

export default function WalletManager() {
  const { address, isConnected } = useAccount();
  const { setWallet, resetWallet } = useWalletStore();

  // If the wallet is connected then set the wallet address and status
  useEffect(() => {
    if (isConnected && address) setWallet(address, true);
    else resetWallet();
  }, [isConnected, address, setWallet, resetWallet]);

  return null;
}
