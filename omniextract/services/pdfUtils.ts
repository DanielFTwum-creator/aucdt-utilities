import * as pdfjsLib from 'pdfjs-dist';

// Point the worker to the CDN copy so we don't need to copy the worker file into dist.
pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

/**
 * Extracts raw text content from a given PDF file.
 * @param file The PDF file to process.
 * @param onProgress An optional callback function to report progress updates.
 * @returns A promise that resolves to the full text content of the PDF.
 */
export const getTextFromPdf = async (
    file: File,
    onProgress?: (message: string) => void
): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let allText = '';
    const numPages = pdf.numPages;

    for (let i = 1; i <= numPages; i++) {
        onProgress?.(`Reading text from page ${i} of ${numPages}...`);
        try {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => item.str).join(' ');
            allText += pageText + ' ';
        } catch (error) {
            console.error(`Failed to get text from page ${i}.`, error);
        }
    }

    return allText.trim();
};

/**
 * Renders each page of a PDF file into a base64-encoded image.
 * This is used for OCR when text extraction fails.
 * @param file The PDF file to process.
 * @param onProgress An optional callback function to report progress updates.
 * @returns A promise that resolves to an array of image parts for the Gemini API.
 */
export const renderPdfPagesAsImages = async (
    file: File,
    onProgress?: (message: string) => void
): Promise<{ inlineData: { mimeType: string; data: string; } }[]> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const numPages = pdf.numPages;
    const imageParts: { inlineData: { mimeType: string; data: string; } }[] = [];

    const scale = 1.5;

    for (let i = 1; i <= numPages; i++) {
        onProgress?.(`Rendering page ${i} of ${numPages}...`);
        try {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            if (!context) {
                console.error(`Could not get 2d context for page ${i}`);
                continue;
            }

            await page.render({ canvasContext: context, viewport }).promise;

            const base64Data = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
            if (base64Data) {
                imageParts.push({ inlineData: { mimeType: 'image/jpeg', data: base64Data } });
            }
        } catch (error) {
            console.error(`Failed to render page ${i} of the PDF.`, error);
        }
    }

    return imageParts;
};