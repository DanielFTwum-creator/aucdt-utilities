import { createContext, useContext, ReactNode } from 'react';
import type { ProjectState, HistoryState, AnimatorContextType, Track } from '../types/animation';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { INITIAL_TRACKS, TOTAL_FRAMES, FPS } from '../constants/playback';

const HISTORY_CAP = 50;

const INITIAL_PROJECT: ProjectState = {
  id: `project-${Date.now()}`,
  name: 'Untitled Project',
  tracks: INITIAL_TRACKS,
  totalFrames: TOTAL_FRAMES,
  fps: FPS,
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

const AnimatorContext = createContext<AnimatorContextType | undefined>(undefined);

export function AnimatorProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useLocalStorage<HistoryState>('history', {
    past: [],
    present: INITIAL_PROJECT,
    future: [],
  });

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  const dispatch = (newPresent: ProjectState) => {
    setHistory({
      past: [...history.past.slice(-HISTORY_CAP + 1), history.present],
      present: { ...newPresent, updatedAt: Date.now() },
      future: [],
    });
  };

  const undo = () => {
    if (!canUndo) return;
    setHistory({
      past: history.past.slice(0, -1),
      present: history.past[history.past.length - 1],
      future: [history.present, ...history.future],
    });
  };

  const redo = () => {
    if (!canRedo) return;
    setHistory({
      past: [...history.past, history.present],
      present: history.future[0],
      future: history.future.slice(1),
    });
  };

  const toggleKeyframe = (trackIdx: number, segIdx: number, keyIdx: number) => {
    const newTracks = history.present.tracks.map((track, ti) => {
      if (ti !== trackIdx) return track;
      return {
        ...track,
        segments: track.segments.map((seg, si) => {
          if (si !== segIdx) return seg;
          return {
            ...seg,
            keys: seg.keys.map((key, ki) => {
              if (ki !== keyIdx) return key;
              return { ...key, enabled: !key.enabled };
            }),
          };
        }),
      };
    });
    dispatch({ ...history.present, tracks: newTracks });
  };

  const addTrack = (track: Track) => {
    const newTracks = [...history.present.tracks, track];
    dispatch({ ...history.present, tracks: newTracks });
  };

  const removeTrack = (trackIdx: number) => {
    const newTracks = history.present.tracks.filter((_, i) => i !== trackIdx);
    dispatch({ ...history.present, tracks: newTracks });
  };

  const updateTrack = (trackIdx: number, updatedTrack: Track) => {
    const newTracks = history.present.tracks.map((track, i) => (i === trackIdx ? updatedTrack : track));
    dispatch({ ...history.present, tracks: newTracks });
  };

  const saveProject = () => {
    // Already auto-saved to localStorage via useLocalStorage dependency
  };

  const newProject = () => {
    const freshProject: ProjectState = {
      id: `project-${Date.now()}`,
      name: 'Untitled Project',
      tracks: INITIAL_TRACKS,
      totalFrames: TOTAL_FRAMES,
      fps: FPS,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setHistory({ past: [], present: freshProject, future: [] });
  };

  const loadProject = (_name?: string) => {
    // If name provided, would load from a project library (future feature)
    // For now, load from localStorage is automatic via useLocalStorage
  };

  const value: AnimatorContextType = {
    history,
    canUndo,
    canRedo,
    undo,
    redo,
    toggleKeyframe,
    addTrack,
    removeTrack,
    updateTrack,
    saveProject,
    newProject,
    loadProject,
  };

  return <AnimatorContext.Provider value={value}>{children}</AnimatorContext.Provider>;
}

export function useAnimator() {
  const context = useContext(AnimatorContext);
  if (context === undefined) {
    throw new Error('useAnimator must be used within AnimatorProvider');
  }
  return context;
}
