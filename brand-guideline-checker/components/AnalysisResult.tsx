import React from 'react';
import type { AnalysisReport, OverallCompliance } from '../types';
import { Spinner } from './Spinner';
import { Icon } from './Icon';

interface AnalysisResultProps {
  result: AnalysisReport | null;
  isLoading: boolean;
  error: string | null;
}

const statusConfig: Record<OverallCompliance, { text: string; bg: string; text_color: string; icon: 'check' | 'warning' | 'cross' }> = {
    COMPLIANT: { text: 'Compliant', bg: 'bg-green-100', text_color: 'text-green-800', icon: 'check' },
    NEEDS_REVIEW: { text: 'Needs Review', bg: 'bg-yellow-100', text_color: 'text-yellow-800', icon: 'warning' },
    NON_COMPLIANT: { text: 'Non-Compliant', bg: 'bg-red-100', text_color: 'text-red-800', icon: 'cross' }
};

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="mt-8 text-center">
        <Spinner />
        <p className="mt-4 text-lg text-[#6B1028]">Analyzing your image...</p>
        <p className="text-gray-500">This may take a moment.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 p-4 bg-red-100 text-red-800 rounded-lg border border-red-300 text-center">
        <p className="font-semibold">Analysis Failed</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!result) {
    return null;
  }
  
  const config = statusConfig[result.overallCompliance];

  return (
    <div className="mt-10 animate-fade-in">
        <h2 className="text-2xl font-bold text-center mb-6 text-[#6B1028]">Analysis Report</h2>
        
        <div className={`p-4 rounded-lg flex items-center justify-center gap-3 ${config.bg} ${config.text_color}`}>
            <Icon name={config.icon} className="w-6 h-6" />
            <span className="font-bold text-lg">Overall Status: {config.text}</span>
        </div>

        <div className="mt-6 space-y-4">
            {result.complianceDetails.map((detail, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg text-[#2C1810]">{detail.category}</h3>
                        {detail.compliant ? (
                            <div className="flex items-center gap-2 text-green-600">
                                <Icon name="check" className="w-5 h-5" />
                                <span className="font-bold">Pass</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-red-600">
                                <Icon name="cross" className="w-5 h-5" />
                                <span className="font-bold">Fail</span>
                            </div>
                        )}
                    </div>
                    <p className="mt-2 text-gray-600 font-latex text-lg leading-relaxed">{detail.reasoning}</p>
                </div>
            ))}
        </div>

        <div className="mt-8 bg-[#E6D5C7]/30 p-5 rounded-lg border-l-4 border-[#D4AF37]">
            <h3 className="font-semibold text-lg text-[#6B1028] mb-2">Suggestions for Improvement</h3>
            <p className="text-gray-700 whitespace-pre-wrap font-latex text-lg leading-relaxed">{result.suggestions}</p>
        </div>
    </div>
  );
};