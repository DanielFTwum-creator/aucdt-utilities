import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Module, ModuleProgress, BadgeLevel, ModuleStatus } from '../types';
import Card from './ui/Card';
import ProgressBarLinear from './ProgressBarLinear';
import BadgeIcon from './BadgeIcon';
import { Lock, Play, CheckCircle } from 'lucide-react';
import { ROUTES } from '../constants';

interface ModuleCardProps {
  module: Module;
  progress?: ModuleProgress;
  className?: string;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module, progress, className = '' }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (!module.locked) {
      navigate(`${ROUTES.MODULES}/${module.id}`);
    }
  };

  const status: ModuleStatus = progress?.status || (module.locked ? 'locked' : 'in_progress');
  const progressPercentage: number = progress?.progressPercentage || 0;
  const badgeLevel: BadgeLevel = progress?.badgeLevel || 'none';

  const statusIcon = {
    locked: <Lock size={20} className="text-gray-500" />,
    in_progress: <Play size={20} className="text-primary" />,
    completed: <CheckCircle size={20} className="text-success" />,
  };

  const statusText = {
    locked: 'Locked',
    in_progress: 'In Progress',
    completed: 'Completed',
  };

  return (
    <Card
      className={`relative flex flex-col justify-between cursor-pointer group hover:shadow-lg transition-all duration-300
                  ${module.locked ? 'opacity-60 grayscale' : ''}
                  ${className}`}
      onClick={handleCardClick}
      aria-label={`Module ${module.id}: ${module.name}. Status: ${statusText[status]}. Click to view.`}
    >
      {module.locked && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 rounded-lg">
          <Lock size={48} className="text-white opacity-70" />
        </div>
      )}
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg md:text-xl font-semibold text-text-light dark:text-text-dark group-hover:text-primary dark:group-hover:text-blue-400 transition-colors duration-200">
          {module.id}: {module.name}
        </h3>
        <div className="flex items-center space-x-2">
          {statusIcon[status]}
          <BadgeIcon level={badgeLevel} size={24} />
        </div>
      </div>
      <p className="text-sm text-subtle-text-light dark:text-subtle-text-dark mb-4">
        {module.theme}
      </p>

      <div className="mt-auto"> {/* Push progress bar and status to bottom */}
        <div className="flex items-center justify-between text-sm text-subtle-text-light dark:text-subtle-text-dark mb-2">
          <span>{statusText[status]}</span>
          <span>{module.timeEstimate}</span>
        </div>
        <ProgressBarLinear value={progressPercentage} />
      </div>
    </Card>
  );
};

export default ModuleCard;