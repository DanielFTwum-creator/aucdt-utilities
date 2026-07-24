
import React from 'react';
import { Loader2 } from 'lucide-react';
import { COLORS } from '../../constants';

interface LoaderProps {
  size?: number;
  message?: string;
  fullScreen?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({ size = 48, message, fullScreen = false }) => {
  const containerClasses = fullScreen 
    ? "fixed inset-0 flex flex-col items-center justify-center bg-gray-50/80 z-50"
    : "flex flex-col items-center justify-center my-8";

  return (
    <div className={containerClasses}>
      <Loader2 className="animate-spin" size={size} style={{ color: COLORS.aucdtGreen }} />
      {message && <p className="mt-4 text-lg font-semibold" style={{ color: COLORS.aucdtDeepBrown }}>{message}</p>}
    </div>
  );
};
