import React, { useState, useRef, useEffect } from 'react';
import { ResponseTemplate } from '../types';
import { RESPONSE_TEMPLATES } from '../constants';
import { MarkdownIcon, BookIcon, SparklesIcon, FileIcon } from './Icons';

interface TemplateSelectorProps {
  currentTemplate: ResponseTemplate;
  onSelectTemplate: (template: ResponseTemplate) => void;
}

const templateIcons: Record<ResponseTemplate, React.ReactNode> = {
  [ResponseTemplate.Markdown]: <MarkdownIcon className="w-4 h-4" />,
  [ResponseTemplate.HTMLDocumentation]: <BookIcon className="w-4 h-4" />,
  [ResponseTemplate.LaTeX]: <SparklesIcon className="w-4 h-4" />,
  [ResponseTemplate.Interactive]: <FileIcon className="w-4 h-4" />,
};

const templateDescriptions: Record<ResponseTemplate, string> = {
  [ResponseTemplate.Markdown]: 'Clean, readable markdown with formatting',
  [ResponseTemplate.HTMLDocumentation]: 'Formal HTML documentation style with gold accents',
  [ResponseTemplate.LaTeX]: 'Scientific notation with full LaTeX support for equations',
  [ResponseTemplate.Interactive]: 'Interactive elements with expandable sections',
};

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ currentTemplate, onSelectTemplate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] p-2 rounded-lg transition-all duration-200 flex items-center gap-2"
        title="Select response format"
        aria-label="Select response format"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <div className="w-5 h-5 flex items-center justify-center">
          {templateIcons[currentTemplate]}
        </div>
        <span className="hidden md:inline text-sm font-medium">{currentTemplate}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-[var(--color-bg-contrast)] rounded-lg shadow-lg border border-[var(--color-border-primary)] z-30 animate-fade-in">
          <div className="p-3">
            <h3 className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-3 px-2">
              Response Format
            </h3>
            <div className="space-y-2">
              {RESPONSE_TEMPLATES.map((template) => (
                <button
                  key={template}
                  onClick={() => {
                    onSelectTemplate(template);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-start gap-3 ${
                    currentTemplate === template
                      ? 'bg-[var(--color-bg-secondary)] border border-[var(--color-accent-primary)]'
                      : 'hover:bg-[var(--color-bg-secondary)] border border-transparent'
                  }`}
                  role="menuitem"
                  aria-selected={currentTemplate === template}
                >
                  <div className={`w-5 h-5 mt-1 flex-shrink-0 flex items-center justify-center rounded-lg ${
                    currentTemplate === template
                      ? 'bg-[var(--color-accent-primary)] text-[var(--color-text-on-accent)]'
                      : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]'
                  }`}>
                    {templateIcons[template]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-semibold text-sm ${
                      currentTemplate === template
                        ? 'text-[var(--color-text-primary)]'
                        : 'text-[var(--color-text-secondary)]'
                    }`}>
                      {template}
                    </div>
                    <div className="text-xs text-[var(--color-text-tertiary)] mt-0.5">
                      {templateDescriptions[template]}
                    </div>
                  </div>
                  {currentTemplate === template && (
                    <div className="w-2 h-2 rounded-full bg-[var(--color-accent-primary)] flex-shrink-0 mt-2"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
