
import React from 'react';
import type { Programme } from '../types';

const ProgramItem: React.FC<Programme> = ({ name, duration }) => (
    <div className="bg-white border-2 border-yellow-200 rounded-xl p-6 transition-all duration-300 ease-in-out hover:border-red-800 hover:shadow-lg hover:shadow-red-900/10 hover:-translate-y-1">
        <h3 className="font-bold text-lg text-red-800">{name}</h3>
        <p className="font-semibold text-orange-500">{duration}</p>
    </div>
);

const ProgramsSection: React.FC = () => {
  const programs: Programme[] = [
    { name: 'BTech Digital Media & Communication Design', duration: '4-Year Programme' },
    { name: 'BTech Fashion Design Technology', duration: '4-Year Programme' },
    { name: 'BA Jewellery Design Technology', duration: '4-Year Programme' },
    { name: 'BA Product Design', duration: '4-Year Programme' },
  ];

  return (
    <section>
      <h2 className="text-3xl font-bold text-red-800 mb-6 flex items-center">
        <span className="w-1.5 h-8 bg-gradient-to-b from-yellow-400 to-orange-400 mr-4 rounded-full"></span>
        Our Programmes
      </h2>
       <div className="mb-6 bg-gradient-to-r from-yellow-400 to-orange-400 text-red-800 p-5 rounded-2xl text-center font-bold text-xl border-2 border-red-800 shadow-lg shadow-red-900/20 animate-pulse">
        ADMISSIONS OPEN FOR 2025/2026!
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {programs.map((program, index) => (
          <ProgramItem key={index} name={program.name} duration={program.duration} />
        ))}
      </div>
    </section>
  );
};

export default ProgramsSection;