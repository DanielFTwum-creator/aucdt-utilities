import React from 'react';
import { ResponseTemplate } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';

interface ResponseRendererProps {
  content: string;
  template?: ResponseTemplate;
}

const renderHTML = (content: string) => {
  return (
    <div className="prose prose-sm max-w-none prose-p:text-[var(--color-text-primary)] prose-li:text-[var(--color-text-primary)] prose-strong:text-[var(--color-text-primary)] prose-headings:text-[var(--color-text-primary)]">
      <style>{`
        .html-doc h1, .html-doc h2, .html-doc h3 {
          color: var(--color-text-primary);
          border-left: 5px solid var(--color-accent-primary);
          padding-left: 15px;
          margin-top: 1.5rem;
        }
        .html-doc h4 {
          color: var(--color-accent-primary);
          margin-bottom: 0.5rem;
        }
        .html-doc p {
          line-height: 1.6;
          margin-bottom: 1rem;
        }
        .html-doc .highlight {
          color: var(--color-accent-primary);
          font-weight: bold;
        }
        .html-doc aside,
        .html-doc aside[style],
        .html-doc div[style*="background"] {
          margin: 1.5rem 0;
          padding: 1.5rem;
          border-left: 5px solid var(--color-accent-primary) !important;
          background-color: var(--color-bg-secondary) !important;
          color: var(--color-text-primary) !important;
          border-radius: 8px;
        }
        .html-doc aside *,
        .html-doc aside[style] *,
        .html-doc div[style*="background"] * {
          color: var(--color-text-primary) !important;
        }
        .html-doc aside strong,
        .html-doc div[style*="background"] strong {
          color: var(--color-accent-primary) !important;
        }
        .html-doc ul, .html-doc ol {
          margin-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .html-doc li {
          margin-bottom: 0.5rem;
        }
        .html-doc abbr {
          text-decoration: underline dotted;
          cursor: help;
        }
        .html-doc svg {
          display: block;
          margin: 1.5rem auto;
          max-width: 100%;
          height: auto;
        }
      `}</style>
      <div className="html-doc" dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};

const renderLaTeX = (content: string) => {
  return (
    <div className="prose prose-sm max-w-none prose-p:text-[var(--color-text-primary)]">
      <style>{`
        .latex-renderer {
          font-family: 'Fira Code', monospace;
        }
        .latex-renderer code {
          background-color: var(--color-bg-secondary);
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          color: var(--color-accent-primary);
        }
        .latex-renderer .equation {
          background-color: var(--color-bg-secondary);
          padding: 1rem;
          border-radius: 8px;
          margin: 1rem 0;
          overflow-x: auto;
        }
      `}</style>
      <div className="latex-renderer whitespace-pre-wrap">
        {content.split('\n').map((line, i) => (
          <div key={i} className={line.startsWith('$$') || line.startsWith('$') ? 'equation' : ''}>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
};

const renderInteractive = (content: string) => {
  const [expandedSections, setExpandedSections] = React.useState<Set<number>>(new Set());

  const sections = content.split(/^### /m).filter(s => s.trim());

  const toggleSection = (index: number) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div className="space-y-2">
      {sections.map((section, index) => {
        const [title, ...contentParts] = section.split('\n');
        const sectionContent = contentParts.join('\n');
        const isExpanded = expandedSections.has(index);

        return (
          <div
            key={index}
            className="border border-[var(--color-border-primary)] rounded-lg overflow-hidden transition-all duration-200"
          >
            <button
              onClick={() => toggleSection(index)}
              className="w-full flex items-center justify-between p-4 hover:bg-[var(--color-bg-secondary)] transition-colors"
              aria-expanded={isExpanded}
            >
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)] text-left">
                {title.trim() || 'Section'}
              </h3>
              <div className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                <svg className="w-5 h-5 text-[var(--color-accent-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </button>
            {isExpanded && (
              <div className="px-4 py-3 border-t border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)]">
                <div className="prose prose-sm max-w-none prose-p:text-[var(--color-text-primary)] prose-li:text-[var(--color-text-primary)]">
                  <MarkdownRenderer content={sectionContent} />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export const ResponseRenderer: React.FC<ResponseRendererProps> = ({ content, template = ResponseTemplate.Markdown }) => {
  switch (template) {
    case ResponseTemplate.HTMLDocumentation:
      return renderHTML(content);
    case ResponseTemplate.LaTeX:
      return renderLaTeX(content);
    case ResponseTemplate.Interactive:
      return renderInteractive(content);
    case ResponseTemplate.Markdown:
    default:
      return (
        <div className="prose prose-sm max-w-none prose-p:text-[var(--color-text-primary)] prose-li:text-[var(--color-text-primary)] prose-strong:text-[var(--color-text-primary)] prose-headings:text-[var(--color-text-primary)]">
          <MarkdownRenderer content={content} />
        </div>
      );
  }
};
