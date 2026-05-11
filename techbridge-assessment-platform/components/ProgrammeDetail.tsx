import React from 'react';
import { Programme, Assessment, View } from '../types';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface ProgrammeDetailProps {
    programme: Programme;
    setView: (view: View) => void;
    setAssessment: (assessment: Assessment) => void;
}

const ProgrammeDetail: React.FC<ProgrammeDetailProps> = ({ programme, setView, setAssessment }) => (
    <div>
        <button onClick={() => setView('dashboard')} className="flex items-center text-sm font-medium text-brand-maroon mb-6 hover:underline">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Programmes
        </button>
        <h2 className="text-3xl font-bold text-brand-brown-dark mb-2">{programme.name}</h2>
        <p className="text-gray-500 mb-8">Select an assessment to begin.</p>
        
        <div className="space-y-8">
            {Object.entries(programme.assessments).map(([year, assessments]) => (
                <div key={year}>
                    <h3 className="text-xl font-semibold text-brand-maroon-dark capitalize mb-4 border-b-2 border-brand-brown-light pb-2">
                        {year.replace('year', 'Year ')}
                    </h3>
                    <div className="space-y-3">
                        {assessments.map(asm => (
                            <div key={asm.id} onClick={() => { setAssessment(asm); setView('assessment'); }}
                                 className="bg-white p-4 rounded-lg shadow-sm cursor-pointer flex justify-between items-center transition-all duration-200 hover:bg-brand-offwhite hover:shadow-md">
                                <div className="flex items-center">
                                    <span className="text-xs font-mono bg-brand-brown-light text-brand-maroon-dark px-2 py-1 rounded-md mr-4 w-24 text-center">
                                        {asm.id}
                                    </span>
                                    <div>
                                        <h4 className="font-semibold text-brand-brown-dark">{asm.title}</h4>
                                        <p className="text-xs text-gray-500">{asm.questions} Questions | {asm.duration} Minutes</p>
                                    </div>
                                </div>
                                <ArrowRight className="w-5 h-5 text-brand-gold" />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default ProgrammeDetail;