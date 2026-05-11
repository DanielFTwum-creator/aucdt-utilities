import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getDesignAdvice = async (stage: string, userQuery: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Context: The user is in the '${stage}' phase of the 6R Design Methodology. 
                 Phase Definitions: 
                 Review: UX Audits & Heuristics. 
                 Reimagine: Innovative ideation. 
                 Restructure: Information Architecture. 
                 Refine: High-fidelity visual design. 
                 Recolor: Colour theory & Typography. 
                 Render: Handoff & Implementation.
                 
                 User Question: ${userQuery}
                 
                 Provide expert design advice in a concise, encouraging tone.`,
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to my design brain right now. Please try again later!";
  }
};

export const generateDesignVisual = async (prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `High-quality, institutional design diagram or conceptual visual representing: ${prompt}. 
                   Style: Minimalist, professional, clean lines, corporate colors (maroon and gold), 
                   academic diagrammatic style suitable for TechBridge University College.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Gemini Image Gen Error:", error);
    return null;
  }
};