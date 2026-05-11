import React from 'react';
import { SendIcon, SourceIcon, CheckIcon, XIcon, AdminIcon, CrownIcon, SparklesIcon, SquareIcon, FilmIcon } from '../Icons';

export type ScreenshotState =
    | { type: 'chat', step: 'initial' | 'question' | 'loading' | 'response' }
    | { type: 'quiz', step: 'setup' | 'loading' | 'question' | 'correct' | 'incorrect' | 'results' }
    | { type: 'admin', step: 'modal' | 'fail' | 'success' | 'panel' }
    | { type: 'theme', step: 'ocean' | 'golden' | 'cyberpunk' | 'minimal' | 'cinema' };

interface MockScreenshotProps {
    state: ScreenshotState;
}

const ScreenContainer: React.FC<{ children: React.ReactNode; theme?: 'ocean' | 'golden' | 'cyberpunk' | 'minimal' | 'cinema' }> = ({ children, theme = 'ocean' }) => {
    const themeClasses = {
        ocean: 'bg-[#0A192F]',
        golden: 'bg-[#FFF8E1]',
        cyberpunk: 'bg-black',
        minimal: 'bg-white',
        cinema: 'bg-[#121212]',
    };
    const headerClasses = {
        ocean: 'bg-[#172A45]',
        golden: 'bg-[#FFECB3]',
        cyberpunk: 'bg-[#1A1A1A]',
        minimal: 'bg-[#F4F4F5]',
        cinema: 'bg-[#1E1E1E]',
    };

    return (
    <div className={`${themeClasses[theme]} p-4 rounded-lg border border-stone-300 dark:border-neutral-600 w-full h-80 overflow-hidden relative shadow-inner`}>
        {/* Mock browser header */}
        <div className={`absolute top-0 left-0 right-0 h-6 ${headerClasses[theme]} flex items-center px-2`}>
            <div className="w-3 h-3 bg-red-400 rounded-full mr-1.5"></div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full mr-1.5"></div>
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
        </div>
        <div className="pt-6 h-full">
            {children}
        </div>
    </div>
)};

