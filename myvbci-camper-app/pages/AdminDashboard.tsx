import React from 'react';
import { useStore } from '../context/StoreContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, DollarSign, Tent, AlertCircle } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { camps, bookings, rooms } = useStore();

  // Metrics
  const totalRevenue = bookings.reduce((sum, b) => sum + b.amount, 0);
  const totalRegistrations = bookings.length;
  const activeCamps = camps.length;
  const occupancyRate = Math.round((rooms.filter(r => r.status === 'Full').length / rooms.length) * 100) || 0;

  // Chart Data Preparation
  const revenueData = camps.map(camp => {
    const campBookings = bookings.filter(b => b.camp_id === camp.camp_id);
    const revenue = campBookings.reduce((sum, b) => sum + b.amount, 0);
    return { name: camp.name.substring(0, 15) + '...', revenue };
  });

  const roomStatusData = [
    { name: 'Available', value: rooms.filter(r => r.status === 'Available').length },
    { name: 'Full', value: rooms.filter(r => r.status === 'Full').length },
  ];
  const PIE_COLORS = ['#10B981', '#EF4444'];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
        <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 text-slate-700">
            Download Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: `₵${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
          { label: 'Total Campers', value: totalRegistrations, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
          { label: 'Active Camps', value: activeCamps, icon: Tent, color: 'text-purple-600', bg: 'bg-purple-100' },
          { label: 'Room Occupancy', value: `${occupancyRate}%`, icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-100' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center">
            <div className={`p-3 rounded-lg ${stat.bg} mr-4`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Revenue by Camp</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                <YAxis tick={{fontSize: 12}} tickLine={false} axisLine={false} tickFormatter={(value) => `₵${value}`} />
                <Tooltip cursor={{fill: '#F1F5F9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="revenue" fill="#000080" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Occupancy Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Room Availability Status</h2>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roomStatusData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {roomStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
               {roomStatusData.map((item, index) => (
                   <div key={index} className="flex items-center">
                       <div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: PIE_COLORS[index]}}></div>
                       <span className="text-sm text-slate-600">{item.name}: {item.value}</span>
                   </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;