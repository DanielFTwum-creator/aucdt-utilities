import { Trait } from '../types';
import TraitPool from './TraitPool';
import { ChevronUp, ChevronDown, X } from 'lucide-react';

export default function Phase1({
  selected,
  onAdd,
  onRemove,
  onMove,
  onNext
}: {
  selected: Trait[],
  onAdd: (t: Trait) => void,
  onRemove: (t: Trait) => void,
  onMove: (index: number, direction: number) => void,
  onNext: () => void
}) {
  return (
    <>
      <section className="trait-library bg-surface rounded-3xl border border-border p-8 flex flex-col gap-6 overflow-hidden">
        <TraitPool onSelect={onAdd} />
      </section>
      <section className="selection-sidebar flex flex-col gap-4">
        <div className="rank-list bg-surface rounded-3xl border border-border p-6 flex-1 flex flex-col gap-2">
           <h3 className="text-xs uppercase tracking-[1px] text-text-dim mb-2">Ranked Traits</h3>
           <ul className="flex flex-col gap-2 overflow-y-auto">
             {selected.map((t, i) => (
               <li key={t.id} className="rank-item filled flex items-center gap-3 bg-white/5 border border-border rounded-lg px-3 h-10 text-xs">
                 <span className="font-mono text-accent w-4 mr-3">{String(i + 1).padStart(2, '0')}</span>
                 <span className="text-lg">{t.emoji}</span>
                 <span className="flex-1">{t.label}</span>
                 <button onClick={() => onMove(i, -1)} disabled={i === 0}>▲</button>
                 <button onClick={() => onMove(i, 1)} disabled={i === selected.length - 1}>▼</button>
                 <button onClick={() => onRemove(t)}>✕</button>
               </li>
             ))}
             {Array.from({ length: 10 - selected.length }).map((_, i) => (
                <div key={i} className="rank-item h-10 border border-dashed border-border rounded-lg px-3 flex items-center text-xs text-text-dim">
                  <span className="font-mono text-accent w-4 mr-3">{String(selected.length + i + 1).padStart(2, '0')}</span>
                </div>
             ))}
           </ul>
        </div>
        <div className="action-panel flex flex-col gap-3">
           <div className="flex justify-between text-xs mb-1">
             <span className="text-text-dim">Selection Progress</span>
             <span className="font-bold">{selected.length}/10</span>
           </div>
           <div className="progress-bar h-1 bg-border rounded-full overflow-hidden">
             <div className="progress-fill h-full bg-accent" style={{width: `${(selected.length/10)*100}%`}}></div>
           </div>
           {selected.length === 10 ? (
             <button onClick={onNext} className="btn bg-text-main text-bg p-4 rounded-xl font-bold uppercase tracking-[1px] text-sm cursor-pointer w-full">Choose My Top 3</button>
           ) : (
             <button className="btn disabled bg-border text-text-dim p-4 rounded-xl font-bold uppercase tracking-[1px] text-sm w-full cursor-not-allowed">Choose My Top 3</button>
           )}
        </div>
      </section>
    </>
  );
}
