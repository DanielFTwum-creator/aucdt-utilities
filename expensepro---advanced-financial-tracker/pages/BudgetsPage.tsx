
import React, { useState } from 'react';
import { Wallet, Plus, Trash2, Calendar, Target, TrendingUp, AlertCircle } from 'lucide-react';
import { Budget, Expense, Category, UserProfile } from '../types';
import { SUPPORTED_CURRENCIES } from '../constants';

interface BudgetsPageProps {
  budgets: Budget[];
  setBudgets: React.Dispatch<React.SetStateAction<Budget[]>>;
  expenses: Expense[];
  categories: Category[];
  user: UserProfile;
}

const BudgetsPage: React.FC<BudgetsPageProps> = ({ budgets, setBudgets, expenses, categories, user }) => {
  const [isAddingBudget, setIsAddingBudget] = useState(false);

  const getSpentForBudget = (budget: Budget) => {
    const start = new Date(budget.startDate);
    const end = new Date(budget.endDate);
    return expenses.filter(e => {
      const d = new Date(e.date);
      const inRange = d >= start && d <= end;
      const matchesCategory = budget.categoryId === null || e.categoryId === budget.categoryId;
      return inRange && matchesCategory;
    }).reduce((acc, curr) => acc + curr.amount, 0);
  };

  const currency = SUPPORTED_CURRENCIES.find(c => c.code === user.currency) || SUPPORTED_CURRENCIES[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Budgets & Limits</h2>
          <p className="text-gray-500">Plan your spending and save more every month.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-lg shadow-indigo-100">
          <Plus className="w-4 h-4" />
          Create Budget
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map(budget => {
          const spent = getSpentForBudget(budget);
          const progress = (spent / budget.amount) * 100;
          const cat = budget.categoryId ? categories.find(c => c.id === budget.categoryId) : null;
          const isOver = spent > budget.amount;
          const isWarning = progress > 80;

          return (
            <div key={budget.id} className="bg-white rounded-2xl border shadow-sm p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
              {isOver && <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">Over Limit</div>}
              
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{backgroundColor: cat ? `${cat.color}15` : '#f3f4f6'}}>
                    {cat ? <Target className="w-6 h-6" style={{color: cat.color}} /> : <Wallet className="w-6 h-6 text-indigo-600" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{cat ? cat.name : 'Overall Spending'}</h4>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{budget.period} Period</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-rose-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Spent so far</p>
                    <p className={`text-2xl font-black ${isOver ? 'text-rose-600' : 'text-gray-900'}`}>{currency.symbol}{spent.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 font-medium">Goal</p>
                    <p className="text-lg font-bold text-gray-700">{currency.symbol}{budget.amount.toLocaleString()}</p>
                  </div>
                </div>

                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ease-out ${isOver ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                    style={{width: `${Math.min(100, progress)}%`}}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>Ends {new Date(budget.endDate).toLocaleDateString()}</span>
                  </div>
                  <span className={`font-bold ${isOver ? 'text-rose-600' : isWarning ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {progress.toFixed(1)}% used
                  </span>
                </div>

                {isWarning && !isOver && (
                  <div className="mt-4 p-3 bg-amber-50 rounded-xl flex items-start gap-2 text-amber-700 text-[11px] leading-relaxed">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    You've reached 80% of your budget. Consider reducing non-essential spending for the rest of the period.
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Add New Budget Card */}
        <button className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:bg-gray-100 hover:border-gray-300 transition-all text-gray-500 group">
          <div className="p-3 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
            <Plus className="w-6 h-6" />
          </div>
          <span className="font-bold">Add New Budget</span>
        </button>
      </div>
    </div>
  );
};

export default BudgetsPage;
