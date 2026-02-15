import { PrintItem } from "@/app/types";

class PrintService {
  printPDF(item: PrintItem): void {
    // Download the PDF blob first, then print it
    fetch(item.content)
      .then((response) => response.blob())
      .then((blob) => {
        const blobUrl = URL.createObjectURL(blob);

        // Create iframe for printing
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        iframe.src = blobUrl;

        document.body.appendChild(iframe);

        iframe.onload = () => {
          setTimeout(() => {
            try {
              iframe.contentWindow?.focus();
              iframe.contentWindow?.print();

              // Cleanup
              setTimeout(() => {
                document.body.removeChild(iframe);
                URL.revokeObjectURL(blobUrl);
              }, 100);
            } catch (error) {
              console.error("Print error:", error);
              document.body.removeChild(iframe);
              URL.revokeObjectURL(blobUrl);
              alert(
                "Unable to print. Please try downloading the file instead.",
              );
            }
          }, 500);
        };
      })
      .catch((error) => {
        console.error("Error loading PDF:", error);
        alert(
          "Unable to load PDF for printing. Please try downloading instead.",
        );
      });
  }

  printImage(item: PrintItem): void {
    // Create a temporary div for printing
    const printDiv = document.createElement("div");
    printDiv.innerHTML = `
      <img src="${item.content}" style="max-width: 100%; height: auto;" />
    `;

    // Hide it from view
    printDiv.style.position = "fixed";
    printDiv.style.left = "-9999px";
    document.body.appendChild(printDiv);

    // Create print-specific styles
    const style = document.createElement("style");
    style.textContent = `
      @media print {
        body * { display: none !important; }
        #print-content, #print-content * { display: block !important; }
        #print-content { 
          position: absolute; 
          left: 0; 
          top: 0;
          width: 100%;
        }
        #print-content img {
          max-width: 100%;
          height: auto;
          page-break-inside: avoid;
        }
      }
    `;
    document.head.appendChild(style);
    printDiv.id = "print-content";

    // Wait for image to load
    const img = printDiv.querySelector("img");
    if (img) {
      img.onload = () => {
        window.print();

        // Cleanup
        setTimeout(() => {
          document.body.removeChild(printDiv);
          document.head.removeChild(style);
        }, 100);
      };

      // If already loaded
      if (img.complete) {
        window.print();
        setTimeout(() => {
          document.body.removeChild(printDiv);
          document.head.removeChild(style);
        }, 100);
      }
    }
  }

  printText(item: PrintItem): void {
    // Create a temporary div for printing
    const printDiv = document.createElement("div");
    printDiv.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
        <pre style="white-space: pre-wrap; word-wrap: break-word; font-family: inherit;">${this.escapeHtml(item.content)}</pre>
      </div>
    `;

    // Hide it from view
    printDiv.style.position = "fixed";
    printDiv.style.left = "-9999px";
    document.body.appendChild(printDiv);

    // Create print-specific styles
    const style = document.createElement("style");
    style.textContent = `
      @media print {
        body * { display: none !important; }
        #print-content, #print-content * { display: block !important; }
        #print-content { 
          position: absolute; 
          left: 0; 
          top: 0;
          width: 100%;
        }
      }
    `;
    document.head.appendChild(style);
    printDiv.id = "print-content";

    // Print
    setTimeout(() => {
      window.print();

      // Cleanup
      setTimeout(() => {
        document.body.removeChild(printDiv);
        document.head.removeChild(style);
      }, 100);
    }, 100);
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
