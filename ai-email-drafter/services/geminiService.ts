
import { GoogleGenAI } from "@google/genai";
import { EmailData } from "../types";

// Assume process.env.API_KEY is available in the environment.
const apiKey = process.env.API_KEY;
if (!apiKey) {
    // In a real app, you'd want a more robust way to handle this,
    // but for this context, throwing an error is sufficient.
    console.error("API_KEY environment variable not set. Please set it in your environment.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export const draftEmailWithGemini = async (emailData: EmailData): Promise<string> => {
  if (!apiKey) {
      return "Error: Gemini API key is not configured. Please ensure the API_KEY environment variable is set.";
  }
  const model = 'gemini-2.5-flash';

  const recipients = [
    emailData.to.length > 0 ? `To: ${emailData.to.join(', ')}` : '',
    emailData.cc.length > 0 ? `CC: ${emailData.cc.join(', ')}` : '',
    emailData.bcc.length > 0 ? `BCC: ${emailData.bcc.join(', ')} (Private)` : '',
  ].filter(Boolean).join('\n');

  const prompt = `
    You are a professional email writing assistant. 
    Based on the following information, write a clear, concise, and professional email.
    If the original body seems like a list of notes or bullet points, flesh it out into a proper email format.
    If images are attached, describe them contextually in the email body where it makes sense.

    --- EMAIL DETAILS ---
    ${recipients}
    Subject: ${emailData.subject}
    
    --- BODY / NOTES ---
    ${emailData.body}
    ---
  `;

  const textPart = { text: prompt };
  
  const imageParts = emailData.attachments.map(attachment => ({
    inlineData: {
      data: attachment.base64,
      mimeType: attachment.type,
    },
  }));

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: [textPart, ...imageParts] },
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        return `Error: An issue occurred while generating the draft. Please check the console for details. Details: ${error.message}`;
    }
    return "Error: An unknown error occurred while generating the draft.";
  }
};
