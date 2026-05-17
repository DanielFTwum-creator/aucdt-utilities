import html2canvas from 'html2canvas';

export interface CaptureOptions {
  element?: HTMLElement;
  quality?: number;
  scale?: number;
}

export async function captureScreenshot(options: CaptureOptions = {}): Promise<string> {
  try {
    const {
      element = document.body,
      quality = 0.95,
      scale = 2,
    } = options;

    // Clone the element to avoid modifying the original
    const clone = element.cloneNode(true) as HTMLElement;

    // Create a temporary container to hold the clone
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    container.style.visibility = 'hidden';
    container.appendChild(clone);
    document.body.appendChild(container);

    try {
      const canvas = await html2canvas(clone, {
        scale,
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        onclone: (clonedDocument) => {
          // Remove unsupported CSS that causes parsing errors
          const style = clonedDocument.createElement('style');
          style.textContent = `
            * {
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
          `;
          clonedDocument.head.appendChild(style);
        },
      });

      return canvas.toDataURL('image/png', quality);
    } finally {
      // Clean up the temporary container
      document.body.removeChild(container);
    }
  } catch (error) {
    console.warn('Screenshot capture failed:', error);
    throw new Error('Failed to capture screenshot');
  }
}

export async function captureAndDownload(filename: string = 'screenshot.png', options: CaptureOptions = {}): Promise<void> {
  try {
    const dataUrl = await captureScreenshot(options);
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    link.click();
  } catch (error) {
    console.error('Screenshot download failed:', error);
    throw error;
  }
}

export async function captureAsBlob(options: CaptureOptions = {}): Promise<Blob> {
  return new Promise(async (resolve, reject) => {
    try {
      const dataUrl = await captureScreenshot(options);
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      resolve(blob);
    } catch (error) {
      reject(error);
    }
  });
}
