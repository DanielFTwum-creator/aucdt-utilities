/**
 * Core animation data types
 * All interfaces for timeline, keyframes, projects, and agent state
 */

export interface Keyframe {
  pos: number;
  enabled: boolean;
}

export interface Segment {
  left: number;
  width: number;
  keys: Keyframe[];
}

export interface Track {
  id: string;
  name: string;
  bg: string; // Tailwind class, e.g. 'bg-indigo-500/10'
  segments: Segment[];
}

export interface AgentStep {
  id: string;
  label: string;
  status: 'done' | 'active' | 'pending';
}

export interface ProjectState {
  id: string;
  name: string;
  tracks: Track[];
  totalFrames: number;
  fps: number;
  createdAt: number;
  updatedAt: number;
}

export interface HistoryState {
  past: ProjectState[];
  present: ProjectState;
  future: ProjectState[];
}

export interface AnimatorContextType {
  history: HistoryState;
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  toggleKeyframe: (trackIdx: number, segIdx: number, keyIdx: number) => void;
  addTrack: (track: Track) => void;
  removeTrack: (trackIdx: number) => void;
  updateTrack: (trackIdx: number, track: Track) => void;
  saveProject: () => void;
  newProject: () => void;
  loadProject: (name?: string) => void;
}
