import { PrintItem } from "@/app/types";

class PrintService {
  printPDF(item: PrintItem): void {
    // Create a hidden iframe for printing
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";
    iframe.src = item.content;

    document.body.appendChild(iframe);

    // Wait for PDF to load, then print
    iframe.onload = () => {
      setTimeout(() => {
        try {
          // Trigger print dialog
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();

          // Remove iframe after a delay
          setTimeout(() => {
            document.body.removeChild(iframe);
          }, 1000);
        } catch (error) {
          console.error("Print failed:", error);
          document.body.removeChild(iframe);

          // Fallback: open in new tab
          window.open(item.content, "_blank");
        }
      }, 500);
    };

    // Error handling
    iframe.onerror = () => {
      console.error("Failed to load PDF");
      document.body.removeChild(iframe);
      window.open(item.content, "_blank");
    };
  }

  printImage(item: PrintItem): void {
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print</title>
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
              img { 
                page-break-inside: avoid;
                max-width: 100%;
                height: auto;
              }
            }
          </style>
        </head>
        <body>
          <img src="${item.content}" onload="window.print();" />
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
            @media print {
              body { padding: 20px; }
            }
          </style>
        </head>
        <body>
          <pre>${this.escapeHtml(item.content)}</pre>
          <script>
            window.onload = function() {
              window.print();
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
