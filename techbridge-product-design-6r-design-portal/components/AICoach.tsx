import React, { useState } from 'react';
import { getDesignAdvice } from '../services/gemini.ts';
import { ICONS } from '../constants.tsx';

interface AICoachProps {
  currentStage: string;
}

const AICoach: React.FC<AICoachProps> = ({ currentStage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMsg = query;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setQuery('');
    setIsTyping(true);

    const aiResponse = await getDesignAdvice(currentStage, userMsg);
    setMessages(prev => [...prev, { role: 'ai', text: aiResponse || 'No response' }]);
    setIsTyping(false);
  };

  return (
    <>
      {/* TechBridge Themed Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-[#6B1515] rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center border-2 border-[#F4C430]"
      >
        {ICONS.Bot("w-6 h-6 text-[#F4C430]")}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 md:w-96 h-[500px] bg-white border-2 border-[#6B1515] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          <div className="p-4 bg-[#6B1515] border-b border-[#F4C430] flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#F4C430] flex items-center justify-center">
                {ICONS.Bot("w-5 h-5 text-[#6B1515]")}
              </div>
              <span className="font-bold text-xs tracking-[0.1em] text-white uppercase">AI Academic Coach</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            <div className="bg-[#6B1515]/5 border border-[#6B1515]/20 p-3 rounded-xl text-xs text-[#6B1515] font-medium">
              Academic context initialized: <strong>{currentStage}</strong>. How may I assist your research?
            </div>
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  m.role === 'user' 
                    ? 'bg-[#6B1515] text-white rounded-br-none' 
                    : 'bg-white text-[#333333] rounded-bl-none border border-gray-200 shadow-sm'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && <div className="text-xs text-[#6B1515] animate-pulse font-bold tracking-widest uppercase">Consulting AI Core...</div>}
          </div>

          <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <input 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Submit inquiry..." 
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6B1515]"
              />
              <button 
                type="submit"
                className="p-2 bg-[#6B1515] text-[#F4C430] rounded-xl hover:bg-[#4A0E0E] transition-colors"
              >
                {ICONS.ChevronRight("w-5 h-5")}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default AICoach;