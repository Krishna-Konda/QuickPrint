import { PrintItem } from "@/app/types";

class PrintService {
  printPDF(item: PrintItem): void {
    // Simply open the PDF in a new tab
    // User can then use Ctrl+P or browser's print button
    const newWindow = window.open(item.content, "_blank");

    if (newWindow) {
      // Optional: Try to trigger print dialog after PDF loads
      newWindow.onload = () => {
        setTimeout(() => {
          try {
            newWindow.print();
          } catch (e) {
            // Silent fail - user can still manually print
            console.log("Auto-print not available, user can use Ctrl+P");
          }
        }, 1000);
      };
    }
  }

  printImage(item: PrintItem): void {
    // Create a simple print window for images
    const printWindow = window.open("", "_blank");

    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print Image</title>
            <style>
              body { 
                margin: 0; 
                display: flex; 
                justify-content: center; 
                align-items: center; 
                min-height: 100vh;
              }
              img { 
                max-width: 100%; 
                height: auto; 
              }
              @media print {
                body { margin: 0; }
                img { 
                  max-width: 100%;
                  page-break-inside: avoid;
                }
              }
            </style>
          </head>
          <body>
            <img src="${item.content}" onload="setTimeout(() => window.print(), 500);" />
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  }

  printText(item: PrintItem): void {
    // Create a simple print window for text
    const printWindow = window.open("", "_blank");

    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print Text</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                padding: 40px; 
                line-height: 1.6;
                max-width: 800px;
                margin: 0 auto;
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
                setTimeout(() => window.print(), 500);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
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
