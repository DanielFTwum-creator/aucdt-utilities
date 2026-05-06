// Add type definitions for Web Speech API for cross-browser compatibility
// These types are not always present in standard TS DOM libs
interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

interface SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: () => void;
  onend: () => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionStatic {
  new(): SpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionStatic;
    webkitSpeechRecognition?: SpeechRecognitionStatic;
  }
}

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ChatArea } from './components/ChatArea';
import { InputFooter } from './components/InputFooter';
import { QuizContainer } from './components/quiz/QuizContainer';
import { DocsContainer } from './components/docs/DocsContainer';
import { TestContainer } from './components/test/TestContainer';
import { AdminContainer } from './components/admin/AdminContainer';
import { PasswordModal } from './components/PasswordModal';
import { AboutModal } from './components/AboutModal';
import { HeroStats } from './components/HeroStats';
import { QuickTopics } from './components/QuickTopics';
import { VoiceContainer } from './components/voice/VoiceContainer';
import { generateBioChemResponse } from './services/geminiService';
import { LearningLevel, Message, AppMode, Theme } from './types';
import { LOCAL_STORAGE_KEYS } from './constants';

const initialMessage: Message = {
  id: 'initial-message',
  role: 'ai',
  content: "Welcome to BioChemAI—Your 24/7 Biochemistry Expert. Select your level below and ask your first question.",
};

