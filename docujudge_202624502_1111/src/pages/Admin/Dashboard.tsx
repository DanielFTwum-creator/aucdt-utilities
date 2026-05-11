import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Activity, Database, FileText, LayoutDashboard, LogOut, TestTube } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const auth = sessionStorage.getItem('docujudge-admin-auth');
    if (!auth) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('docujudge-admin-auth');
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">DocuJudge Admin</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link to="/admin/diagnostics" className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Activity size={20} />
            Diagnostics
          </Link>
          <Link to="/admin/testing" className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <TestTube size={20} />
            Testing Suite
          </Link>
          <Link to="/admin/db-monitor" className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Database size={20} />
            DB Monitor
          </Link>
          <Link to="/admin/logs" className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <FileText size={20} />
            System Logs
          </Link>
          <Link to="/admin/performance" className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Activity size={20} />
            Performance
          </Link>
          <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
             <Link to="/" className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <FileText size={20} />
              Back to App
            </Link>
          </div>
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 w-full text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
