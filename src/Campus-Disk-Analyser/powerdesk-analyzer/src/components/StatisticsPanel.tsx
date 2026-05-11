import React from 'react';
import { HardDrive, Folder, FileText, Clock } from 'lucide-react';
import { DiskAnalysisData } from '../types/disk-analysis';

interface StatisticsPanelProps {
  data: DiskAnalysisData;
}

const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ data }) => {
  const totalSize = data.directory_analysis.reduce((sum, dir) => sum + dir.size_kb, 0);
  const totalFiles = data.directory_analysis.reduce((sum, dir) => sum + dir.file_count, 0);
  const totalFolders = data.directory_analysis.length;
  const largestFolder = data.directory_analysis.reduce((max, dir) => 
    dir.size_kb > max.size_kb ? dir : max
  );

  const formatSize = (sizeKb: number): string => {
    if (sizeKb >= 1024 * 1024 * 1024) {
      return `${(sizeKb / (1024 * 1024 * 1024)).toFixed(1)} TB`;
    } else if (sizeKb >= 1024 * 1024) {
      return `${(sizeKb / (1024 * 1024)).toFixed(1)} GB`;
    } else if (sizeKb >= 1024) {
      return `${(sizeKb / 1024).toFixed(1)} MB`;
    } else {
      return `${sizeKb} KB`;
    }
  };

  const StatCard: React.FC<{ 
    icon: React.ReactNode; 
    title: string; 
    value: string; 
    subtitle?: string;
    color: string;
  }> = ({ icon, title, value, subtitle, color }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center">
        <div className={`flex-shrink-0 ${color}`}>
          {icon}
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            {subtitle && (
              <p className="ml-2 text-sm text-gray-500">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        icon={<HardDrive className="h-8 w-8" />}
        title="Total Size"
        value={formatSize(totalSize)}
        color="text-blue-600"
      />
      <StatCard
        icon={<Folder className="h-8 w-8" />}
        title="Folders Analyzed"
        value={totalFolders.toLocaleString()}
        color="text-green-600"
      />
      <StatCard
        icon={<FileText className="h-8 w-8" />}
        title="Total Files"
        value={totalFiles.toLocaleString()}
        color="text-purple-600"
      />
      <StatCard
        icon={<Clock className="h-8 w-8" />}
        title="Largest Folder"
        value={largestFolder.name}
        subtitle={largestFolder.size_formatted}
        color="text-orange-600"
      />
    </div>
  );
};

export default StatisticsPanel;
