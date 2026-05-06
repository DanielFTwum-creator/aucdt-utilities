
import React from 'react';
import AppCard from './AppCard';
import { AppItem } from '../types';

interface AppGridProps {
  apps: AppItem[];
}

const AppGrid: React.FC<AppGridProps> = ({ apps }) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {apps.map((app, index) => (
        <AppCard key={app.id} app={app} index={index} />
      ))}
    </div>
  );
};

export default AppGrid;