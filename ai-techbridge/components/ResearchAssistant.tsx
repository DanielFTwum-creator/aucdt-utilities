
import { Bot, MessageSquare, Send, Sparkles, User, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { askDartmouthAI } from '../services/gemini';

const ResearchAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const response = await askDartmouthAI(userMsg);
      setMessages(prev => [...prev, { role: 'assistant', text: response || "I apologize, I couldn't retrieve that information right now." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', text: "System connection error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <div className="fixed bottom-6 right-6 z-[60] font-sans">
      {isOpen ? (
        <div className="bg-white dark:bg-slate-900 w-[90vw] md:w-[450px] h-[600px] max-h-[80vh] rounded-[2rem] shadow-2xl flex flex-col border border-techbridge-beige dark:border-slate-700 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-300">
          {/* Header */}
          <div className="bg-techbridge-burgundy p-5 text-white flex justify-between items-center shadow-md z-10">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-xl">
                <Bot size={24} className="text-techbridge-gold" />
              </div>
              <div>
                <h3 className="font-black text-lg leading-none tracking-tight">AI CONCIERGE</h3>
                <p className="text-[10px] text-techbridge-gold/80 font-bold uppercase tracking-wider mt-1">TechBridge Intelligence</p>
              </div>
            </div>
            <button 
              onClick={toggleChat} 
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Close Chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-techbridge-cream dark:bg-slate-950 scroll-smooth">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center px-8 opacity-60">
                <div className="w-20 h-20 bg-techbridge-burgundy/5 rounded-3xl flex items-center justify-center mb-6 animate-pulse">
                  <Sparkles size={32} className="text-techbridge-burgundy dark:text-techbridge-gold" />
                </div>
                <h4 className="text-techbridge-burgundy dark:text-white font-black text-sm mb-2 uppercase tracking-widest">System Ready</h4>
                <p className="text-xs text-gray-500 font-medium">Ask about AI history, research labs, or faculty members.</p>
              </div>
            )}
            
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    m.role === 'user' ? 'bg-gray-200 dark:bg-slate-700' : 'bg-techbridge-gold text-techbridge-burgundy'
                  }`}>
                    {m.role === 'user' ? <User size={14} /> : <Bot size={16} />}
                  </div>
                  
                  <div className={`px-5 py-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    m.role === 'user' 
                      ? 'bg-techbridge-burgundy text-white rounded-tr-none' 
                      : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-tl-none border border-techbridge-beige dark:border-slate-700'
                  }`}>
                    {m.text}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start animate-in fade-in duration-300">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-techbridge-gold text-techbridge-burgundy flex items-center justify-center">
                    <Bot size={16} />
                  </div>
                  <div className="bg-white dark:bg-slate-800 px-5 py-4 rounded-2xl rounded-tl-none border border-techbridge-beige dark:border-slate-700 shadow-sm flex gap-1.5 items-center">
                    <span className="w-1.5 h-1.5 bg-techbridge-burgundy/60 dark:bg-techbridge-gold/60 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-techbridge-burgundy/60 dark:bg-techbridge-gold/60 rounded-full animate-bounce delay-100"></span>
                    <span className="w-1.5 h-1.5 bg-techbridge-burgundy/60 dark:bg-techbridge-gold/60 rounded-full animate-bounce delay-200"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white dark:bg-slate-900 border-t border-techbridge-beige dark:border-slate-700">
            <div className="relative">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask TechBridge AI..."
                className="w-full bg-techbridge-cream dark:bg-slate-800 text-gray-800 dark:text-white rounded-full pl-6 pr-14 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-techbridge-burgundy/20 border border-transparent focus:border-techbridge-burgundy/30 transition-all placeholder:text-gray-400"
                disabled={isLoading}
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="absolute right-2 top-2 p-2 bg-techbridge-burgundy text-white rounded-full hover:bg-techbridge-burgundy-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
                aria-label="Send Message"
              >
                <Send size={18} className={isLoading ? 'opacity-0' : 'opacity-100'} />
                {isLoading && <div className="absolute inset-0 flex items-center justify-center"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div></div>}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={toggleChat}
          className="group relative w-16 h-16 bg-techbridge-burgundy text-white rounded-[1.5rem] shadow-[0_10px_30px_rgba(139,21,56,0.3)] flex items-center justify-center hover:scale-110 hover:-translate-y-1 transition-all duration-300 border-[3px] border-techbridge-cream dark:border-slate-800"
          aria-label="Open AI Assistant"
        >
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></div>
          <MessageSquare size={28} className="group-hover:scale-90 transition-transform" />
        </button>
      )}
    </div>
  );
};

export default ResearchAssistant;
