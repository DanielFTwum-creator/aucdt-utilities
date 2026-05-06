import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, CloudUpload } from 'lucide-react';

interface AudioPlayerProps {
  url: string;
  onEnded: () => void;
  onSave?: () => void;
  autoPlay?: boolean;
}

export default function AudioPlayer({ url, onEnded, onSave, autoPlay = false }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      onEnded();
    });

    setIsPlaying(false);
    setProgress(0);

    if (autoPlay) {
      audio.play().catch(e => console.error('Autoplay failed:', e));
      setIsPlaying(true);
    }

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
    };
  }, [url, onEnded, autoPlay]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const seekTo = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = ratio * audioRef.current.duration;
    }
  };

  return (
    <div className="studio-panel p-5 flex flex-col gap-4">

      {/* ── Row 1: Label + status ───────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <p className="font-mono uppercase tracking-[0.3em]" style={{ fontSize: '9px', color: '#C89040' }}>
          Now Playing
        </p>
        <div className="flex items-center gap-2">
          {isPlaying && (
            <span className="rec-dot w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#C8921E' }} />
          )}
          <span className="font-mono" style={{ fontSize: '9px', color: '#A07838' }}>
            {isPlaying ? 'Live' : 'Paused'}
          </span>
        </div>
      </div>

      {/* ── Row 2: Progress bar (full width, clickable) ─────────────────────── */}
      <div
        className="relative rounded-full overflow-hidden cursor-pointer group"
        style={{ height: '6px', background: '#3A2010' }}
        onClick={seekTo}
        title="Seek"
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-100"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(to right, #A07010, #C8921E, #E8C060)',
          }}
        />
        {/* Playhead dot */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            left: `calc(${progress}% - 6px)`,
            background: '#E8C060',
            boxShadow: '0 0 6px rgba(232, 192, 96, 0.6)',
          }}
        />
      </div>

      {/* ── Row 3: Controls ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4">

        {/* Play / Pause */}
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all"
          style={isPlaying ? {
            background: 'linear-gradient(135deg, #C8921E, #A07010)',
            color: '#100804',
            boxShadow: '0 4px 20px rgba(200,146,30,0.4)',
          } : {
            background: '#261408',
            color: '#C8921E',
            border: '1px solid #6A4020',
          }}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right controls */}
        <div className="flex items-center gap-3 shrink-0">
          {onSave && (
            <button
              type="button"
              onClick={onSave}
              title="Save to Google Drive"
              className="transition-colors"
              style={{ color: '#9A7030' }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = '#C8921E'}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = '#9A7030'}
            >
              <CloudUpload size={18} />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            title={isMuted ? 'Unmute' : 'Mute'}
            className="transition-colors"
            style={{ color: isMuted ? '#6A4020' : '#C89040' }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = '#C8921E'}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = isMuted ? '#6A4020' : '#C89040'}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </div>

      {/* ── Row 4: L/R stereo level meters (full width) ─────────────────────── */}
      <div className="flex flex-col gap-1.5">
        {(['L', 'R'] as const).map((ch, ci) => (
          <div key={ch} className="flex items-center gap-3">
            <span className="font-mono w-3 text-right shrink-0" style={{ fontSize: '9px', color: '#9A7030' }}>
              {ch}
            </span>
            <div
              className="flex-1 rounded-full overflow-hidden"
              style={{ height: '6px', background: '#261408' }}
            >
              <div
                className={`h-full rounded-full ${isPlaying ? (ci === 0 ? 'level-meter-l' : 'level-meter-r') : ''}`}
                style={{
                  width: isPlaying ? undefined : '0%',
                  background: 'linear-gradient(to right, #186828 0%, #22C55E 55%, #E8AB3A 82%, #C8921E 100%)',
                  transition: isPlaying ? 'none' : 'width 0.5s ease',
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <audio ref={audioRef} src={url} muted={isMuted} />
    </div>
  );
}
