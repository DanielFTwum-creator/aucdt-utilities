import React from 'react';
import { ToastMessage } from '../types';
import { Icons } from './Icons';

export const Toast: React.FC<ToastMessage> = ({ message, type, action }) => {
    return (
        <div className={`
            fixed bottom-8 right-8 z-[100] flex items-center gap-4 px-6 py-4 rounded-xl shadow-2xl border animate-slide-in-right backdrop-blur-md
            ${type === 'success' 
                ? 'bg-bg-secondary/90 border-green-500/30 text-green-400' 
                : 'bg-bg-secondary/90 border-red-500/30 text-red-400'
            }
        `}>
            <div className="flex items-center gap-3">
                {type === 'success' ? <Icons.CheckCircle className="w-5 h-5" /> : <Icons.AlertCircle className="w-5 h-5" />}
                <span className="font-mono text-sm font-medium text-text-primary">{message}</span>
            </div>
            
            {action && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        action.onClick();
                    }}
                    className="ml-2 px-3 py-1.5 rounded-lg bg-accent-primary/20 hover:bg-accent-primary/30 text-accent-primary text-xs font-mono font-bold uppercase tracking-wider border border-accent-primary/30 transition-all active:scale-95"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
};