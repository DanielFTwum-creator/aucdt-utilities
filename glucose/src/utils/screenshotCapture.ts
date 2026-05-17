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

    const canvas = await html2canvas(element, {
      scale,
      logging: false,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
    });

    return canvas.toDataURL('image/png', quality);
  } catch (error) {
    console.error('Screenshot capture failed:', error);
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
