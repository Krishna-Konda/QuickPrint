import { Upload } from "lucide-react";
import { FileUpload } from "./FileUpload";
import { TextInput } from "./TextInput";

interface UploadSectionProps {
  onFilesSelected: (files: File[]) => void;
  onTextSubmit: (value: string) => void;
}

export const UploadSection = ({
  onFilesSelected,
  onTextSubmit,
}: UploadSectionProps) => {
  return (
    <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border-2 border-zinc-800 rounded-3xl p-6 sm:p-8 mb-8 shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur opacity-50"></div>
          <div className="relative bg-gradient-to-r from-cyan-500 to-blue-500 p-2 rounded-xl">
            <Upload className="w-5 h-5 text-black" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white">Add Documents</h2>
      </div>

      <FileUpload onFilesSelected={onFilesSelected} />
      <TextInput onSubmit={onTextSubmit} />
    </div>
  );
};
