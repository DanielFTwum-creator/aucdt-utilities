import React from 'react';
import { Message } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';
import { SourceIcon, FlaskConicalIcon } from './Icons';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { id, role, content, sources, isError } = message;

  if (role === 'user') {
    return (
      <div className="flex justify-end animate-fade-in">
        <div className="bg-[var(--color-accent-primary)] text-[var(--color-text-on-accent)] p-4 rounded-2xl shadow-md max-w-lg">
          <p>{content}</p>
        </div>
      </div>
    );
  }

  if (id === 'loading-message') {
    return (
        <div className="flex justify-start animate-fade-in">
            <div className="p-4 rounded-2xl shadow-lg border w-full max-w-2xl bg-[var(--color-bg-secondary)] border-[var(--color-border-primary)]">
                <div className="flex items-center space-x-3">
                    <div className="p-1.5 rounded-lg bg-[var(--color-accent-primary)]">
                        <FlaskConicalIcon className="w-5 h-5 text-[var(--color-text-on-accent)]" />
                    </div>
                    <div className="flex items-baseline space-x-1">
                        <span className="font-semibold text-[var(--color-text-secondary)] italic">
                            {content}
                        </span>
                        <div className="w-1.5 h-1.5 bg-[var(--color-text-tertiary)] rounded-full dot-1"></div>
                        <div className="w-1.5 h-1.5 bg-[var(--color-text-tertiary)] rounded-full dot-2"></div>
                        <div className="w-1.5 h-1.5 bg-[var(--color-text-tertiary)] rounded-full dot-3"></div>
                    </div>
                </div>
            </div>
        </div>
    );
  }
  
  const bubbleClasses = isError 
    ? "bg-red-500/10 border-[var(--color-error)]" 
    : "bg-[var(--color-bg-secondary)] border-[var(--color-border-primary)]";

  return (
    <div className="flex justify-start animate-fade-in">
      <div className={`p-4 rounded-2xl shadow-lg border w-full max-w-2xl ${bubbleClasses}`}>
        <div className="flex items-center space-x-2 mb-2">
            <div className={`p-1.5 rounded-lg ${isError ? 'bg-[var(--color-error)]' : 'bg-[var(--color-accent-primary)]'}`}>
                <FlaskConicalIcon className="w-4 h-4 text-[var(--color-text-on-accent)]" />
            </div>
            <span className={`font-semibold ${isError ? 'text-[var(--color-error)]' : 'text-[var(--color-text-accent)]'}`}>
                BioChemAI
            </span>
        </div>

        <div className="prose prose-sm max-w-none prose-p:text-[var(--color-text-primary)] prose-li:text-[var(--color-text-primary)] prose-strong:text-[var(--color-text-primary)] prose-headings:text-[var(--color-text-primary)]">
            <MarkdownRenderer content={content} />
        </div>

        {sources && sources.length > 0 && !isError && (
          <div className="mt-4 pt-3 border-t border-[var(--color-border-primary)]">
            <h4 className="text-xs font-semibold text-[var(--color-text-secondary)] mb-2 flex items-center">
                <SourceIcon className="w-4 h-4 mr-1.5" />
                SOURCES
            </h4>
            <ol className="list-decimal list-inside space-y-1">
              {sources.map((source, index) => (
                <li key={index} className="text-sm">
                  <a 
                    href={source.uri} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[var(--color-text-accent)] hover:underline break-all"
                  >
                    {source.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};