import { GoogleGenAI, Type } from "@google/genai";
import { ProgramData } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING },
      title: { type: Type.STRING },
      description: { type: Type.STRING },
      icon: { type: Type.STRING },
      assessments: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            year: { type: Type.INTEGER },
            semester: { type: Type.INTEGER },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  questionText: { type: Type.STRING },
                  answers: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        text: { type: Type.STRING },
                        isCorrect: { type: Type.BOOLEAN },
                      },
                      required: ["text", "isCorrect"],
                    },
                  },
                },
                required: ["id", "questionText", "answers"],
              },
            },
          },
          required: ["id", "title", "year", "semester", "questions"],
        },
      },
    },
    required: ["id", "title", "description", "icon", "assessments"],
  },
};

export const convertPdfToJson = async (pdfBase64: string): Promise<ProgramData[]> => {
  try {
    const pdfPart = {
      inlineData: {
        mimeType: 'application/pdf',
        data: pdfBase64,
      },
    };

    const textPart = {
      text: `Analyse the entire multi-page PDF document from start to finish, ensuring you process every page. The document contains university program and assessment data. Extract all the information and format it precisely according to the provided JSON schema. Ensure all fields are populated correctly based on the complete document content. The 'icon' field should be a camelCase string derived from the program title, ending with 'Icon', for example, 'B.A. Jewellery Design' becomes 'JewelleryIcon'. Do not skip any programmes or assessments mentioned in the document.`,
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [pdfPart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    const jsonText = response.text.trim();
    const jsonData = JSON.parse(jsonText);
    return jsonData as ProgramData[];
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("The AI model failed to process the PDF. It might be an unsupported format or contain unreadable text.");
  }
};
