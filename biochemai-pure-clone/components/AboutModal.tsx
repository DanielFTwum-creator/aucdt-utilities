import React, { useEffect, useRef } from 'react';
import { BookIcon, FlaskConicalIcon, GithubIcon } from './Icons';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToDocs: () => void;
}

const metadata = {
  name: "BioChemAI v151120251713",
  description: "An intelligent web-based teaching assistant designed to provide adaptive biochemistry education across multiple learning levels, leveraging AI to deliver personalized, level-appropriate explanations with source citations.",
};

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, onNavigateToDocs }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const [appName, version] = metadata.name.split(' v');

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-[var(--color-bg-modal-overlay)] z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-modal-title"
    >
      <div
        ref={modalRef}
        className="bg-[var(--color-bg-secondary)] rounded-2xl shadow-xl w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-8 text-center">
          <div className="mx-auto bg-[var(--color-accent-primary)] p-3 rounded-lg w-fit mb-4">
            <FlaskConicalIcon className="w-8 h-8 text-[var(--color-text-on-accent)]" />
          </div>
          <h2 id="about-modal-title" className="text-2xl font-bold text-[var(--color-text-primary)]">{appName}</h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-4">Version {version}</p>
          <p className="text-[var(--color-text-tertiary)] mb-6">
            {metadata.description}
          </p>
          <div className="space-y-3">
            <button
                onClick={onNavigateToDocs}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 font-semibold text-[var(--color-text-on-accent)] bg-[var(--color-accent-primary)] rounded-lg hover:bg-[var(--color-accent-primary-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-accent-primary)] focus:ring-offset-[var(--color-bg-primary)] transition"
              >
                <BookIcon className="w-4 h-4" />
                View Documentation
            </button>
            <a 
              href="https://github.com/google-gemini-vignettes/BioChemAI-Teaching-Aid"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 font-semibold text-[var(--color-text-secondary)] bg-[var(--color-bg-tertiary)] rounded-lg hover:bg-[var(--color-border-primary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-text-tertiary)] focus:ring-offset-[var(--color-bg-primary)] transition"
            >
              <GithubIcon className="w-4 h-4" />
              Source Code on GitHub
            </a>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="mt-6 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
