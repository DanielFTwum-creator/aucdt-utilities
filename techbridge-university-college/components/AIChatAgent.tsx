
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { MessageCircle, X, Send, Loader2, Bot, Sparkles, User, Info, CheckCircle2 } from 'lucide-react';
import { ChatMessage } from '../types.ts';
import { streamResponse } from '../lib/gemini.ts';

interface AIChatAgentProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

/**
 * A user-friendly, high-fidelity message renderer for BridgeBot.
 * Converts basic markdown syntax into highly styled React components.
 */
const FormattedMessage: React.FC<{ text: string; role: 'user' | 'model' }> = ({ text, role }) => {
  const content = useMemo(() => {
    if (!text) return null;

    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let currentList: React.ReactNode[] = [];

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      // Handle Bullet Points with visual flair
      if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        const itemContent = trimmedLine.substring(2);
        currentList.push(
          <li key={`li-${index}`} className="flex items-start gap-2.5 mb-2 group">
            <CheckCircle2 size={16} className="text-tuc-gold mt-0.5 flex-shrink-0" />
            <span className="text-[13px] md:text-sm leading-snug">{renderInline(itemContent)}</span>
          </li>
        );
      } else {
        // Push list if transition occurs
        if (currentList.length > 0) {
          elements.push(<ul key={`ul-${index}`} className="mb-4 mt-2 space-y-1">{currentList}</ul>);
          currentList = [];
        }

        if (trimmedLine) {
          // Detect headers or subheaders (wrapped in **)
          const isSubHeader = trimmedLine.startsWith('**') && trimmedLine.endsWith('**') && trimmedLine.length < 50;
          
          elements.push(
            <div key={`div-${index}`} className={`mb-3 last:mb-0 leading-relaxed ${isSubHeader ? 'mt-5 border-l-4 border-tuc-gold pl-3 font-black text-tuc-maroon dark:text-tuc-gold uppercase tracking-widest text-[10px]' : 'text-[13px] md:text-sm'}`}>
              {renderInline(trimmedLine)}
            </div>
          );
        }
      }
    });

    // Final list flush
    if (currentList.length > 0) {
      elements.push(<ul key="ul-final" className="mb-4 mt-2 space-y-1">{currentList}</ul>);
    }

    return elements;
  }, [text]);

  function renderInline(str: string) {
    // Split for basic bolding **text**
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-black text-tuc-maroon dark:text-tuc-gold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  }

  return <div className="space-y-1">{content}</div>;
};

