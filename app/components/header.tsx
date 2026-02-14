import { Printer, Trash2, Zap } from "lucide-react";
import { APP_CONFIG } from "@/app/constants/config";

interface HeaderProps {
  itemCount: number;
  onClearAll: () => void;
}

export const Header = ({ itemCount, onClearAll }: HeaderProps) => {
  const handleClearClick = () => {
    if (window.confirm("Clear all items from the queue?")) {
      onClearAll();
    }
  };

  return (
    <header className="bg-zinc-900/95 backdrop-blur-xl border-b border-zinc-800 sticky top-0 z-50 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur opacity-75"></div>
              <div className="relative bg-gradient-to-r from-cyan-500 to-blue-500 p-3 rounded-xl">
                <Printer className="w-7 h-7 text-black" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                {APP_CONFIG.name}
              </h1>
              <p className="text-sm text-zinc-400 font-medium flex items-center gap-2">
                <Zap className="w-3 h-3" />
                {APP_CONFIG.tagline}
              </p>
            </div>
          </div>

          {itemCount > 0 && (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-block text-sm text-zinc-300 bg-zinc-800 px-4 py-2 rounded-lg font-medium border border-zinc-700">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </span>
              <button
                onClick={handleClearClick}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 bg-red-950/50 hover:bg-red-950/70 rounded-lg transition-all duration-200 font-medium border border-red-900/50 hover:border-red-800">
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Clear All</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
