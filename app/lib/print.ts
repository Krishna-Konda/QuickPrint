import { PrintItem } from "@/app/types";

class PrintService {
  printPDF(item: PrintItem): void {
    // Simply open the PDF in a new tab - let browser handle it
    window.open(item.content, "_blank");
  }

  printImage(item: PrintItem): void {
    // For images, create a data URL and open it
    // This allows browser to display and print the image properly
    const printWindow = window.open("about:blank", "_blank");

    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print Image</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { 
                margin: 0; 
                display: flex; 
                justify-content: center; 
                align-items: center; 
                min-height: 100vh;
                background: #f5f5f5;
              }
              img { 
                max-width: 100%; 
                max-height: 100vh;
                height: auto;
                display: block;
              }
              @media print {
                body { 
                  margin: 0; 
                  background: white;
                }
                img { 
                  max-width: 100%;
                  page-break-inside: avoid;
                }
              }
            </style>
          </head>
          <body>
            <img src="${item.content}" alt="${item.fileName || "Image"}" />
            <script>
              window.onload = function() {
                // Wait a bit for image to load, then trigger print
                setTimeout(function() {
                  window.print();
                }, 500);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  }

  printText(item: PrintItem): void {
    // For text, create a formatted print page
    const printWindow = window.open("about:blank", "_blank");

    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print Text</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { 
                font-family: Arial, sans-serif; 
                padding: 40px; 
                line-height: 1.6;
                max-width: 800px;
                margin: 0 auto;
                background: white;
                color: black;
              }
              pre { 
                white-space: pre-wrap; 
                word-wrap: break-word;
                font-family: inherit;
                font-size: 14px;
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
                setTimeout(function() {
                  window.print();
                }, 300);
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
