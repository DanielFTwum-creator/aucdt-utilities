import { GoogleGenAI, Part } from '@google/genai';
import {
  CartoonAnalysis, CartoonPairAnalysis, GenerationBrief, QuickAnalysis,
  AnalyseFormData, GenerateBriefFormData, CompareFormData
} from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
const MODEL = 'gemini-2.5-flash';

function parseJson<T>(text: string): T {
  // Strip markdown code fences if present
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();
  return JSON.parse(cleaned) as T;
}

async function generate(prompt: string, imageParts?: Part[]): Promise<string> {
  const contents: Part[] = [];
  if (imageParts) contents.push(...imageParts);
  contents.push({ text: prompt });

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [{ role: 'user', parts: contents }],
    config: { temperature: 0.7, topP: 0.9 },
  });
  return response.text ?? '';
}

function buildImageParts(base64: string, mimeType: string): Part[] {
  return [{
    inlineData: { data: base64, mimeType }
  }];
}

export async function analyseCartoon(data: AnalyseFormData): Promise<CartoonAnalysis> {
  const imageParts = data.image && data.imageMimeType
    ? buildImageParts(data.image, data.imageMimeType)
    : undefined;

  const prompt = `You are an expert Afrofuturism cultural analyst. Analyse the following cartoon${data.image ? ' (image provided)' : ''} and produce a complete structured analysis.

Title: "${data.title}"
Creator: "${data.creator || 'Unknown'}"
${data.description ? `Description: ${data.description}` : ''}

Apply all three analysis directives:

DIRECTIVE 1 — Cultural Authenticity Analysis (score 1-5):
- Identify specific cultural elements (clothing, hairstyles, language, traditions)
- Verify geographic/ethnic accuracy
- Assess whether cultures are stereotyped or nuanced
- Check for agency and dignity of characters
- Evaluate level of cultural insider knowledge

DIRECTIVE 2 — Afrofuturism Authenticity Check:
- Does the work celebrate African/diaspora identity?
- Are futuristic elements meaningful or decorative?
- Is there genuine speculative worldbuilding?
- Does it challenge or celebrate existing power structures?
- Is cultural voice/agency central to narrative?
- Does it avoid "white gaze" framing?
Classification: Strong (5+ checks), Moderate (3-4), Aesthetic (1-2)

DIRECTIVE 3 — Representation Quality Assessment (score 1-5):
- Skin tone representation diversity
- Body type diversity
- Gender and gender expression
- Age and generational diversity
- Role agency

Return ONLY valid JSON matching this exact schema (no markdown, no explanation outside JSON):

{
  "metadata": {
    "title": "${data.title}",
    "creator": "${data.creator || 'Unknown'}",
    "date_created": "${new Date().toISOString().split('T')[0]}",
    "image_id": "auto-${Date.now()}"
  },
  "cultural_context": {
    "region": "string",
    "specific_cultures": ["string"],
    "diaspora_connection": "string or null",
    "authenticity_notes": "string"
  },
  "visual_style": {
    "artistic_technique": "string",
    "color_palette": ["string"],
    "aesthetic_era": "string",
    "visual_mood": "string"
  },
  "characters": [
    {
      "identifier": 1,
      "cultural_identity": "string",
      "physical_characteristics": ["string"],
      "clothing": ["string"],
      "position": "string",
      "agency": "active"
    }
  ],
  "setting": {
    "location_type": "string",
    "interior_exterior": "string",
    "technology_level": "string",
    "cultural_markers": ["string"]
  },
  "narrative_layer": {
    "theme": "string",
    "story_or_scenario": "string",
    "social_commentary": "string or null",
    "message": "string"
  },
  "afrofuturism_elements": {
    "futuristic_aspects": ["string"],
    "cultural_celebrations": ["string"],
    "speculative_elements": ["string"],
    "contemporary_relevance": "string"
  },
  "classification": {
    "subgenre": "string",
    "tone": "string",
    "content_warnings": []
  },
  "directive_scores": {
    "cultural_authenticity": 4,
    "afrofuturism_strength": "Strong Afrofuturism",
    "representation_quality": 4
  },
  "narrative_analysis": "A 2-3 paragraph narrative synthesis of all findings."
}`;

  const raw = await generate(prompt, imageParts);
  return parseJson<CartoonAnalysis>(raw);
}

export async function quickAnalyse(title: string, description: string, image?: string, imageMimeType?: string): Promise<QuickAnalysis> {
  const imageParts = image && imageMimeType ? buildImageParts(image, imageMimeType) : undefined;

  const prompt = `You are an expert Afrofuturism analyst. Perform a rapid 3-minute analysis of this cartoon.

Title: "${title}"
${description ? `Description: ${description}` : ''}

Return ONLY valid JSON — no markdown fences, no extra text:

{
  "quick_analysis": {
    "title": "${title}",
    "cultural_origin": "string (region/culture)",
    "three_visual_standouts": ["element 1", "element 2", "element 3"],
    "afrofuturism_score": 4,
    "cultural_authenticity_score": 4,
    "one_sentence_summary": "string",
    "key_takeaway": "string"
  }
}

Scores are 1-5. Be decisive and specific.`;

  const raw = await generate(prompt, imageParts);
  return parseJson<QuickAnalysis>(raw);
}

