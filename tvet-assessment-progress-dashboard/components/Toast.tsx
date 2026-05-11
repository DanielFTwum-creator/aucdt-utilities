
import React from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { Notification } from '../types';

interface Props {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<Props> = ({ notifications, onDismiss }) => {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {notifications.map((n) => (
        <div 
          key={n.id} 
          className={`pointer-events-auto flex items-center gap-3 pl-4 pr-3 py-3 rounded-xl shadow-2xl backdrop-blur-xl border animate-in slide-in-from-right-full duration-300 max-w-sm ${
            n.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
            n.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
            'bg-blue-500/10 border-blue-500/20 text-blue-400'
          }`}
          role="alert"
        >
          {n.type === 'success' && <CheckCircle size={18} className="shrink-0" />}
          {n.type === 'error' && <AlertCircle size={18} className="shrink-0" />}
          {n.type === 'info' && <Info size={18} className="shrink-0" />}
          
          <span className="text-xs font-bold font-mono grow">{n.message}</span>
          
          <button 
            onClick={() => onDismiss(n.id)} 
            className="p-1 hover:bg-white/10 rounded-lg transition-colors shrink-0"
            aria-label="Dismiss Notification"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
