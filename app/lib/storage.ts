// FILE: app/lib/storage.ts
// Copy this to: app/lib/storage.ts

import { PrintItem } from "@/app/types";
import { APP_CONFIG } from "@/app/constants/config";

class StorageService {
  private storageKey = APP_CONFIG.storageKey;

  saveItems(items: PrintItem[]): void {
    try {
      if (items.length > 0) {
        localStorage.setItem(this.storageKey, JSON.stringify(items));
      } else {
        localStorage.removeItem(this.storageKey);
      }
    } catch (error) {
      console.error("Failed to save items:", error);
    }
  }

  loadItems(): PrintItem[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }));
      }
    } catch (error) {
      console.error("Failed to load items:", error);
    }
    return [];
  }

  clearItems(): void {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error("Failed to clear items:", error);
    }
  }
}

export const storageService = new StorageService();
