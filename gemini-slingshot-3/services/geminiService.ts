/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, Type } from "@google/genai";
import { StrategicHint, AiResponse, DebugInfo, BubbleColor } from "../types";

// Initialize Gemini Client
let ai: GoogleGenAI | null = null;
if (process.env.API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
}

const MODEL_NAME = "gemini-3-flash-preview";

export interface TargetCandidate {
  id: string;
  color: string;
  size: number;
  row: number;
  col: number;
  pointsPerBubble: number;
  description: string;
}

/**
 * Tactical Service for board state analysis.
 * Uses Gemini-3-Flash for real-time strategic reasoning.
 */
export const getStrategicHint = async (
  imageBase64: string,
  validTargets: TargetCandidate[],
  dangerRow: number
): Promise<AiResponse> => {
  const startTime = performance.now();
  const debug: DebugInfo = {
    latency: 0,
    screenshotBase64: imageBase64,
    promptContext: "",
    rawResponse: "",
    timestamp: new Date().toLocaleTimeString()
  };

  if (!ai) {
    return {
      hint: { message: "System offline. Check API configuration." },
      debug: { ...debug, error: "API Key Unavailable" }
    };
  }

  // Fallback Logic for local heuristics
  const getFallback = (): StrategicHint => {
    if (validTargets.length > 0) {
      const best = [...validTargets].sort((a,b) => (b.size * b.pointsPerBubble) - (a.size * a.pointsPerBubble))[0];
      return {
        message: `Local heuristic: Strike ${best.color.toUpperCase()} at [R:${best.row} C:${best.col}]`,
        rationale: "Defaulting to high-value cluster detected via local clear-path analysis.",
        targetRow: best.row, targetCol: best.col,
        recommendedColor: best.color as BubbleColor
      };
    }
    return { 
      message: "No clear shot. Conserve ammunition.", 
      rationale: "Awaiting better board configuration." 
    };
  };

  const targetListStr = validTargets.length > 0 
    ? validTargets.map(t => `- TACTICAL TARGET: ${t.color.toUpperCase()} | Size: ${t.size} | Value: ${t.size * t.pointsPerBubble} | Location: [R:${t.row}, C:${t.col}] (${t.description})`).join("\n")
    : "No immediate clusters available for existing projectile pool.";
  
  debug.promptContext = targetListStr;

  const prompt = `
    You are the Strategic Tactical Computer for a Bubble Shooter simulation.
    Analyse the visual feed and logical target pool to determine the most effective projectile color and aim point.

    --- BOARD DATA ---
    DANGER LEVEL: ${dangerRow >= 6 ? "CRITICAL (Immediate clearance required!)" : "NOMINAL"}
    
    --- SCORING PROTOCOL ---
    RED: 100 | BLUE: 150 | GREEN: 200 | YELLOW: 250 | PURPLE: 300 | ORANGE: 500

    --- TACTICAL OPPORTUNITIES (Validated Shots) ---
    ${targetListStr}

    --- OBJECTIVES ---
    1. SURVIVAL: If Danger is CRITICAL, focus exclusively on the lowest active bubbles regardless of score.
    2. OPTIMIZATION: Maximize score using Orange/Purple clusters if safety permits.
    3. EFFICIENCY: Suggest a "setup" shot if no matches exist.

    --- RESPONSE FORMAT (JSON ONLY) ---
    {
      "message": "Operational directive (concise)",
      "rationale": "Strategic reasoning",
      "recommendedColor": "red|blue|green|yellow|purple|orange",
      "targetRow": integer,
      "targetCol": integer
    }
  `;

  try {
    const cleanBase64 = imageBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          { text: prompt }, 
          { inlineData: { mimeType: "image/jpeg", data: cleanBase64 } }
        ]
      },
      config: {
        maxOutputTokens: 600,
        temperature: 0.1, // High precision required for tactical analysis
        responseMimeType: "application/json"
      }
    });

    debug.latency = Math.round(performance.now() - startTime);
    const text = response.text || "{}";
    debug.rawResponse = text;

    try {
      const json = JSON.parse(text);
      debug.parsedResponse = json;
      if (typeof json.targetRow === 'number' && json.recommendedColor) {
        return {
          hint: {
            message: json.message || "Target acquired.",
            rationale: json.rationale || "Optimal path determined by neural evaluation.",
            targetRow: json.targetRow,
            targetCol: json.targetCol,
            recommendedColor: json.recommendedColor.toLowerCase() as BubbleColor
          },
          debug
        };
      }
      return { hint: getFallback(), debug: { ...debug, error: "AI response missing fields" } };
    } catch (e) {
      return { hint: getFallback(), debug: { ...debug, error: "JSON parse failed" } };
    }
  } catch (error: any) {
    debug.latency = Math.round(performance.now() - startTime);
    return { hint: getFallback(), debug: { ...debug, error: error.message } };
  }
};
