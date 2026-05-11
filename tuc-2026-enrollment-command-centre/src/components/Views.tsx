import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  CornerDownRight, 
  Smartphone, 
  Home,
  Check
} from "lucide-react";
import { 
  WEEKS, 
  SEGMENTS, 
  FUNNEL_DATA, 
  CHECKLIST_SECTIONS 
} from "../data/planData";

export const TimelineView: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-5 gap-4">
        <div />
        {['Marketing', 'Admissions', 'Community', 'Ops/Systems'].map((head) => (
          <div key={head} className="px-2 text-[10px] font-bold tracking-widest text-text-muted uppercase">
            {head}
          </div>
        ))}
      </div>
      
      <div className="space-y-3">
        {WEEKS.map((w, idx) => (
          <div key={idx} className="grid grid-cols-5 gap-3">
            <div className="flex flex-col justify-center rounded-xl bg-card border border-border px-4 py-3 shadow-sm">
              <div className="text-sm font-bold text-text">{w.wk}</div>
              <div className="text-[10px] text-text-muted uppercase tracking-wider">{w.dt}</div>
            </div>
            <div className="rounded-xl border border-blue-border bg-blue-bg p-4 text-xs leading-relaxed text-blue-text">
              {w.blue}
            </div>
            <div className="rounded-xl border border-teal-border bg-teal-bg p-4 text-xs leading-relaxed text-teal-text">
              {w.teal}
            </div>
            <div className={`rounded-xl p-4 text-xs leading-relaxed ${w.amber ? 'border border-amber-border bg-amber-bg text-amber-text' : 'bg-card border border-border/50 opacity-20'}`}>
              {w.amber}
            </div>
            <div className="rounded-xl border border-purple-border bg-purple-bg p-4 text-xs leading-relaxed text-purple-text">
              {w.purple}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export const SegmentsView: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid gap-6 md:grid-cols-3"
    >
      {SEGMENTS.map((s, idx) => (
        <div key={idx} className="group relative overflow-hidden rounded-3xl border border-border bg-card p-8 pt-12 transition-all hover:bg-bg">
          <div 
            className="absolute top-0 left-0 h-1.5 w-full opacity-50" 
            style={{ backgroundColor: `var(--color-${s.iconClass}-text)` }}
          />
          
          <div 
            className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl ring-1 transition-transform group-hover:scale-110"
            style={{ 
              backgroundColor: `var(--color-${s.iconClass}-bg)`,
              color: `var(--color-${s.iconClass}-text)`,
              borderColor: `var(--color-${s.iconClass}-border)`
            }}
          >
            <s.icon className="h-6 w-6" />
          </div>
          
          <h3 className="mb-2 text-xl font-medium text-text">{s.title}</h3>
          <div className="mb-8 rounded-2xl border-l-2 border-accent bg-bg px-4 py-3 text-sm italic leading-relaxed text-text-muted">
            {s.mindset}
          </div>
          
          <div className="space-y-4">
            {s.items.map((item, iidx) => (
              <div key={iidx} className="flex gap-3 text-sm leading-relaxed text-text-muted">
                <CornerDownRight className="mt-1 h-3 w-3 shrink-0 opacity-40" />
                <span>
                  {item.t} <span className="ml-2 inline-block rounded-full border border-blue-border bg-blue-bg px-2.5 py-0.5 text-[10px] font-bold text-blue-text">{item.tag}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  );
};

export const FunnelView: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12"
    >
      <div className="rounded-3xl border border-border bg-card p-10">
        <div className="mb-10 max-w-xl">
          <h3 className="mb-3 text-2xl font-medium text-text italic font-serif underline decoration-accent/30 underline-offset-8">Conversion Gap Analysis</h3>
          <p className="text-sm leading-relaxed text-text-muted">
            Applications drop from 75% to 18% at two critical stages. The tactical fixes below target the "Silence Gap" and "Parent Trust" bottlenecks.
          </p>
        </div>
        
        <div className="space-y-6">
          {FUNNEL_DATA.map((f, idx) => (
            <div key={idx} className="flex items-center gap-6">
              <div className="w-24 shrink-0 text-right text-xs font-bold tracking-widest text-text-muted uppercase">{f.label}</div>
              <div className="relative flex-1">
                <div className="h-10 w-full overflow-hidden rounded-xl bg-bg border border-border">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${f.pct}%` }}
                    transition={{ duration: 1, delay: idx * 0.1 }}
                    className="flex h-full items-center px-4" 
                    style={{ background: f.fill, border: `1px solid ${f.stroke}` }}
                  >
                    <span className="text-xs font-bold" style={{ color: f.textCol }}>{f.pct}%</span>
                  </motion.div>
                </div>
              </div>
              <div className="w-32 shrink-0">
                {f.badge && (
                  <span className={`inline-block rounded-full px-4 py-1.5 text-[10px] font-bold border ${
                    f.badge.includes('⚠') 
                    ? 'bg-amber-bg text-amber-text border-amber-border' 
                    : 'bg-blue-bg text-blue-text border-blue-border'
                  }`}>
                    {f.badge}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-border bg-card p-8 transition-colors hover:border-accent/30">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-bg text-blue-text border border-blue-border">
              <Smartphone className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-text">Fix 1: Post-Apply Silence</h4>
          </div>
          <p className="mb-6 text-xs text-text-muted">7-day automated WhatsApp nurture sequence to reduce lead decay.</p>
          <div className="space-y-3">
            {[1, 3, 5, 7].map((day, d) => (
              <div key={day} className="flex gap-3 text-xs leading-relaxed text-text-muted">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-bg font-bold text-blue-text border border-blue-border">{d+1}</span>
                <span><strong className="text-text">Day {day}:</strong> {['Confirm next steps', 'Share student spotlight', 'Virtual tour invite', 'Personal call'][d]}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="rounded-3xl border border-border bg-card p-8 transition-colors hover:border-amber-border/30">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-bg text-amber-text border border-amber-border">
              <Home className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-text">Fix 2: Parent Buy-In</h4>
          </div>
          <p className="mb-6 text-xs text-text-muted">Targeted collateral for parents addressing accreditation and career ROI.</p>
          <div className="space-y-3">
            {['Parent Info Pack (PDF)', 'Virtual Parent Night', 'In-person Q&A', 'Testimonial Drive'].map((step, s) => (
              <div key={s} className="flex gap-3 text-xs leading-relaxed text-text-muted">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-bg font-bold text-amber-text border border-amber-border">{String.fromCharCode(65+s)}</span>
                <span className="text-text">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const ChecklistView: React.FC = () => {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  
  const totalItems = CHECKLIST_SECTIONS.reduce((acc, sec) => acc + sec.items.length, 0);
  const doneCount = completed.size;
  const progressPct = Math.round((doneCount / totalItems) * 100);

  const toggleTask = (id: string) => {
    const next = new Set(completed);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setCompleted(next);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="rounded-3xl bg-blue-bg border border-blue-border p-8 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-medium text-text italic font-serif">Week 1 Readiness</h3>
            <p className="text-xs text-text-muted mt-1">Foundation tasks to secure the funnel</p>
          </div>
          <div className="text-right">
            <div className="font-mono text-3xl font-light text-text">{progressPct}%</div>
            <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{doneCount} of {totalItems} Complete</div>
          </div>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-bg border border-border">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            className="h-full bg-accent shadow-[0_0_20px_rgba(99,102,241,0.3)]" 
          />
        </div>
      </div>

      <div className="space-y-8">
        {CHECKLIST_SECTIONS.map((sec, si) => (
          <div key={si}>
            <div className="mb-4 flex items-center gap-3">
              <div className="text-[10px] font-bold tracking-widest text-text-muted uppercase">{sec.label}</div>
              <span className={`rounded-full border px-3 py-0.5 text-[9px] font-bold uppercase transition-colors ${sec.badgeClass}`}>{sec.badge}</span>
            </div>
            <div className="space-y-2">
              {sec.items.map((it, ii) => {
                const id = `${si}-${ii}`;
                const isDone = completed.has(id);
                return (
                  <button
                    key={id}
                    onClick={() => toggleTask(id)}
                    className={`flex w-full items-start gap-4 rounded-2xl border px-6 py-5 text-left transition-all ${
                      isDone 
                        ? "border-teal-border bg-teal-bg opacity-50" 
                        : "border-border bg-card shadow-sm hover:border-accent/40 hover:bg-bg"
                    }`}
                  >
                    <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-colors ${
                      isDone ? "border-green bg-green text-white" : "border-border"
                    }`}>
                      {isDone && <Check className="h-4 w-4" strokeWidth={3} />}
                    </div>
                    <div>
                      <div className={`text-sm font-medium transition-all ${isDone ? "text-text-muted line-through" : "text-text"}`}>
                        {it.t}
                      </div>
                      <div className="mt-1 text-[10px] font-bold tracking-wider text-text-muted uppercase">{it.meta}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export const AdminView: React.FC = () => {
  const [passcode, setPasscode] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [logs, setLogs] = useState<{ id: string; action: string; time: string }[]>([
    { id: "1", action: "System initialized", time: "2026-05-11 10:00" },
    { id: "2", action: "Timeline baseline generated", time: "2026-05-11 10:05" },
  ]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "TUC2026") {
      setIsUnlocked(true);
      setLogs(prev => [{
        id: Math.random().toString(),
        action: "Admin terminal accessed",
        time: new Date().toLocaleTimeString()
      }, ...prev]);
    } else {
      alert("Invalid Command Key");
    }
  };

  if (!isUnlocked) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-8">
        <div className="w-full max-w-md rounded-3xl border border-border bg-card p-10 text-center backdrop-blur-xl shadow-xl">
          <h2 className="mb-2 text-2xl font-serif text-text italic underline decoration-accent/30 underline-offset-8">Command Node</h2>
          <p className="mb-8 text-sm text-text-muted">Restricted access area. Enter tactical authorization key.</p>
          <form onSubmit={handleUnlock} className="space-y-4">
            <input
              type="password"
              placeholder="Authorization Key"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full rounded-xl border border-border bg-bg px-6 py-4 text-center text-sm tracking-widest text-text placeholder:text-text-muted focus:border-accent focus:outline-none transition-all"
            />
            <button
              type="submit"
              className="w-full rounded-xl bg-accent py-4 text-sm font-bold text-white shadow-lg shadow-accent/20 transition-all hover:bg-accent-hover active:scale-95"
            >
              Verify Authority
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-border bg-card p-8 transition-colors hover:border-accent/30 shadow-sm">
          <h3 className="mb-6 font-bold text-text">System Overrides</h3>
          <div className="space-y-4">
            <button className="w-full rounded-xl bg-bg border border-border px-6 py-4 text-left text-sm font-medium text-text-muted transition-all hover:bg-red/10 hover:text-red hover:border-red/30">
              Reset Campaign State
            </button>
            <button className="w-full rounded-xl bg-bg border border-border px-6 py-4 text-left text-sm font-medium text-text-muted transition-all hover:bg-green/10 hover:text-green hover:border-green/30">
              Broadcast Enrollment Alert
            </button>
          </div>
        </div>
        
        <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
          <h3 className="mb-6 font-bold text-text">Audit Log</h3>
          <div className="space-y-3 font-mono text-[10px]">
            {logs.map((log) => (
              <div key={log.id} className="flex justify-between border-b border-border pb-2 text-text-muted">
                <span className="text-accent">{log.action}</span>
                <span>{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
