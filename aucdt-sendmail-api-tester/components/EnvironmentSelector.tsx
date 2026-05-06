import React from 'react';
import { Environment } from '../types';

interface EnvironmentSelectorProps {
  selected: Environment;
  onChange: (env: Environment) => void;
}

const environments = [
    { key: Environment.DEV, label: 'DEV' },
    { key: Environment.QA, label: 'QA' },
    { key: Environment.UAT, label: 'UAT' },
];

const EnvironmentSelector: React.FC<EnvironmentSelectorProps> = ({ selected, onChange }) => {
    return (
        <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                Environment
            </label>
            <div className="flex bg-gray-100 rounded-full p-1" role="group">
                {environments.map(({ key, label }) => (
                    <button
                        key={key}
                        type="button"
                        onClick={() => onChange(key)}
                        className={`w-full py-2.5 text-sm font-semibold rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-[#8B1538] ${
                            selected === key
                                ? 'bg-[#8B1538] text-white shadow-md'
                                : 'text-gray-500 hover:bg-white/60'
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default EnvironmentSelector;