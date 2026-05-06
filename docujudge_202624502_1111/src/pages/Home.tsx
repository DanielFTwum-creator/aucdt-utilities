import { useState, useEffect } from 'react';
import { FORM_SECTIONS } from '@/constants';
import EvaluationSection from '@/components/EvaluationSection';
import Summary from '@/components/Summary';
import { submissionService } from '@/services/submissionService';
import { auditService } from '@/services/auditService';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';

export default function Home() {
  const [scores, setScores] = useState<Record<string, Record<string, number>>>(() => {
    try {
      const saved = localStorage.getItem('docujudge-data');
      if (!saved) return {};
      const parsed = JSON.parse(saved);
      // Basic validation: ensure it's an object and values are numbers
      if (typeof parsed !== 'object' || parsed === null) return {};
      
      // Deep sanitize: ensure all nested values are numbers
      const sanitized: Record<string, Record<string, number>> = {};
      for (const [sectionId, sectionScores] of Object.entries(parsed)) {
        if (typeof sectionScores === 'object' && sectionScores !== null) {
          sanitized[sectionId] = {};
          for (const [criterionId, score] of Object.entries(sectionScores as Record<string, any>)) {
            const num = Number(score);
            if (!isNaN(num)) {
              sanitized[sectionId][criterionId] = num;
            }
          }
        }
      }
      return sanitized;
    } catch {
      return {};
    }
  });

  const [applicantId, setApplicantId] = useState('');
  const [judgeName, setJudgeName] = useState('');
  const [judgeEmail, setJudgeEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    localStorage.setItem('docujudge-data', JSON.stringify(scores));
  }, [scores]);

  const handleScoreChange = (sectionId: string, criterionId: string, value: number) => {
    setScores((prev) => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [criterionId]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    if (!applicantId || !judgeName || !judgeEmail) {
      setMessage({ type: 'error', text: 'MISSING REQUIRED FIELDS' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const result = await submissionService.submitEvaluation(applicantId, judgeName, judgeEmail, scores, feedback);

      if (result.status === 'success') {
        auditService.log('submission', `Evaluation submitted for ${applicantId} by ${judgeName}`);
        setMessage({ type: 'success', text: 'EVALUATION SUBMITTED SUCCESSFULLY' });
        localStorage.removeItem('docujudge-data');
        setScores({});
        setApplicantId('');
        setFeedback('');
      } else {
        const errorMessage = result.error || 'SUBMISSION FAILED. TRY AGAIN.';
        setMessage({ type: 'error', text: errorMessage });
        auditService.log('submission_error', `Failed submission for ${applicantId}: ${errorMessage}`);
      }
    } catch (error: any) {
      console.error(error);
      setMessage({ type: 'error', text: 'UNEXPECTED ERROR OCCURRED.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary selection:bg-accent-red selection:text-white">
      {/* MASTHEAD */}
      <header className="border-b-[3px] border-double border-border-subtle bg-bg-primary sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex flex-col justify-center">
          <div className="flex justify-between items-end">
            <div className="flex items-center gap-4">
              <img 
                src="https://techbridge.edu.gh/static/TUC_LOGO_1.png" 
                alt="DocuJudge Logo" 
                className="h-16 object-contain"
                referrerPolicy="no-referrer"
              />
              <h1 className="text-5xl font-display font-black tracking-tighter uppercase leading-none">
                <span className="text-white">DOCU</span>
                <span className="text-accent-red">JUDGE</span>
              </h1>
            </div>
            <Link to="/admin" className="text-text-muted hover:text-accent-red transition-colors mb-1">
              <Settings size={20} />
            </Link>
          </div>
          <div className="flex justify-between items-center mt-2 border-t border-border-subtle pt-1">
            <span className="font-label text-[10px] tracking-[3px] text-text-label uppercase">
              VOL. 2026 ✦ {new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' }).toUpperCase()} ✦ EDITION ▸▸▸▸
            </span>
            <span className="font-label text-[10px] tracking-[3px] text-accent-red uppercase">
              CONFIDENTIAL
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* LEFT COLUMN: CONTENT */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-12"
          >
            {/* PROJECT DETAILS SECTION */}
            <section className="bg-bg-card text-black">
              <div className="bg-bg-elevated px-4 py-2 flex justify-between items-center border-l-4 border-accent-red">
                <h2 className="font-mono text-white text-lg uppercase tracking-wide">
                  INT. PROJECT DETAILS — DAY
                </h2>
                <span className="font-mono text-accent-red font-bold">SC. 01</span>
              </div>
              
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block font-label text-[9px] tracking-[3px] text-text-label uppercase">
                    Applicant ID
                  </label>
                  <input
                    type="text"
                    value={applicantId}
                    onChange={(e) => setApplicantId(e.target.value)}
                    className="w-full bg-transparent border-b border-gray-400 font-input text-xl text-black focus:border-accent-red focus:outline-none transition-colors pb-1 placeholder-gray-400"
                    placeholder="APP-XXXX"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block font-label text-[9px] tracking-[3px] text-text-label uppercase">
                    Judge Name
                  </label>
                  <input
                    type="text"
                    value={judgeName}
                    onChange={(e) => setJudgeName(e.target.value)}
                    className="w-full bg-transparent border-b border-gray-400 font-input text-xl text-black focus:border-accent-red focus:outline-none transition-colors pb-1 placeholder-gray-400"
                    placeholder="FULL NAME"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="block font-label text-[9px] tracking-[3px] text-text-label uppercase">
                    Judge Email
                  </label>
                  <input
                    type="email"
                    value={judgeEmail}
                    onChange={(e) => setJudgeEmail(e.target.value)}
                    className="w-full bg-transparent border-b border-gray-400 font-input text-xl text-black focus:border-accent-red focus:outline-none transition-colors pb-1 placeholder-gray-400"
                    placeholder="EMAIL@ADDRESS.COM"
                  />
                </div>
              </div>
            </section>

            {/* EVALUATION SECTIONS */}
            {FORM_SECTIONS.map((section, index) => (
              <EvaluationSection
                key={section.id}
                section={section}
                scores={scores[section.id] || {}}
                onScoreChange={(criterionId, val) => handleScoreChange(section.id, criterionId, val)}
                sceneNumber={index + 2}
              />
            ))}

            {/* FEEDBACK SECTION */}
            <section className="bg-bg-card text-black">
              <div className="bg-bg-elevated px-4 py-2 flex justify-between items-center border-l-4 border-accent-red">
                <h2 className="font-mono text-white text-lg uppercase tracking-wide">
                  EXT. FINAL NOTES — DUSK
                </h2>
                <span className="font-mono text-accent-red font-bold">SC. {FORM_SECTIONS.length + 2}</span>
              </div>
              <div className="p-8">
                <div className="flex justify-between items-end mb-2">
                  <label className="block font-label text-[9px] tracking-[3px] text-text-label uppercase">
                    Qualitative Feedback
                  </label>
                  <span className="font-label text-[9px] text-text-label">
                    {feedback.length} CHARS
                  </span>
                </div>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={6}
                  className="w-full bg-transparent border-b border-gray-400 font-input text-lg text-black focus:border-accent-red focus:outline-none transition-colors resize-none placeholder-gray-400 leading-relaxed"
                  placeholder="TYPEWRITER NOTES..."
                />
              </div>
            </section>
          </motion.div>

          {/* RIGHT COLUMN: VERDICT PANEL */}
          <div className="lg:col-span-1">
            <Summary 
              scores={scores} 
              onSubmit={handleSubmit} 
              isSubmitting={isSubmitting}
              message={message}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
