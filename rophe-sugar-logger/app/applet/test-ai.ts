import { GoogleGenAI, Type } from "@google/genai";
async function test() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
  try {
    const filePart = { inlineData: { data: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', mimeType: 'image/jpeg' } };
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        'Extract data',
        filePart
      ] as any,
    });
    console.log("Success", response.text);
  } catch (err) {
    console.error("Error:", err);
  }
}
test();
