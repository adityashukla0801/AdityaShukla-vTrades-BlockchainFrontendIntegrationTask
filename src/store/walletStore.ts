import { create } from "zustand";
import { persist } from "zustand/middleware";

type WalletState = {
  address: `0x${string}` | null;
  isConnected: boolean;
  setWallet: (address: `0x${string}`, isConnected: boolean) => void;
  resetWallet: () => void;
};

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      address: null,
      isConnected: false,
      setWallet: (address, isConnected) => set({ address, isConnected }),
      resetWallet: () => set({ address: null, isConnected: false }),
    }),
    { name: "wallet-store" }
  )
);
