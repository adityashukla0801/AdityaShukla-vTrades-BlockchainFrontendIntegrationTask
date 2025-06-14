import Navbar from "@/components/Navbar";
import WalletStatusCard from "@/components/WalletStatusCard";
import WalletManager from "@/components/WalletManager"; // <-- handles Zustand sync
import CounterInteraction from "@/components/CounterInteraction";

export default function HomePage() {
  return (
    <main>
      <WalletManager />
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="p-4 gap-6 md:flex items-center justify-center">
          <WalletStatusCard />
          <CounterInteraction />
        </div>
      </div>
    </main>
  );
}
