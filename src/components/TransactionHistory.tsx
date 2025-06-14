"use client";

import { useEffect, useState } from "react";

interface Props {
  address: `0x${string}` | null;
  triggerReload?: number;
}

interface Tx {
  hash: string;
  to: string;
  from: string;
  value: string;
}

export function TransactionHistory({ address, triggerReload }: Props) {
  const [txs, setTxs] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // For fetch the recent transactions
  useEffect(() => {
    if (!address) return;

    const fetchTxs = async () => {
      setLoading(true);
      setError("");

      try {
        // Delay to let Etherscan catch up
        await new Promise((r) => setTimeout(r, 6000)); // 6-second delay
        const res = await fetch(
          `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=24F34GNRRQ3QGHNNC4D8NAQDTX61GGT152`
        );
        const data = await res.json();
        if (data.status !== "1") {
          setTxs([]);
          throw new Error(data.message);
        }
        console.log("first", data);
        setTxs(data.result); // show last 5 txs
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTxs();
  }, [address, triggerReload]);

  return (
    <div className="mb-4">
      {loading && <p className="text-blue-500">Loading transactions... 🔄</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && txs.length === 0 && (
        <p className="text-gray-500">No transactions found.</p>
      )}
      <ul className="text-sm space-y-1">
        {txs.map((tx) => (
          <li key={tx.hash} className="truncate">
            🔗{" "}
            <a
              href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {tx.hash.slice(0, 15)}.................{tx.hash.slice(-10)}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