function App() {
  const [mode, setMode] = useState<AppMode>(AppMode.Chat);

  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const savedMessages = localStorage.getItem(LOCAL_STORAGE_KEYS.messages);
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages);
        if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
          return parsedMessages;
        }
      }
      return [initialMessage];
    } catch (error) {
      console.error("Failed to parse messages from localStorage", error);
      return [initialMessage];
    }
  });

  const [learningLevel, setLearningLevel] = useState<LearningLevel>(() => {
    const savedLevel = localStorage.getItem(LOCAL_STORAGE_KEYS.learningLevel);
    return (savedLevel as LearningLevel) || LearningLevel.Undergraduate;
  });

  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem(LOCAL_STORAGE_KEYS.theme);
    return (savedTheme as Theme) || Theme.Ocean; // Default to Ocean theme
  });

  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.messages, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.learningLevel, learningLevel);
  }, [learningLevel]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.theme, theme);
    const html = document.documentElement;
    const themeSlug = theme.toLowerCase().replace(/\s+/g, '-');
    html.setAttribute('data-theme', themeSlug);
    document.body.style.fontFamily = `var(--font-sans)`;
  }, [theme]);
  
  const handleSetMode = (newMode: AppMode) => {
    if (newMode === AppMode.Admin) {
      if (isAdminAuthenticated) {
        setMode(AppMode.Admin);
      } else {
        setIsPasswordModalOpen(true);
      }
    } else {
      setMode(newMode);
    }
  };

  const handlePasswordSuccess = () => {
    setIsAdminAuthenticated(true);
    setIsPasswordModalOpen(false);
    setMode(AppMode.Admin);
  };

  const handleNavigateToDocs = () => {
    setIsAboutModalOpen(false);
    setMode(AppMode.Docs);
  };

  const handleSubmit = useCallback(async () => {
    if (!currentQuestion.trim() || isLoading) return;

    const userMessage: Message = { id: `user-${Date.now()}`, role: 'user', content: currentQuestion.trim() };
    setMessages(prev => [...prev, userMessage]);
    setCurrentQuestion('');
    setIsLoading(true);

    try {
      const { text, sources } = await generateBioChemResponse(currentQuestion.trim(), learningLevel);
      const aiMessage: Message = { id: `ai-${Date.now()}`, role: 'ai', content: text, sources: sources };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error generating response:", error);
      const errorMessage: Message = {
        id: `err-${Date.now()}`,
        role: 'ai',
        content: "I'm sorry, but I encountered an error while trying to generate a response. Please check your connection and try again. If the problem persists, the service might be temporarily unavailable.",
        isError: true,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [currentQuestion, isLoading, learningLevel]);

  const handleExportChat = useCallback(() => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      learningLevelAtExport: learningLevel,
      conversation: messages,
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `biochemai-chat-history-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
  }, [messages, learningLevel]);

  const handleExportMarkdown = useCallback(() => {
    let markdownContent = `# BioChemAI Chat History\n\n`;
    markdownContent += `**Exported At:** ${new Date().toISOString()}\n`;
    markdownContent += `**Learning Level:** ${learningLevel}\n\n---\n\n`;

    messages.forEach(msg => {
        if (msg.role === 'user') {
            markdownContent += `> **You:**\n> ${msg.content.replace(/\n/g, '\n> ')}\n\n`;
        } else {
            markdownContent += `### BioChemAI\n\n${msg.content}\n\n`;
            if (msg.sources && msg.sources.length > 0) {
                markdownContent += `#### Sources\n`;
                msg.sources.forEach(source => {
                    markdownContent += `- [${source.title}](${source.uri})\n`;
                });
                markdownContent += `\n`;
            }
        }
        markdownContent += `---\n\n`;
    });

    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `biochemai-chat-history-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
  }, [messages, learningLevel]);

  const handleCopyChat = useCallback(() => {
    let content = `BioChemAI Chat History\n`;
    content += `Exported At: ${new Date().toISOString()}\n`;
    content += `Learning Level: ${learningLevel}\n\n-----------------\n\n`;

    messages.forEach(msg => {
        if (msg.role === 'user') {
            content += `You:\n${msg.content}\n\n`;
        } else {
            content += `BioChemAI:\n${msg.content}\n\n`;
            if (msg.sources && msg.sources.length > 0) {
                content += `Sources:\n`;
                msg.sources.forEach(source => {
                    content += `- ${source.title} (${source.uri})\n`;
                });
                content += `\n`;
            }
        }
        content += `-----------------\n\n`;
    });

    return navigator.clipboard.writeText(content);
  }, [messages, learningLevel]);

  const handleTopicSelect = (topic: string) => {
    setCurrentQuestion(topic);
    // Focus the input after setting the question
    const input = document.querySelector('input[type="text"]') as HTMLInputElement;
    input?.focus();
  };
  
  const toggleVoiceListening = useCallback(() => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported by your browser.");
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
      setCurrentQuestion('');
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };
    
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => { 
      console.error('Speech recognition error:', event.error);
      alert(`Speech recognition error: ${event.error}. Please ensure you've granted microphone permissions.`);
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setCurrentQuestion(finalTranscript || interimTranscript);
    };

    recognition.start();
  }, [isListening]);

  const renderCurrentMode = () => {
    switch (mode) {
      case AppMode.Chat:
        return (
          <>
            <ChatArea messages={messages} isLoading={isLoading} />
            <QuickTopics onTopicSelect={handleTopicSelect} />
          </>
        );
      case AppMode.Voice:
        return <VoiceContainer />;
      case AppMode.Quiz:
        return <QuizContainer />;
      case AppMode.Docs:
        return <DocsContainer />;
      case AppMode.Test:
        return <TestContainer />;
      case AppMode.Admin:
        return <AdminContainer />;
      default:
        return null;
    }
  };

  return (
    <div className={`text-[var(--color-text-primary)] ${mode === AppMode.Chat || mode === AppMode.Voice ? 'h-screen flex flex-col' : 'min-h-screen'}`}>
      <Header 
        mode={mode} 
        setMode={handleSetMode} 
        onExportChat={handleExportChat} 
        onExportMarkdown={handleExportMarkdown}
        onCopyChat={handleCopyChat}
        onOpenAbout={() => setIsAboutModalOpen(true)}
        theme={theme}
        setTheme={setTheme}
      />
      {mode === AppMode.Chat && <HeroStats />}

      <main className={`w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${mode === AppMode.Chat || mode === AppMode.Voice ? 'flex-1 overflow-y-auto custom-scrollbar' : ''}`}>
        {renderCurrentMode()}
      </main>
      
      {mode === AppMode.Chat && (
        <InputFooter
          currentQuestion={currentQuestion}
          setCurrentQuestion={setCurrentQuestion}
          learningLevel={learningLevel}
          setLearningLevel={setLearningLevel}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          isListening={isListening}
          onVoiceInput={toggleVoiceListening}
        />
      )}

      <PasswordModal 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
        onSuccess={handlePasswordSuccess}
      />
      <AboutModal 
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
        onNavigateToDocs={handleNavigateToDocs}
      />
    </div>
  );
}

export default App;
