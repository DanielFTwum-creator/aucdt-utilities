import React from 'react';
import { COLORS } from '../constants';
import { useTheme } from '../context/ThemeContext';

interface ProgressBarCircularProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  className?: string;
}

const ProgressBarCircular: React.FC<ProgressBarCircularProps> = ({
  value,
  size = 120,
  strokeWidth = 10,
  className = '',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;
  const { theme } = useTheme();

  const textColor = theme === 'dark' ? COLORS.textDark : COLORS.textLight;
  const trackColor = theme === 'dark' ? '#4a5568' : '#e2e8f0'; // Tailwind gray-700 / gray-200
  const progressColor = COLORS.primary;

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          stroke={trackColor}
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          stroke={progressColor}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset: offset }}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <span
        className="absolute text-2xl font-bold"
        style={{ color: textColor }}
      >
        {value}%
      </span>
    </div>
  );
};

export default ProgressBarCircular;