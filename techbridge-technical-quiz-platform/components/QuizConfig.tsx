
import React from 'react';
import { MOCK_QUIZZES } from '../mockData';
import { Settings, Clock, Target, ListChecks, ChevronRight } from 'lucide-react';

const QuizConfig: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_QUIZZES.map((quiz) => (
          <div key={quiz.id} className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-2xl">
                <Settings size={24} />
              </div>
              <span className="text-[10px] font-bold uppercase px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-slate-500">
                {quiz.category}
              </span>
            </div>
            
            <h3 className="text-lg font-bold mb-4 group-hover:text-indigo-600 transition-colors">{quiz.name}</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm opacity-70 font-medium">
                <Clock size={16} />
                <span>{quiz.timeLimit} Minutes Duration</span>
              </div>
              <div className="flex items-center gap-3 text-sm opacity-70 font-medium">
                <ListChecks size={16} />
                <span>{quiz.questions.length} Selected Questions</span>
              </div>
              <div className="flex items-center gap-3 text-sm opacity-70 font-medium">
                <Target size={16} />
                <span>{quiz.passThreshold}% Passing Score</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-50 dark:border-slate-700 flex gap-2">
              <button className="flex-1 py-2 rounded-xl text-sm font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                Edit Config
              </button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        ))}

        <button className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl p-8 flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-indigo-500 hover:border-indigo-300 transition-all hover:bg-indigo-50/30">
          <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
            <Settings size={24} />
          </div>
          <span className="font-bold">Create New Template</span>
        </button>
      </div>
    </div>
  );
};

export default QuizConfig;
