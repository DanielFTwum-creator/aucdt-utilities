import { Logger } from '../../services/logger';
import { Users, Eye, Calendar, ArrowUpRight } from 'lucide-react';

export default function Dashboard() {
  const logs = Logger.getLogs();
  const recentActivity = logs.slice(0, 5);

  const stats = [
    { label: 'Total Visits', value: '1,234', change: '+12%', icon: Eye },
    { label: 'Bookings', value: '42', change: '+5%', icon: Calendar },
    { label: 'Active Users', value: '8', change: '+2', icon: Users },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">Welcome back, Admin.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-600 dark:text-orange-400">
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="flex items-center text-sm font-medium text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                {stat.change}
                <ArrowUpRight className="w-3 h-3 ml-1" />
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-bold text-gray-900 dark:text-white">Recent Activity</h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {recentActivity.map((log) => (
            <div key={log.id} className="px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{log.action}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{log.details}</p>
              </div>
              <span className="text-xs text-gray-400">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
          {recentActivity.length === 0 && (
            <div className="p-6 text-center text-gray-500">No recent activity found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
