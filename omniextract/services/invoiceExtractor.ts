import { getTextFromPdf, renderPdfPagesAsImages } from './pdfUtils';

// Gemini extraction runs on the backend (so the API key is never in the
// browser bundle). This calls the server proxy; PDF parsing stays client-side.
const EXTRACT_ENDPOINT = `${import.meta.env.BASE_URL}api/extract`;

async function extractViaProxy(
    payload: { text: string } | { imagePart: { inlineData: { mimeType: string; data: string } } }
): Promise<any> {
    const res = await fetch(EXTRACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Extraction request failed (${res.status})`);
    }
    const { result } = await res.json();
    return result;
}

/**
 * Converts an array of invoice JSON objects into a single, well-structured CSV string.
 * @param invoices An array of invoice data objects.
 * @returns A string in CSV format.
 */
const invoicesJsonToCsv = (invoices: any[]): string => {
    if (!invoices || invoices.length === 0) {
        return '';
    }

    let csv = '';

    // Section 1: Invoice Summaries
    csv += 'Invoice Summaries\n';
    const summaryHeaders = ['invoiceId', 'issueDate', 'vendorName', 'customerName', 'subtotal', 'discount', 'grandTotal'];
    // Format headers to Title Case for readability
    const formatHeader = (h: string) => `"${h.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}"`;
    csv += summaryHeaders.map(formatHeader).join(',') + '\n';

    invoices.forEach(invoice => {
        csv += summaryHeaders.map(header => {
            const value = invoice[header];
            return `"${value !== null && value !== undefined ? value : ''}"`;
        }).join(',') + '\n';
    });

    csv += '\n\n'; // Add space between sections

    // Section 2: All Line Items, with invoiceId to link back to the summary
    csv += 'All Line Items\n';
    const lineItemHeaders = ['invoiceId', 'quantity', 'description', 'unitPrice', 'total'];
    csv += lineItemHeaders.map(formatHeader).join(',') + '\n';
    
    invoices.forEach(invoice => {
        if (invoice.lineItems && invoice.lineItems.length > 0) {
            invoice.lineItems.forEach((item: any) => {
                const row = [
                    invoice.invoiceId,
                    item.quantity,
                    item.description,
                    item.unitPrice,
                    item.total
                ];
                csv += row.map(value => `"${value !== null && value !== undefined ? String(value).replace(/"/g, '""') : ''}"`).join(',') + '\n';
            });
        }
    });

    return csv;
};


/**
 * Extracts invoice data from a PDF file, automatically handling both text-based and image-based (scanned) documents.
 * @param file The PDF file to process.
 * @param onProgress A callback function to report progress updates.
 * @returns A promise that resolves to a CSV string of the extracted invoice data.
 */
export const extractInvoiceDataAsCsv = async (
    file: File,
    onProgress: (message: string) => void
): Promise<string> => {
    onProgress('Extracting text from PDF...');
    const text = await getTextFromPdf(file, onProgress);
    const invoices: any[] = [];

    if (text) {
        onProgress('Analyzing text with AI...');
        try {
            const parsedJson = await extractViaProxy({ text });
            if (parsedJson.isInvoice) {
                invoices.push(parsedJson);
            }
        } catch (error) {
            console.error("AI error (text-based):", error);
            throw new Error("Failed to analyze invoice data with AI from the PDF text. The content may be unsupported.");
        }
    } else {
        onProgress('No text found, switching to image analysis...');
        const imageParts = await renderPdfPagesAsImages(file, onProgress);
        if (imageParts.length === 0) {
            throw new Error("Could not extract text or render any images from the PDF. The file may be empty or corrupted.");
        }

        // Process each page sequentially to avoid rate limiting.
        for (let i = 0; i < imageParts.length; i++) {
            const part = imageParts[i];
            const pageNum = i + 1;
            onProgress(`Processing page ${pageNum} of ${imageParts.length} with AI...`);
            
            try {
                const parsedJson = await extractViaProxy({ imagePart: part });
                if (parsedJson && parsedJson.isInvoice) {
                    invoices.push(parsedJson);
                }
            } catch (error) {
                // Log the error for the specific page but continue processing others.
                console.error(`Failed to process page ${pageNum}:`, error);
                onProgress(`Error on page ${pageNum}. Continuing...`);
            }
            
            // Add a small delay between requests to be safe with rate limits, especially for free tiers.
            if (i < imageParts.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 1000)); // 1-second delay
            }
        }
    }

    if (invoices.length === 0) {
        throw new Error("The provided document does not appear to contain any valid invoices or receipts that could be processed.");
    }

    onProgress('Finalizing CSV data...');
    return invoicesJsonToCsv(invoices);
};