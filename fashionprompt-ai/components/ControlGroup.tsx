import React from 'react';
import { ArrowRightIcon } from './Icons';

interface ControlGroupProps {
  title: string;
  children: React.ReactNode;
  badge?: React.ReactNode;
}

const ControlGroup: React.FC<ControlGroupProps> = ({ title, children, badge }) => {
  return (
    <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-100 hover:border-indigo-100 transition-colors duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-800 font-bold text-lg flex items-center gap-2">
          <ArrowRightIcon className="w-5 h-5 text-indigo-500" />
          {title}
        </h3>
        {badge}
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

export default ControlGroup;
