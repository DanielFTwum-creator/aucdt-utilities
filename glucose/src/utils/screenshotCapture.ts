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
      quality = 0.9,
      scale = 1.2,
    } = options;

    // Use html2canvas with minimal configuration to avoid CSS parsing issues
    const canvas = await html2canvas(element, {
      scale,
      logging: false,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      foreignObjectRendering: true,
    });

    return canvas.toDataURL('image/png', quality);
  } catch (error) {
    // Suppress error logging for html2canvas CSS parsing issues
    // The app will still function, just without screenshots
    throw new Error('Screenshot unavailable');
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
    console.error('Screenshot download failed');
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
