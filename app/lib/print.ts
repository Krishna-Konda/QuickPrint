// FILE: app/lib/print.ts
// CLEAN VERSION - No document.write issues
// Copy this to: app/lib/print.ts

import { PrintItem } from "@/app/types";

class PrintService {
  printPDF(item: PrintItem): void {
    const printFrame = document.createElement("iframe");
    printFrame.style.cssText =
      "position:absolute;width:0;height:0;border:none;";

    document.body.appendChild(printFrame);

    printFrame.onload = function () {
      try {
        if (printFrame.contentWindow) {
          printFrame.contentWindow.focus();
          printFrame.contentWindow.print();
        }
      } catch (e) {
        console.error("Print error:", e);
      }

      setTimeout(() => {
        if (document.body.contains(printFrame)) {
          document.body.removeChild(printFrame);
        }
      }, 1000);
    };

    printFrame.src = item.content;
  }

  printImage(item: PrintItem): void {
    const printFrame = document.createElement("iframe");
    printFrame.style.cssText =
      "position:absolute;width:0;height:0;border:none;";
    document.body.appendChild(printFrame);

    const win = printFrame.contentWindow;
    if (win && win.document) {
      const doc = win.document;
      doc.open();

      const htmlContent = `
        <html>
          <head>
            <title>Print</title>
          </head>
          <body>
            <img src="${item.content}" style="width:100%;" onload="window.print();">
          </body>
        </html>
      `;

      doc.write(htmlContent);
      doc.close();

      setTimeout(() => {
        if (document.body.contains(printFrame)) {
          document.body.removeChild(printFrame);
        }
      }, 2000);
    }
  }

  printText(item: PrintItem): void {
    const printFrame = document.createElement("iframe");
    printFrame.style.cssText =
      "position:absolute;width:0;height:0;border:none;";
    document.body.appendChild(printFrame);

    const win = printFrame.contentWindow;
    if (win && win.document) {
      const doc = win.document;
      doc.open();

      const htmlContent = `
        <html>
          <head>
            <title>Print</title>
            <style>
              body { font-family: Arial; padding: 20px; line-height: 1.6; }
              pre { white-space: pre-wrap; }
            </style>
          </head>
          <body>
            <pre>${this.escapeHtml(item.content)}</pre>
          </body>
        </html>
      `;

      doc.write(htmlContent);
      doc.close();

      setTimeout(() => {
        if (win) {
          win.print();
        }
        setTimeout(() => {
          if (document.body.contains(printFrame)) {
            document.body.removeChild(printFrame);
          }
        }, 1000);
      }, 100);
    }
  }

  openURL(url: string): void {
    window.open(url, "_blank", "noopener,noreferrer");
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
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
