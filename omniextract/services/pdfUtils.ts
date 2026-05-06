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
    if (typeof window.pdfjsLib === 'undefined') {
        // This check is important because the library is loaded from a CDN.
        throw new Error("PDF.js library is not loaded or ready. Please try again in a moment.");
    }
    
    const arrayBuffer = await file.arrayBuffer();
    // Use the pdfjsLib from the window scope
    const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let allText = '';
    const numPages = pdf.numPages;

    for (let i = 1; i <= numPages; i++) {
        onProgress?.(`Reading text from page ${i} of ${numPages}...`);
        try {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            // The `item.str` can have spaces, so we join with a space to be safe
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
    if (typeof window.pdfjsLib === 'undefined') {
        throw new Error("PDF.js library is not loaded or ready.");
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const numPages = pdf.numPages;
    const imageParts: { inlineData: { mimeType: string; data: string; } }[] = [];
    
    // Use a reasonable scale for better OCR quality. 1.5 is a good balance.
    const scale = 1.5; 

    // Process pages sequentially to avoid overwhelming the browser with canvas renderings
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
            
            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };
            await page.render(renderContext).promise;
            
            // Convert canvas to a base64 string. Use JPEG for efficiency.
            // The Gemini API expects the raw base64 data, without the data URL prefix.
            const base64Data = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];

            if (base64Data) {
                imageParts.push({
                    inlineData: {
                        mimeType: 'image/jpeg',
                        data: base64Data
                    }
                });
            }
        } catch (error) {
            console.error(`Failed to render page ${i} of the PDF.`, error);
            // Continue to the next page even if one fails
        }
    }

    return imageParts;
};