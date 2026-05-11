import { Bot, MessageSquare, Send, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

const VirtualAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! Welcome to TUC. I am your virtual assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const newUserMsg: Message = { id: Date.now(), text: inputText, sender: 'user' };
    setMessages(prev => [...prev, newUserMsg]);
    setInputText("");

    // Simulate AI response
    setTimeout(() => {
      const botResponse = generateResponse(newUserMsg.text);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponse, sender: 'bot' }]);
    }, 1000);
  };

  const handleQuickReply = (text: string) => {
    const newUserMsg: Message = { id: Date.now(), text: text, sender: 'user' };
    setMessages(prev => [...prev, newUserMsg]);
    
    setTimeout(() => {
      const botResponse = generateResponse(text);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponse, sender: 'bot' }]);
    }, 800);
  };

  const generateResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('admission') || lowerInput.includes('apply')) {
      return "Admissions are currently open for January 2026! You can click the 'APPLY NOW' button in the header to start your application via our portal.";
    }
    if (lowerInput.includes('fee') || lowerInput.includes('cost')) {
      return "Tuition fees vary by program. Please visit the Admissions section or contact our finance office at +233 (0) 54 012 4400 for the latest fee schedule.";
    }
    if (lowerInput.includes('location') || lowerInput.includes('where')) {
      return "We are located in Oyibi, opposite Valley View University, off the Adenta - Dodowa Road, Accra.";
    }
    if (lowerInput.includes('course') || lowerInput.includes('program')) {
      return "We offer degrees in Product Design, Jewellery Design, Digital Media, and Fashion Design, as well as various short courses.";
    }
    return "Thank you for your message. For detailed inquiries, please email info@tuc.edu.gh or call us directly.";
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      
      {/* Chat Window */}
      <div 
        className={`bg-white rounded-lg shadow-2xl w-80 sm:w-96 mb-4 overflow-hidden transition-all duration-300 origin-bottom-right border border-gray-200 ${
          isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-10 pointer-events-none h-0'
        }`}
      >
        {/* Header */}
        <div className="bg-tuc-maroon p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-1.5 rounded-full">
              <Bot size={20} className="text-tuc-gold" />
            </div>
            <div>
              <h3 className="font-bold text-sm">TUC Assistant</h3>
              <span className="text-xs text-green-400 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Online
              </span>
            </div>
          </div>
          <button onClick={toggleChat} className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded">
            <X size={18} />
          </button>
        </div>

        {/* Messages Area */}
        <div className="h-80 overflow-y-auto p-4 bg-gray-50 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[80%] p-3 rounded-lg text-sm ${
                  msg.sender === 'user' 
                    ? 'bg-tuc-gold text-tuc-maroon rounded-br-none font-medium' 
                    : 'bg-white border border-gray-200 text-gray-700 rounded-bl-none shadow-sm'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies (only if messages length is small or user hasn't typed) */}
        {messages.length < 4 && (
          <div className="px-4 py-2 bg-gray-50 flex gap-2 overflow-x-auto no-scrollbar">
            <button onClick={() => handleQuickReply("Admissions")} className="whitespace-nowrap px-3 py-1 text-xs bg-white border border-tuc-maroon text-tuc-maroon rounded-full hover:bg-tuc-maroon hover:text-white transition-colors">Admissions</button>
            <button onClick={() => handleQuickReply("Tuition Fees")} className="whitespace-nowrap px-3 py-1 text-xs bg-white border border-tuc-maroon text-tuc-maroon rounded-full hover:bg-tuc-maroon hover:text-white transition-colors">Tuition Fees</button>
            <button onClick={() => handleQuickReply("Location")} className="whitespace-nowrap px-3 py-1 text-xs bg-white border border-tuc-maroon text-tuc-maroon rounded-full hover:bg-tuc-maroon hover:text-white transition-colors">Location</button>
          </div>
        )}

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100 flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow px-3 py-2 text-sm bg-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-tuc-maroon"
          />
          <button 
            type="submit"
            disabled={!inputText.trim()}
            className="bg-tuc-maroon text-white p-2 rounded-md hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={18} />
          </button>
        </form>
      </div>

      {/* Toggle Button */}
      <button
        onClick={toggleChat}
        className={`${isOpen ? 'bg-gray-600 rotate-90' : 'bg-tuc-maroon hover:rotate-12'} text-white p-4 rounded-full shadow-lg hover:bg-opacity-90 transition-all duration-300 flex items-center justify-center border-4 border-white`}
        aria-label="Toggle Chat"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} fill="currentColor" />}
      </button>
    </div>
  );
};

export default VirtualAssistant;
