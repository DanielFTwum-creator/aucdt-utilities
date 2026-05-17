import React from 'react';
import { Message } from '../types';
import { ResponseRenderer } from './ResponseRenderer';
import { SourceIcon, FlaskConicalIcon } from './Icons';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { id, role, content, sources, isError } = message;

  if (role === 'user') {
    return (
      <div className="flex justify-end animate-fade-in">
        <div className="bg-[var(--color-accent-primary)] text-[var(--color-text-on-accent)] p-4 rounded-lg shadow-lg max-w-lg border border-[var(--color-accent-primary-hover)] hover:shadow-[rgba(100,255,218,0.2)] transition-shadow duration-200">
          <p className="font-medium leading-relaxed">{content}</p>
        </div>
      </div>
    );
  }

  if (id === 'loading-message') {
    return (
        <div className="flex justify-start animate-fade-in">
            <div className="p-4 rounded-lg shadow-lg border w-full max-w-2xl bg-[var(--color-bg-secondary)] border-[var(--color-border-primary)] hover:border-[var(--color-border-focus)] transition-colors duration-200">
                <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-[var(--color-accent-primary)]">
                        <FlaskConicalIcon className="w-5 h-5 text-[var(--color-text-on-accent)]" />
                    </div>
                    <div className="flex items-baseline space-x-1">
                        <span className="font-semibold text-[var(--color-text-accent)]">
                            {content}
                        </span>
                        <div className="w-1.5 h-1.5 bg-[var(--color-text-accent)] rounded-full dot-1"></div>
                        <div className="w-1.5 h-1.5 bg-[var(--color-text-accent)] rounded-full dot-2"></div>
                        <div className="w-1.5 h-1.5 bg-[var(--color-text-accent)] rounded-full dot-3"></div>
                    </div>
                </div>
            </div>
        </div>
    );
  }
  
  const bubbleClasses = isError
    ? "bg-red-500/10 border-[var(--color-error)]"
    : "bg-[var(--color-bg-secondary)] border-[var(--color-border-primary)] hover:border-[var(--color-border-focus)] hover:shadow-[rgba(100,255,218,0.1)]";

  return (
    <div className="flex justify-start animate-fade-in">
      <div className={`p-4 rounded-lg shadow-lg border w-full max-w-2xl transition-all duration-200 ${bubbleClasses}`}>
        <div className="flex items-center space-x-2 mb-3">
            <div className={`p-2 rounded-lg ${isError ? 'bg-[var(--color-error)]' : 'bg-[var(--color-accent-primary)]'}`}>
                <FlaskConicalIcon className="w-5 h-5 text-[var(--color-text-on-accent)]" />
            </div>
            <span className={`font-bold ${isError ? 'text-[var(--color-error)]' : 'text-[var(--color-text-accent)]'}`}>
                BioChemAI
            </span>
        </div>

        <div className="text-[var(--color-text-primary)] leading-relaxed">
          <ResponseRenderer content={content} template={message.template} />
        </div>

        {sources && sources.length > 0 && !isError && (
          <div className="mt-4 pt-3 border-t border-[var(--color-border-secondary)]">
            <h4 className="text-xs font-bold text-[var(--color-text-accent)] mb-3 flex items-center uppercase tracking-wider">
                <SourceIcon className="w-4 h-4 mr-2" />
                Sources
            </h4>
            <ol className="list-decimal list-inside space-y-1">
              {sources.map((source, index) => (
                <li key={index} className="text-xs text-[var(--color-text-secondary)]">
                  <a
                    href={source.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-text-accent)] hover:underline hover:brightness-110 transition-all duration-200 break-all"
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