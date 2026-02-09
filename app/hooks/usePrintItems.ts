// FILE: app/hooks/usePrintItems.ts
// Copy this to: app/hooks/usePrintItems.ts

import { useState, useEffect } from "react";
import { PrintItem } from "@/app/types";
import { storageService } from "@/app/lib/storage";
import {
  generateUniqueId,
  isValidUrl,
  readFileAsDataURL,
} from "@/app/lib/utils";

export const usePrintItems = () => {
  const [items, setItems] = useState<PrintItem[]>([]);

  // Load items from localStorage on mount
  useEffect(() => {
    const loadedItems = storageService.loadItems();
    setItems(loadedItems);
  }, []);

  // Save items to localStorage whenever they change
  useEffect(() => {
    storageService.saveItems(items);
  }, [items]);

  const addFile = async (file: File) => {
    try {
      const content = await readFileAsDataURL(file);
      const isImage = file.type.startsWith("image/");

      const newItem: PrintItem = {
        id: generateUniqueId(),
        type: isImage ? "image" : "file",
        content,
        fileName: file.name,
        fileSize: file.size,
        timestamp: new Date(),
        preview: isImage ? content : undefined,
      };

      setItems((prev) => [newItem, ...prev]);
    } catch (error) {
      console.error("Failed to add file:", error);
      throw error;
    }
  };

  const addTextOrUrl = (value: string) => {
    if (!value.trim()) return;

    const urlCheck = isValidUrl(value);

    const newItem: PrintItem = {
      id: generateUniqueId(),
      type: urlCheck ? "url" : "text",
      content: value.trim(),
      timestamp: new Date(),
    };

    setItems((prev) => [newItem, ...prev]);
  };

  const addPastedImage = async (blob: Blob) => {
    try {
      const file = new File([blob], `pasted-image-${Date.now()}.png`, {
        type: blob.type,
      });
      await addFile(file);
    } catch (error) {
      console.error("Failed to add pasted image:", error);
      throw error;
    }
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearAll = () => {
    setItems([]);
    storageService.clearItems();
  };

  return {
    items,
    addFile,
    addTextOrUrl,
    addPastedImage,
    deleteItem,
    clearAll,
  };
};
