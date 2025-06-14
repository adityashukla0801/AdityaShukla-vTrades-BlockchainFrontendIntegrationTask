"use client";

import { useConnect, useDisconnect, useBalance, useChainId } from "wagmi";
import { injected } from "@wagmi/connectors";
import { useWalletStore } from "@/store/walletStore";
import { useEffect, useState } from "react";

// Chain name map
const CHAIN_NAME_MAP: Record<number, string> = {
  1: "Ethereum Mainnet",
  5: "Goerli Testnet",
  11155111: "Sepolia Testnet",
  137: "Polygon",
  80001: "Mumbai Testnet",
  10: "Optimism",
  42161: "Arbitrum",
};

export default function WalletStatusCard() {
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useWalletStore();
  const {
    data: balance,
    isLoading: isBalanceLoading,
    isError: isBalanceError,
    error: balanceError,
  } = useBalance({
    address: address ?? undefined,
  });
  const chainId = useChainId();

  const [chainName, setChainName] = useState<string | undefined>(undefined);

  // Update chain name when chainId changes
  useEffect(() => {
    if (chainId) {
      setChainName(CHAIN_NAME_MAP[chainId] || `Unknown (ID: ${chainId})`);
    }
  }, [chainId]);

  // Handle wallet & network changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    const { ethereum } = window;
    if (!ethereum || !ethereum.on) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect(); // Disconnected in wallet UI
      }
    };

    const handleChainChanged = (newChainId: string) => {
      const parsedChainId = parseInt(newChainId, 16);
      setChainName(
        CHAIN_NAME_MAP[parsedChainId] || `Unknown (ID: ${parsedChainId})`
      );
      // Optional: Force reload to sync app
      window.location.reload();
    };

    ethereum.on("accountsChanged", handleAccountsChanged);
    ethereum.on("chainChanged", handleChainChanged);

    return () => {
      ethereum.removeListener("accountsChanged", handleAccountsChanged);
      ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, [disconnect]);

  return (
    <div className="w-full md:max-w-xl mt-4 h-[340px] flex items-center justify-center bg-white rounded-2xl shadow-lg p-6 text-sm text-gray-700">
      <div>
        {isConnected && address ? (
          <>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              ✅ Connected
            </h2>
            <p className="mb-2">
              🆔 <strong>Address:</strong> {address}
            </p>
            <p className="mb-2">
              🌐 <strong>Network:</strong> {chainName}
            </p>

            <p className="mb-4">
              💰 <strong>Wallet Balance: </strong>
              {isBalanceLoading ? (
                <span className="text-blue-500">Loading... 🔄</span>
              ) : isBalanceError ? (
                <span className="text-red-600">
                  Error: {balanceError?.message}
                </span>
              ) : (
                <span>
                  {balance?.formatted} {balance?.symbol}
                </span>
              )}
            </p>
            <button
              onClick={() => disconnect()}
              className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition cursor-pointer"
            >
              Disconnect
            </button>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Connect your metmask wallet
            </h2>

            <button
              onClick={() => connect({ connector: injected() })}
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition cursor-pointer"
            >
              Connect Wallet
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
