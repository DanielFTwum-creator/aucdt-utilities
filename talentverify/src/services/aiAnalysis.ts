import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface AIAnalysisResult {
  score: number; // 0-100 (100 = highly likely AI)
  confidence: number;
  signals: string[];
}

export async function analyzeAuthorship(text: string): Promise<AIAnalysisResult> {
  if (!text || text.length < 50) {
    return { score: 0, confidence: 0, signals: ['Text too short for analysis'] };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the following text for likelihood of AI authorship. 
      Focus on indicators like:
      - Lack of personal anecdotes or specific details
      - Overly structured or repetitive phrasing
      - "Hallucinated" or generic facts
      - Perfect grammar with low perplexity
      
      Text to analyze:
      "${text.substring(0, 2000)}..."`, // Truncate for safety
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: {
              type: Type.NUMBER,
              description: "Likelihood score 0-100, where 100 is definitely AI generated.",
            },
            confidence: {
              type: Type.NUMBER,
              description: "Confidence in the analysis 0-100.",
            },
            signals: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
              description: "List of specific indicators found.",
            },
          },
        },
      }
    });

    const result = JSON.parse(response.text || '{}');
    return {
      score: result.score || 0,
      confidence: result.confidence || 0,
      signals: result.signals || []
    };
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return { score: 0, confidence: 0, signals: ['Analysis failed'] };
  }
}

export async function analyzeVideoResponse(base64Video: string): Promise<AIAnalysisResult> {
  try {
    // Extract base64 data and mime type
    const matches = base64Video.match(/^data:(.+);base64,(.+)$/);
    if (!matches) {
      return { score: 0, confidence: 0, signals: ['Invalid video format'] };
    }
    const mimeType = matches[1];
    const data = matches[2];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: mimeType,
                data: data
              }
            },
            {
              text: `Analyze this video response from a job candidate.
              Focus on:
              - Signs of reading from a script or teleprompter (eye movement, unnatural pacing)
              - Use of AI-generated avatars (unnatural lip sync, static features)
              - Authenticity of delivery
              
              Provide a score where 100 means highly likely to be scripted/AI-generated/fake.`
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: {
              type: Type.NUMBER,
              description: "Likelihood score 0-100, where 100 is definitely AI/Scripted.",
            },
            confidence: {
              type: Type.NUMBER,
              description: "Confidence in the analysis 0-100.",
            },
            signals: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
              description: "List of specific indicators found.",
            },
          },
        },
      }
    });

    const result = JSON.parse(response.text || '{}');
    return {
      score: result.score || 0,
      confidence: result.confidence || 0,
      signals: result.signals || []
    };
  } catch (error) {
    console.error("Video Analysis failed:", error);
    return { score: 0, confidence: 0, signals: ['Video analysis failed'] };
  }
}
