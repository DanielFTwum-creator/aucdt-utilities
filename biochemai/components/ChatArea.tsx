import React, { useEffect, useRef } from 'react';
import { Message } from '../types';
import { MessageBubble } from './MessageBubble';
import { SVGNetworkBackground } from './SVGNetworkBackground';

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ messages, isLoading }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const loadingMessage: Message = {
    id: 'loading-message',
    role: 'ai',
    content: "BioChemAI is thinking",
  };

  return (
    <div className="relative">
      <SVGNetworkBackground accentColor="--color-accent-primary" opacity={0.25} />
      <div className="space-y-4 mb-6 relative z-10">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isLoading && <MessageBubble message={loadingMessage} />}
        <div ref={scrollRef} />
      </div>
    </div>
  );
};