import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { PHASES } from '../constants';
import { Icons } from './Icons';

interface Message {
    role: 'user' | 'model';
    text: string;
}

interface AIAssistantProps {
    externalInput?: string;
    onInputConsumed?: () => void;
    forceOpen?: boolean;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ externalInput, onInputConsumed, forceOpen }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', text: 'Hello! I am your QA Assistant. I can help you understand the framework, explain specific tasks, or generate custom directives for your specific project context.' }
    ]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatRef = useRef<Chat | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    // Handle force open and external input
    useEffect(() => {
        if (forceOpen) {
            setIsOpen(true);
        }
    }, [forceOpen]);

    useEffect(() => {
        if (externalInput) {
            setInput(externalInput);
            if (onInputConsumed) onInputConsumed();
            // Optional: Auto-open if external input arrives
            setIsOpen(true);
        }
    }, [externalInput]);

    useEffect(() => {
        // Safe access to process.env
        const apiKey = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : undefined;

        if (!chatRef.current && apiKey) {
            try {
                const ai = new GoogleGenAI({ apiKey: apiKey });
                
                const systemInstruction = `You are the Bulletproof Directive AI Assistant.
                Your goal is to help developers and QA specialists understand, implement, and refine the Bulletproof Directive framework.
                
                The framework consists of 5 phases with the following details:
                ${JSON.stringify(PHASES, null, 2)}
                
                Rules:
                1. Be concise, professional, and helpful.
                2. Refer to specific phases by their number and title.
                3. If asked about "tasks" or "deliverables", quote the specific items from the provided JSON context.
                4. Provide general QA advice when the context implies it, but always tie it back to the framework if relevant.
                5. Use bullet points for lists to improve readability.

                Directive Generation & Refinement:
                - When asked to generate, refine, or explain a directive, use the 'directive' field from the PHASES data as the baseline.
                - If the user provides specific context (e.g., "Refine Phase 1 for a React Native project"), adapt the standard directive while maintaining the strict format (e.g., "EXECUTE PHASE X ONLY", "COMPLETION REQUIREMENTS").
                - Ensure generated directives remain authoritative, clear, and focused on quality assurance.`;

                chatRef.current = ai.chats.create({
                    model: 'gemini-3-flash-preview',
                    config: {
                        systemInstruction: systemInstruction,
                    },
                });
            } catch (e) {
                console.error("Failed to initialize AI client:", e);
            }
        }
    }, []);

    const handleSend = async () => {
        if (!input.trim()) return;
        
        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
        setIsLoading(true);

        if (!chatRef.current) {
            setTimeout(() => {
                setMessages(prev => [...prev, { role: 'model', text: "I'm currently running in offline mode (API Key not detected). Please verify your environment configuration." }]);
                setIsLoading(false);
            }, 500);
            return;
        }

        try {
            const response: GenerateContentResponse = await chatRef.current.sendMessage({ message: userMessage });
            const responseText = response.text || "I'm sorry, I couldn't generate a response.";
            setMessages(prev => [...prev, { role: 'model', text: responseText }]);
        } catch (error) {
            console.error("AI Error:", error);
            setMessages(prev => [...prev, { role: 'model', text: "I encountered an error connecting to the AI service. Please try again later." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-[350px] sm:w-[450px] h-[600px] bg-bg-secondary/95 backdrop-blur-md border border-border rounded-2xl shadow-2xl flex flex-col animate-slide-up overflow-hidden">
                    {/* Header */}
                    <div className="p-4 border-b border-border bg-accent-primary/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-accent-primary/20 text-accent-primary">
                                <Icons.Bot className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-mono text-sm font-bold text-text-primary">QA Assistant</h3>
                                <p className="text-[10px] text-text-muted uppercase tracking-wider">Powered by Gemini</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="p-2 text-text-muted hover:text-text-primary hover:bg-bg-tertiary rounded-lg transition-colors"
                            aria-label="Close Chat"
                        >
                            <Icons.X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-bg-tertiary/20">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`
                                    max-w-[90%] p-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
                                    ${msg.role === 'user' 
                                        ? 'bg-accent-primary/20 text-text-primary rounded-tr-sm border border-accent-primary/30 shadow-sm' 
                                        : 'bg-bg-secondary border border-border text-text-secondary rounded-tl-sm shadow-sm'
                                    }
                                `}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-bg-secondary border border-border px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5 shadow-sm">
                                    <div className="w-2 h-2 rounded-full bg-accent-primary/40 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 rounded-full bg-accent-primary/40 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 rounded-full bg-accent-primary/40 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-border bg-bg-secondary">
                        <div className="relative flex flex-col gap-2">
                            {input.length > 100 && (
                                <div className="text-[10px] font-mono text-accent-primary bg-accent-primary/5 px-2 py-1 rounded border border-accent-primary/10 self-start">
                                    Refining Large Directive...
                                </div>
                            )}
                            <div className="relative flex items-center">
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ask about phases or refine directives..."
                                    className="w-full pl-4 pr-12 py-3 rounded-xl bg-bg-tertiary border border-border text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all text-sm font-sans resize-none max-h-32 min-h-[44px]"
                                    rows={Math.min(5, input.split('\n').length || 1)}
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={isLoading || !input.trim()}
                                    className="absolute right-2 bottom-2 p-2 rounded-lg bg-accent-primary text-white hover:bg-accent-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
                                >
                                    <Icons.Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-14 h-14 rounded-full shadow-lg shadow-accent-primary/20 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95
                    ${isOpen ? 'bg-bg-tertiary text-text-muted border border-border' : 'bg-gradient-to-br from-accent-primary to-accent-secondary text-white'}
                `}
                aria-label="Toggle AI Assistant"
            >
                {isOpen ? <Icons.ChevronDown className="w-6 h-6" /> : <Icons.MessageCircle className="w-6 h-6" />}
            </button>
        </div>
    );
};