import { GoogleGenAI, Type } from "@google/genai";
import * as fs from "fs";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function test() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY not set");
    process.exit(1);
  }

  const ai = new GoogleGenAI({ apiKey });
  try {
    const imageBuffer = fs.readFileSync("rophe-glucose-sheet.jpg");
    const base64Image = imageBuffer.toString("base64");
    const filePart = { 
      inlineData: { 
        data: base64Image, 
        mimeType: 'image/jpeg' 
      } 
    };
    
    console.log("Testing with gemini-3.1-pro-preview...");
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: {
        parts: [
          { text: `Role: You are a highly accurate clinical data entry assistant.
Request: Extract all handwritten blood glucose reading logs from the attached photo.
Result: A valid JSON array of objects.
Requirements:
- Each object must map to a row containing these keys: date, fasting, post_breakfast, pre_lunch, post_lunch, pre_dinner, post_dinner.
- Format the date appropriately to MM/DD/YYYY if possible.
- The values are blood glucose measurements in mmol/L. Keep decimals exactly as written.
Rules:
- Leave fields empty (as an empty string "") if there is no reading recorded in that cell.
- Ignore blank rows completely. Only return rows with at least one reading.
Restrictions:
- ONLY output the JSON array. Make sure the output precisely matches the JSON response schema.` },
          filePart
        ]
      },
      config: {
        temperature: 0,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              date: { type: Type.STRING },
              fasting: { type: Type.STRING },
              post_breakfast: { type: Type.STRING },
              pre_lunch: { type: Type.STRING },
              post_lunch: { type: Type.STRING },
              pre_dinner: { type: Type.STRING },
              post_dinner: { type: Type.STRING },
            },
            required: ["date"],
          }
        }
      }
    });

    console.log("Response:", response.text);
  } catch (err) {
    console.error("Error:", err);
  }
}

test();
