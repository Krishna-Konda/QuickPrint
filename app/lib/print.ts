// FILE: app/lib/print.ts
// ABSOLUTE FINAL WORKING VERSION
// Copy this to: app/lib/print.ts

import { PrintItem } from "@/app/types";

class PrintService {
  printPDF(item: PrintItem): void {
    // Create hidden iframe
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0px";
    iframe.style.height = "0px";
    iframe.style.border = "none";
    iframe.style.visibility = "hidden";

    document.body.appendChild(iframe);

    // Set PDF source
    iframe.src = item.content;

    // Wait for load and print
    iframe.onload = function () {
      setTimeout(function () {
        try {
          if (iframe.contentWindow) {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
          }

          // Remove after print dialog is shown
          setTimeout(function () {
            if (iframe.parentNode) {
              document.body.removeChild(iframe);
            }
          }, 1000);
        } catch (e) {
          console.error("Print failed:", e);
          if (iframe.parentNode) {
            document.body.removeChild(iframe);
          }
          // Fallback: open in new window
          window.open(item.content, "_blank");
        }
      }, 1000);
    };

    iframe.onerror = function () {
      if (iframe.parentNode) {
        document.body.removeChild(iframe);
      }
      window.open(item.content, "_blank");
    };
  }

  printImage(item: PrintItem): void {
    const img = new Image();
    img.src = item.content;

    img.onload = function () {
      const printWindow = window.open("", "", "height=600,width=800");

      if (printWindow) {
        printWindow.document.write("<html><head><title>Print</title>");
        printWindow.document.write("<style>");
        printWindow.document.write(
          "body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }",
        );
        printWindow.document.write("img { max-width: 100%; height: auto; }");
        printWindow.document.write(
          "@media print { body { margin: 0; } img { max-width: 100%; page-break-inside: avoid; } }",
        );
        printWindow.document.write("</style>");
        printWindow.document.write("</head><body>");
        printWindow.document.write('<img src="' + item.content + '" />');
        printWindow.document.write("</body></html>");
        printWindow.document.close();

        setTimeout(function () {
          printWindow.focus();
          printWindow.print();
        }, 500);
      }
    };
  }

  printText(item: PrintItem): void {
    const printWindow = window.open("", "", "height=600,width=800");

    if (printWindow) {
      printWindow.document.write("<html><head><title>Print</title>");
      printWindow.document.write("<style>");
      printWindow.document.write(
        "body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; }",
      );
      printWindow.document.write(
        "pre { white-space: pre-wrap; word-wrap: break-word; font-family: inherit; }",
      );
      printWindow.document.write("</style>");
      printWindow.document.write("</head><body>");
      printWindow.document.write(
        "<pre>" + this.escapeHtml(item.content) + "</pre>",
      );
      printWindow.document.write("</body></html>");
      printWindow.document.close();

      setTimeout(function () {
        printWindow.focus();
        printWindow.print();
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
