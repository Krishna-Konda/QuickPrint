// FILE: app/lib/print.ts
// Copy this to: app/lib/print.ts

import { PrintItem } from "@/app/types";

class PrintService {
  printPDF(item: PrintItem): void {
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print: ${item.fileName}</title>
          <style>
            * { margin: 0; padding: 0; }
            body { width: 100%; height: 100vh; }
            iframe { width: 100%; height: 100%; border: none; }
          </style>
        </head>
        <body>
          <iframe src="${item.content}" onload="window.print(); setTimeout(() => window.close(), 100);"></iframe>
        </body>
      </html>
    `;

    this.openPrintWindow(printContent);
  }

  printImage(item: PrintItem): void {
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print: ${item.fileName}</title>
          <style>
            * { margin: 0; padding: 0; }
            body { 
              display: flex; 
              justify-content: center; 
              align-items: center; 
              min-height: 100vh;
              background: #fff;
            }
            img { 
              max-width: 100%; 
              max-height: 100vh;
              height: auto; 
              display: block;
            }
            @media print {
              body { margin: 0; }
              img { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <img src="${item.content}" onload="window.print(); setTimeout(() => window.close(), 100);" />
        </body>
      </html>
    `;

    this.openPrintWindow(printContent);
  }

  printText(item: PrintItem): void {
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Text</title>
          <style>
            * { margin: 0; padding: 0; }
            body { 
              font-family: 'Arial', sans-serif; 
              padding: 40px; 
              line-height: 1.6; 
              background: #fff;
              color: #000;
            }
            pre { 
              white-space: pre-wrap; 
              word-wrap: break-word; 
              font-family: inherit;
            }
          </style>
        </head>
        <body>
          <pre>${this.escapeHtml(item.content)}</pre>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => window.close(), 100);
            };
          </script>
        </body>
      </html>
    `;

    this.openPrintWindow(printContent);
  }

  openURL(url: string): void {
    window.open(url, "_blank", "noopener,noreferrer");
  }

  private openPrintWindow(content: string): void {
    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (printWindow) {
      printWindow.document.write(content);
      printWindow.document.close();
    }
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
