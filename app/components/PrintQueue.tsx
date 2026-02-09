// FILE: app/components/PrintQueue.tsx
// Copy this to: app/components/PrintQueue.tsx

import { Clock, Printer } from "lucide-react";
import { PrintItem } from "@/app/types";
import { PrintQueueItem } from "./PrintQueueItem";

interface PrintQueueProps {
  items: PrintItem[];
  onDeleteItem: (id: string) => void;
}

export const PrintQueue = ({ items, onDeleteItem }: PrintQueueProps) => {
  if (items.length === 0) {
    return (
      <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border-2 border-zinc-800 rounded-3xl p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-3xl blur opacity-25"></div>
            <div className="relative bg-zinc-800 p-6 rounded-3xl border border-zinc-700">
              <Printer className="w-16 h-16 text-zinc-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">No Items Yet</h3>
          <p className="text-zinc-400 mb-6">
            Upload documents, paste text/URLs, or paste images to get started.{" "}
            <br />
            Your print queue will appear here!
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-zinc-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <span>Ready to receive</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border-2 border-zinc-800 rounded-3xl p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl blur opacity-50"></div>
            <div className="relative bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-xl">
              <Clock className="w-5 h-5 text-black" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white">Print Queue</h2>
        </div>
        <p className="text-sm text-zinc-400">Ready to print!</p>
      </div>

      <div className="grid gap-4">
        {items.map((item) => (
          <PrintQueueItem key={item.id} item={item} onDelete={onDeleteItem} />
        ))}
      </div>
    </div>
  );
};
