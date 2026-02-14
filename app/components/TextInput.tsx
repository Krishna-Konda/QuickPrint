import { useState, useRef } from "react";
import { FileText, Image as ImageIcon } from "lucide-react";

interface TextInputProps {
  onSubmit: (value: string) => void;
}

export const TextInput = ({ onSubmit }: TextInputProps) => {
  const [value, setValue] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit(value);
      setValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSubmit();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-50"></div>
          <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-xl">
            <FileText className="w-5 h-5 text-black" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-white">Paste Text or URL</h3>
      </div>

      <div className="relative">
        <textarea
          ref={textAreaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Paste text, URL, or press Ctrl+V to paste images anywhere on the page..."
          className="w-full px-5 py-4 border-2 border-zinc-700 rounded-2xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none resize-none transition-all duration-200 text-white placeholder-zinc-500 min-h-[120px] bg-zinc-900/50 backdrop-blur-sm"
        />
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded-lg border border-zinc-700">
            Ctrl + Enter to add
          </span>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!value.trim()}
        className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-black rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/50 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none flex items-center justify-center gap-2">
        <FileText className="w-5 h-5" />
        Add to Print Queue
      </button>

      {/* Paste Image Hint */}
      <div className="p-4 bg-gradient-to-r from-zinc-900 to-zinc-800 border border-zinc-700 rounded-xl">
        <div className="flex items-start gap-3">
          <div className="bg-zinc-800 p-2 rounded-lg mt-0.5 border border-zinc-700">
            <ImageIcon className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white mb-1">
              💡 Pro Tip: Paste Images Directly!
            </p>
            <p className="text-sm text-zinc-400">
              Copy any image and press{" "}
              <kbd className="px-2 py-0.5 bg-zinc-900 border border-zinc-700 rounded text-xs font-mono text-cyan-400">
                Ctrl+V
              </kbd>{" "}
              anywhere on this page to add it instantly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