const AIChatAgent: React.FC<AIChatAgentProps> = ({ isOpen, onClose, onOpen }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: "Bridge the gap! I'm **BridgeBot**, your TUC assistant. How can I guide your journey today? \n\n **Institutional Pillars** \n - Admissions for **January 2026** \n - Cutting-edge **DMCD** and **PDE** programmes \n - The Bridge Scholarship Eligibility"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => { if (isOpen) scrollToBottom(); }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !selectedImage) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      image: selectedImage || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);

    const history = messages.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    const aiMessageId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: aiMessageId, role: 'model', text: '' }]);

    try {
      await streamResponse(
        userMessage.text,
        history,
        userMessage.image || null,
        (chunkText) => {
          setMessages(prev => prev.map(msg => 
            msg.id === aiMessageId ? { ...msg, text: chunkText } : msg
          ));
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={onOpen}
        aria-label="Open AI Chat Assistant"
        className="fixed bottom-6 right-6 z-[60] bg-tuc-maroon text-white p-4 rounded-full shadow-2xl hover:scale-110 hover:bg-tuc-gold hover:text-tuc-maroon transition-all group focus:ring-4 focus:ring-tuc-gold flex items-center justify-center"
      >
        <MessageCircle size={32} aria-hidden="true" />
        <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 px-4 py-2 rounded-xl text-sm font-black text-tuc-maroon dark:text-tuc-gold shadow-2xl opacity-0 group-hover:opacity-100 whitespace-nowrap transition-all transform scale-90 group-hover:scale-100 border border-gray-100 dark:border-gray-700">Ask BridgeBot</span>
      </button>
    );
  }

  return (
    <div 
      ref={chatWindowRef}
      tabIndex={-1}
      className="fixed bottom-6 right-6 z-[100] w-[calc(100vw-2rem)] sm:w-[460px] h-[720px] max-h-[90vh] bg-white dark:bg-gray-900 rounded-[3.5rem] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden animate-scale-up border border-gray-100 dark:border-gray-800 focus:outline-none"
      role="dialog"
      aria-label="BridgeBot AI Assistant"
    >
      {/* Visual Header */}
      <div className="bg-tuc-maroon p-8 flex justify-between items-center relative overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 w-56 h-56 bg-tuc-gold/10 rounded-full -mr-28 -mt-28"></div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="bg-tuc-gold p-3.5 rounded-2xl shadow-xl">
            <Bot size={26} className="text-tuc-maroon" />
          </div>
          <div>
            <h3 className="text-white font-black text-xl uppercase tracking-widest leading-none mb-1">BridgeBot</h3>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.6)]"></span>
              <p className="text-[10px] text-tuc-gold font-black uppercase tracking-widest opacity-90">Institutional Advisor</p>
            </div>
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="text-white/40 hover:text-white hover:bg-white/10 p-3 rounded-full transition-all"
          aria-label="Close chat"
        >
          <X size={22} />
        </button>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-8 space-y-12 scrollbar-thin bg-gray-50/40 dark:bg-gray-900/40">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`flex-shrink-0 w-10 h-10 rounded-[1.25rem] flex items-center justify-center shadow-lg transition-transform hover:scale-105 ${msg.role === 'user' ? 'bg-tuc-gold text-tuc-maroon' : 'bg-white dark:bg-gray-800 text-tuc-maroon dark:text-tuc-gold border border-gray-100 dark:border-gray-700'}`}>
              {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
            </div>
            <div className={`max-w-[85%] p-6 rounded-[2.5rem] shadow-sm transition-all ${
              msg.role === 'user' 
                ? 'bg-tuc-maroon text-white rounded-tr-none' 
                : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-gray-700'
            }`}>
              {msg.image && <img src={msg.image} alt="Context" className="rounded-3xl mb-5 max-h-60 object-cover w-full shadow-inner" />}
              {msg.text ? (
                <FormattedMessage text={msg.text} role={msg.role} />
              ) : (
                msg.role === 'model' && (
                  <div className="flex items-center gap-3 text-tuc-gold animate-pulse font-black text-[10px] uppercase tracking-widest">
                    <Sparkles size={16} /> Retrieving TUC Records...
                  </div>
                )
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-8 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shrink-0">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/80 px-6 py-4 rounded-[2.5rem] border-2 border-transparent focus-within:border-tuc-gold/40 transition-all shadow-inner group">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { 
                if (e.key === 'Enter' && !e.shiftKey) { 
                  e.preventDefault(); 
                  handleSubmit(e); 
                } 
              }}
              placeholder="How can I assist your TUC journey?"
              className="flex-1 bg-transparent border-none text-[13px] md:text-sm focus:ring-0 resize-none py-2 text-gray-900 dark:text-white font-medium placeholder:text-gray-400"
              rows={1}
              aria-label="Type your message"
            />
            <button 
              type="submit" 
              disabled={isLoading || (!input.trim() && !selectedImage)} 
              className="bg-tuc-maroon text-white p-3.5 rounded-[1.5rem] disabled:opacity-20 hover:bg-tuc-gold hover:text-tuc-maroon transition-all shadow-xl active:scale-95 flex items-center justify-center"
              aria-label="Send"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
            </button>
          </div>
        </form>
        <div className="flex items-center justify-between mt-6 px-3">
           <div className="flex items-center gap-1.5 text-[9px] text-gray-400 font-black uppercase tracking-widest">
             <Info size={12} className="text-tuc-gold" />
             AI Guidance System
           </div>
           <p className="text-[9px] text-gray-300 dark:text-gray-600 font-bold uppercase tracking-widest tracking-[0.2em]">Design and Build a Nation!</p>
        </div>
      </div>
    </div>
  );
};

export default AIChatAgent;
