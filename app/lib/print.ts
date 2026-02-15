// FILE: app/lib/print.ts
// WORKING SOLUTION - Hidden iframe that works
// Copy this to: app/lib/print.ts

import { PrintItem } from "@/app/types";

class PrintService {
  printPDF(item: PrintItem): void {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    iframe.src = item.content;

    iframe.addEventListener("load", () => {
      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch (err) {
          console.error("Print failed:", err);
        }

        // Remove iframe after 1 second
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      }, 500);
    });
  }

  printImage(item: PrintItem): void {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;

    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print Image</title>
            <style>
              body { margin: 0; display: flex; justify-content: center; align-items: center; }
              img { max-width: 100%; height: auto; }
            </style>
          </head>
          <body>
            <img src="${item.content}" onload="window.print()" />
          </body>
        </html>
      `);
      iframeDoc.close();

      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 2000);
    }
  }

  printText(item: PrintItem): void {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;

    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print Text</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
              pre { white-space: pre-wrap; word-wrap: break-word; }
            </style>
          </head>
          <body>
            <pre>${this.escapeHtml(item.content)}</pre>
            <script>
              window.onload = function() { window.print(); }
            </script>
          </body>
        </html>
      `);
      iframeDoc.close();

      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 2000);
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
