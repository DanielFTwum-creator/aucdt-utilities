import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, User, Bot } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { MOCK_PROPERTIES } from '../constants';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 'init', role: 'model', text: "Hello! I'm Pama, your AI property assistant. How can I help you find your dream home today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Initialization: adhere to strictly using named parameter for apiKey
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Construct system instruction with property context
      // This grounds the model in the actual data available in the app
      const propertyContext = MOCK_PROPERTIES.map(p => 
        `[${p.type}] ${p.title}
         - ID: ${p.id}
         - Price: Gh₵ ${p.price.toLocaleString()}
         - Location: ${p.location}
         - Description: ${p.description}
         - Features: ${p.bedrooms ? `${p.bedrooms} Bedrooms` : ''} ${p.areaSize ? `| ${p.areaSize}` : ''}`
      ).join('\n\n');

      const systemInstruction = `You are Pama, an expert real estate agent for 'Pama Realtor'. 
      You are helpful, professional, and enthusiastic.
      
      Your goal is to help users find properties from the list below.
      
      AVAILABLE PROPERTIES:
      ${propertyContext}
      
      GUIDELINES:
      1. ONLY recommend properties listed above. If a user asks for something not listed, politely explain what IS available.
      2. Prices are in Ghana Cedis (Gh₵).
      3. Be concise and persuasive.
      4. If users ask about "visiting" or "viewing", mention the "Drive-to-View" service which costs a small fee.
      5. Do not hallucinate properties not in the list.
      
      Current User Question: ${input}`;

      // Use the correct model for text tasks
      const modelName = 'gemini-2.5-flash';

      // Create a chat session to maintain history
      const chat = ai.chats.create({
        model: modelName,
        config: {
          systemInstruction: systemInstruction,
        },
        history: messages.slice(1).map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }))
      });

      const result = await chat.sendMessage({ message: userMessage.text });
      const responseText = result.text;

      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: 'model', 
        text: responseText || "I'm having trouble thinking of a response right now." 
      }]);

    } catch (error) {
      console.error("AI Error:", error);
      let errorMessage = "I apologize, but I'm having trouble connecting right now.";
      
      // Check if it's likely an API key issue (common in demos)
      if (!process.env.API_KEY) {
        errorMessage = "System Error: API_KEY is missing from the environment configuration.";
      }
      
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: 'model', 
        text: errorMessage 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-24 right-6 z-40 p-4 rounded-full shadow-lg transition-all transform hover:scale-110 duration-300 group
          ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100 bg-gray-900 text-white'}`}
        aria-label="Open AI Assistant"
      >
        <Sparkles className="w-6 h-6 animate-pulse" />
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-white text-gray-900 text-xs font-bold px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Ask AI Agent
        </span>
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl z-50 transition-all duration-300 flex flex-col overflow-hidden border border-gray-100
        ${isOpen ? 'translate-y-0 opacity-100 h-[600px]' : 'translate-y-10 opacity-0 h-0 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="bg-gray-900 p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
              <Bot size={18} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Pama AI Agent</h3>
              <p className="text-xs text-emerald-400">Online • Gemini 2.5 Flash</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)} 
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
            aria-label="Close chat"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 scroll-smooth">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm leading-relaxed
                ${msg.role === 'user' 
                  ? 'bg-emerald-600 text-white rounded-br-none' 
                  : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'}`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3 border border-gray-100 shadow-sm">
                <div className="flex gap-1.5 items-center h-5">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-100">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about properties..."
              className="flex-1 bg-gray-100 border border-transparent rounded-full px-4 py-2.5 text-sm focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all placeholder:text-gray-400"
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="p-2.5 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md transform active:scale-95"
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AIAssistant;