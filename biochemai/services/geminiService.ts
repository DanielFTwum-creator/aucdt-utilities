import { GoogleGenAI, Type } from "@google/genai";
import { LearningLevel, Source, QuizQuestion } from '../types';

// Per coding guidelines, API_KEY is assumed to be available in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a system instruction prompt for the Gemini model based on the user's learning level.
 * @param level - The selected learning level for the target audience.
 * @returns A string containing the system instruction.
 */
const getSystemInstruction = (level: LearningLevel): string => {
  // FIX: The original object keys ('beginner', 'intermediate', 'advanced') did not match the
  // LearningLevel enum type. The keys have been updated to use the enum members,
  // and values have been mapped to preserve the original intent of grouping levels.
  const levelDescriptions: Record<LearningLevel, string> = {
    [LearningLevel.Primary]: 'beginner (primary school)',
    [LearningLevel.Secondary]: 'beginner (secondary school)',
    [LearningLevel.Undergraduate]: 'intermediate (A-level/undergraduate)',
    [LearningLevel.PostGraduate]: 'advanced (postgraduate/professional)',
    [LearningLevel.Professional]: 'advanced (postgraduate/professional)',
  };

  return `You are BioChemAI, an expert biochemistry teaching assistant specialising in clear, accurate, and engaging explanations.

## Response Guidelines

### Level Adaptation
Your response MUST be tailored to a **${levelDescriptions[level] || level}** audience. Adjust your:
- Vocabulary complexity and technical terminology
- Depth of mechanistic explanations
- Use of analogies and examples
- References to prerequisite knowledge

### Formatting Standards
- Use British International English spelling throughout
- Structure responses with clear markdown headings (###)
- Use **bold** for emphasis and key terms
- Use *italics* for scientific names and foreign terms
- Create bulleted or numbered lists for clarity
- Include chemical formulae where appropriate (e.g., H₂O, CO₂)

### Drug and Medication Information
When discussing specific drugs, medications, or chemical compounds, you MUST structure your response with these sections:

#### Essential Sections
- **### Brand Names** (commercial and generic names)
- **### Classification** (drug class and mechanism category)
- **### Indications** (what it is used for)
- **### Mechanism of Action** (how it works, adapted to level)
- **### Administration** (how to take it, dosage forms)
- **### Common Side Effects** (frequency-organised when possible)
- **### Important Warnings** (contraindications, interactions, precautions)
- **### Storage and Handling** (if relevant)

#### Additional Sections (Level-Dependent)
For intermediate/advanced levels, also include:
- **### Pharmacokinetics** (absorption, distribution, metabolism, excretion)
- **### Drug Interactions** (detailed mechanisms)
- **### Clinical Considerations** (monitoring parameters, special populations)

### Mandatory Disclaimer
Always conclude any response about drugs, medications, or therapeutic compounds with this disclaimer as a separate, clearly visible paragraph:

---

**⚠️ Medical Disclaimer:** This information is for educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay seeking it because of information you have read here.

---

### Teaching Approach
- Begin with foundational concepts before advancing to complex details
- Use relevant examples and real-world applications
- Encourage critical thinking with thought-provoking questions
- Provide visual descriptions where diagrams would help
- Acknowledge limitations and areas of ongoing research
- Connect biochemical concepts to physiology and clinical practice where appropriate`;
};

/**
 * Generates a biochemistry explanation based on a user prompt and learning level.
 * Uses Google Search for grounding to provide up-to-date information and source citations.
 * @param prompt - The user's question or prompt.
 * @param level - The selected learning level to tailor the response.
 * @returns A promise that resolves to an object containing the AI-generated text and an array of sources.
 * @throws Will throw an error if the API call fails.
 */
