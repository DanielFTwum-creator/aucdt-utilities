
import { GoogleGenAI, Type } from "@google/genai";

if (!process.env.API_KEY) {
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const extractSchema = {
    type: Type.OBJECT,
    properties: {
        lecturers: {
            type: Type.ARRAY,
            description: "A list of lecturer names found in the document.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: {
                        type: Type.STRING,
                        description: "The full name of the lecturer."
                    }
                }
            }
        },
        courses: {
            type: Type.ARRAY,
            description: "A list of courses or subjects mentioned in the document.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: {
                        type: Type.STRING,
                        description: "The full name of the course or subject."
                    },
                    year: {
                        type: Type.INTEGER,
                        description: "The academic year the course is taught in (e.g., 1, 2, 3)."
                    },
                    semester: {
                        type: Type.INTEGER,
                        description: "The semester the course is taught in (e.g., 1 or 2)."
                    }
                }
            }
        }
    }
};

export const extractDataFromPdfText = async (text: string, programmeName: string): Promise<{
  lecturers: { name: string }[];
  courses: { name: string; year: number; semester: number }[];
}> => {
  try {
    const prompt = `
      From the following text, which is extracted from a university programme document, please identify all lecturers and all courses associated with the "${programmeName}" programme.
      
      Rules:
      1. Extract the full names of all lecturers.
      2. Extract the full names of all courses/subjects.
      3. For each course, identify the academic year and semester it belongs to. If not specified, make a reasonable guess.
      4. Return the data in the specified JSON format.
      
      Document Text:
      ---
      ${text}
      ---
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: extractSchema,
      },
    });

    const jsonString = response.text.trim();
    if (!jsonString) {
      throw new Error("API returned an empty response.");
    }

    const parsedData = JSON.parse(jsonString);

    if (!parsedData.lecturers || !parsedData.courses) {
        throw new Error("The extracted data is missing required fields (lecturers or courses).");
    }

    return parsedData;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to extract data using AI. Please check the console for details.");
  }
};