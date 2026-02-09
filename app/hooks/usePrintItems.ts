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
  const [loading, setLoading] = useState(true);

  // Load items from MongoDB on mount
  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    const loadedItems = await storageService.loadItems();
    setItems(loadedItems);
    setLoading(false);
  };

  const addFile = async (file: File) => {
    try {
      const content = await readFileAsDataURL(file);
      const isImage = file.type.startsWith("image/");

      const newItemData = {
        type: (isImage ? "image" : "file") as "file" | "image",
        content,
        fileName: file.name,
        fileSize: file.size,
        timestamp: new Date(),
        preview: isImage ? content : undefined,
      };

      const savedItem = await storageService.saveItem(newItemData);

      if (savedItem) {
        setItems((prev) => [savedItem, ...prev]);
      }
    } catch (error) {
      console.error("Failed to add file:", error);
      throw error;
    }
  };

  const addTextOrUrl = async (value: string) => {
    if (!value.trim()) return;

    const urlCheck = isValidUrl(value);

    const newItemData = {
      type: (urlCheck ? "url" : "text") as "url" | "text",
      content: value.trim(),
      timestamp: new Date(),
    };

    const savedItem = await storageService.saveItem(newItemData);

    if (savedItem) {
      setItems((prev) => [savedItem, ...prev]);
    }
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

  const deleteItem = async (id: string) => {
    const success = await storageService.deleteItem(id);
    if (success) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const clearAll = async () => {
    const success = await storageService.clearItems();
    if (success) {
      setItems([]);
    }
  };

  return {
    items,
    loading,
    addFile,
    addTextOrUrl,
    addPastedImage,
    deleteItem,
    clearAll,
    refreshItems: loadItems,
  };
};
