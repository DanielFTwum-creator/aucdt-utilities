export interface SceneCue {
  id: string;
  type: 'facilitator' | 'children' | 'music_element' | 'drum_cue';
  text: string;
  subText?: string;
}

export interface StoryScene {
  id: number;
  title: string;
  narrative: string;
  cues: SceneCue[];
  musicalElements: {
    term: string;
    description: string;
  }[];
  selFocus: {
    competency: string;
    description: string;
  };
  visualFocus: 'opening' | 'map' | 'elephant_normal' | 'elephant_slow' | 'elephant_running' | 'monkeys_chattering' | 'snakes' | 'pond_frogs' | 'nap';
}

export interface MusicalConcept {
  term: string;
  definition: string;
  dfsApplication: string;
  hasAudioDemo: boolean;
  demoType: 'pulse' | 'decelerando' | 'accelerando' | 'unison' | 'timbre' | 'improvisation' | 'fermata';
}

export interface FoundObjectInstrument {
  id: string;
  category: 'drum' | 'shaker' | 'frog';
  name: string;
  realAlternative: string;
  description: string;
  soundType: string;
}

export interface CASELMapping {
  competency: string;
  description: string;
  drummingConnection: string;
  examples: string[];
}
