import React from 'react';
import { Programme, View } from '../types';
import ProgrammeIcon from './ProgrammeIcon';

interface ProgrammeDashboardProps {
    setView: (view: View) => void;
    setProgramme: (programme: Programme) => void;
    programmes: Programme[];
}

const ProgrammeDashboard: React.FC<ProgrammeDashboardProps> = ({ setView, setProgramme, programmes }) => (
    <div>
        <h2 className="text-3xl font-bold text-brand-brown-dark mb-6">Academic Programmes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programmes.map(prog => (
                <div key={prog.id} onClick={() => { setProgramme(prog); setView('programmeDetail'); }}
                     className="bg-white p-6 rounded-xl shadow-[0_4px_12px_rgba(139,21,56,0.1)] cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-l-4 border-brand-gold">
                    <ProgrammeIcon programmeId={prog.id} className="w-10 h-10 text-brand-maroon mb-3" />
                    <h3 className="text-xl font-bold text-brand-maroon">{prog.name}</h3>
                    <p className="text-gray-600 text-sm mt-2">View available assessments for this programme.</p>
                </div>
            ))}
        </div>
    </div>
);

export default ProgrammeDashboard;
