import React from 'react';
import { COLORS } from '../constants';

interface ProgressBarLinearProps {
  value: number; // 0-100
  className?: string;
}

const ProgressBarLinear: React.FC<ProgressBarLinearProps> = ({ value, className = '' }) => {
  return (
    <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 ${className}`}>
      <div
        className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );
};

export default ProgressBarLinear;