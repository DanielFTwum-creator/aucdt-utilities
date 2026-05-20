import { EmailData } from "../types";

// Gemini calls are proxied through the backend at /api/gemini/draft so the API key never reaches the browser.

export const draftEmailWithGemini = async (emailData: EmailData): Promise<string> => {
  try {
    const response = await fetch('/email-drafter/api/gemini/draft', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: emailData.to,
        cc: emailData.cc,
        bcc: emailData.bcc,
        subject: emailData.subject,
        body: emailData.body,
        attachments: emailData.attachments.map(a => ({ base64: a.base64, type: a.type })),
      }),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return `Error: ${err.error || 'Failed to generate draft'}${err.details ? ` (${err.details})` : ''}`;
    }
    const data = await response.json();
    return data.text || '';
  } catch (error) {
    console.error('Error calling Gemini proxy:', error);
    return error instanceof Error
      ? `Error: An issue occurred while generating the draft. Details: ${error.message}`
      : 'Error: An unknown error occurred while generating the draft.';
  }
};
