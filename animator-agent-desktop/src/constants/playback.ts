import type { Track, AgentStep } from '../types/animation';

export const FPS = 24;
export const TOTAL_FRAMES = 600;

export const INITIAL_TRACKS: Track[] = [
  {
    id: 'track-camera',
    name: 'Camera_Main',
    bg: 'bg-[rgba(59,107,255,0.10)]',
    segments: [{ left: 10, width: 60, keys: [{ pos: 2, enabled: true }, { pos: 25, enabled: true }, { pos: 55, enabled: true }] }],
  },
  {
    id: 'track-subject',
    name: 'Subj_Alpha',
    bg: 'bg-[rgba(140,100,255,0.10)]',
    segments: [{ left: 20, width: 30, keys: [{ pos: 5, enabled: true }] }],
  },
  {
    id: 'track-vfx',
    name: 'VFX_Bloom',
    bg: 'bg-[rgba(244,197,90,0.10)]',
    segments: [{ left: 38, width: 50, keys: [{ pos: 2, enabled: true }, { pos: 42, enabled: true }] }],
  },
  {
    id: 'track-lighting',
    name: 'Light_Key',
    bg: 'bg-[rgba(52,211,153,0.10)]',
    segments: [{ left: 5, width: 90, keys: [{ pos: 15, enabled: true }, { pos: 30, enabled: true }, { pos: 45, enabled: true }, { pos: 80, enabled: true }] }],
  },
];

export const INITIAL_AGENT_STEPS: AgentStep[] = [
  { id: 'step-1', label: 'Briefing', status: 'done' },
  { id: 'step-2', label: 'Character Setup', status: 'done' },
  { id: 'step-3', label: 'Animation', status: 'active' },
  { id: 'step-4', label: 'Rendering', status: 'pending' },
  { id: 'step-5', label: 'Review', status: 'pending' },
];
