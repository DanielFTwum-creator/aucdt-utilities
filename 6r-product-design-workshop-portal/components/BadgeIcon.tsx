import React from 'react';
import { Award, Trophy, Star } from 'lucide-react';
import { BadgeLevel } from '../types';

interface BadgeIconProps {
  level: BadgeLevel;
  className?: string;
  size?: number;
}

const BadgeIcon: React.FC<BadgeIconProps> = ({ level, className = '', size = 20 }) => {
  let iconComponent;
  let colorClass = '';
  let label = '';

  switch (level) {
    case 'bronze':
      iconComponent = <Award size={size} />;
      colorClass = 'text-amber-700 dark:text-amber-500';
      label = 'Bronze Badge';
      break;
    case 'silver':
      iconComponent = <Trophy size={size} />;
      colorClass = 'text-gray-400 dark:text-gray-300';
      label = 'Silver Badge';
      break;
    case 'gold':
      iconComponent = <Star size={size} />;
      colorClass = 'text-yellow-500 dark:text-yellow-400';
      label = 'Gold Badge';
      break;
    case 'none':
    default:
      return null; // Or a placeholder if desired
  }

  return (
    <div className={`inline-flex items-center space-x-1 ${colorClass} ${className}`} aria-label={label}>
      {iconComponent}
      <span className="sr-only">{label}</span>
    </div>
  );
};

export default BadgeIcon;