import React, { useState, useEffect, useRef } from 'react';
import { createChat } from '../services/geminiService';
import type { ChatMessage } from '../types';
import type { Chat } from '@google/genai';

const Module5Storytelling: React.FC = () => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const startStory = async () => {
        setIsLoading(true);
        const newChat = createChat();
        setChat(newChat);
        const initialMessage = "Start a dark fantasy story for me in one paragraph and give me two choices.";
        const response = await newChat.sendMessage({ message: initialMessage });

        setHistory([
            { role: 'user', text: "Let's begin the story." },
            { role: 'model', text: response.text }
        ]);
        setIsLoading(false);
    };

    startStory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [history]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading || !chat) return;

    const newUserMessage: ChatMessage = { role: 'user', text: userInput };
    setHistory(prev => [...prev, newUserMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      const response = await chat.sendMessage({ message: userInput });
      const modelMessage: ChatMessage = { role: 'model', text: response.text };
      setHistory(prev => [...prev, modelMessage]);
    } catch (error: any) {
      console.error("Error sending message:", error);
      let errorText = "Sorry, an unexpected error occurred. Please try again.";
      
      const errorDetail = error.message;
      if (errorDetail === 'QUOTA_EXCEEDED') {
        errorText = "The storyteller is taking a breath. (Rate limit reached). Please wait a minute before sending your next choice.";
      } else if (errorDetail === 'SAFETY_BLOCK') {
        errorText = "That choice led to a path I cannot follow. (Safety block). Please try a different direction.";
      } else if (errorDetail === 'INVALID_KEY') {
        errorText = "Institutional access issue (Invalid API Key). Please contact support.";
      }
      
      const errorMessage: ChatMessage = { role: 'model', text: errorText };
      setHistory(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto h-[75vh] flex flex-col">
      <div 
        ref={chatContainerRef}
        className="flex-1 bg-[var(--color-background-card)]/50 p-6 rounded-t-lg border border-b-0 border-[var(--color-border-card)] overflow-y-auto space-y-4"
        aria-live="polite"
      >
        {history.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            <div className={`max-w-lg p-3 rounded-lg font-inter ${msg.role === 'user' ? 'bg-[var(--color-primary)] text-[var(--color-foreground-on-primary)] shadow-md' : 'bg-[var(--color-background-card-hover)] text-[var(--color-foreground)] border border-[var(--color-border-card)]'}`}>
              <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start" aria-label="AI is typing">
                 <div className="max-w-lg p-3 rounded-lg bg-[var(--color-background-card-hover)] text-[var(--color-foreground)] border border-[var(--color-border-card)]">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-pulse [animation-delay:0.2s]"></div>
                        <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-pulse [animation-delay:0.4s]"></div>
                    </div>
                </div>
            </div>
        )}
      </div>
      <form onSubmit={handleSendMessage} className="p-4 bg-[var(--color-background-card)]/80 backdrop-blur-sm rounded-b-lg border border-t-0 border-[var(--color-border-card)] flex items-center">
        <label htmlFor="story-input" className="sr-only">Your choice</label>
        <input
          id="story-input"
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Make your choice..."
          disabled={isLoading}
          className="flex-1 bg-[var(--color-background-input)] border border-[var(--color-border-input)] rounded-l-md p-3 text-[var(--color-foreground)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition duration-200 disabled:opacity-50 font-inter"
        />
        <button
          type="submit"
          disabled={isLoading || !userInput.trim()}
          aria-label="Send your choice to the storyteller"
          title="Submit your answer"
          className="bg-[var(--color-primary)] hover:bg-[#b6963a] text-[var(--color-foreground-on-primary)] font-bold py-3 px-6 rounded-r-md transition duration-300 disabled:bg-[var(--color-primary)]/50 disabled:cursor-not-allowed font-inter"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Module5Storytelling;
