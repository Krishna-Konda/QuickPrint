import {
  FileText,
  Link as LinkIcon,
  Image as ImageIcon,
  Printer,
  Download,
  Trash2,
  Clock,
  Copy,
  Check,
} from "lucide-react";
import { useState } from "react";
import { PrintItem } from "@/app/types";
import { formatFileSize, formatTimestamp } from "@/app/lib/utils";
import { printService } from "@/app/lib/print";

interface PrintQueueItemProps {
  item: PrintItem;
  onDelete: (id: string) => void;
}

export const PrintQueueItem = ({ item, onDelete }: PrintQueueItemProps) => {
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    switch (item.type) {
      case "file":
        printService.printPDF(item);
        break;
      case "image":
        printService.printImage(item);
        break;
      case "url":
        printService.openURL(item.content);
        break;
      // Note: No print case for 'text' type
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(item.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  const handleDownload = () => {
    if (item.type === "file" || item.type === "image") {
      printService.downloadFile(item);
    }
  };

  const getIcon = () => {
    switch (item.type) {
      case "file":
        return <FileText className="w-10 h-10 text-red-400" />;
      case "url":
        return <LinkIcon className="w-10 h-10 text-blue-400" />;
      case "text":
        return <FileText className="w-10 h-10 text-green-400" />;
      case "image":
        return <ImageIcon className="w-10 h-10 text-purple-400" />;
    }
  };

  const getTypeColor = () => {
    switch (item.type) {
      case "file":
        return "bg-red-950/50 text-red-400 border-red-900/50";
      case "url":
        return "bg-blue-950/50 text-blue-400 border-blue-900/50";
      case "text":
        return "bg-green-950/50 text-green-400 border-green-900/50";
      case "image":
        return "bg-purple-950/50 text-purple-400 border-purple-900/50";
    }
  };

  const getIconBg = () => {
    switch (item.type) {
      case "file":
        return "bg-red-950/50 border-red-900/50";
      case "url":
        return "bg-blue-950/50 border-blue-900/50";
      case "text":
        return "bg-green-950/50 border-green-900/50";
      case "image":
        return "bg-purple-950/50 border-purple-900/50";
    }
  };

  return (
    <div className="group bg-gradient-to-br from-zinc-900 to-zinc-800 border-2 border-zinc-800 rounded-2xl p-5 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300">
      <div className="flex items-start gap-4">
        {/* Icon/Preview */}
        <div className="flex-shrink-0">
          {item.type === "image" && item.preview ? (
            <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-zinc-700 shadow-lg">
              <img
                src={item.preview}
                alt={item.fileName}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div
              className={`w-20 h-20 rounded-xl flex items-center justify-center border ${getIconBg()}`}>
              {getIcon()}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white truncate mb-1">
                {item.fileName ||
                  (item.type === "url" ? "URL Link" : "Text Document")}
              </h3>
              <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                <span
                  className={`px-2 py-1 rounded-lg font-medium border ${getTypeColor()}`}>
                  {item.type.toUpperCase()}
                </span>
                {item.fileSize && (
                  <span className="bg-zinc-800 px-2 py-1 rounded-lg border border-zinc-700">
                    {formatFileSize(item.fileSize)}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTimestamp(item.timestamp)}
                </span>
              </div>
            </div>
          </div>

          {/* Preview Content */}
          {item.type === "text" && (
            <p className="text-sm text-zinc-300 line-clamp-2 bg-zinc-900/50 p-3 rounded-lg border border-zinc-800 mt-2">
              {item.content}
            </p>
          )}
          {item.type === "url" && (
            <a
              href={item.content}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-cyan-400 hover:text-cyan-300 line-clamp-1 mt-2 inline-block hover:underline">
              {item.content}
            </a>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 mt-4">
            {/* Show Print button for everything EXCEPT text */}
            {item.type !== "text" && (
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-black rounded-xl font-medium hover:shadow-lg hover:shadow-cyan-500/50 hover:scale-105 transition-all duration-200 text-sm">
                <Printer className="w-4 h-4" />
                Print Now
              </button>
            )}

            {/* Show Copy button ONLY for text */}
            {item.type === "text" && (
              <button
                onClick={handleCopy}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 text-sm ${
                  copied
                    ? "bg-green-950/50 text-green-400 border border-green-900/50"
                    : "bg-gradient-to-r from-cyan-500 to-blue-500 text-black hover:shadow-lg hover:shadow-cyan-500/50 hover:scale-105"
                }`}>
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Text
                  </>
                )}
              </button>
            )}

            {(item.type === "file" || item.type === "image") && (
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-zinc-300 rounded-xl font-medium hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 transition-all duration-200 text-sm">
                <Download className="w-4 h-4" />
                Download
              </button>
            )}
            <button
              onClick={() => onDelete(item.id)}
              className="flex items-center gap-2 px-4 py-2 bg-red-950/50 text-red-400 rounded-xl font-medium hover:bg-red-950/70 transition-all duration-200 text-sm border border-red-900/50">
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
