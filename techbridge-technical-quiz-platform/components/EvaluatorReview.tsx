
import React, { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  Award, 
  ArrowRight,
  Code,
  FileText,
  Star
} from 'lucide-react';
import { MOCK_QUESTIONS } from '../mockData';
import { QuestionType } from '../types';

const EvaluatorReview: React.FC = () => {
  const [selectedAssessment, setSelectedAssessment] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, string>>({});

  const candidates = [
    { name: 'Alex Rivera', role: 'Senior Java Dev', score: 85, status: 'Needs Review', submitted: '2h ago' },
    { name: 'Sarah Chen', role: 'Full Stack Engineer', score: 92, status: 'Reviewed', submitted: '4h ago' },
    { name: 'John Doe', role: 'Backend Lead', score: 64, status: 'Needs Review', submitted: '1d ago' },
  ];

  // For demo, we show the first subjective question
  const subjectQuestion = MOCK_QUESTIONS.find(q => q.type === QuestionType.CODE || q.type === QuestionType.SCENARIO);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar - Review Queue */}
      <div className="lg:col-span-1 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider opacity-60 px-2">Review Queue</h3>
        <div className="space-y-2">
          {candidates.map((cand, i) => (
            <button
              key={i}
              onClick={() => setSelectedAssessment(i)}
              className={`w-full text-left p-4 rounded-2xl border transition-all ${
                selectedAssessment === i 
                ? 'bg-indigo-50 border-indigo-200 ring-2 ring-indigo-100 dark:bg-indigo-900/30 dark:border-indigo-700' 
                : 'bg-white border-slate-100 dark:bg-slate-800 dark:border-slate-700 hover:border-slate-200'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <p className="font-bold truncate">{cand.name}</p>
                <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold ${cand.status === 'Reviewed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {cand.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-2">{cand.role}</p>
              <div className="flex justify-between items-center text-[10px] font-bold opacity-60">
                <span>Objective: {cand.score}%</span>
                <span>{cand.submitted}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Review Workspace */}
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                <Award size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold">{candidates[selectedAssessment].name}</h2>
                <p className="text-sm text-slate-500">Evaluation: Full Stack Java Assessment v1</p>
              </div>
            </div>
            <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all">
              Finalize & Release
            </button>
          </div>

          <div className="p-8 space-y-8">
            {/* Question Breakdown */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Code size={20} /></span>
                  <h3 className="font-bold text-lg">Question 2: Coding Challenge</h3>
                </div>
                <div className="flex items-center gap-2">
                   <span className="text-sm font-semibold opacity-60">Weight: 25 pts</span>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-wider opacity-60">Candidate Response</h4>
                  <div className="p-6 bg-slate-900 text-indigo-300 font-mono text-xs rounded-2xl shadow-inner leading-relaxed">
                    <pre>{`@GetMapping("/{id}")
public User fetchUser(@PathVariable Long id) {
  return service.find(id);
  // I would also add error handling here
  // maybe a try catch block
}`}</pre>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-wider opacity-60">Ideal Solution / Rubric</h4>
                  <div className="p-6 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-800 dark:text-emerald-400 font-mono text-xs rounded-2xl border border-emerald-100 dark:border-emerald-900/50 leading-relaxed">
                    <pre>{`@GetMapping("/{id}")
public ResponseEntity<User> getUser(@PathVariable Long id) {
  return repository.findById(id)
    .map(ResponseEntity::ok)
    .orElse(ResponseEntity.notFound().build());
}`}</pre>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-100 dark:border-slate-700">
                <div className="md:col-span-2 space-y-4">
                  <h4 className="text-sm font-bold flex items-center gap-2"><MessageSquare size={16} /> Feedback for Candidate</h4>
                  <textarea 
                    className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl min-h-[100px] outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    placeholder="Enter detailed feedback..."
                  ></textarea>
                </div>
                <div className="space-y-4">
                  <h4 className="text-sm font-bold flex items-center gap-2"><Star size={16} /> Scoring</h4>
                  <div className="space-y-2">
                    <label className="text-xs opacity-60 font-bold block">Assigned Points (Max 25)</label>
                    <input 
                      type="number" 
                      max="25" 
                      className="w-full p-3 bg-white dark:bg-slate-900 border-2 border-indigo-100 dark:border-slate-700 rounded-xl text-xl font-bold text-center focus:border-indigo-500 outline-none transition-all"
                      placeholder="0"
                    />
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(v => (
                        <button key={v} className="flex-1 p-2 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900 text-[10px] font-bold transition-all">
                          {v*5}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluatorReview;
