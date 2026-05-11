import React from 'react';

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6 font-display">Recruiter Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-text-muted uppercase font-body">Active Pipelines</h3>
          <p className="text-3xl font-bold text-text-primary mt-2 font-display">12</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-text-muted uppercase font-body">Pending Reviews</h3>
          <p className="text-3xl font-bold text-text-primary mt-2 font-display">45</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-text-muted uppercase font-body">Avg. Time to Hire</h3>
          <p className="text-3xl font-bold text-text-primary mt-2 font-display">18d</p>
        </div>
      </div>
    </div>
  );
}
