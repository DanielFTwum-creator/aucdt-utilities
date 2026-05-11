import { TransportControls } from './TransportControls';

interface AppHeaderProps {
  projectName: string;
  profilePhoto: string | null;
  onOpenCamera: () => void;
  onExport: () => void;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
}

export function AppHeader({ projectName, profilePhoto, onOpenCamera, onExport, isPlaying, onPlay, onPause, onStop }: AppHeaderProps) {
  return (
    <header
      className="h-13 border-b border-[var(--c-border-default)] px-5 flex items-center justify-between bg-[var(--c-bg-base)] shrink-0"
      role="banner"
      aria-label="Animator Agent header"
    >
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-md bg-[var(--c-accent-strong)] flex items-center justify-center" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M7 2L12 12H2L7 2Z" fill="white" opacity="0.9" />
            <line x1="4.5" y1="8.5" x2="9.5" y2="8.5" stroke="white" strokeWidth="1.2" opacity="0.7" />
          </svg>
        </div>
        <span className="text-[var(--c-text-primary)] text-sm font-semibold tracking-[-0.01em]">
          Animator <span className="text-[var(--c-text-secondary)] font-normal text-xs tracking-normal">Agent</span>
        </span>
        <span className="text-[10px] bg-[var(--c-accent-tint)] text-[var(--c-accent-soft)] px-1.5 py-0.5 rounded font-mono" aria-label="Version 3.0">v3.0</span>
      </div>
      <nav className="flex gap-6 text-xs h-full items-center" aria-label="Main navigation">
        <span className="text-[var(--c-accent-soft)] border-b border-[var(--c-accent-strong)] h-full flex items-center pb-0 cursor-pointer" aria-current="page">Workspace</span>
        <span className="text-[var(--c-text-secondary)] hover:text-[var(--c-text-primary)] cursor-pointer transition-colors" role="link" tabIndex={0}>Assets</span>
        <span className="text-[var(--c-text-secondary)] hover:text-[var(--c-text-primary)] cursor-pointer transition-colors" role="link" tabIndex={0}>Render Queue</span>
        <span className="text-[var(--c-text-secondary)] hover:text-[var(--c-text-primary)] cursor-pointer transition-colors" role="link" tabIndex={0}>Settings</span>
      </nav>

      <TransportControls isPlaying={isPlaying} onPlay={onPlay} onPause={onPause} onStop={onStop} />

      <div className="flex gap-2">
        <button
          type="button"
          className="h-7 px-3 bg-[var(--c-bg-raised)] border border-[var(--c-border-default)] rounded-md flex items-center gap-2 text-xs text-[var(--c-text-secondary)] hover:text-[var(--c-text-primary)] transition-colors"
          onClick={onOpenCamera}
          aria-label="Update profile photo"
          title="Update profile photo"
        >
          {profilePhoto ? (
            <img src={profilePhoto} alt="Profile" className="w-5 h-5 rounded-full object-cover" />
          ) : (
            <div className="w-5 h-5 bg-[var(--c-border-hover)] rounded-full flex items-center justify-center text-[8px]" aria-hidden="true">👤</div>
          )}
          <span>Profile</span>
        </button>
        <div className="h-7 px-3 bg-[var(--c-bg-raised)] border border-[var(--c-border-default)] rounded-md flex items-center text-xs text-[var(--c-text-muted)] font-mono" aria-label={`Current project: ${projectName}`}>
          {projectName}
        </div>
        <button
          type="button"
          className="h-7 px-4 bg-[var(--c-accent-strong)] hover:bg-[var(--c-accent-mid)] transition-colors rounded-md flex items-center text-xs text-white font-medium tracking-wide"
          onClick={onExport}
          aria-label="Export project"
          title="Export project"
        >
          Export
        </button>
      </div>
    </header>
  );
}
