import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, AlertCircle } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from '../types';
import { VECA_SYSTEM_INSTRUCTION } from '../constants';

export const ContactAgent: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Greetings. I am the VECA Intelligent Agent. I am currently in Phase 1 (Foundation Mode). I can assist you with understanding our data acquisition protocols and Vermont PD contact hierarchy. How may I assist?',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const apiKey = process.env.API_KEY; 
      if (!apiKey) {
        throw new Error("API Key not found in environment.");
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: input,
        config: {
          systemInstruction: VECA_SYSTEM_INSTRUCTION,
        },
      });

      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text || "I apologize, but I could not generate a response at this time.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, modelMsg]);

    } catch (error) {
      console.error("Agent Error:", error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "System Alert: Unable to connect to VECA Core Intelligence. Please verify API configuration.",
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
      {/* Agent Header */}
      <div className="bg-aucdt-brown text-aucdt-gold p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-aucdt-gold/20 rounded-full">
            <Bot size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg">VECA Agent</h3>
            <span className="text-xs text-aucdt-gold/80 uppercase tracking-wider flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Online • Phase 1
            </span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 shadow-sm ${
                msg.role === 'user'
                  ? 'bg-aucdt-green text-white rounded-br-none'
                  : msg.isError 
                    ? 'bg-red-50 text-red-800 border border-red-200 rounded-bl-none'
                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
              }`}
            >
              {msg.isError && <AlertCircle size={16} className="inline mr-2 mb-1" />}
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              <div className={`text-[10px] mt-2 opacity-70 text-right`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 p-4 rounded-lg rounded-bl-none flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-aucdt-gold" />
              <span className="text-xs text-gray-500">Processing inquiry...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about Vermont PD contacts or Data Scrape protocols..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-aucdt-gold/50 text-sm"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-aucdt-brown text-aucdt-gold px-4 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-[10px] text-center text-gray-400 mt-2">
          VECA Agent Information is generated by Gemini 2.5 Flash. Verify critical data manually.
        </p>
      </div>
    </div>
  );
};