import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mockPerformanceData } from '../../services/mockData';

const Performance: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">System Performance</h1>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-6" id="perf-chart-title">CPU & Memory Usage (24h)</h3>
        <p className="sr-only" aria-labelledby="perf-chart-title">
          Area chart showing CPU and Memory usage trends over the last 24 hours. CPU usage averages around 40%, Memory usage averages around 60%.
        </p>
        <div className="h-80" aria-hidden="true">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="cpu" stackId="1" stroke="#8884d8" fill="#8884d8" name="CPU %" />
              <Area type="monotone" dataKey="memory" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="Memory %" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Performance;