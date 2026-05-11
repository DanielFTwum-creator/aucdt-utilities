import React, { useState, useRef, useEffect, useCallback } from 'react';
// FIX: The LiveSession type is not exported from @google/genai. It has been removed.
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import { MicrophoneIcon, StopCircleIcon, FlaskConicalIcon } from '../Icons';

// --- Helper functions for audio and base64 encoding/decoding ---

// Encodes a Uint8Array into a base64 string.
function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Creates a Gemini API Blob from raw audio data.
function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

type VoiceStatus = 'idle' | 'connecting' | 'active' | 'error';
interface TranscriptionTurn {
  speaker: 'user' | 'ai';
  text: string;
}

export const VoiceContainer: React.FC = () => {
    const [status, setStatus] = useState<VoiceStatus>('idle');
    const [transcriptionHistory, setTranscriptionHistory] = useState<TranscriptionTurn[]>([]);
    const [currentInput, setCurrentInput] = useState('');
    const [currentOutput, setCurrentOutput] = useState('');
    const [error, setError] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    // Refs for accumulating transcriptions to avoid stale state in callbacks
    const currentInputRef = useRef('');
    const currentOutputRef = useRef('');

    // FIX: Replaced the unexported LiveSession type with `any` to resolve the type error.
    const sessionPromiseRef = useRef<Promise<any> | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);

    const cleanup = useCallback(() => {
        window.speechSynthesis.cancel(); // Stop any active TTS
        scriptProcessorRef.current?.disconnect();
        sourceNodeRef.current?.disconnect();
        mediaStreamRef.current?.getTracks().forEach(track => track.stop());
        inputAudioContextRef.current?.close().catch(console.error);

        scriptProcessorRef.current = null;
        sourceNodeRef.current = null;
        mediaStreamRef.current = null;
        inputAudioContextRef.current = null;
    }, []);

    const handleStop = useCallback(async () => {
        if (sessionPromiseRef.current) {
            try {
              const session = await sessionPromiseRef.current;
              session.close();
            } catch (e) {
                console.error("Error closing session:", e);
            } finally {
                sessionPromiseRef.current = null;
            }
        }
        cleanup();
        setStatus('idle');
    }, [cleanup]);

    useEffect(() => {
        return () => {
            handleStop();
        };
    }, [handleStop]);
    
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [transcriptionHistory, currentInput, currentOutput]);

    const handleStart = async () => {
        setStatus('connecting');
        setError('');
        
        try {
            // Prime the speech synthesis engine on user interaction to prevent issues with async initiation
            const primer = new SpeechSynthesisUtterance(' ');
            primer.volume = 0;
            window.speechSynthesis.speak(primer);

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;
            
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

            // Fix for webkitAudioContext type error
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            inputAudioContextRef.current = new AudioContext({ sampleRate: 16000 });
            
            setTranscriptionHistory([]);
            setCurrentInput('');
            setCurrentOutput('');
            currentInputRef.current = '';
            currentOutputRef.current = '';
            
            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                config: {
                    responseModalities: [Modality.AUDIO],
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                    systemInstruction: 'You are BioChemAI, an expert biochemistry teaching assistant. Speak in a friendly, helpful, and conversational tone. Keep your responses concise and clear.'
                },
                callbacks: {
                    onopen: () => {
                        setStatus('active');
                        const source = inputAudioContextRef.current!.createMediaStreamSource(mediaStreamRef.current!);
                        sourceNodeRef.current = source;
                        
                        const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
                        scriptProcessorRef.current = scriptProcessor;

                        scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const pcmBlob = createBlob(inputData);
                            sessionPromiseRef.current?.then((session) => {
                                session.sendRealtimeInput({ media: pcmBlob });
                            });
                        };
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(inputAudioContextRef.current!.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        if (message.serverContent?.inputTranscription) {
                            currentInputRef.current += message.serverContent.inputTranscription.text;
                            setCurrentInput(currentInputRef.current);
                        }
                        if (message.serverContent?.outputTranscription) {
                            currentOutputRef.current += message.serverContent.outputTranscription.text;
                            setCurrentOutput(currentOutputRef.current);
                        }
                        if (message.serverContent?.turnComplete) {
                            const finalInput = currentInputRef.current;
                            const finalOutput = currentOutputRef.current;
                            
                            setTranscriptionHistory(prev => {
                                const newHistory = [...prev];
                                if (finalInput.trim()) newHistory.push({ speaker: 'user', text: finalInput });
                                if (finalOutput.trim()) newHistory.push({ speaker: 'ai', text: finalOutput });
                                return newHistory;
                            });

                            if (finalOutput.trim()) {
                                const utterance = new SpeechSynthesisUtterance(finalOutput);
                                window.speechSynthesis.speak(utterance);
                            }

                            currentInputRef.current = '';
                            currentOutputRef.current = '';
                            setCurrentInput('');
                            setCurrentOutput('');
                        }

                        if (message.serverContent?.interrupted) {
                            window.speechSynthesis.cancel();
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        setError('An error occurred during the session. Please try again.');
                        console.error('Session error:', e);
                        handleStop();
                    },
                    onclose: () => {
                        // This might be called naturally, so we only reset if status is not idle.
                        // This prevents resetting UI if user stops conversation manually.
                        setStatus(currentStatus => {
                           if (currentStatus !== 'idle') {
                               handleStop();
                           }
                           return currentStatus;
                        });
                    },
                },
            });

        } catch (err) {
            console.error('Failed to start voice session:', err);
            setError('Could not access microphone. Please check your browser permissions.');
            setStatus('error');
            cleanup();
        }
    };
    
    if (status === 'idle' || status === 'error') {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <MicrophoneIcon className="w-24 h-24 text-[var(--color-text-tertiary)] mb-4" />
                <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Conversational Voice Mode</h1>
                <p className="text-[var(--color-text-secondary)] mt-2 max-w-md">
                    Click the button below to start a real-time voice conversation with BioChemAI.
                </p>
                {error && <p className="mt-4 text-[var(--color-error)]">{error}</p>}
                <button
                    onClick={handleStart}
                    className="mt-8 flex items-center justify-center gap-3 px-8 py-4 font-semibold text-lg text-[var(--color-text-on-accent)] bg-[var(--color-accent-primary)] rounded-full hover:bg-[var(--color-accent-primary-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-accent-primary)] focus:ring-offset-[var(--color-bg-primary)] transition-transform transform hover:scale-105"
                >
                    <MicrophoneIcon className="w-6 h-6" />
                    Start Conversation
                </button>
            </div>
        );
    }

    const getStatusText = () => {
        if (status === 'connecting') return 'Connecting...';
        if (currentOutput) return 'BioChemAI is speaking...';
        if (currentInput) return 'Listening...';
        return 'Connected. You can start speaking now.';
    };
    
    return (
        <div className="flex flex-col h-full">
            <div className="p-4 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border-primary)] rounded-t-lg">
                <div className="flex items-center justify-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${status === 'active' ? 'bg-[var(--color-success)] animate-pulse' : 'bg-[var(--color-warning)]'}`}></div>
                    <span className="text-sm font-medium text-[var(--color-text-secondary)]">{getStatusText()}</span>
                </div>
            </div>
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {transcriptionHistory.map((turn, index) => (
                    <div key={index} className={`flex ${turn.speaker === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-3 rounded-lg max-w-lg ${turn.speaker === 'user' ? 'bg-[var(--color-accent-primary)] text-[var(--color-text-on-accent)]' : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]'}`}>
                           <p className="font-medium">{turn.speaker === 'user' ? 'You' : 'BioChemAI'}</p>
                           <p>{turn.text}</p>
                        </div>
                    </div>
                ))}
                 {currentInput && (
                    <div className="flex justify-end">
                        <div className="p-3 rounded-lg max-w-lg bg-[var(--color-accent-primary)] text-[var(--color-text-on-accent)] opacity-70">
                            <p className="font-medium">You</p>
                            <p>{currentInput}...</p>
                        </div>
                    </div>
                 )}
                 {currentOutput && (
                    <div className="flex justify-start">
                        <div className="p-3 rounded-lg max-w-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] opacity-70">
                            <p className="font-medium">BioChemAI</p>
                            <p>{currentOutput}...</p>
                        </div>
                    </div>
                 )}
                <div ref={scrollRef}></div>
            </div>
            <div className="p-4 border-t border-[var(--color-border-primary)]">
                <button
                    onClick={handleStop}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 font-semibold text-[var(--color-text-primary)] bg-[var(--color-bg-tertiary)] rounded-lg hover:bg-[var(--color-border-primary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-text-tertiary)] focus:ring-offset-[var(--color-bg-primary)] transition"
                >
                    <StopCircleIcon className="w-6 h-6" />
                    End Conversation
                </button>
            </div>
        </div>
    );
};