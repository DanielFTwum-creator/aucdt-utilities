
import { GoogleGenAI } from "@google/genai";
import type { Curriculum } from "../types";

// IMPORTANT: API key is loaded from environment variables.
// This is a security best practice to avoid hardcoding secrets in the source code.
const API_KEY = process.env.API_KEY;

// Warn the developer if the API key is missing during development.
if (!API_KEY) {
  console.warn("Gemini API key not found in environment variables. The AI-powered PDF processing feature will be disabled.");
}

// Initialize the GoogleGenAI client.
// The exclamation mark (!) asserts that API_KEY is non-null,
// as the function logic below will handle the case where it's missing.
const ai = new GoogleGenAI({ apiKey: API_KEY! });
const model = "gemini-2.5-flash"; // Using a fast and efficient model for this task.

/**
 * Extracts structured curriculum data from raw text extracted from a university timetable PDF.
 * @param pdfText The raw text content from the PDF.
 * @returns A promise that resolves to a structured Curriculum object.
 * @throws An error if the API key is not configured or if the API call fails.
 */
export const extractCurriculumFromPdfText = async (pdfText: string): Promise<Curriculum> => {
  // Guard clause to prevent API calls if the key is not available.
  if (!API_KEY) {
    throw new Error("Gemini API key is not configured. Cannot process PDF.");
  }

  // A detailed prompt designed to guide the AI model to return a clean, structured JSON object.
  const prompt = `
    You are an expert data extraction system for a university. Your task is to analyze the provided text from a university timetable and extract all programmes, courses, and lecturers.
    
    You MUST return the data as a single, valid JSON object that strictly adheres to the following TypeScript interfaces.
    Do NOT include any additional text, explanations, or markdown formatting (like \`\`\`json) outside of the JSON object itself. The entire response body must be the JSON object.

    **TypeScript Interfaces:**
    \`\`\`typescript
    interface Programme {
      id: string; // e.g., "b-tech-digital-media"
      name: string; // e.g., "B.Tech Digital Media and Communication Design"
    }

    interface Course {
      id: string; // e.g., "dmcd-112"
      name: string; // e.g., "DMCD 112 - Basic Design"
      programmeId: string; // The ID of the programme this course belongs to.
      lecturerIds: string[]; // An array of lecturer IDs who teach this course.
    }

    interface Lecturer {
      id: string; // e.g., "mr-daitey"
      name: string; // e.g., "Mr. Daitey"
    }

    interface Curriculum {
      programmes: Programme[];
      courses: Course[];
      lecturers: Lecturer[];
    }
    \`\`\`

    **Instructions:**
    - Generate unique, URL-safe, kebab-case IDs for all items (e.g., 'b-tech-fashion', 'fdt-114', 'ms-kushitor').
    - Create a comprehensive list of all unique lecturers mentioned.
    - Map all courses to their respective programme and the lecturers who teach them.
    - Ensure all relationships are correctly mapped.

    **Timetable Text to Process:**
    ---
    ${pdfText}
    ---
  `;

  try {
    // Make the API call to generate content.
    const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        // Requesting a JSON response type helps the model provide cleaner output.
        config: {
            responseMimeType: "application/json",
        }
    });

    // The Gemini API client has a convenient .text accessor for the response.
    const jsonText = response.text.trim();
    
    // Parse the JSON text into a JavaScript object.
    const parsedData = JSON.parse(jsonText);
    
    // Perform a basic validation to ensure the top-level keys exist.
    if (!parsedData.programmes || !parsedData.courses || !parsedData.lecturers) {
        throw new Error("The AI model returned JSON, but it is missing the required 'programmes', 'courses', or 'lecturers' fields.");
    }

    // Return the validated data, cast to the expected type.
    return parsedData as Curriculum;
  } catch (error) {
    console.error("Error during Gemini API call or JSON parsing:", error);
    // Provide a more user-friendly error message for the UI.
    throw new Error("Failed to extract curriculum data. The AI model could not process the text or returned an invalid response.");
  }
};
