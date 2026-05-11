
import { GoogleGenAI, Type } from "@google/genai";
import { SearchType, Restaurant, Pantry } from '../types';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  // This is a fallback for development, but the app expects the key to be set in the environment.
  console.warn("API_KEY environment variable not set.");
}
const ai = new GoogleGenAI({ apiKey: API_KEY! });

const commonLocationSchema = {
    name: { type: Type.STRING, description: "The full name of the establishment." },
    address: { type: Type.STRING, description: "The full street address, including city and zip code." },
    phone: { type: Type.STRING, description: "The primary phone number." },
    hours: { type: Type.STRING, description: "The operating hours, e.g., 'Mon-Fri 9am-5pm'." },
    id: { type: Type.STRING, description: "A unique ID for this item, can be a short hash of the name."}
};

const restaurantSchema = {
    type: Type.OBJECT,
    properties: {
        ...commonLocationSchema,
        isPartner: { type: Type.BOOLEAN, description: "Indicates if they are a 'Partner for Donations'." },
    },
};

const pantrySchema = {
    type: Type.OBJECT,
    properties: {
        ...commonLocationSchema,
        needs: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of items the pantry currently needs. If specific needs aren't listed, provide general categories like 'Non-perishable food' or 'Fresh produce'." },
        dropOffTimes: { type: Type.STRING, description: "Specific times when donations are accepted. If not available, use a placeholder like 'Please call to arrange a drop-off' or 'Check website for hours'." },
    },
};

export const fetchLocations = async (
  query: string,
  type: SearchType
): Promise<Restaurant[] | Pantry[]> => {
  const isRestaurant = type === SearchType.Restaurants;
  const entityName = isRestaurant ? "restaurants" : "food pantries, food banks, or other food donation centers";
  const schema = isRestaurant ? restaurantSchema : pantrySchema;

  const prompt = `Find up to 10 ${entityName} in or near ${query} worldwide. Provide a diverse list representing different regions when possible. For each, give me the name, full address including country, phone number with country code, and operating hours in local time. Also include the specific fields as described in the JSON schema. It is very important to return a list, even if some specific details for a location are not available; in that case, use sensible placeholders like 'Varies' or 'Call for details'.`;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            locations: {
              type: Type.ARRAY,
              items: schema,
            }
          }
        },
      },
    });
    
    const jsonText = response.text.trim();
    if (!jsonText) {
        throw new Error("Received empty response from API.");
    }

    const data = JSON.parse(jsonText);
    return data.locations || [];

  } catch (error) {
    console.error(`Error fetching ${entityName}:`, error);
    if (error instanceof Error) {
        if (error.message.includes('json')) {
            throw new Error(`The AI model returned an invalid format. Please try your search again.`);
        }
        throw new Error(`Failed to fetch ${entityName}. Reason: ${error.message}`);
    }
    throw new Error(`An unknown error occurred while fetching ${entityName}.`);
  }
};
