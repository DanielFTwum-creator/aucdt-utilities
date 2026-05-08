import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { ProjectState, HistoryState, AnimatorContextType, Track, PlaybackState } from '../types/animation';
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

const INITIAL_PLAYBACK: PlaybackState = {
  frame: 0,
  playheadPos: 0,
  isPlaying: true,
  isScrubbing: false,
};

const AnimatorContext = createContext<AnimatorContextType | undefined>(undefined);

export function AnimatorProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useLocalStorage<HistoryState>('history', {
    past: [],
    present: INITIAL_PROJECT,
    future: [],
  });

  const [playback, setPlayback] = useState<PlaybackState>(INITIAL_PLAYBACK);
  const [profilePhoto, setProfilePhoto] = useLocalStorage<string | null>('profile-photo', null);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(Date.now());

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;


  const undo = useCallback(() => {
    setHistory((prev: HistoryState) => {
      if (prev.past.length === 0) return prev;
      return {
        past: prev.past.slice(0, -1),
        present: prev.past[prev.past.length - 1],
        future: [prev.present, ...prev.future],
      };
    });
  }, [setHistory]);

  const redo = useCallback(() => {
    setHistory((prev: HistoryState) => {
      if (prev.future.length === 0) return prev;
      return {
        past: [...prev.past, prev.present],
        present: prev.future[0],
        future: prev.future.slice(1),
      };
    });
  }, [setHistory]);

  const toggleKeyframe = useCallback((trackIdx: number, segIdx: number, keyIdx: number) => {
    setHistory((prev: HistoryState) => {
      const newTracks = prev.present.tracks.map((track: Track, ti: number) => {
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
      const newPresent = { ...prev.present, tracks: newTracks, updatedAt: Date.now() };
      return {
        past: [...prev.past.slice(-HISTORY_CAP + 1), prev.present],
        present: newPresent,
        future: [],
      };
    });
    setLastSavedAt(Date.now());
  }, [setHistory]);

  const addTrack = useCallback((track: Track) => {
    setHistory((prev: HistoryState) => {
      const newTracks = [...prev.present.tracks, track];
      return {
        past: [...prev.past.slice(-HISTORY_CAP + 1), prev.present],
        present: { ...prev.present, tracks: newTracks, updatedAt: Date.now() },
        future: [],
      };
    });
    setLastSavedAt(Date.now());
  }, [setHistory]);

  const removeTrack = useCallback((trackIdx: number) => {
    setHistory((prev: HistoryState) => {
      const newTracks = prev.present.tracks.filter((_: Track, i: number) => i !== trackIdx);
      return {
        past: [...prev.past.slice(-HISTORY_CAP + 1), prev.present],
        present: { ...prev.present, tracks: newTracks, updatedAt: Date.now() },
        future: [],
      };
    });
    setLastSavedAt(Date.now());
  }, [setHistory]);

  const updateTrack = useCallback((trackIdx: number, updatedTrack: Track) => {
    setHistory((prev: HistoryState) => {
      const newTracks = prev.present.tracks.map((track: Track, i: number) => (i === trackIdx ? updatedTrack : track));
      return {
        past: [...prev.past.slice(-HISTORY_CAP + 1), prev.present],
        present: { ...prev.present, tracks: newTracks, updatedAt: Date.now() },
        future: [],
      };
    });
    setLastSavedAt(Date.now());
  }, [setHistory]);

  const saveProject = useCallback(() => {
    setLastSavedAt(Date.now());
  }, []);

  const newProject = useCallback(() => {
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
    setPlayback(INITIAL_PLAYBACK);
    setLastSavedAt(Date.now());
  }, [setHistory]);

  const loadProject = useCallback((_name?: string) => {
    // If name provided, would load from a project library (future feature)
    // For now, load from localStorage is automatic via useLocalStorage
  }, []);

  // Playback controls
  const play = useCallback(() => {
    setPlayback(prev => ({ ...prev, isPlaying: true }));
  }, []);

  const pause = useCallback(() => {
    setPlayback(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const stop = useCallback(() => {
    setPlayback({ frame: 0, playheadPos: 0, isPlaying: false, isScrubbing: false });
  }, []);

  const setFrame = useCallback((frame: number) => {
    setPlayback(prev => ({ ...prev, frame }));
  }, []);

  const setPlayheadPos = useCallback((pos: number) => {
    setPlayback(prev => ({ ...prev, playheadPos: pos }));
  }, []);

  const setIsScrubbing = useCallback((scrubbing: boolean) => {
    setPlayback(prev => ({ ...prev, isScrubbing: scrubbing }));
  }, []);

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
    playback,
    play,
    pause,
    stop,
    setFrame,
    setPlayheadPos,
    setIsScrubbing,
    profilePhoto,
    setProfilePhoto,
    lastSavedAt,
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
