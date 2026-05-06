import { getTextFromPdf } from './pdfUtils';

/**
 * Extracts unique email addresses from a given PDF file.
 * @param file The PDF file to process.
 * @param onProgress A callback function to report progress updates.
 * @returns A promise that resolves to an array of unique, sorted email addresses.
 */
export const extractEmailsFromPdf = async (
    file: File,
    onProgress: (message: string) => void
): Promise<string[]> => {
    onProgress("Extracting text from PDF...");
    const allText = await getTextFromPdf(file, onProgress);
    
    onProgress("Finding unique emails...");
    // Improved regex to better handle various email formats
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emails = allText.match(emailRegex) || [];
    
    // Create a Set of lowercased emails to ensure uniqueness, then convert back to an array and sort.
    const uniqueEmails = [...new Set(emails.map(email => email.toLowerCase()))].sort();
    
    return uniqueEmails;
};