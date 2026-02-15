// FILE: app/lib/print.ts
// SIMPLEST SOLUTION - Native Print Dialog Only
// Copy this to: app/lib/print.ts

import { PrintItem } from "@/app/types";

class PrintService {
  printPDF(item: PrintItem): void {
    // Create completely hidden iframe
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.src = item.content;

    document.body.appendChild(iframe);

    iframe.onload = () => {
      setTimeout(() => {
        iframe.contentWindow?.print();

        // Clean up after 2 seconds
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 2000);
      }, 500);
    };
  }

  printImage(item: PrintItem): void {
    // Create hidden image element
    const img = document.createElement("img");
    img.src = item.content;
    img.style.display = "none";

    document.body.appendChild(img);

    img.onload = () => {
      // Use iframe for image printing
      const iframe = document.createElement("iframe");
      iframe.style.position = "fixed";
      iframe.style.right = "0";
      iframe.style.bottom = "0";
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.style.border = "0";

      document.body.appendChild(iframe);

      const doc = iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(`
          <html>
            <head>
              <style>
                @page { margin: 0; }
                body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
                img { max-width: 100%; height: auto; }
              </style>
            </head>
            <body><img src="${item.content}" /></body>
          </html>
        `);
        doc.close();

        setTimeout(() => {
          iframe.contentWindow?.print();

          setTimeout(() => {
            document.body.removeChild(iframe);
            document.body.removeChild(img);
          }, 2000);
        }, 500);
      }
    };
  }

  printText(item: PrintItem): void {
    // Create iframe for text printing
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";

    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(`
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
              pre { white-space: pre-wrap; word-wrap: break-word; font-family: inherit; }
            </style>
          </head>
          <body><pre>${this.escapeHtml(item.content)}</pre></body>
        </html>
      `);
      doc.close();

      setTimeout(() => {
        iframe.contentWindow?.print();

        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 2000);
      }, 250);
    }
  }

  openURL(url: string): void {
    window.open(url, "_blank", "noopener,noreferrer");
  }

  private escapeHtml(text: string): string {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  downloadFile(item: PrintItem): void {
    const link = document.createElement("a");
    link.href = item.content;
    link.download =
      item.fileName ||
      `download-${Date.now()}.${item.type === "image" ? "png" : "pdf"}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export const printService = new PrintService();
