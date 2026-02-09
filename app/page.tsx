// FILE: app/page.tsx
// Copy this to: app/page.tsx

"use client";

import { usePrintItems } from "./hooks/usePrintItems";
import { useImagePaste } from "./hooks/useImagePaste";
import { Header } from "./components/header";
import { UploadSection } from "./components/UploadSection";
import { PrintQueue } from "./components/PrintQueue";

export default function Home() {
  const { items, addFile, addTextOrUrl, addPastedImage, deleteItem, clearAll } =
    usePrintItems();

  useImagePaste({
    onImagePaste: addPastedImage,
  });

  const handleFilesSelected = async (files: File[]) => {
    for (const file of files) {
      try {
        await addFile(file);
      } catch (error) {
        console.error("Error adding file:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Header itemCount={items.length} onClearAll={clearAll} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <UploadSection
            onFilesSelected={handleFilesSelected}
            onTextSubmit={addTextOrUrl}
          />

          <PrintQueue items={items} onDeleteItem={deleteItem} />
        </main>

        {/* Footer */}
        <footer className="relative z-10 mt-16 pb-8 text-center text-sm text-zinc-500">
          <p>
            Built for students who print smarter • Upload anywhere, print
            everywhere
          </p>
        </footer>
      </div>
    </div>
  );
}
