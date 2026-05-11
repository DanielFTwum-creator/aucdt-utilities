import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';
import { askCampAssistant } from '../services/geminiService';
import { useStore } from '../context/StoreContext';

export const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    { role: 'assistant', text: 'Hello! I am your VBCI Camp Assistant. How can I help you today?' }
  ]);
  const [loading, setLoading] = useState(false);
  const { camps, rooms } = useStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!query.trim()) return;

    const userMsg = query;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setQuery('');
    setLoading(true);

    // Build Context
    const campContext = camps.map(c => `${c.name}: ₵${c.price}, ${c.available_slots} slots left. ${c.description}`).join('\n');
    const roomContext = `There are ${rooms.length} rooms configured. Some are ${rooms.filter(r => r.status === 'Full').length} full.`;
    const fullContext = `Camps:\n${campContext}\n\nRooms:\n${roomContext}`;

    const response = await askCampAssistant(userMsg, fullContext);
    
    setMessages(prev => [...prev, { role: 'assistant', text: response }]);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-vbci-navy text-white p-4 rounded-full shadow-lg hover:bg-vbci-navyLight transition-all transform hover:scale-105"
        >
          <MessageSquare size={24} />
        </button>
      )}

      {isOpen && (
        <div className="bg-white rounded-lg shadow-2xl w-80 sm:w-96 flex flex-col border border-slate-200 overflow-hidden h-[500px]">
          <div className="bg-vbci-navy p-4 flex justify-between items-center text-white">
            <h3 className="font-semibold">VBCI Assistant</h3>
            <button onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-white">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-3">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
                  m.role === 'user' 
                    ? 'bg-vbci-gold text-vbci-navy font-medium' 
                    : 'bg-white border border-slate-200 text-slate-700'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
               <div className="flex justify-start">
                 <div className="bg-white border border-slate-200 p-3 rounded-lg">
                   <Loader2 size={16} className="animate-spin text-vbci-navy" />
                 </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-white border-t border-slate-200 flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about camps..."
              className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vbci-navy focus:border-transparent text-sm"
            />
            <button 
              onClick={handleSend}
              disabled={loading}
              className="bg-vbci-navy text-white p-2 rounded-md hover:bg-vbci-navyLight disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};