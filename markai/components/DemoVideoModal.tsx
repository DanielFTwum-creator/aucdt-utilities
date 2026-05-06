
import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface DemoVideoModalProps {
  onClose: () => void;
}

const DemoVideoModal: React.FC<DemoVideoModalProps> = ({ onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Focus trapping
    const modal = modalRef.current;
    if (modal) {
        const focusableElements = modal.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        closeButtonRef.current?.focus();

        const handleTabKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'Tab') {
                if (event.shiftKey) { // Shift+Tab
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        event.preventDefault();
                    }
                } else { // Tab
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        event.preventDefault();
                    }
                }
            }
        };
        modal.addEventListener('keydown', handleTabKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            modal.removeEventListener('keydown', handleTabKeyPress);
        };
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="demo-video-title"
    >
      <div 
        ref={modalRef}
        className="bg-secondary rounded-2xl shadow-2xl w-full max-w-4xl aspect-video relative flex flex-col border border-default" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-default">
            <h2 id="demo-video-title" className="text-xl font-bold text-primary">MarkAI Product Demo</h2>
            <button 
                ref={closeButtonRef}
                onClick={onClose} 
                className="p-2 rounded-full text-secondary hover:bg-primary hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary"
                aria-label="Close video demo"
            >
                <X className="h-6 w-6" />
            </button>
        </div>
        <div className="flex-grow bg-black rounded-b-xl">
             <iframe 
                className="w-full h-full" 
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0"
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
            ></iframe>
        </div>
      </div>
    </div>
  );
};

export default DemoVideoModal;
