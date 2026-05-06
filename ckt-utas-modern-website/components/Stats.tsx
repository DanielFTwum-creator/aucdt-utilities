import React from 'react';
import { Users, Book, Building2, GraduationCap } from 'lucide-react';

const stats = [
    { id: 1, label: 'University Inauguration', value: '2020', icon: <Building2 size={40} /> },
    { id: 2, label: 'Enrolled Students', value: '4000', suffix: '+', icon: <Users size={40} /> },
    { id: 3, label: 'Programmes', value: '30', suffix: '+', icon: <GraduationCap size={40} /> },
    { id: 4, label: 'Schools/Departments', value: '15', suffix: '+', icon: <Book size={40} /> },
];

const Stats: React.FC = () => {
  return (
    <section className="relative py-20 bg-primary-dark text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
                <div key={stat.id} className="p-6 rounded-lg hover:bg-white/5 transition-colors group">
                    <div className="flex justify-center mb-4 text-secondary group-hover:scale-110 transition-transform duration-300">
                        {stat.icon}
                    </div>
                    <div className="text-4xl md:text-5xl font-bold text-white mb-2 font-sans">
                        {stat.value}<span className="text-secondary">{stat.suffix}</span>
                    </div>
                    <div className="text-gray-300 text-sm md:text-base uppercase tracking-wider font-medium">
                        {stat.label}
                    </div>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;