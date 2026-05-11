import React, { useMemo, useCallback, useLayoutEffect, useEffect, useRef, useState } from 'react';
import { Award, Loader2 } from 'lucide-react';
import { AUCDT_COLORS } from '../constants';
import { Message } from '../types';

// Declare MathJax on the window object for TypeScript
declare global {
    interface Window {
        MathJax: any;
    }
}

// --- MathJax Renderer ---
interface LatexRendererProps {
    children: string;
}

const MemoizedLatexRenderer: React.FC<LatexRendererProps> = ({ children }) => {
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (children && ref.current && window.MathJax?.typesetPromise) {
            // Tell MathJax to typeset the content of this component.
            // Using a promise ensures that the typesetting is complete before any subsequent actions.
            window.MathJax.typesetPromise([ref.current]).catch((err: any) =>
                console.error('MathJax typesetting error:', err)
            );
        }
    }, [children]); // Rerun the effect when the children prop changes

    // Render the raw children string. MathJax will process it.
    return <span ref={ref}>{children}</span>;
};
export const LatexRenderer = React.memo(MemoizedLatexRenderer);


// --- Spinner ---
export const Spinner: React.FC<{ size?: number }> = ({ size = 48 }) => (
    <div className="flex justify-center items-center p-8">
        <Loader2 className="animate-spin" size={size} style={{ color: 'var(--primary-text-color)' }} />
    </div>
);

// --- Confirmation Modal ---
interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}
export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[var(--card-background)] rounded-xl shadow-lg p-8 m-4 max-w-md w-full border-t-4" style={{ borderColor: AUCDT_COLORS.gold }}>
        <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--primary-text-color)' }}>{title}</h2>
        <p className="text-lg mb-6">{message}</p>
        <div className="flex justify-end gap-4">
          <button onClick={onCancel} className="py-2 px-6 rounded-lg font-bold" style={{ backgroundColor: 'var(--card-border-color)', color: 'var(--primary-text-color)' }}>Cancel</button>
          <button onClick={onConfirm} className="py-2 px-6 rounded-lg font-bold" style={{ backgroundColor: AUCDT_COLORS.green, color: AUCDT_COLORS.white }}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

// --- Bonus Section ---
interface BonusSectionProps {
    title: string;
    content: string;
}
export const BonusSection: React.FC<BonusSectionProps> = ({ title, content }) => {
    if (!title || !content) return null;
    return (
        <div className="mt-8 p-4 border-l-4 rounded-r-lg bg-opacity-50" style={{ borderColor: AUCDT_COLORS.gold, backgroundColor: 'var(--card-border-color)' }}>
            <div className="flex items-center">
                <Award className="h-6 w-6 mr-3 flex-shrink-0" style={{ color: AUCDT_COLORS.gold }} />
                <h3 className="text-lg font-bold" style={{ color: 'var(--primary-text-color)' }}>{title}</h3>
            </div>
            <p className="mt-2 text-base pl-9">
                <LatexRenderer>{content}</LatexRenderer>
            </p>
        </div>
    );
};

// --- Message Display ---
export const MessageDisplay: React.FC<{ message: Message | null }> = ({ message }) => {
    if (!message) return null;

    const styles: React.CSSProperties = {
        backgroundColor: `var(--message-${message.type}-bg)`,
        color: `var(--message-${message.type}-text)`,
    };

    return <div className="p-3 rounded-lg mb-4 text-center" style={styles}>{message.text}</div>;
};