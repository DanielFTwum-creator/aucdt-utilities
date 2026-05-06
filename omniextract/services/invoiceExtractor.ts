import { GoogleGenAI, Type } from "@google/genai";
import { getTextFromPdf, renderPdfPagesAsImages } from './pdfUtils';

// This function assumes `process.env.API_KEY` is set in the execution environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const invoiceSchema = {
    type: Type.OBJECT,
    properties: {
        isInvoice: { 
            type: Type.BOOLEAN, 
            description: "Is the document an invoice or receipt? Responds false if it's not." 
        },
        vendorName: { 
            type: Type.STRING, 
            description: "The name of the business issuing the invoice (e.g., the chemist shop name)." 
        },
        customerName: { 
            type: Type.STRING, 
            description: "The name of the customer. Should be 'N/A' if not present." 
        },
        invoiceId: { 
            type: Type.STRING, 
            description: "The invoice number or ID." 
        },
        issueDate: { 
            type: Type.STRING, 
            description: "The date the invoice was issued." 
        },
        lineItems: {
            type: Type.ARRAY,
            description: "A list of all purchased items or services.",
            items: {
                type: Type.OBJECT,
                properties: {
                    quantity: { type: Type.NUMBER, description: "The quantity of the item." },
                    description: { type: Type.STRING, description: "The description of the item." },
                    unitPrice: { type: Type.NUMBER, description: "The price per unit (Rate)." },
                    total: { type: Type.NUMBER, description: "The total price for the line item (Quantity * Rate)." }
                },
                required: ["quantity", "description", "unitPrice", "total"]
            }
        },
        subtotal: { 
            type: Type.NUMBER, 
            description: "The total amount before discounts or taxes." 
        },
        discount: { 
            type: Type.NUMBER, 
            description: "The total discount amount applied. Should be 0 if not present." 
        },
        grandTotal: { 
            type: Type.NUMBER, 
            description: "The final amount to be paid (e.g., Total To Pay)." 
        },
    },
    required: ["isInvoice", "vendorName", "invoiceId", "issueDate", "lineItems", "subtotal", "grandTotal"]
};

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

    const systemPrompt = `You are an expert invoice and receipt data extractor. Your task is to accurately pull out the key information according to the provided JSON schema. Pay close attention to line items, totals, and invoice details. If the document does not seem to be an invoice or a receipt, set 'isInvoice' to false and leave other fields blank.`;

    if (text) {
        onProgress('Analyzing text with AI...');
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `${systemPrompt} Text from PDF: ${text}`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: invoiceSchema,
                },
            });
            const parsedJson = JSON.parse(response.text.trim());
            if (parsedJson.isInvoice) {
                invoices.push(parsedJson);
            }
        } catch (error) {
            console.error("Gemini API error (text-based):", error);
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
                const response = await ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: [ { text: `${systemPrompt} Extract data for the single invoice in the provided image.` }, part ],
                    config: {
                        responseMimeType: "application/json",
                        responseSchema: invoiceSchema,
                    },
                });

                if (response) {
                    const parsedJson = JSON.parse(response.text.trim());
                    if (parsedJson.isInvoice) {
                        invoices.push(parsedJson);
                    }
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