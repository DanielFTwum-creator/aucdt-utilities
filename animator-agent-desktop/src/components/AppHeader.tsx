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
    <header className="h-14 border-b border-[#27272a] px-6 flex items-center justify-between bg-[#09090b] shrink-0">
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">A</div>
        <span className="text-white font-semibold tracking-tight">
          ANIMATOR <span className="text-indigo-400 font-normal">AGENT v1.4</span>
        </span>
      </div>
      <div className="flex gap-8 text-xs font-medium uppercase tracking-widest h-full items-center">
        <span className="text-indigo-400 border-b border-indigo-400 h-full flex items-center pt-1 mt-0">Workspace</span>
        <span className="hover:text-white cursor-pointer h-full flex items-center pt-1 mt-0">Assets</span>
        <span className="hover:text-white cursor-pointer h-full flex items-center pt-1 mt-0">Render Queue</span>
        <span className="hover:text-white cursor-pointer h-full flex items-center pt-1 mt-0">Settings</span>
      </div>

      <TransportControls isPlaying={isPlaying} onPlay={onPlay} onPause={onPause} onStop={onStop} />

      <div className="flex gap-3">
        <div className="h-8 px-4 bg-[#18181b] border border-[#27272a] rounded flex items-center text-xs text-white cursor-pointer" onClick={onOpenCamera}>
          {profilePhoto ? (
            <img src={profilePhoto} alt="Profile" className="w-6 h-6 rounded-full object-cover mr-2" />
          ) : (
            <div className="w-6 h-6 bg-zinc-700 rounded-full flex items-center justify-center mr-2">
              <span className="text-[10px]">👤</span>
            </div>
          )}
          Profile
        </div>
        <div className="h-8 px-4 bg-[#18181b] border border-[#27272a] rounded flex items-center text-xs text-white">Project: {projectName}</div>
        <div className="h-8 px-4 bg-indigo-600 hover:bg-indigo-500 cursor-pointer transition-colors rounded flex items-center text-xs text-white font-bold" onClick={onExport}>
          EXPORT
        </div>
      </div>
    </header>
  );
}
