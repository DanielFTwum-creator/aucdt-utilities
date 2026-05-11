import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { motion, AnimatePresence } from "motion/react";
import { Icons } from './Icons';

interface Message {
  id: string;
  sender: 'user' | 'agent';
  content: string;
  timestamp: Date;
  promptId?: string;
}

interface AIAssistantProps {
  externalInput?: string;
  onInputConsumed?: () => void;
  forceOpen?: boolean;
}

export const PrimaryAIAgent: React.FC<AIAssistantProps> = ({ externalInput, onInputConsumed, forceOpen }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      sender: 'agent',
      content: 'Hello! I am your AI Assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<Chat | null>(null);

  useEffect(() => {
    if (externalInput) {
      setInput(externalInput);
      if (onInputConsumed) onInputConsumed();
    }
  }, [externalInput, onInputConsumed]);

  useEffect(() => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && !chatRef.current) {
      const ai = new GoogleGenAI({ apiKey });
      chatRef.current = ai.chats.create({
        model: 'gemini-1.5-flash',
        config: {
          systemInstruction: 'You are a helpful and concise AI assistant. Provide clear, well-structured responses.'
        }
      });
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      sender: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    try {
      if (!chatRef.current) {
        throw new Error("AI client not initialized.");
      }
      
      const response = await chatRef.current.sendMessage({ message: userMessage.content });
      const agentMessage: Message = {
        id: crypto.randomUUID(),
        sender: 'agent',
        content: response.text || "I'm sorry, I couldn't generate a response.",
        timestamp: new Date(),
        promptId: `p-${Date.now()}`
      };
      setMessages(prev => [...prev, agentMessage]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        sender: 'agent',
        content: "Error: Communication with the agent failed. Please try again.",
        timestamp: new Date()
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto border border-border rounded-xl overflow-hidden bg-bg-secondary shadow-lg">
      <header className="bg-bg-tertiary p-4 border-b border-border text-center font-mono font-bold text-text-primary">
        Primary AI Assistant
      </header>

      <div className="flex-1 overflow-y-auto p-6 bg-bg-primary space-y-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className={`
                max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm
                ${msg.sender === 'user' 
                  ? 'bg-accent-primary text-white rounded-br-sm' 
                  : 'bg-bg-tertiary border border-border text-text-secondary rounded-bl-sm'}
              `}>
                {msg.content}
              </div>
              {msg.promptId && (
                <span className="text-[10px] text-text-muted mt-1 font-mono">
                  ID: {msg.promptId}
                </span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isProcessing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="self-start text-accent-primary font-mono text-xs italic"
          >
            Processing...
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmission} className="p-4 bg-bg-secondary border-t border-border flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your prompt..."
          disabled={isProcessing}
          className="flex-1 p-3 rounded-lg bg-bg-tertiary border border-border text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-primary text-sm"
        />
        <button 
          type="submit" 
          disabled={isProcessing || !input.trim()}
          className="px-6 py-2 bg-accent-primary text-white rounded-lg font-bold hover:bg-accent-secondary disabled:opacity-50 transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
};
