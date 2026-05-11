import { ClaudiaScene } from './ClaudiaScene';

interface PreviewPanelProps {
  frame: number;
}

export function PreviewPanel({ frame }: PreviewPanelProps) {
  return (
    <div
      className="lg:col-span-8 lg:row-span-4 bg-[var(--c-bg-panel)] border border-[var(--c-border-default)] rounded-xl relative flex items-center justify-center overflow-hidden min-h-[300px]"
      role="region"
      aria-label="Animation preview"
    >
      <div className="absolute top-4 left-4 flex gap-2 z-50">
        <div className="bg-[var(--c-bg-raised)]/80 backdrop-blur px-3 py-1 rounded-md text-[10px] text-[var(--c-text-secondary)] border border-[var(--c-border-default)]" aria-label="Preview resolution: 4K">
          4K Preview
        </div>
        <div className="bg-[var(--c-status-ok)]/8 text-[var(--c-status-ok)] px-3 py-1 rounded-md text-[10px] border border-[var(--c-status-ok)]/15" aria-live="polite">
          Active Loop
        </div>
      </div>

      <div className="absolute inset-2 border border-[var(--c-border-default)]/30 rounded-lg overflow-hidden isolate">
        <ClaudiaScene />
      </div>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-[60%] border-x-2 border-transparent flex flex-col items-center justify-center relative pointer-events-none z-40" aria-hidden="true">
        <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-[var(--c-accent-soft)] mix-blend-screen opacity-30" />
        <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-[var(--c-accent-soft)] mix-blend-screen opacity-30" />
      </div>

      <div className="absolute bottom-4 left-4 z-50">
        <div className="text-[var(--c-text-muted)] font-mono text-[10px] bg-black/50 px-2.5 py-1 rounded-md backdrop-blur" aria-live="polite" aria-label={`Current frame: ${frame}`}>
          Frame {frame}
        </div>
      </div>

      <div className="absolute bottom-4 right-4 flex gap-3 text-[10px] font-mono text-[var(--c-text-muted)] bg-black/50 px-3 py-1 rounded-md backdrop-blur border border-[var(--c-border-default)]/40 z-50" aria-label="Preview metadata">
        <span>24 fps</span>
        <span className="text-[var(--c-border-hover)]" aria-hidden="true">·</span>
        <span>12:04</span>
        <span className="text-[var(--c-border-hover)]" aria-hidden="true">·</span>
        <span>3840 × 2160</span>
      </div>
    </div>
  );
}
