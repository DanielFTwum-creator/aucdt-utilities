import { useState, useEffect } from 'react';
import { Bookmark, CheckSquare, Square, Calendar, Users, HelpCircle, Save, CheckCircle, Smartphone, Award, Clock } from 'lucide-react';
import { CommitmentState } from '../types';

export default function CommitmentTracker() {
  const [commitment, setCommitment] = useState<CommitmentState>(() => {
    const saved = localStorage.getItem('tuc_commitment');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // use default
      }
    }
    return {
      task30Days: '',
      colleagueShow: '',
      questionBlocker: '',
      weeksProgress: {
        week1: false,
        week2: false,
        week3: false,
        week4: false,
      }
    };
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleTextChange = (field: keyof Omit<CommitmentState, 'weeksProgress'>, value: string) => {
    setCommitment((prev) => ({ ...prev, [field]: value }));
    setSavedSuccess(false);
  };

  const handleToggleWeek = (week: keyof CommitmentState['weeksProgress']) => {
    setCommitment((prev) => {
      const updated = {
        ...prev,
        weeksProgress: {
          ...prev.weeksProgress,
          [week]: !prev.weeksProgress[week]
        }
      };
      localStorage.setItem('tuc_commitment', JSON.stringify(updated));
      return updated;
    });
  };

  const handleSave = () => {
    localStorage.setItem('tuc_commitment', JSON.stringify(commitment));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const completedWeeksCount = Object.values(commitment.weeksProgress).filter(Boolean).length;

  return (
    <section className="bg-white border border-editorial-border rounded-2xl p-6 sm:p-8 space-y-8">
      {/* Block Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-editorial-border">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-editorial-accent flex items-center gap-2">
            Your 30-Day Commitment
          </h2>
          <p className="text-sm text-editorial-text-medium font-sans">Solidify your AI integration plan and track weekly accomplishments.</p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-editorial-secondary border border-editorial-border rounded-lg text-xs text-editorial-accent font-bold uppercase tracking-wider font-sans">
          <Award size={14} className="text-editorial-gold" />
          <span>Onboarding Progress</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Commitment Form Card */}
        <div className="lg:col-span-7 bg-editorial-secondary/20 border border-editorial-border rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-editorial-accent/10 text-editorial-accent">
              <Bookmark size={15} />
            </span>
            <h3 className="text-xs font-bold text-editorial-accent font-serif uppercase tracking-wider">Commitment Statement</h3>
          </div>

          <div className="space-y-4 font-sans">
            {/* Field 1 */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-editorial-text-dark flex items-center gap-2 font-serif uppercase tracking-wider">
                <Calendar size={13} className="text-editorial-gold" />
                1. One task I will do with AI every week for the next 30 days:
              </label>
              <textarea
                rows={2}
                value={commitment.task30Days}
                onChange={(e) => handleTextChange('task30Days', e.target.value)}
                placeholder="e.g. Generate weekly formative quizzes for HND portfolios"
                className="w-full text-xs font-sans rounded-lg border border-editorial-border px-3.5 py-2.5 focus:ring-2 focus:ring-editorial-accent/10 focus:border-editorial-accent outline-none text-editorial-text-dark bg-white"
              />
            </div>

            {/* Field 2 */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-editorial-text-dark flex items-center gap-2 font-serif uppercase tracking-wider">
                <Users size={13} className="text-editorial-gold" />
                2. One colleague I will show it to before end of month:
              </label>
              <input
                type="text"
                value={commitment.colleagueShow}
                onChange={(e) => handleTextChange('colleagueShow', e.target.value)}
                placeholder="e.g. Dr. Abigail Ankomah (Head of Department)"
                className="w-full text-xs font-sans rounded-lg border border-editorial-border px-3.5 py-2.5 focus:ring-2 focus:ring-editorial-accent/10 focus:border-editorial-accent outline-none text-editorial-text-dark bg-white"
              />
            </div>

            {/* Field 3 */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-editorial-text-dark flex items-center gap-2 font-serif uppercase tracking-wider">
                <HelpCircle size={13} className="text-editorial-gold" />
                3. One question or blocker for the ICT team:
              </label>
              <input
                type="text"
                value={commitment.questionBlocker}
                onChange={(e) => handleTextChange('questionBlocker', e.target.value)}
                placeholder="e.g. How to obtain official Canva Educational credentials"
                className="w-full text-xs font-sans rounded-lg border border-editorial-border px-3.5 py-2.5 focus:ring-2 focus:ring-editorial-accent/10 focus:border-editorial-accent outline-none text-editorial-text-dark bg-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-editorial-border/60">
            <span className="text-[10px] text-editorial-text-light font-sans">Values are securely saved to your local storage.</span>
            <button
              onClick={handleSave}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                savedSuccess
                  ? 'bg-[#137333] text-white'
                  : 'bg-editorial-accent text-white hover:bg-editorial-accent/90'
              }`}
            >
              {savedSuccess ? (
                <>
                  <CheckCircle size={13} />
                  <span>Commitment Locked!</span>
                </>
              ) : (
                <>
                  <Save size={13} />
                  <span>Lock Commitment</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Calendar and Weekly Rhythm */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-editorial-accent/10 text-editorial-accent">
                <Clock size={15} />
              </span>
              <h3 className="text-xs font-bold text-editorial-accent font-serif uppercase tracking-wider">Your Weekly Rhythm</h3>
            </div>

            <div className="space-y-3.5">
              {/* Week 1 */}
              <button
                onClick={() => handleToggleWeek('week1')}
                className={`w-full flex items-start gap-3.5 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  commitment.weeksProgress.week1
                    ? 'bg-[#E6F4EA] border-[#B7E1CD] text-[#137333]'
                    : 'bg-white border-editorial-border hover:border-editorial-text-muted text-editorial-text-medium'
                }`}
              >
                <div className="mt-0.5">
                  {commitment.weeksProgress.week1 ? (
                    <CheckSquare size={16} className="text-[#137333]" />
                  ) : (
                    <Square size={16} className="text-editorial-text-muted" />
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-serif uppercase tracking-wider">Week 1 Rhythm</span>
                    {commitment.weeksProgress.week1 && <span className="text-[9px] font-bold bg-[#137333]/10 text-[#137333] px-1.5 py-0.5 rounded uppercase font-sans">Done</span>}
                  </div>
                  <p className="text-[11px] text-editorial-text-light leading-normal font-sans">
                    Use your chosen AI workspace workflow twice. Keep and save the resulting syllabus/quizzes.
                  </p>
                </div>
              </button>

              {/* Week 2 */}
              <button
                onClick={() => handleToggleWeek('week2')}
                className={`w-full flex items-start gap-3.5 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  commitment.weeksProgress.week2
                    ? 'bg-[#E6F4EA] border-[#B7E1CD] text-[#137333]'
                    : 'bg-white border-editorial-border hover:border-editorial-text-muted text-editorial-text-medium'
                }`}
              >
                <div className="mt-0.5">
                  {commitment.weeksProgress.week2 ? (
                    <CheckSquare size={16} className="text-[#137333]" />
                  ) : (
                    <Square size={16} className="text-editorial-text-muted" />
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-serif uppercase tracking-wider">Week 2 Rhythm</span>
                    {commitment.weeksProgress.week2 && <span className="text-[9px] font-bold bg-[#137333]/10 text-[#137333] px-1.5 py-0.5 rounded uppercase font-sans">Done</span>}
                  </div>
                  <p className="text-[11px] text-editorial-text-light leading-normal font-sans">
                    Show one colleague in your department. Do it <strong>with them</strong>, not for them.
                  </p>
                </div>
              </button>

              {/* Week 3 */}
              <button
                onClick={() => handleToggleWeek('week3')}
                className={`w-full flex items-start gap-3.5 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  commitment.weeksProgress.week3
                    ? 'bg-[#E6F4EA] border-[#B7E1CD] text-[#137333]'
                    : 'bg-white border-editorial-border hover:border-editorial-text-muted text-editorial-text-medium'
                }`}
              >
                <div className="mt-0.5">
                  {commitment.weeksProgress.week3 ? (
                    <CheckSquare size={16} className="text-[#137333]" />
                  ) : (
                    <Square size={16} className="text-editorial-text-muted" />
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-serif uppercase tracking-wider">Week 3 Rhythm</span>
                    {commitment.weeksProgress.week3 && <span className="text-[9px] font-bold bg-[#137333]/10 text-[#137333] px-1.5 py-0.5 rounded uppercase font-sans">Done</span>}
                  </div>
                  <p className="text-[11px] text-editorial-text-light leading-normal font-sans">
                    Try one advanced block that you didn't master today (e.g. multi-step sequential instructions).
                  </p>
                </div>
              </button>

              {/* Week 4 */}
              <button
                onClick={() => handleToggleWeek('week4')}
                className={`w-full flex items-start gap-3.5 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  commitment.weeksProgress.week4
                    ? 'bg-[#E6F4EA] border-[#B7E1CD] text-[#137333]'
                    : 'bg-white border-editorial-border hover:border-editorial-text-muted text-editorial-text-medium'
                }`}
              >
                <div className="mt-0.5">
                  {commitment.weeksProgress.week4 ? (
                    <CheckSquare size={16} className="text-[#137333]" />
                  ) : (
                    <Square size={16} className="text-editorial-text-muted" />
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-serif uppercase tracking-wider">Week 4 Rhythm</span>
                    {commitment.weeksProgress.week4 && <span className="text-[9px] font-bold bg-[#137333]/10 text-[#137333] px-1.5 py-0.5 rounded uppercase font-sans">Done</span>}
                  </div>
                  <p className="text-[11px] text-editorial-text-light leading-normal font-sans">
                    Report back to the ICT Department what worked, what didn't, and what your department needs.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Onboarding support banner */}
          <div className="p-4 rounded-xl bg-editorial-secondary border border-editorial-border space-y-2">
            <h4 className="text-xs font-bold text-editorial-accent font-serif uppercase tracking-wider flex items-center gap-1.5">
              <Smartphone size={13} className="text-editorial-gold" />
              TUC Onboarding Support
            </h4>
            <ul className="text-[11px] text-editorial-text-medium space-y-1 font-sans">
              <li>• Templates from today are sent to the Staff WhatsApp / email.</li>
              <li>• <strong>ICT Drop-In support:</strong> every Saturday, 9:00 AM (ICT Dept).</li>
              <li>• <strong>Next Session:</strong> Agentic Workflows deep-dive.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