export const generateBioChemResponse = async (
  prompt: string,
  level: LearningLevel
): Promise<{ text: string; sources: Source[] }> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: getSystemInstruction(level),
      },
    });

    const text = response.text;
    const sources: Source[] = [];
    
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks) {
        for (const chunk of groundingChunks) {
            if (chunk.web) {
                try {
                    // Validate URL before adding
                    new URL(chunk.web.uri);
                    sources.push({
                        uri: chunk.web.uri,
                        title: chunk.web.title || 'Untitled Source'
                    });
                } catch (e) {
                    console.warn(`Invalid source URL skipped: ${chunk.web.uri}`);
                }
            }
        }
    }

    return { text, sources };
  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error("Failed to get response from BioChemAI.");
  }
};

/**
 * Generates a multiple-choice quiz on a given topic for a specific learning level.
 * Requests a structured JSON response from the Gemini API.
 * @param topic - The topic for the quiz (e.g., "Cellular Respiration").
 * @param level - The learning level for the quiz questions.
 * @param numQuestions - The number of questions to generate. Defaults to 5.
 * @returns A promise that resolves to an array of QuizQuestion objects.
 * @throws Will throw an error if the API call fails or if the response format is invalid.
 */
export const generateQuiz = async (
  topic: string,
  level: LearningLevel,
  numQuestions: number = 5
): Promise<QuizQuestion[]> => {
  const systemInstruction = `You are an expert biochemistry quiz generator. Create a multiple-choice quiz based on the user's topic and learning level. Provide a clear question, 4 plausible options where one is correct, and a concise explanation for the correct answer. The quiz must be tailored for a ${level} level. The explanation should clarify why the correct answer is right and the others are wrong.`;

  const prompt = `Generate a ${numQuestions}-question multiple-choice quiz on the topic: "${topic}".`;

  const quizSchema = {
    type: Type.OBJECT,
    properties: {
      questions: {
        type: Type.ARRAY,
        description: `An array of ${numQuestions} quiz questions.`,
        items: {
          type: Type.OBJECT,
          properties: {
            questionText: {
              type: Type.STRING,
              description: "The text of the quiz question.",
            },
            options: {
              type: Type.ARRAY,
              description: "An array of exactly 4 strings representing the options.",
              items: { type: Type.STRING },
            },
            correctAnswerIndex: {
              type: Type.INTEGER,
              description: "The 0-based index of the correct answer in the 'options' array.",
            },
            explanation: {
              type: Type.STRING,
              description: "A brief explanation of why the correct answer is correct.",
            },
          },
          required: ['questionText', 'options', 'correctAnswerIndex', 'explanation'],
        },
      },
    },
    required: ['questions'],
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: quizSchema,
      },
    });
    
    const jsonText = response.text.trim();
    const quizData = JSON.parse(jsonText);
    
    if (!quizData.questions || !Array.isArray(quizData.questions) || quizData.questions.length === 0) {
        throw new Error("Invalid quiz format received from API.");
    }

    return quizData.questions as QuizQuestion[];

  } catch (error) {
    console.error("Gemini API call for quiz generation failed:", error);
    throw new Error("Failed to generate a quiz from BioChemAI.");
  }
};

/**
 * Adapts a string of content into a social media post for a specific platform.
 * @param originalContent - The source content to be adapted.
 * @param platform - The target social media platform ('instagram' or 'linkedin').
 * @param level - The learning level of the target audience.
 * @returns A promise that resolves to a string containing the generated social media post.
 * @throws Will throw an error if the API call fails.
 */
export const generateSocialPost = async (
  originalContent: string,
  platform: 'instagram' | 'linkedin',
  level: LearningLevel
): Promise<string> => {
  const platformName = platform === 'instagram' ? 'Instagram' : 'LinkedIn';
  const systemInstruction = `You are a social media expert specializing in science communication. Rewrite the following biochemistry content for a ${platformName} post. Adapt the tone and format appropriately. For Instagram, use an engaging, accessible tone with emojis and relevant hashtags. For LinkedIn, maintain a professional and informative tone and use professional hashtags. The target audience is at a ${level} level.`;
  
  const prompt = `Content to adapt: "${originalContent}"`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });
    return response.text;
  } catch (error) {
    console.error(`Gemini API call for ${platformName} post generation failed:`, error);
    throw new Error(`Failed to generate ${platformName} post.`);
  }
};
