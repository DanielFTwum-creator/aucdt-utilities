
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Timer, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  Flag, 
  Send,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { MOCK_QUESTIONS } from '../mockData';
import { QuestionType } from '../types';

interface CandidateQuizProps {
  onFinish: () => void;
}

const CandidateQuiz: React.FC<CandidateQuizProps> = ({ onFinish }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3600); // 60 mins
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAutoSubmit = () => {
    alert("Time's up! Your answers are being submitted.");
    onFinish();
  };

  const currentQuestion = MOCK_QUESTIONS[currentIdx];

  const handleResponse = (val: any) => {
    setResponses(prev => ({ ...prev, [currentQuestion.id]: val }));
  };

  const toggleFlag = () => {
    const newFlagged = new Set(flagged);
    if (newFlagged.has(currentQuestion.id)) {
      newFlagged.delete(currentQuestion.id);
    } else {
      newFlagged.add(currentQuestion.id);
    }
    setFlagged(newFlagged);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const progress = (Object.keys(responses).length / MOCK_QUESTIONS.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Quiz Header (Sticky) */}
      <div className="sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-10 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-full ${timeLeft < 300 ? 'bg-rose-100 text-rose-600 animate-pulse' : 'bg-indigo-100 text-indigo-600'}`}>
            <Timer size={24} />
          </div>
          <div>
            <p className="text-xs uppercase font-bold tracking-wider opacity-60">Time Remaining</p>
            <p className={`text-xl font-mono font-bold ${timeLeft < 300 ? 'text-rose-600' : 'text-slate-800 dark:text-slate-100'}`}>
              {formatTime(timeLeft)}
            </p>
          </div>
        </div>
        <div className="flex-1 mx-8 max-w-xs hidden sm:block">
          <div className="flex justify-between text-xs mb-1 font-bold">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        <button 
          onClick={() => setIsSubmitting(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-200 dark:shadow-none"
        >
          <Send size={18} />
          Submit Quiz
        </button>
      </div>

      {/* Question Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Section */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700">
            <div className="flex justify-between items-start mb-6">
              <span className="text-indigo-600 font-bold px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-sm">
                Question {currentIdx + 1} of {MOCK_QUESTIONS.length}
              </span>
              <button 
                onClick={toggleFlag}
                className={`p-2 rounded-lg transition-colors ${flagged.has(currentQuestion.id) ? 'bg-amber-100 text-amber-600' : 'text-slate-400 hover:bg-slate-100'}`}
              >
                <Flag size={20} fill={flagged.has(currentQuestion.id) ? 'currentColor' : 'none'} />
              </button>
            </div>
            
            <h2 className="text-xl font-semibold leading-relaxed mb-8">
              {currentQuestion.content}
            </h2>

            <div className="space-y-4">
              {currentQuestion.type === QuestionType.MCQ && currentQuestion.options?.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleResponse(option)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-4 group ${
                    responses[currentQuestion.id] === option 
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30' 
                    : 'border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500 bg-slate-50 dark:bg-slate-800'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                    responses[currentQuestion.id] === option 
                    ? 'border-indigo-600 bg-indigo-600 text-white' 
                    : 'border-slate-300 dark:border-slate-600 group-hover:border-slate-400'
                  }`}>
                    {responses[currentQuestion.id] === option && <CheckCircle size={14} />}
                  </div>
                  <span className="font-medium">{option}</span>
                </button>
              ))}

              {currentQuestion.type === QuestionType.CODE && (
                <textarea
                  className="w-full h-64 p-4 font-mono text-sm bg-slate-900 text-indigo-400 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner"
                  placeholder="// Enter your solution code here..."
                  value={responses[currentQuestion.id] || ''}
                  onChange={(e) => handleResponse(e.target.value)}
                />
              )}

              {currentQuestion.type === QuestionType.SCENARIO && (
                <textarea
                  className="w-full h-48 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="Type your detailed response here..."
                  value={responses[currentQuestion.id] || ''}
                  onChange={(e) => handleResponse(e.target.value)}
                />
              )}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button 
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx(prev => prev - 1)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-200 dark:hover:bg-slate-800"
            >
              <ChevronLeft size={20} />
              Previous
            </button>
            <div className="flex gap-2">
              {MOCK_QUESTIONS.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === currentIdx ? 'w-8 bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
              ))}
            </div>
            <button 
              disabled={currentIdx === MOCK_QUESTIONS.length - 1}
              onClick={() => setCurrentIdx(prev => prev + 1)}
              className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-indigo-700 shadow-lg shadow-indigo-100 dark:shadow-none"
            >
              Next
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Question Map */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 opacity-60">Question Map</h3>
            <div className="grid grid-cols-4 gap-2">
              {MOCK_QUESTIONS.map((q, i) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentIdx(i)}
                  className={`aspect-square rounded-lg flex items-center justify-center font-bold text-sm transition-all border-2 ${
                    currentIdx === i ? 'border-indigo-600 ring-2 ring-indigo-100 ring-offset-2 dark:ring-offset-slate-900' : 'border-transparent'
                  } ${
                    responses[q.id] ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                  } ${
                    flagged.has(q.id) ? 'bg-amber-400 text-white border-amber-400' : ''
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700 space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium">
                <div className="w-3 h-3 rounded bg-indigo-600"></div>
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium">
                <div className="w-3 h-3 rounded bg-slate-100 dark:bg-slate-700"></div>
                <span>Unanswered</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium">
                <div className="w-3 h-3 rounded bg-amber-400"></div>
                <span>Flagged</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl border border-indigo-100 dark:border-indigo-900/50">
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 mb-2">
              <HelpCircle size={18} />
              <span className="font-bold">Need Help?</span>
            </div>
            <p className="text-xs leading-relaxed text-indigo-600 dark:text-indigo-500">
              Your progress is auto-saved every 30 seconds. In case of disconnection, just refresh the page.
            </p>
          </div>
        </div>
      </div>

      {/* Submission Modal */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 max-w-md w-full rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={32} />
            </div>
            <h2 className="text-2xl font-bold text-center mb-2">Ready to submit?</h2>
            <p className="text-slate-500 dark:text-slate-400 text-center mb-8">
              You have {MOCK_QUESTIONS.length - Object.keys(responses).length} unanswered questions. Once submitted, you cannot change your answers.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setIsSubmitting(false)}
                className="flex-1 px-6 py-3 rounded-xl font-bold bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 transition-colors"
              >
                Go Back
              </button>
              <button 
                onClick={onFinish}
                className="flex-1 px-6 py-3 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none transition-all"
              >
                Confirm Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateQuiz;
