import React from 'react';
import { JobStatus, ExecutionStatus } from '../types';

interface StatusBadgeProps {
  status: JobStatus | ExecutionStatus | string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStyles = (s: string) => {
    switch (s) {
      case JobStatus.ACTIVE:
      case ExecutionStatus.COMPLETED:
        return 'bg-green-100 text-green-800 border-green-200';
      case JobStatus.PAUSED:
      case ExecutionStatus.QUEUED:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case JobStatus.ARCHIVED:
      case ExecutionStatus.CANCELLED:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case JobStatus.DELETED:
      case ExecutionStatus.FAILED:
      case ExecutionStatus.TIMEOUT:
        return 'bg-red-100 text-red-800 border-red-200';
      case ExecutionStatus.RUNNING:
        return 'bg-blue-100 text-blue-800 border-blue-200 animate-pulse';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStyles(status)}`}>
      {status}
    </span>
  );
};

export default StatusBadge;