
import React, { useState, useRef, useEffect } from 'react';
import { ClaudeService } from '../services/geminiService';
import Button from './common/Button';

const MessageSquareIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
);

const XIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

const SendIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
);

const BotIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="11" width="18" height="10" rx="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path><line x1="8" y1="16" x2="8" y2="16"></line><line x1="16" y1="16" x2="16" y2="16"></line></svg>
);

interface Message {
    id: string;
    role: 'user' | 'assistant';
    text: string;
}

const ClaudeAssistant: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: 'init', role: 'assistant', text: "Hello! I'm CLAUDE, your AI assistant. I can help you calculate salaries, check audit logs, or explain tax regulations. How can I help you today?" }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const claudeRef = useRef<ClaudeService | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && !claudeRef.current) {
            claudeRef.current = new ClaudeService();
        }
    }, [isOpen]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isThinking]);

    const handleSend = async () => {
        if (!inputValue.trim() || !claudeRef.current) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            text: inputValue
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsThinking(true);

        try {
            const responseText = await claudeRef.current.sendMessage(userMsg.text);
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                text: responseText
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { 
                id: (Date.now() + 1).toString(), 
                role: 'assistant', 
                text: "Sorry, I encountered an error. Please try again." 
            }]);
        } finally {
            setIsThinking(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
            {isOpen && (
                <div 
                    className="mb-4 w-80 sm:w-96 h-[500px] rounded-lg shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-300"
                    style={{ backgroundColor: 'var(--color-bg-card)' }}
                >
                    {/* Header */}
                    <div className="p-3 flex justify-between items-center" style={{ backgroundColor: 'var(--color-accent-primary)', color: 'white' }}>
                        <div className="flex items-center gap-2">
                            <BotIcon className="w-5 h-5" />
                            <span className="font-bold text-sm">CLAUDE Assistant</span>
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)} 
                            className="hover:bg-white/20 rounded p-1 transition-colors focus:outline-none focus:bg-white/20"
                            aria-label="Close Assistant"
                        >
                            <XIcon className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Chat Area */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
                        {messages.map(msg => (
                            <div 
                                key={msg.id} 
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div 
                                    className={`max-w-[85%] rounded-lg p-3 text-sm whitespace-pre-wrap shadow-sm ${
                                        msg.role === 'user' 
                                            ? 'text-white rounded-br-none' 
                                            : 'bg-[var(--color-bg-card)] text-[var(--color-text-primary)] rounded-bl-none'
                                    }`}
                                    style={msg.role === 'user' ? { backgroundColor: 'var(--color-accent-primary)' } : {}}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isThinking && (
                            <div className="flex justify-start">
                                <div className="bg-[var(--color-bg-card)] rounded-lg rounded-bl-none p-3 flex items-center gap-2 shadow-sm">
                                    <div className="w-2 h-2 bg-[var(--color-accent-primary)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-[var(--color-accent-primary)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-[var(--color-accent-primary)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-3 border-t border-[var(--color-border-primary)]" style={{ backgroundColor: 'var(--color-bg-card)' }}>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask about salaries, logs..."
                                className="flex-1 px-3 py-2 rounded-md text-sm border bg-[var(--color-bg-input)] text-[var(--color-text-primary)] border-[var(--color-border-primary)] focus:outline-none focus:ring-2"
                                style={{ '--ring-color': 'var(--color-accent-primary)' } as React.CSSProperties}
                                disabled={isThinking}
                            />
                            <Button 
                                onClick={handleSend} 
                                disabled={!inputValue.trim() || isThinking}
                                className="p-2 !px-2"
                            >
                                <SendIcon className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105 active:scale-95 focus:outline-none"
                style={{ backgroundColor: 'var(--color-accent-primary)', color: 'white' }}
                aria-label={isOpen ? "Close Claude Assistant" : "Open Claude Assistant"}
            >
                {isOpen ? <XIcon className="w-6 h-6" /> : <MessageSquareIcon className="w-6 h-6" />}
            </button>
        </div>
    );
};

export default ClaudeAssistant;
