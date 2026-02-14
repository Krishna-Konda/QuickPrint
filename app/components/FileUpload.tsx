import { useRef } from "react";
import { Upload } from "lucide-react";
import { ACCEPTED_FILE_TYPES } from "@/app/constants/config";

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
}

export const FileUpload = ({ onFilesSelected }: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      onFilesSelected(Array.from(files));
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files) {
      onFilesSelected(Array.from(files));
    }
  };

  return (
    <div className="mb-6">
      <label
        htmlFor="file-upload"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="relative block border-2 border-dashed border-zinc-700 rounded-2xl p-12 text-center hover:border-cyan-500 transition-all duration-300 cursor-pointer group bg-zinc-900/50 hover:bg-zinc-900/70 backdrop-blur-sm">
        <input
          id="file-upload"
          ref={fileInputRef}
          type="file"
          multiple
          accept={ACCEPTED_FILE_TYPES.all}
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative bg-gradient-to-r from-cyan-500 to-blue-500 p-4 rounded-2xl">
              <Upload className="w-10 h-10 text-black" />
            </div>
          </div>
          <p className="text-xl font-semibold text-white mb-2">
            Drop files here or click to upload
          </p>
          <p className="text-sm text-zinc-400 mb-4">
            PDFs, Documents, Images • Multiple files supported
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <span className="px-3 py-1 bg-zinc-800 text-cyan-400 rounded-lg text-xs font-medium border border-zinc-700">
              PDF
            </span>
            <span className="px-3 py-1 bg-zinc-800 text-blue-400 rounded-lg text-xs font-medium border border-zinc-700">
              DOC
            </span>
            <span className="px-3 py-1 bg-zinc-800 text-purple-400 rounded-lg text-xs font-medium border border-zinc-700">
              JPG
            </span>
            <span className="px-3 py-1 bg-zinc-800 text-pink-400 rounded-lg text-xs font-medium border border-zinc-700">
              PNG
            </span>
          </div>
        </div>
      </label>
    </div>
  );
};
