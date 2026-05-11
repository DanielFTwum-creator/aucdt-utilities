import { Trait } from '../types';

export default function Phase2({
  top10,
  selectedTop3,
  onToggle,
  onNext
}: {
  top10: Trait[],
  selectedTop3: Trait[],
  onToggle: (t: Trait) => void,
  onNext: () => void
}) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold">Phase 2: Refinement</h2>
      <p className="text-text-dim">Select your Top 3 from your Top 10.</p>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {top10.map(t => {
          const isSelected = selectedTop3.find(s => s.id === t.id);
          return (
            <button
              key={t.id}
              onClick={() => onToggle(t)}
              className={`p-4 rounded-xl border ${isSelected ? 'border-accent bg-accent text-white' : 'border-border bg-surface text-text-main'} hover:border-text-dim`}
            >
              <div className="text-4xl mb-2">{t.emoji}</div>
              <div className="font-bold">{t.label}</div>
            </button>
          );
        })}
      </div>
      
      {selectedTop3.length === 3 && (
        <button onClick={onNext} className="btn bg-text-main text-bg p-4 rounded-xl font-bold uppercase tracking-[1px] text-sm mt-6 w-full max-w-sm">Reveal My Parachute</button>
      )}
    </div>
  );
}
