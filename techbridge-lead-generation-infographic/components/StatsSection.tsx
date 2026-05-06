
import React from 'react';
import type { StatCardProps } from '../types';

const StatCard: React.FC<StatCardProps> = ({ number, label }) => (
  <div className="group bg-gradient-to-br from-yellow-50 to-white border-2 border-yellow-400 rounded-2xl p-6 text-center transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-900/20 hover:border-red-800">
    <div className="text-5xl font-extrabold text-red-800">{number}</div>
    <div className="mt-2 text-sm font-semibold text-gray-600 uppercase tracking-wide">{label}</div>
  </div>
);

const StatsSection: React.FC = () => {
  const stats: StatCardProps[] = [
    { number: '95%', label: 'Employability Rate' },
    { number: '12+', label: 'Innovative Programmes' },
    { number: '50+', label: 'Industry Partners' },
  ];

  return (
    <section>
      <h2 className="text-3xl font-bold text-red-800 mb-6 flex items-center">
        <span className="w-1.5 h-8 bg-gradient-to-b from-yellow-400 to-orange-400 mr-4 rounded-full"></span>
        Unlock Your Potential
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} number={stat.number} label={stat.label} />
        ))}
      </div>
    </section>
  );
};

export default StatsSection;