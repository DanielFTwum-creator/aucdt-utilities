export interface Criterion {
  id: string;
  label: string;
  maxScore: number;
  description?: string;
}

export interface Section {
  id: string;
  title: string;
  criteria: Criterion[];
}

export const FORM_SECTIONS: Section[] = [
  {
    id: 'storytelling',
    title: 'Storytelling',
    criteria: [
      { id: 'plot', label: 'Plot Structure & Pacing', maxScore: 10, description: 'Coherence of the narrative arc and pacing.' },
      { id: 'characters', label: 'Character Development', maxScore: 10, description: 'Depth and relatability of characters.' },
      { id: 'theme', label: 'Theme & Message', maxScore: 10, description: 'Clarity and impact of the central theme.' },
    ],
  },
  {
    id: 'title',
    title: 'Title',
    criteria: [
      { id: 'relevance', label: 'Relevance', maxScore: 5, description: 'Connection to the content.' },
      { id: 'creativity', label: 'Creativity', maxScore: 5, description: 'Originality and appeal.' },
    ],
  },
  {
    id: 'video',
    title: 'Video Production',
    criteria: [
      { id: 'cinematography', label: 'Cinematography', maxScore: 10, description: 'Camera work, framing, and lighting.' },
      { id: 'editing', label: 'Editing', maxScore: 10, description: 'Transitions, flow, and visual coherence.' },
    ],
  },
  {
    id: 'audio',
    title: 'Audio Production',
    criteria: [
      { id: 'sound_design', label: 'Sound Design', maxScore: 10, description: 'Use of sound effects and ambience.' },
      { id: 'music', label: 'Music Score', maxScore: 10, description: 'Appropriateness and emotional impact of music.' },
      { id: 'dialogue', label: 'Dialogue Clarity', maxScore: 10, description: 'Audibility and quality of spoken words.' },
    ],
  },
  {
    id: 'presentation',
    title: 'Presentation',
    criteria: [
      { id: 'overall_impact', label: 'Overall Impact', maxScore: 10, description: 'General impression and engagement.' },
    ],
  },
];

export const MAX_TOTAL_SCORE = FORM_SECTIONS.reduce(
  (acc, section) => acc + section.criteria.reduce((sAcc, criterion) => sAcc + criterion.maxScore, 0),
  0
);
