"use client";

import { useWalletStore } from "@/store/walletStore";
import { useConnect, useDisconnect } from "wagmi";
import { injected } from "@wagmi/connectors";

export default function Navbar() {
  const { address, isConnected } = useWalletStore();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  // Show the conneted wallet address
  const shortAddr = address?.slice(0, 6) + "..." + address?.slice(-4);

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-gray-900 text-white shadow-md">
      <div className="text-2xl font-bold">🔗 MyDapp</div>
      <div>
        {isConnected && address ? (
          <div className="flex items-center gap-4">
            <span className="bg-gray-800 px-3 py-1 rounded-full font-mono text-sm">
              {shortAddr}
            </span>
            <button
              onClick={() => disconnect()}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm cursor-pointer"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            onClick={() => connect({ connector: injected() })}
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-sm cursor-pointer"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </nav>
  );
}
