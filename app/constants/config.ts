// FILE: app/constants/config.ts
// Copy this to: app/constants/config.ts

export const APP_CONFIG = {
  name: "QuickPrint",
  tagline: "Print smarter, not harder",
  maxFileSize: 10 * 1024 * 1024, // 10MB
  storageKey: "quickprint-items",
} as const;

export const ACCEPTED_FILE_TYPES = {
  documents: ".pdf,.doc,.docx,.txt",
  images: "image/*",
  all: ".pdf,.doc,.docx,.txt,image/*",
} as const;

export const MIME_TYPES = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  image: "image/",
} as const;
