import React from 'react';
import { User, Role, LogEntry, LogStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DashboardProps {
  user: User;
  logs: LogEntry[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const Dashboard: React.FC<DashboardProps> = ({ user, logs }) => {
  
  const getStats = () => {
    const total = logs.length;
    const approved = logs.filter(l => l.status === LogStatus.APPROVED).length;
    const pending = logs.filter(l => l.status === LogStatus.PENDING).length;
    const totalHours = logs.reduce((acc, curr) => acc + curr.hours, 0);

    return { total, approved, pending, totalHours };
  };

  const stats = getStats();

  const pieData = [
    { name: 'Approved', value: stats.approved },
    { name: 'Pending', value: stats.pending },
    { name: 'Rejected', value: stats.total - stats.approved - stats.pending },
  ];

  // Simple weekly data mock based on logs
  const weeklyData = logs.slice(0, 5).map(l => ({
    name: l.date,
    hours: l.hours
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
        Welcome back, {user.name.split(' ')[0]}!
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" role="list" aria-label="Statistics">
        <div className="bg-white dark:bg-darkcard p-6 rounded-xl shadow-sm border-l-4 border-blue-500" role="listitem">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Entries</p>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats.total}</p>
        </div>
        <div className="bg-white dark:bg-darkcard p-6 rounded-xl shadow-sm border-l-4 border-green-500" role="listitem">
          <p className="text-sm text-gray-500 dark:text-gray-400">Hours Logged</p>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats.totalHours}</p>
        </div>
        <div className="bg-white dark:bg-darkcard p-6 rounded-xl shadow-sm border-l-4 border-yellow-500" role="listitem">
          <p className="text-sm text-gray-500 dark:text-gray-400">Pending Approval</p>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats.pending}</p>
        </div>
         <div className="bg-white dark:bg-darkcard p-6 rounded-xl shadow-sm border-l-4 border-purple-500" role="listitem">
          <p className="text-sm text-gray-500 dark:text-gray-400">Completion</p>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">45%</p>
        </div>
      </div>

      {/* Charts Section - Only visible for relevant roles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-darkcard p-6 rounded-xl shadow-sm h-80 border dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Weekly Activity Hours</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                    />
                    <Bar dataKey="hours" fill="#3b82f6" radius={[4, 4, 0, 0]} aria-label="Activity hours bar chart" />
                </BarChart>
            </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-darkcard p-6 rounded-xl shadow-sm h-80 border dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Approval Status</h3>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        aria-label="Approval status pie chart"
                    >
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                </PieChart>
            </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white dark:bg-darkcard rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
         <div className="px-6 py-4 border-b dark:border-gray-700">
             <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Recent Logs</h3>
         </div>
         <div className="overflow-x-auto">
             <table className="w-full text-left" aria-label="Recent Log Entries">
                 <thead>
                     <tr className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm">
                         <th className="px-6 py-3" scope="col">Date</th>
                         <th className="px-6 py-3" scope="col">Activity Summary</th>
                         <th className="px-6 py-3" scope="col">Hours</th>
                         <th className="px-6 py-3" scope="col">Status</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y dark:divide-gray-700">
                     {logs.slice(0, 5).map(log => (
                         <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                             <td className="px-6 py-4 text-sm">{log.date}</td>
                             <td className="px-6 py-4 text-sm truncate max-w-xs" title={log.summary}>{log.summary}</td>
                             <td className="px-6 py-4 text-sm">{log.hours}</td>
                             <td className="px-6 py-4">
                                 <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                                    ${log.status === LogStatus.APPROVED ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                                      log.status === LogStatus.REJECTED ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 
                                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                                     {log.status}
                                 </span>
                             </td>
                         </tr>
                     ))}
                 </tbody>
             </table>
         </div>
      </div>
    </div>
  );
};