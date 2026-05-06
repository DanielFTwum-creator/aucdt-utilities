
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const lecturerWorkloadData = [
  { name: 'Prof. Grant', hours: 20 },
  { name: 'Dr. Sattler', hours: 15 },
  { name: 'Mr. Malcolm', hours: 18 },
];

const venueUtilizationData = [
  { name: 'Design Studio A', value: 400 },
  { name: 'Lecture Hall B', value: 300 },
  { name: 'Computer Lab C', value: 300 },
  { name: 'Unused', value: 200 },
];

const COLORS = ['#004225', '#3D2B1F', '#D4AF37', '#e0e0e0'];

const ReportsPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-aucdt-green mb-6">Reporting & Analytics</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-aucdt-brown mb-4">Lecturer Workload (Hours/Week)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={lecturerWorkloadData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="hours" fill="#004225" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-aucdt-brown mb-4">Classroom Utilization</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={venueUtilizationData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={110}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {venueUtilizationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
