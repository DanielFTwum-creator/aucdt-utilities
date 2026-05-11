import { useState } from 'react';
import { useAnimator } from './context/AnimatorContext';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { AppHeader } from './components/AppHeader';
import { PreviewPanel } from './components/PreviewPanel';
import { AgentPanel } from './components/AgentPanel';
import { TimelinePanel } from './components/TimelinePanel';
import { StatusBar } from './components/StatusBar';
import { CameraModal } from './components/CameraModal';

export default function Animator() {
  const {
    history,
    playback,
    play,
    pause,
    stop,
    toggleKeyframe,
    profilePhoto,
    setProfilePhoto,
  } = useAnimator();

  // Global keyboard shortcuts: Space=play/pause, Escape=stop, Ctrl+Z=undo, Ctrl+Shift+Z=redo, Ctrl+S=save
  useKeyboardShortcuts();

  const [showCamera, setShowCamera] = useState(false);

  const openCamera = () => setShowCamera(true);

  const closeCamera = () => setShowCamera(false);

  const handlePhotoTaken = (photoDataUrl: string) => {
    setProfilePhoto(photoDataUrl);
    setShowCamera(false);
  };

  const handleExport = () => {
    // Future: trigger render pipeline
    console.log('[Animator] Export requested for project:', history.present.name);
  };

  return (
    <div className="w-full min-h-screen h-screen bg-[var(--c-bg-base)] text-[var(--c-text-secondary)] flex flex-col font-sans overflow-hidden">
      <AppHeader
        projectName={history.present.name}
        profilePhoto={profilePhoto}
        onOpenCamera={openCamera}
        onExport={handleExport}
        isPlaying={playback.isPlaying}
        onPlay={play}
        onPause={pause}
        onStop={stop}
      />

      <main className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-12 grid-rows-none lg:grid-rows-6 gap-4 overflow-hidden min-h-0" role="main">
        <PreviewPanel frame={playback.frame} />
        <AgentPanel />
        <TimelinePanel
          tracks={history.present.tracks}
          onKeyframeToggle={toggleKeyframe}
        />
      </main>

      <StatusBar />

      {showCamera && (
        <CameraModal onClose={closeCamera} onPhotoTaken={handlePhotoTaken} />
      )}
    </div>
  );
}
