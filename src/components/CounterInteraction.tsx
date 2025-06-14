"use client";

import React, { useState } from "react";
import { useReadContract, useWriteContract, useTransaction } from "wagmi";
import { counterAbi } from "@/hooks/counterAbi";
import { waitForTransactionReceipt } from "wagmi/actions";
import { wagmiConfig } from "@/lib/wagmi";
import { useWalletStore } from "@/store/walletStore";
import { TransactionHistory } from "./TransactionHistory";

const CONTRACT_ADDRESS = "0xE47C0f73d1C5D9EBE20488c08C78f2dD5d31E1Ee";

export default function CounterInteraction() {
  const { address, isConnected } = useWalletStore();
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [txReloadFlag, setTxReloadFlag] = useState(0);

  const {
    data: count,
    refetch: refetchCount,
    isLoading: isReading,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: counterAbi,
    functionName: "getCount",
  });

  const { writeContractAsync, isPending: isWriting } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useTransaction({
    hash: txHash,
  });

  const handleIncrement = async () => {
    try {
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: counterAbi,
        functionName: "increment",
      });

      setTxHash(hash);

      // Wait for confirmation
      setIsRefreshing(true);
      await waitForTransactionReceipt(wagmiConfig, { hash });
      await refetchCount(); // Ensure latest value is fetched
      setIsRefreshing(false);
      // Trigger transaction history refresh
      setTxReloadFlag((v) => v + 1);
    } catch (err) {
      console.error("Transaction failed:", err);
      setIsRefreshing(false);
    }
  };

  return (
    <>
      <div className="w-full md:max-w-xl mt-4 h-[340px] flex items-center justify-center bg-white rounded-2xl shadow-lg p-6 text-sm text-gray-700">
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            🧮 Counter Smart Contract
          </h2>

          {isConnected ? (
            <>
              <div className="text-gray-700 text-lg mb-4">
                <p>
                  <strong>Current Count:</strong>{" "}
                  {isReading || isRefreshing
                    ? "Loading...	🔄"
                    : count?.toString() ?? "N/A"}
                </p>
              </div>

              <button
                onClick={handleIncrement}
                disabled={isWriting || isConfirming || isRefreshing}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition cursor-pointer"
              >
                {isWriting
                  ? "Sending Tx..."
                  : isConfirming
                  ? "Waiting for Confirmation..."
                  : isRefreshing
                  ? "Fetching Updated Count..."
                  : "Increment Counter"}
              </button>

              {txHash && (
                <p className="mt-2 text-sm text-gray-600 break-words">
                  Tx Hash: 🔗
                  <a
                    className="text-blue-600 underline"
                    href={`https://sepolia.etherscan.io/tx/${txHash}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {txHash}
                  </a>
                </p>
              )}

              {isConfirmed && !isRefreshing && (
                <p className="mt-2 text-green-600 font-medium">
                  ✅ Transaction Confirmed
                </p>
              )}
            </>
          ) : (
            <p className="text-gray-500 font-bold">
              Please connect your wallet to interact
            </p>
          )}
        </div>
      </div>
      <div className="w-full md:max-w-xl mt-4 h-[340px] flex items-center justify-center bg-white rounded-2xl shadow-lg p-6 text-sm text-gray-700">
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            📭 Recent Transactions
          </h2>
          {isConnected ? (
            <TransactionHistory
              address={address}
              triggerReload={txReloadFlag}
            />
          ) : (
            <p className="text-gray-500 font-bold">
              Please connect your wallet to interact
            </p>
          )}
        </div>
      </div>
    </>
  );
}
