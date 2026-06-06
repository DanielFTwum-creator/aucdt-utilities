import React from 'react';

/**
 * Kanban-themed loading indicator: three mini columns whose cards animate "across"
 * the board (To Do → In Progress → Done), echoing the product. Pure CSS keyframes
 * injected once; respects prefers-reduced-motion.
 */
export default function KanbanLoader({ label = 'Loading…' }: { label?: string }) {
  return (
    <div style={wrap} role="status" aria-live="polite" aria-busy="true">
      <style>{KEYFRAMES}</style>
      <div style={board} aria-hidden="true">
        {[0, 1, 2].map(col => (
          <div key={col} style={column}>
            <span style={colBar} />
            {[0, 1, 2].map(card => (
              <span key={card} className="kl-card" style={{ ...cardDot, animationDelay: `${col * 0.18 + card * 0.12}s` }} />
            ))}
          </div>
        ))}
      </div>
      <span style={text}>{label}</span>
    </div>
  );
}

const KEYFRAMES = `
@keyframes klPulse {
  0%, 100% { opacity: 0.25; transform: translateY(0); }
  40%      { opacity: 1;    transform: translateY(-3px); }
}
.kl-card { animation: klPulse 1.4s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) {
  .kl-card { animation: none; opacity: 0.6; }
}
`;

const wrap: React.CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: '48px 0' };
const board: React.CSSProperties = { display: 'flex', gap: 10 };
const column: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
  width: 46, padding: '8px 6px', borderRadius: 8,
  background: 'var(--bg)', border: '1px solid var(--border)',
};
const colBar: React.CSSProperties = { width: 26, height: 4, borderRadius: 999, background: 'var(--tuc-maroon)', opacity: 0.7, marginBottom: 2 };
const cardDot: React.CSSProperties = { width: 30, height: 10, borderRadius: 3, background: 'var(--tuc-gold)' };
const text: React.CSSProperties = { fontSize: 13, color: 'var(--muted)' };