const ChatBubble: React.FC<{ role: 'ai' | 'user', children: React.ReactNode, sources?: boolean, theme?: ScreenshotState['step'] }> = ({ role, children, sources, theme = 'ocean' }) => {
    const aiBubbleClasses: Record<string, string> = {
        ocean: 'bg-[#172A45] text-[#CCD6F6]',
        golden: 'bg-[#FFECB3] text-[#4E342E]',
        cyberpunk: 'bg-[#1A1A1A] text-white',
        minimal: 'bg-[#F4F4F5] text-[#18181B]',
        cinema: 'bg-[#1E1E1E] text-[#E0E0E0]',
    };
    const userBubbleClasses: Record<string, string> = {
        ocean: 'bg-[#64FFDA] text-[#0A192F]',
        golden: 'bg-[#FFB300] text-[#4E342E]',
        cyberpunk: 'bg-[#FF00FF] text-black',
        minimal: 'bg-[#27272A] text-white',
        cinema: 'bg-[#E50914] text-white',
    };
    const sourceClasses: Record<string, string> = {
        ocean: 'text-[#8892B0]',
        golden: 'text-[#6D4C41]',
        cyberpunk: 'text-[#BBBBBB]',
        minimal: 'text-[#52525B]',
        cinema: 'text-[#BDBDBD]',
    };
    const accentTextClasses: Record<string, string> = {
        ocean: 'text-[#64FFDA]',
        golden: 'text-[#FFB300]',
        cyberpunk: 'text-[#FF00FF]',
        minimal: 'text-[#27272A]',
        cinema: 'text-[#E50914]',
    };

    return (
        <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`${role === 'user' ? userBubbleClasses[theme] : aiBubbleClasses[theme]} p-3 rounded-lg shadow-sm max-w-[80%]`}>
                {role === 'ai' && <p className={`font-semibold ${accentTextClasses[theme]} text-sm mb-1`}>BioChemAI</p>}
                <div className="text-sm">{children}</div>
                {sources && (
                    <div className="mt-2 pt-2 border-t border-white/10">
                        <h4 className={`text-xs font-semibold ${sourceClasses[theme]} flex items-center`}><SourceIcon className="w-3 h-3 mr-1" /> SOURCES</h4>
                        <p className={`text-xs ${accentTextClasses[theme]} truncate`}>1. Introduction to Enzymes</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const ChatScreen: React.FC<{ step: Extract<ScreenshotState, { type: 'chat' }>['step'], theme?: ScreenshotState['step'] }> = ({ step, theme = 'ocean' }) => {
    return (
        <div className="space-y-3 p-2">
            <ChatBubble role="ai" theme={theme}>Hello! I'm BioChemAI...</ChatBubble>
            { (step === 'question' || step === 'loading' || step === 'response') &&
                <ChatBubble role="user" theme={theme}>What is an enzyme?</ChatBubble>
            }
            { step === 'loading' &&
                 <ChatBubble role="ai" theme={theme}>BioChemAI is thinking...</ChatBubble>
            }
            { step === 'response' &&
                <ChatBubble role="ai" sources theme={theme}>An enzyme is a biological catalyst...</ChatBubble>
            }
        </div>
    );
};

const QuizScreen: React.FC<{ step: Extract<ScreenshotState, { type: 'quiz' }>['step'] }> = ({ step }) => {
    const renderContent = () => {
        switch (step) {
            case 'setup':
                return <div className="text-center p-8 bg-white rounded-lg shadow-md">
                    <h1 className="font-bold text-xl">Biochemistry Quiz Mode</h1>
                    <input type="text" placeholder="e.g. Cellular Respiration" className="w-full text-sm p-2 border rounded-md mt-4" />
                    <button className="w-full bg-green-700 text-white p-2 rounded-md mt-4 text-sm font-semibold">Start Quiz</button>
                </div>
            case 'loading':
                return <div className="text-center p-8"><div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div><p className="mt-2 text-sm text-stone-600">Generating Quiz...</p></div>
            case 'question':
            case 'correct':
            case 'incorrect':
                const getOptionStyle = (type: 'correct' | 'incorrect' | 'neutral', selected: boolean = false) => {
                    if (type === 'correct') return 'border-2 border-green-500 bg-green-100 font-bold';
                    if (type === 'incorrect' && selected) return 'border-2 border-red-500 bg-red-100 font-bold';
                    return 'border border-stone-300 bg-white';
                }
                return <div className="p-4 bg-white rounded-lg shadow-md">
                    <p className="text-xs font-semibold text-green-700">Question 1 of 5</p>
                    <p className="font-bold my-2">What is the primary function of an enzyme?</p>
                    <div className="space-y-2 mt-3 text-sm">
                        <div className={`p-2 rounded-md ${getOptionStyle(step==='correct' ? 'correct' : 'neutral')}`}>To store genetic info</div>
                        <div className={`p-2 rounded-md flex justify-between items-center ${getOptionStyle(step==='correct' ? 'neutral' : 'incorrect', step==='incorrect')}`}>To speed up reactions {step === 'incorrect' && <XIcon className="w-4 h-4 text-red-600" />}</div>
                        <div className={`p-2 rounded-md flex justify-between items-center ${getOptionStyle(step==='correct' ? 'correct' : 'neutral', step==='correct')}`}>To act as a catalyst {step === 'correct' && <CheckIcon className="w-4 h-4 text-green-600" />}</div>
                        <div className={`p-2 rounded-md ${getOptionStyle('neutral')}`}>To provide cell structure</div>
                    </div>
                </div>
            case 'results':
                 return <div className="text-center p-6 bg-white rounded-lg shadow-md">
                    <h1 className="font-bold text-xl">Quiz Complete!</h1>
                    <p className="text-4xl font-bold text-green-700 mt-4">4<span className="text-xl text-stone-400">/5</span></p>
                    <p className="font-semibold text-green-600">(80%)</p>
                    <button className="w-full bg-green-700 text-white p-2 rounded-md mt-6 text-sm font-semibold">Take Another Quiz</button>
                </div>
        }
    }
    return <div className="p-4">{renderContent()}</div>;
};

const AdminScreen: React.FC<{ step: Extract<ScreenshotState, { type: 'admin' }>['step'] }> = ({ step }) => {
    const renderContent = () => {
        switch (step) {
            case 'modal':
            case 'fail':
            case 'success':
                 return <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-64">
                        <h2 className="font-bold text-lg mb-2">Admin Access</h2>
                        <input type="password" value={step === 'fail' ? 'wrong' : step === 'success' ? 'password123' : ''} readOnly className="w-full text-sm p-2 border rounded-md" />
                        {step === 'fail' && <p className="text-xs text-red-500 mt-1">Incorrect password.</p>}
                        <div className="flex gap-2 mt-4">
                            <button className="w-1/2 bg-stone-200 p-2 rounded-md text-sm">Cancel</button>
                            <button className="w-1/2 bg-green-700 text-white p-2 rounded-md text-sm">{step === 'success' ? 'Verifying...' : 'Submit'}</button>
                        </div>
                    </div>
                 </div>
            case 'panel':
                 return <div className="p-4 bg-white rounded-lg shadow-md h-full">
                     <h1 className="text-xl font-bold">Admin Panel</h1>
                     <div className="mt-4 p-4 border rounded-lg">
                        <h2 className="font-bold mb-2">Audit Log</h2>
                        <div className="text-xs space-y-1">
                            <p className="p-1 bg-stone-100 rounded">Admin Login - Successful</p>
                            <p className="p-1 bg-stone-100 rounded">Admin Login Attempt - Failed</p>
                            <p className="p-1 bg-stone-100 rounded">System Initialized</p>
                        </div>
                     </div>
                 </div>
        }
    }
    return <div className="p-4 h-full relative">{renderContent()}</div>
};

const ThemeScreen: React.FC<{ step: Extract<ScreenshotState, { type: 'theme' }>['step'] }> = ({ step }) => {
    const headerClasses: Record<string, string> = {
        ocean: 'bg-[#172A45]',
        golden: 'bg-[#FFECB3]',
        cyberpunk: 'bg-[#1A1A1A]',
        minimal: 'bg-[#F4F4F5]',
        cinema: 'bg-[#1E1E1E]',
    };
    const titleClasses: Record<string, string> = {
        ocean: 'text-[#64FFDA]',
        golden: 'text-[#FFB300]',
        cyberpunk: 'text-[#FF00FF]',
        minimal: 'text-[#27272A]',
        cinema: 'text-[#E50914]',
    };
    const themeIcons: Record<string, React.ReactElement> = {
        ocean: <AdminIcon className="w-4 h-4" />,
        golden: <CrownIcon className="w-4 h-4" />,
        cyberpunk: <SparklesIcon className="w-4 h-4" />,
        minimal: <SquareIcon className="w-4 h-4" />,
        cinema: <FilmIcon className="w-4 h-4" />,
    };
    const themes: (keyof typeof themeIcons)[] = ['ocean', 'golden', 'cyberpunk', 'minimal', 'cinema'];

    return (
        <div className="h-full flex flex-col">
            <header className={`${headerClasses[step]} p-3 shadow-md`}>
                <div className="flex justify-between items-center">
                    <h1 className={`${titleClasses[step]} font-bold text-lg`}>BioChemAI</h1>
                    <div className="flex items-center gap-1 bg-black/20 rounded-full p-1">
                        {themes.map(t => (
                             <button key={t} className={`p-1.5 rounded-full ${step === t ? 'ring-2 ring-offset-2 ring-offset-black/20' : ''}`} style={{color: titleClasses[t], '--tw-ring-color': titleClasses[t]} as React.CSSProperties}>
                                {themeIcons[t]}
                            </button>
                        ))}
                    </div>
                </div>
            </header>
            <div className="flex-1">
                <ChatScreen step="response" theme={step} />
            </div>
        </div>
    );
};

export const MockScreenshot: React.FC<MockScreenshotProps> = ({ state }) => {
    const theme = state.type === 'theme' ? state.step : 'ocean';

    const renderState = () => {
        switch (state.type) {
            case 'chat': return <ChatScreen step={state.step} />;
            case 'quiz': return <QuizScreen step={state.step} />;
            case 'admin': return <AdminScreen step={state.step} />;
            case 'theme': return <ThemeScreen step={state.step} />;
            default: return null;
        }
    }

    return (
        <ScreenContainer theme={theme}>
            {renderState()}
        </ScreenContainer>
    );
};