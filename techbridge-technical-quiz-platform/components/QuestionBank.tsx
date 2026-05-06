
import React, { useState } from 'react';
/* Added CheckSquare to the lucide-react imports */
import { Search, Filter, Plus, Edit3, Trash2, MoreVertical, Code, List, HelpCircle, FileText, CheckSquare } from 'lucide-react';
import { MOCK_QUESTIONS } from '../mockData';
import { QuestionType, Difficulty } from '../types';

const QuestionBank: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('All');

  const filteredQuestions = MOCK_QUESTIONS.filter(q => 
    (filterType === 'All' || q.type === filterType) &&
    (q.content.toLowerCase().includes(searchTerm.toLowerCase()) || q.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getDifficultyColor = (diff: Difficulty) => {
    switch(diff) {
      case Difficulty.BEGINNER: return 'bg-emerald-100 text-emerald-700';
      case Difficulty.INTERMEDIATE: return 'bg-blue-100 text-blue-700';
      case Difficulty.ADVANCED: return 'bg-amber-100 text-amber-700';
      case Difficulty.EXPERT: return 'bg-rose-100 text-rose-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getTypeIcon = (type: QuestionType) => {
    switch(type) {
      case QuestionType.MCQ: return <List size={16} />;
      case QuestionType.CODE: return <Code size={16} />;
      case QuestionType.SCENARIO: return <HelpCircle size={16} />;
      case QuestionType.MULTI_SELECT: return <CheckSquare size={16} />;
      default: return <FileText size={16} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search questions, categories, tags..." 
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all font-medium">
            <Filter size={18} />
            Filters
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-medium shadow-md shadow-indigo-100 dark:shadow-none">
            <Plus size={18} />
            New Question
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">
              <th className="px-6 py-4">Question</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Difficulty</th>
              <th className="px-6 py-4">Points</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {filteredQuestions.map((q) => (
              <tr key={q.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                <td className="px-6 py-4 max-w-xs">
                  <div className="font-medium text-slate-800 dark:text-slate-200 line-clamp-2">{q.content}</div>
                  <div className="flex gap-1 mt-1">
                    {q.tags.map(tag => (
                      <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500 rounded uppercase font-bold">{tag}</span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    {getTypeIcon(q.type)}
                    {q.type}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium">{q.category}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${getDifficultyColor(q.difficulty)}`}>
                    {q.difficulty}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold text-indigo-600">{q.points}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 rounded-lg transition-all"><Edit3 size={18} /></button>
                    <button className="p-2 hover:bg-rose-50 dark:hover:bg-rose-900/30 text-rose-600 rounded-lg transition-all"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredQuestions.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            <p>No questions found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionBank;
