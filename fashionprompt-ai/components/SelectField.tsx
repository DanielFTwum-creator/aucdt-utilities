import React from 'react';
import { OptionItem } from '../types';

interface SelectFieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: OptionItem[];
}

const SelectField: React.FC<SelectFieldProps> = ({ label, id, value, onChange, options }) => {
  return (
    <div>
      <label htmlFor={id} className="block mb-2 text-sm font-semibold text-slate-600 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-3 bg-white border-2 border-slate-200 rounded-xl appearance-none text-slate-700 font-medium focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer shadow-sm hover:border-slate-300"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
          <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SelectField;
