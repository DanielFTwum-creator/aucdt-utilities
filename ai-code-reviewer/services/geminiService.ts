
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const createPrompt = (code: string, language: string) => {
  return `
You are an expert software engineer and world-class code reviewer. Your task is to analyze the provided code snippet and give constructive, detailed feedback.

### Instructions:
1.  **Bugs & Errors:** Identify potential bugs, logical errors, or unhandled edge cases.
2.  **Performance:** Suggest improvements for performance and efficiency.
3.  **Readability & Maintainability:** Comment on code style, clarity, and structure. Suggest ways to make the code more readable and easier to maintain.
4.  **Best Practices:** Check for adherence to common best practices and language-specific conventions for ${language}.
5.  **Security:** Point out any potential security vulnerabilities (e.g., injection flaws, insecure handling of data).
6.  **Formatting:** Structure your feedback clearly using Markdown.
    - Use headings (e.g., \`### Bugs\`, \`### Performance\`) for different categories.
    - Use bullet points (\`*\`) for individual suggestions.
    - Use backticks for inline code: \`likeThis()\`.
    - Use triple backticks for multi-line code blocks.

Your tone should be helpful, professional, and educational.

### Language:
${language}

### Code to Review:
\`\`\`${language.toLowerCase()}
${code}
\`\`\`
`;
};

export const getCodeReview = async (code: string, language: string): Promise<string> => {
  const prompt = createPrompt(code, language);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.3,
        topP: 0.9,
      },
    });

    if (response.text) {
      return response.text;
    } else {
      throw new Error("Received an empty response from the AI. The content may have been blocked.");
    }

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while communicating with the Gemini API.");
  }
};
