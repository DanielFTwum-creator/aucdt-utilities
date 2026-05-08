import { useEffect, useCallback } from 'react';
import { useAnimator } from '../context/AnimatorContext';

/**
 * Global keyboard shortcuts hook.
 * Attach at the app root level.
 *
 * Shortcuts:
 *   Space        → Play / Pause toggle
 *   Escape       → Stop playback
 *   Ctrl+Z       → Undo
 *   Ctrl+Shift+Z → Redo
 *   Ctrl+S       → Save project (prevent default browser save)
 */
export function useKeyboardShortcuts() {
  const { playback, play, pause, stop, undo, redo, canUndo, canRedo, saveProject } = useAnimator();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't intercept when typing in an input/textarea
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return;
    }

    // Space → Play/Pause
    if (e.code === 'Space') {
      e.preventDefault();
      if (playback.isPlaying) {
        pause();
      } else {
        play();
      }
      return;
    }

    // Escape → Stop
    if (e.code === 'Escape') {
      e.preventDefault();
      stop();
      return;
    }

    // Ctrl+Z → Undo / Ctrl+Shift+Z → Redo
    if ((e.ctrlKey || e.metaKey) && e.code === 'KeyZ') {
      e.preventDefault();
      if (e.shiftKey) {
        if (canRedo) redo();
      } else {
        if (canUndo) undo();
      }
      return;
    }

    // Ctrl+S → Save
    if ((e.ctrlKey || e.metaKey) && e.code === 'KeyS') {
      e.preventDefault();
      saveProject();
      return;
    }
  }, [playback.isPlaying, play, pause, stop, undo, redo, canUndo, canRedo, saveProject]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
