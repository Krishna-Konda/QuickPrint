// FILE: app/hooks/useImagePaste.ts
// Copy this to: app/hooks/useImagePaste.ts

import { useEffect } from "react";

interface UseImagePasteProps {
  onImagePaste: (blob: Blob) => void;
}

export const useImagePaste = ({ onImagePaste }: UseImagePasteProps) => {
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            onImagePaste(blob);
          }
        }
      }
    };

    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [onImagePaste]);
};
