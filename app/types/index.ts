// FILE: app/types/index.ts
// Copy this to: app/types/index.ts

export interface PrintItem {
  id: string;
  type: "file" | "text" | "url" | "image";
  content: string;
  fileName?: string;
  fileSize?: number;
  timestamp: Date;
  preview?: string;
}

export type ItemType = "file" | "text" | "url" | "image";