export async function generateBrief(data: GenerateBriefFormData): Promise<GenerationBrief> {
  const prompt = `You are a creative director specialising in Afrofuturism illustration. Generate a complete creative brief for a new Afrofuturism cartoon.

Input parameters:
- Cultural Origin: ${data.cultural_origin}
- Setting: ${data.setting}
- Theme: ${data.theme}
- Mood/Tone: ${data.mood}
- Narrative Focus: ${data.narrative_focus}
- Characters: ${data.characters}
- Futuristic Elements: ${data.futuristic_elements}
- Social Message: ${data.social_message || 'None specified'}

Use Prompt Set 2 — Creation Prompts:
"Create an Afrofuturism cartoon scenario featuring ${data.cultural_origin} characters in ${data.setting}. Include elements of: ${data.theme}. The tone should be ${data.mood}. Focus on ${data.narrative_focus}."

Ensure:
- Cultural authenticity (not stereotypical)
- Afrofuturism elements integrated meaningfully
- Character agency established
- Clear social message or celebration
- Originality and specificity

Return ONLY valid JSON — no markdown fences:

{
  "generation_brief": {
    "title": "string (evocative title)",
    "cultural_origin": "${data.cultural_origin}",
    "temporal_setting": "string",
    "primary_theme": "${data.theme}",
    "target_characters": "string (detailed character descriptions)",
    "visual_style_ref": ["style reference 1", "style reference 2"],
    "key_elements": ["element 1", "element 2", "element 3"],
    "social_message": ${data.social_message ? `"${data.social_message}"` : 'null'},
    "mood_target": "${data.mood}",
    "constraints": ["constraint 1", "constraint 2"],
    "inspirations": ["inspiration 1", "inspiration 2"]
  },
  "visual_description": "A detailed 3-4 sentence visual description of what the finished cartoon should look like — composition, colours, atmosphere, key focal points.",
  "art_direction_notes": "2-3 sentences of specific art direction notes for the illustrator — technique, cultural references to research, things to avoid."
}`;

  const raw = await generate(prompt);
  return parseJson<GenerationBrief>(raw);
}

export async function compareCartoons(data: CompareFormData): Promise<CartoonPairAnalysis> {
  const imageParts: Part[] = [];
  if (data.cartoon_a_image && data.cartoon_a_imageMimeType) {
    imageParts.push(...buildImageParts(data.cartoon_a_image, data.cartoon_a_imageMimeType));
  }
  if (data.cartoon_b_image && data.cartoon_b_imageMimeType) {
    imageParts.push(...buildImageParts(data.cartoon_b_image, data.cartoon_b_imageMimeType));
  }

  const prompt = `You are an expert Afrofuturism cultural analyst. Compare these two Afrofuturism cartoons using Template 2: Comparative Analysis.

CARTOON A:
- Title: "${data.cartoon_a_title}"
- Cultural Origin: "${data.cartoon_a_origin}"
${data.cartoon_a_description ? `- Description: ${data.cartoon_a_description}` : ''}

CARTOON B:
- Title: "${data.cartoon_b_title}"
- Cultural Origin: "${data.cartoon_b_origin}"
${data.cartoon_b_description ? `- Description: ${data.cartoon_b_description}` : ''}

Analyse visual, thematic, and cultural similarities and differences. Extract cross-cultural insights and compare representation quality.

Return ONLY valid JSON — no markdown fences:

{
  "cartoon_pair_analysis": {
    "cartoon_a": {
      "title": "${data.cartoon_a_title}",
      "cultural_origin": "${data.cartoon_a_origin}"
    },
    "cartoon_b": {
      "title": "${data.cartoon_b_title}",
      "cultural_origin": "${data.cartoon_b_origin}"
    },
    "similarities": {
      "visual": ["similarity 1", "similarity 2"],
      "thematic": ["similarity 1", "similarity 2"],
      "cultural": ["similarity 1", "similarity 2"]
    },
    "differences": {
      "visual": ["difference 1", "difference 2"],
      "thematic": ["difference 1", "difference 2"],
      "cultural": ["difference 1", "difference 2"]
    },
    "cross_cultural_insights": "string — what patterns emerge across both works?",
    "representation_comparison": "string — how does representation quality compare?"
  },
  "narrative_analysis": "A 2-3 paragraph comparative analysis synthesising all findings and recommending future directions."
}`;

  const raw = await generate(prompt, imageParts.length ? imageParts : undefined);
  return parseJson<CartoonPairAnalysis>(raw);
}
