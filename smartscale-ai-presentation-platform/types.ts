
export enum SlideType {
  TITLE = 'TITLE',
  SECTION = 'SECTION',
  CONTENT = 'CONTENT',
  SPLIT = 'SPLIT',
  CTA = 'CTA',
  USE_CASE_GRID = 'USE_CASE_GRID',
  SANKEY = 'SANKEY'
}

export interface SlideImage {
  url: string;
  alt: string;
  position?: 'left' | 'right' | 'top' | 'bottom' | 'center';
  caption?: string;
}

export interface SlideInteraction {
  id: string;
  type: 'text' | 'textarea' | 'checkbox' | 'ai-prompt' | 'image-gen';
  label: string;
  placeholder?: string;
  aiPromptTemplate?: string; // Template for the AI to fill
}

export interface UseCase {
  industry: string;
  title: string;
  description: string;
  promptExample: string;
  benefit: string;
}

export interface SlideContent {
  id: number;
  type: SlideType;
  title: string;
  subtitle?: string;
  body?: string[]; 
  leftTitle?: string;
  leftBody?: string[];
  rightTitle?: string;
  rightBody?: string[];
  footer?: string;
  theme?: 'light' | 'brand'; 
  backgroundImage?: string;
  mainImage?: SlideImage;
  images?: SlideImage[]; 
  interactions?: SlideInteraction[]; 
  speakerNotes?: string;
  useCases?: UseCase[]; // For the Use Case Grid layout
}
