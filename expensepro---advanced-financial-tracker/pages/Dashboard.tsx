
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Wallet, Calendar, AlertCircle } from 'lucide-react';
import { Expense, Budget, Category, UserProfile } from '../types';
import { SUPPORTED_CURRENCIES } from '../constants';

interface DashboardProps {
  expenses: Expense[];
  budgets: Budget[];
  categories: Category[];
  user: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ expenses, budgets, categories, user }) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const totalSpent = monthlyExpenses.reduce((acc, curr) => acc + curr.amount, 0);
  const mainBudget = budgets.find(b => b.categoryId === null)?.amount || 0;
  const remainingBudget = Math.max(0, mainBudget - totalSpent);
  const budgetProgress = mainBudget > 0 ? (totalSpent / mainBudget) * 100 : 0;

  // Pie chart data: Spending by Category
  const categoryData = categories.map(cat => ({
    name: cat.name,
    value: monthlyExpenses.filter(e => e.categoryId === cat.id).reduce((acc, curr) => acc + curr.amount, 0),
    color: cat.color
  })).filter(d => d.value > 0);

  // Line chart data: Spending over time (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const amount = expenses
      .filter(e => e.date === dateStr)
      .reduce((acc, curr) => acc + curr.amount, 0);
    return {
      name: d.toLocaleDateString(undefined, { weekday: 'short' }),
      amount
    };
  });

  const currency = SUPPORTED_CURRENCIES.find(c => c.code === user.currency) || SUPPORTED_CURRENCIES[0];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Spent (Month)" 
          value={`${currency.symbol}${totalSpent.toLocaleString()}`} 
          trend="+12%" 
          trendType="down"
          icon={<DollarSign className="w-6 h-6 text-indigo-600" />}
          bgColor="bg-indigo-50"
        />
        <StatCard 
          title="Remaining Budget" 
          value={`${currency.symbol}${remainingBudget.toLocaleString()}`} 
          trend="-5%" 
          trendType="neutral"
          icon={<Wallet className="w-6 h-6 text-emerald-600" />}
          bgColor="bg-emerald-50"
        />
        <StatCard 
          title="Daily Average" 
          value={`${currency.symbol}${(totalSpent / 30).toFixed(2)}`} 
          trend="+2%" 
          trendType="up"
          icon={<Calendar className="w-6 h-6 text-amber-600" />}
          bgColor="bg-amber-50"
        />
        <StatCard 
          title="Budget Alerts" 
          value={budgetProgress > 80 ? '1 Active' : 'None'} 
          trend="" 
          trendType="none"
          icon={<AlertCircle className={`w-6 h-6 ${budgetProgress > 80 ? 'text-rose-600' : 'text-gray-400'}`} />}
          bgColor={budgetProgress > 80 ? 'bg-rose-50' : 'bg-gray-50'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spending Trend */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-800">Weekly Spending Trend</h3>
            <select className="text-sm border-none bg-gray-50 rounded-lg px-2 py-1 outline-none text-gray-600">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={last7Days}>
                <defs>
                  <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                  cursor={{stroke: '#4f46e5', strokeWidth: 2}}
                />
                <Area type="monotone" dataKey="amount" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorAmt)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="font-bold text-gray-800 mb-6">Spending by Category</h3>
          <div className="h-64 relative">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 italic">No data this month</div>
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs text-gray-500 font-medium">Monthly Total</span>
              <span className="text-xl font-bold text-gray-800">{currency.symbol}{totalSpent.toLocaleString()}</span>
            </div>
          </div>
          <div className="mt-4 space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
            {categoryData.sort((a,b) => b.value - a.value).map((cat, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{backgroundColor: cat.color}}></div>
                  <span className="text-gray-600">{cat.name}</span>
                </div>
                <span className="font-semibold text-gray-800">{currency.symbol}{cat.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions Peek */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">Recent Transactions</h3>
            <button className="text-indigo-600 text-sm font-semibold hover:text-indigo-700">View all</button>
          </div>
          <div className="divide-y">
            {expenses.slice(0, 5).map((expense) => {
              const cat = categories.find(c => c.id === expense.categoryId);
              return (
                <div key={expense.id} className="py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{backgroundColor: `${cat?.color}15`}}>
                      <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: cat?.color}}></div>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{expense.description}</p>
                      <p className="text-xs text-gray-500">{expense.date} • {cat?.name}</p>
                    </div>
                  </div>
                  <p className="font-bold text-gray-900">-{currency.symbol}{expense.amount.toFixed(2)}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Budget Progress */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="font-bold text-gray-800 mb-6">Budget Overview</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 font-medium">Overall Monthly Budget</span>
                <span className="font-bold text-gray-900">{budgetProgress.toFixed(0)}%</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${budgetProgress > 100 ? 'bg-red-500' : budgetProgress > 80 ? 'bg-amber-500' : 'bg-indigo-600'}`} 
                  style={{width: `${Math.min(100, budgetProgress)}%`}}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>Spent: {currency.symbol}{totalSpent.toLocaleString()}</span>
                <span>Limit: {currency.symbol}{mainBudget.toLocaleString()}</span>
              </div>
            </div>

            {/* Top Category Budgets */}
            {budgets.filter(b => b.categoryId !== null).slice(0, 2).map((budget) => {
              const cat = categories.find(c => c.id === budget.categoryId);
              const spent = monthlyExpenses.filter(e => e.categoryId === budget.categoryId).reduce((acc, curr) => acc + curr.amount, 0);
              const progress = (spent / budget.amount) * 100;
              return (
                <div key={budget.id}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 font-medium">{cat?.name} Budget</span>
                    <span className="font-bold text-gray-900">{progress.toFixed(0)}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${progress > 100 ? 'bg-red-500' : 'bg-emerald-500'}`} 
                      style={{width: `${Math.min(100, progress)}%`}}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  trendType: 'up' | 'down' | 'neutral' | 'none';
  icon: React.ReactNode;
  bgColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, trend, trendType, icon, bgColor }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${bgColor}`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
            trendType === 'down' ? 'bg-emerald-50 text-emerald-600' : 
            trendType === 'up' ? 'bg-rose-50 text-rose-600' : 
            'bg-gray-50 text-gray-500'
          }`}>
            {trendType === 'down' ? <TrendingDown className="w-3 h-3" /> : trendType === 'up' ? <TrendingUp className="w-3 h-3" /> : null}
            {trend}
          </div>
        )}
      </div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h4 className="text-2xl font-bold text-gray-900">{value}</h4>
    </div>
  );
};

export default Dashboard;
