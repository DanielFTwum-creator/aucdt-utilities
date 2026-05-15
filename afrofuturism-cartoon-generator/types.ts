// Afrofuturism Cartoon Directive Generator — Type Definitions
// Based on the AFROFUTURISM_CARTOON_DIRECTIVE_GENERATOR v1.0 framework

export interface CartoonMetadata {
  title: string;
  creator: string;
  date_created: string;
  image_id: string;
}

export interface CulturalContext {
  region: string;
  specific_cultures: string[];
  diaspora_connection: string | null;
  authenticity_notes: string;
}

export interface VisualStyle {
  artistic_technique: string;
  color_palette: string[];
  aesthetic_era: string;
  visual_mood: string;
}

export interface Character {
  identifier: number;
  cultural_identity: string;
  physical_characteristics: string[];
  clothing: string[];
  position: string;
  agency: 'active' | 'passive';
}

export interface Setting {
  location_type: string;
  interior_exterior: string;
  technology_level: string;
  cultural_markers: string[];
}

export interface NarrativeLayer {
  theme: string;
  story_or_scenario: string;
  social_commentary: string | null;
  message: string;
}

export interface AfrofuturismElements {
  futuristic_aspects: string[];
  cultural_celebrations: string[];
  speculative_elements: string[];
  contemporary_relevance: string;
}

export interface Classification {
  subgenre: string;
  tone: string;
  content_warnings: string[];
}

export interface DirectiveScores {
  cultural_authenticity: number;
  afrofuturism_strength: 'Strong Afrofuturism' | 'Moderate Afrofuturism' | 'Aesthetic Afrofuturism';
  representation_quality: number;
}

export interface CartoonAnalysis {
  metadata: CartoonMetadata;
  cultural_context: CulturalContext;
  visual_style: VisualStyle;
  characters: Character[];
  setting: Setting;
  narrative_layer: NarrativeLayer;
  afrofuturism_elements: AfrofuturismElements;
  classification: Classification;
  directive_scores: DirectiveScores;
  narrative_analysis: string;
}

export interface CartoonPairAnalysis {
  cartoon_pair_analysis: {
    cartoon_a: { title: string; cultural_origin: string; };
    cartoon_b: { title: string; cultural_origin: string; };
    similarities: { visual: string[]; thematic: string[]; cultural: string[]; };
    differences: { visual: string[]; thematic: string[]; cultural: string[]; };
    cross_cultural_insights: string;
    representation_comparison: string;
  };
  narrative_analysis?: string;
}

export interface GenerationBrief {
  generation_brief: {
    title: string;
    cultural_origin: string;
    temporal_setting: string;
    primary_theme: string;
    target_characters: string;
    visual_style_ref: string[];
    key_elements: string[];
    social_message: string | null;
    mood_target: string;
    constraints: string[];
    inspirations: string[];
  };
  visual_description: string;
  art_direction_notes: string;
}

export interface QuickAnalysis {
  quick_analysis: {
    title: string;
    cultural_origin: string;
    three_visual_standouts: [string, string, string];
    afrofuturism_score: number;
    cultural_authenticity_score: number;
    one_sentence_summary: string;
    key_takeaway: string;
  };
}

export type AnalysisType = 'full_analysis' | 'generation_brief' | 'comparison' | 'quick_analysis';

export interface LibraryEntry {
  id: string;
  type: AnalysisType;
  title: string;
  cultural_origin?: string;
  created_at: string;
  data: CartoonAnalysis | CartoonPairAnalysis | GenerationBrief | QuickAnalysis;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  details?: string;
}

export interface GenerateBriefFormData {
  cultural_origin: string;
  setting: string;
  theme: string;
  mood: string;
  narrative_focus: string;
  characters: string;
  futuristic_elements: string;
  social_message: string;
}

export interface AnalyseFormData {
  title: string;
  creator: string;
  description: string;
  image?: string; // base64
  imageMimeType?: string;
}

export interface CompareFormData {
  cartoon_a_title: string;
  cartoon_a_origin: string;
  cartoon_a_description: string;
  cartoon_a_image?: string;
  cartoon_a_imageMimeType?: string;
  cartoon_b_title: string;
  cartoon_b_origin: string;
  cartoon_b_description: string;
  cartoon_b_image?: string;
  cartoon_b_imageMimeType?: string;
}
