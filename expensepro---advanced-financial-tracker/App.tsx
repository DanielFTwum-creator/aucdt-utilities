
import React, { useState, useEffect, useMemo, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, Receipt, Wallet, Tags, UserCircle, Menu, X, Plus, LogOut, Bell, Globe, ShieldCheck, Beaker, Sun, Moon, Contrast
} from 'lucide-react';
import Dashboard from './pages/Dashboard';
import ExpensesPage from './pages/ExpensesPage';
import BudgetsPage from './pages/BudgetsPage';
import CategoriesPage from './pages/CategoriesPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import TestingPage from './pages/TestingPage';
import { Expense, Budget, Category, UserProfile, ThemeType, AuditEntry } from './types';
import { DEFAULT_CATEGORIES, SUPPORTED_CURRENCIES } from './constants';

const ThemeContext = createContext<{
  theme: ThemeType;
  setTheme: (t: ThemeType) => void;
}>({ theme: 'light', setTheme: () => {} });

const App: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
  const [theme, setTheme] = useState<ThemeType>('light');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile>({
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    currency: 'USD',
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const addAuditLog = (action: string, details: string) => {
    const entry: AuditEntry = {
      id: Math.random().toString(36).substring(7),
      action,
      details,
      timestamp: new Date().toISOString(),
      user: user.name
    };
    setAuditLogs(prev => [entry, ...prev].slice(0, 100));
  };

  useEffect(() => {
    const dummyExpenses: Expense[] = [
      { id: 'e1', amount: 45.5, currency: 'USD', date: new Date().toISOString().split('T')[0], categoryId: '1', paymentMethod: 'Credit Card', description: 'Dinner at Italian Restaurant', isRecurring: false, tags: ['dinner'], createdAt: new Date().toISOString() },
      { id: 'e2', amount: 120, currency: 'USD', date: new Date().toISOString().split('T')[0], categoryId: '3', paymentMethod: 'Bank Transfer', description: 'Internet Bill', isRecurring: true, tags: ['utilities'], createdAt: new Date().toISOString() }
    ];
    const dummyBudgets: Budget[] = [{ id: 'b1', categoryId: null, amount: 2000, period: 'Monthly', startDate: '2024-01-01', endDate: '2024-12-31' }];
    setExpenses(dummyExpenses);
    setBudgets(dummyBudgets);
    addAuditLog('System Initialize', 'Application baseline established');
  }, []);

  const themeClasses = {
    light: 'bg-gray-50 text-gray-900',
    dark: 'bg-gray-900 text-gray-100 dark-mode',
    'high-contrast': 'bg-black text-yellow-400 high-contrast-mode border-yellow-400'
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, aria: 'Dashboard overview' },
    { name: 'Expenses', path: '/expenses', icon: Receipt, aria: 'Transactions and receipts' },
    { name: 'Budgets', path: '/budgets', icon: Wallet, aria: 'Budget planning' },
    { name: 'Categories', path: '/categories', icon: Tags, aria: 'Category management' },
    { name: 'Profile', path: '/profile', icon: UserCircle, aria: 'User settings' },
    { name: 'Testing', path: '/testing', icon: Beaker, aria: 'QA lab' },
    { name: 'Admin', path: '/admin', icon: ShieldCheck, aria: 'Security console' },
  ];

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <HashRouter>
        <div className={`min-h-screen flex flex-col md:flex-row transition-colors duration-300 ${themeClasses[theme]}`}>
          {/* Mobile Navbar */}
          <nav role="navigation" aria-label="Mobile Navigation" className="md:hidden border-b px-4 py-3 flex items-center justify-between sticky top-0 z-50 bg-inherit">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Receipt className="text-white w-5 h-5" />
              </div>
              <span className="font-bold text-xl">ExpensePro</span>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              aria-expanded={isSidebarOpen}
              className="p-2 rounded-lg border focus:ring-2 focus:ring-indigo-500"
            >
              {isSidebarOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            </button>
          </nav>

          <aside 
            role="complementary" 
            className={`fixed inset-y-0 left-0 z-40 w-64 border-r transform transition-transform md:translate-x-0 md:static ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}
          >
            <div className="h-full flex flex-col p-4">
              <div className="px-2 py-4 hidden md:flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Receipt className="text-white w-6 h-6" />
                </div>
                <span className="font-bold text-2xl tracking-tight">ExpensePro</span>
              </div>
              <nav role="navigation" aria-label="Main Navigation" className="flex-1 mt-6 space-y-1">
                {navItems.map((item) => (
                  <NavLink key={item.path} item={item} onClick={() => setIsSidebarOpen(false)} theme={theme} />
                ))}
              </nav>
              <div className="mt-auto pt-4 border-t border-gray-200">
                <div className="flex justify-around mb-4" role="group" aria-label="Theme Selection">
                  <button onClick={() => setTheme('light')} aria-label="Light theme" className={`p-2 rounded-lg ${theme === 'light' ? 'bg-indigo-100 text-indigo-600' : ''}`}><Sun size={18}/></button>
                  <button onClick={() => setTheme('dark')} aria-label="Dark theme" className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-indigo-900 text-indigo-400' : ''}`}><Moon size={18}/></button>
                  <button onClick={() => setTheme('high-contrast')} aria-label="High contrast theme" className={`p-2 rounded-lg ${theme === 'high-contrast' ? 'bg-yellow-400 text-black' : ''}`}><Contrast size={18}/></button>
                </div>
                <div className="p-2 rounded-xl hover:bg-black/5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">{user.name[0]}</div>
                  <div className="truncate"><p className="text-xs font-bold">{user.name}</p></div>
                </div>
              </div>
            </div>
          </aside>

          {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsSidebarOpen(false)} aria-hidden="true" />}

          <main role="main" className="flex-1 overflow-auto">
            <header className="hidden md:flex border-b px-8 py-4 items-center justify-between sticky top-0 z-30 bg-inherit">
              <h1 className="text-lg font-bold opacity-70 uppercase tracking-widest">
                <Routes>
                  <Route path="/" element="Dashboard" />
                  <Route path="/expenses" element="Transactions" />
                  <Route path="/budgets" element="Planning" />
                  <Route path="/categories" element="Categories" />
                  <Route path="/profile" element="Settings" />
                  <Route path="/admin" element="Security Console" />
                  <Route path="/testing" element="Testing Lab" />
                </Routes>
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border">
                  <Globe size={16} aria-hidden="true" />
                  <select 
                    aria-label="Select currency"
                    value={user.currency} 
                    onChange={(e) => setUser({...user, currency: e.target.value})} 
                    className="bg-transparent text-sm font-bold border-none focus:ring-0 cursor-pointer"
                  >
                    {SUPPORTED_CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
                  </select>
                </div>
                <button aria-label="Notifications" className="p-2 rounded-full border relative hover:bg-black/5 transition-colors">
                  <Bell size={18} />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                <Link 
                  to="/expenses" 
                  aria-label="Add new expense"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-transform"
                >
                  <Plus size={16} /> Add New
                </Link>
              </div>
            </header>
            <div className="p-4 md:p-8 max-w-[1400px] mx-auto">
              <Routes>
                <Route path="/" element={<Dashboard expenses={expenses} budgets={budgets} categories={categories} user={user} />} />
                <Route path="/expenses" element={<ExpensesPage expenses={expenses} setExpenses={(val) => { setExpenses(val); addAuditLog('Expense Update', 'User modified the transaction list'); }} categories={categories} user={user} />} />
                <Route path="/budgets" element={<BudgetsPage budgets={budgets} setBudgets={setBudgets} expenses={expenses} categories={categories} user={user} />} />
                <Route path="/categories" element={<CategoriesPage categories={categories} setCategories={setCategories} />} />
                <Route path="/profile" element={<ProfilePage user={user} setUser={setUser} />} />
                <Route path="/admin" element={<AdminPage isAuthenticated={isAdminAuthenticated} setAuthenticated={setIsAdminAuthenticated} logs={auditLogs} />} />
                <Route path="/testing" element={<TestingPage />} />
              </Routes>
            </div>
          </main>
        </div>
      </HashRouter>
      <style>{`
        .dark-mode { --tw-bg-opacity: 1; background-color: #111827; color: #f9fafb; border-color: #374151; }
        .dark-mode aside { background-color: #1f2937; border-color: #374151; }
        .dark-mode header { border-color: #374151; }
        .dark-mode tr:hover { background-color: #1f2937 !important; }
        .dark-mode .bg-white { background-color: #1f2937 !important; border-color: #374151; color: #f9fafb; }
        .high-contrast-mode { background-color: #000 !important; color: #ffff00 !important; }
        .high-contrast-mode * { border-color: #ffff00 !important; color: #ffff00 !important; }
        .high-contrast-mode button { background-color: #ffff00 !important; color: #000 !important; font-weight: 900 !important; }
        .high-contrast-mode input, .high-contrast-mode select { background-color: #000 !important; border: 2px solid #ffff00 !important; }
      `}</style>
    </ThemeContext.Provider>
  );
};

const NavLink = ({ item, onClick, theme }: any) => {
  const { pathname } = useLocation();
  const active = pathname === item.path;
  const activeStyles = theme === 'high-contrast' ? 'bg-yellow-400 text-black font-black ring-4 ring-yellow-400' : 'bg-indigo-50 text-indigo-700';
  return (
    <Link 
      to={item.path} 
      onClick={onClick} 
      aria-label={item.aria}
      aria-current={active ? 'page' : undefined}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${active ? activeStyles : 'hover:bg-black/5 opacity-70'}`}
    >
      <item.icon size={20} className={active ? '' : 'opacity-50'} />
      {item.name}
    </Link>
  );
};

export default App;
