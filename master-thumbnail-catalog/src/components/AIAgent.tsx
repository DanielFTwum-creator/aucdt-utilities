import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Sparkles, RefreshCw } from 'lucide-react';

interface Message {
  id: string;
  role: 'agent' | 'user';
  text: string;
  timestamp: Date;
}

export const AIAgent: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 'init-1', 
      role: 'agent', 
      text: 'Hello! I am your Thumbnail Strategist. I can help you choose the perfect style for your content or analyze your current selection.', 
      timestamp: new Date() 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulated AI Response Logic
    setTimeout(() => {
      let responseText = "I recommend trying the 'Golden Glow' style for maximum engagement on this topic.";
      const lowerInput = userMsg.text.toLowerCase();

      if (lowerInput.includes('mobile') || lowerInput.includes('phone')) {
        responseText = "For mobile-first audiences, 'Thick Outline' offers the best readability due to its high contrast and bold stroke.";
      } else if (lowerInput.includes('reggae') || lowerInput.includes('energy') || lowerInput.includes('dancehall')) {
        responseText = "The 'Red Glow' style is perfect for high-energy or reggae content. It uses a specific RGB(255, 80, 80) accent that resonates with the genre.";
      } else if (lowerInput.includes('corporate') || lowerInput.includes('clean') || lowerInput.includes('business')) {
        responseText = "Stick to 'Clean Shadow' for a professional, corporate look. It maintains legibility without being overly aggressive.";
      } else if (lowerInput.includes('spiritual') || lowerInput.includes('soul')) {
        responseText = "'Golden Glow' is ideal for spiritual or soulful content, adding a warm, premium feel.";
      }

      const agentMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        text: responseText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, agentMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-500 text-white p-4 rounded-full shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 z-50 group animate-in zoom-in duration-300"
        >
          <Bot size={24} className="group-hover:scale-110 transition-transform" />
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-zinc-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-zinc-700">
            Ask AI Agent
          </span>
        </button>
      )}

      {/* Chat Interface */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 md:w-96 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300 h-[500px]">
          {/* Header */}
          <div className="bg-zinc-800 p-4 flex justify-between items-center border-b border-zinc-700">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg shadow-inner">
                <Bot size={18} className="text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white leading-none">Thumbnail Strategist</h3>
                <p className="text-[10px] text-zinc-400 flex items-center gap-1.5 mt-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Online v1.0
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setMessages([{ id: Date.now().toString(), role: 'agent', text: 'Session reset. How can I help you?', timestamp: new Date() }])}
                className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors"
                title="Reset Chat"
              >
                <RefreshCw size={16} />
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-950/50 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-br-none' 
                    : 'bg-zinc-800 text-zinc-200 rounded-bl-none border border-zinc-700'
                }`}>
                  {msg.text}
                  <div className={`text-[9px] mt-1 opacity-50 ${msg.role === 'user' ? 'text-indigo-200' : 'text-zinc-500'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-zinc-800 border border-zinc-700 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}/>
                  <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}/>
                  <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}/>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-zinc-900 border-t border-zinc-800">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about styles, audiences, or trends..."
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-zinc-600"
                autoFocus
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors shadow-sm"
              >
                <Send size={14} />
              </button>
            </div>
            <div className="mt-2 flex justify-center">
              <span className="text-[10px] text-zinc-600 flex items-center gap-1">
                <Sparkles size={10} />
                Powered by MasterCatalog AI
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
