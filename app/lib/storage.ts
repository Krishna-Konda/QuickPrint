import { PrintItem } from "@/app/types";

class StorageService {
  private baseUrl = "/api/items";

  async saveItem(item: Omit<PrintItem, "id">): Promise<PrintItem | null> {
    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      });

      const result = await response.json();

      if (result.success) {
        return {
          ...result.data,
          id: result.data._id,
          timestamp: new Date(result.data.timestamp),
        };
      }

      return null;
    } catch (error) {
      console.error("Failed to save item:", error);
      return null;
    }
  }

  async loadItems(): Promise<PrintItem[]> {
    try {
      const response = await fetch(this.baseUrl, {
        cache: "no-store",
      });

      const result = await response.json();

      if (result.success) {
        return result.data.map((item: any) => ({
          ...item,
          id: item._id,
          timestamp: new Date(item.timestamp),
        }));
      }

      return [];
    } catch (error) {
      console.error("Failed to load items:", error);
      return [];
    }
  }

  async deleteItem(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error("Failed to delete item:", error);
      return false;
    }
  }

  async clearItems(): Promise<boolean> {
    try {
      const response = await fetch(this.baseUrl, {
        method: "DELETE",
      });

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error("Failed to clear items:", error);
      return false;
    }
  }
}

export const storageService = new StorageService();
