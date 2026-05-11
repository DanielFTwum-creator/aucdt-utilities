import { GoogleGenAI } from "@google/genai";
import { ThumbnailData, GeneratedPrompts } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const SYSTEM_INSTRUCTION = `
You are a professional thumbnail design agent. You generate detailed, production-ready image generation prompts for thumbnails based on user-supplied brand details, copy, and visual style preferences.

DESIGN PHILOSOPHY:
- Style: cinematic dark luxury
- Mood: authoritative, aspirational, high-converting
- Color Language: deep blacks + gold accents + bright white typography
- Composition: portrait-format poster with bold headline hierarchy, background cityscape/scene, foreground human subject (right-aligned), icon list (lower-left), tagline bar (bottom)

SUBJECT POSE & PRESENCE:
- When describing the foreground subject, ensure they exhibit a "Dynamic & Commanding" posture.
- Ideal poses: slight tilt of the head, direct powerful eye contact, confident stride, hands adjusting a watch or lapel, or an authoritative standing posture with depth.

CINEMATIC LIGHTING:
- Mandate dramatic lighting on the foreground subject: Use sharp rim lighting to separate them from the dark background.
- Implement high-contrast Chiaroscuro or "Rembrandt" key lighting to create depth and mystery.
- Add golden-hour backlighting accents on hair or shoulders to tie into the gold luxury palette.
- Shadows should be deep and clean, avoiding flat illumination.

OUTPUT REQUIREMENTS:
Return a JSON object matching this structure:
{
  "midjourney": "/imagine prompt ...",
  "imagen3": "natural language prompt for Imagen 3 ...",
  "canvaBrief": "creative brief for Canva ...",
  "typographySpec": {
    "headline": "font details",
    "subheadline": "font details",
    "icons": "font details",
    "tagline": "font details"
  },
  "colorPalette": {
    "background": "#0A0A0A",
    "goldPrimary": "#C9A84C",
    "goldAccent": "#F0C040",
    "whiteText": "#FFFFFF"
  },
  "animatedExtension": "Sora/Veo video loop extension prompt..."
}

Always follow the hierarchy: Headline Line 1 (White), Headline Line 2 (Gold).
If the brand name or copy conflicts with luxury/authority tone, flag it in the canvaBrief or as a note.
`;

export async function generateThumbnailPrompts(data: ThumbnailData): Promise<GeneratedPrompts> {
  const prompt = `
    Generate thumbnail design prompts and specs for:
    Brand: ${data.brandName}
    Logo: ${data.logoDescription}
    Headline: ${data.headlineLine1} / ${data.headlineLine2}
    Subheadline: ${data.subheadline}
    Background: ${data.backgroundScene}
    Subject: ${data.foregroundSubject}
    Features: ${data.featureIcons.join(", ")}
    Tagline: ${data.taglineBar}
    Aspect Ratio: ${data.aspectRatio}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
      },
    });

    if (!response.text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(response.text) as GeneratedPrompts;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
