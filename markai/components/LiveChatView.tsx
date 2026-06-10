
import React, { useState, useEffect, useRef, useCallback } from 'react';
// Fix: Use `GoogleGenAI` instead of the deprecated `GoogleGenerativeAI`.
import { GoogleGenAI, LiveServerMessage, Modality, Blob as GenaiBlob } from '@google/genai';
import { TranscriptionEntry } from '../types';
import { Mic, AlertTriangle, MicOff } from 'lucide-react';
import Spinner from './Spinner';

// =====================
// AUDIO UTILITIES
// =====================
const encode = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes));

const decode = (base64: string) => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> => {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
};


const LiveChatView: React.FC = () => {
    type SessionStatus = 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED' | 'ERROR';
    const [status, setStatus] = useState<SessionStatus>('DISCONNECTED');
    const [transcriptionHistory, setTranscriptionHistory] = useState<TranscriptionEntry[]>([]);
    const [currentTranscription, setCurrentTranscription] = useState<TranscriptionEntry | null>(null);
    const [error, setError] = useState<string | null>(null);

    const sessionPromiseRef = useRef<Promise<any> | null>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const microphoneStreamRef = useRef<MediaStream | null>(null);
    const nextStartTimeRef = useRef<number>(0);
    const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    const chatLogRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatLogRef.current?.scrollTo({ top: chatLogRef.current.scrollHeight, behavior: 'smooth' });
    }, [transcriptionHistory, currentTranscription]);

    const stopSession = useCallback(() => {
        if (sessionPromiseRef.current) {
            sessionPromiseRef.current.then(s => s.close()).catch(console.error);
            sessionPromiseRef.current = null;
        }
        microphoneStreamRef.current?.getTracks().forEach(track => track.stop());
        microphoneStreamRef.current = null;
        scriptProcessorRef.current?.disconnect();
        scriptProcessorRef.current = null;
        inputAudioContextRef.current?.close();
        outputAudioContextRef.current?.close();
        
        audioSourcesRef.current.forEach(source => source.stop());
        audioSourcesRef.current.clear();

        setStatus('DISCONNECTED');
        setCurrentTranscription(null);
    }, []);

    const startSession = useCallback(async () => {
        setStatus('CONNECTING');
        setError(null);
        setTranscriptionHistory([]);
        setCurrentTranscription(null);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            microphoneStreamRef.current = stream;

            const apiBase = window.location.origin.includes('localhost') 
                ? 'http://localhost:3000/api' 
                : `${window.location.origin}/markai/api`;
            
            const keyRes = await fetch(`${apiBase}/gemini/key`);
            if (!keyRes.ok) {
                const errText = await keyRes.text().catch(() => '');
                throw new Error(`Failed to fetch API key from server (HTTP ${keyRes.status}: ${errText})`);
            }
            const keyData = await keyRes.json();
            const apiKey = keyData.apiKey;
            if (!apiKey) throw new Error("API key was not returned by the server.");
            const ai = new GoogleGenAI({ apiKey });
            
            inputAudioContextRef.current = new (window.AudioContext)({ sampleRate: 16000 });
            outputAudioContextRef.current = new (window.AudioContext)({ sampleRate: 24000 });
            nextStartTimeRef.current = 0;

            const sessionPromise = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        setStatus('CONNECTED');
                        const inputCtx = inputAudioContextRef.current!;
                        const source = inputCtx.createMediaStreamSource(stream);
                        const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
                        scriptProcessorRef.current = scriptProcessor;

                        scriptProcessor.onaudioprocess = (e) => {
                            const inputData = e.inputBuffer.getChannelData(0);
                            const int16 = new Int16Array(inputData.map(x => x * 32768));
                            const pcmBlob: GenaiBlob = { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
                            sessionPromiseRef.current?.then(s => s.sendRealtimeInput({ media: pcmBlob }));
                        };
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(inputCtx.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        if (message.serverContent?.inputTranscription) {
                            setCurrentTranscription(prev => ({ ...prev, id: Date.now(), speaker: 'user', text: (prev?.text || '') + message.serverContent!.inputTranscription!.text }));
                        }
                        if (message.serverContent?.outputTranscription) {
                            setCurrentTranscription(prev => ({ ...prev, id: Date.now(), speaker: 'model', text: (prev?.text || '') + message.serverContent!.outputTranscription!.text }));
                        }
                        if (message.serverContent?.turnComplete && currentTranscription) {
                            setTranscriptionHistory(prev => [...prev, { ...currentTranscription, isFinal: true }]);
                            setCurrentTranscription(null);
                        }
                        
                        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData.data;
                        if (base64Audio && outputAudioContextRef.current) {
                            const outputCtx = outputAudioContextRef.current;
                            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
                            const audioBuffer = await decodeAudioData(decode(base64Audio), outputCtx, 24000, 1);
                            
                            const source = outputCtx.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(outputCtx.destination);
                            source.addEventListener('ended', () => audioSourcesRef.current.delete(source));
                            source.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += audioBuffer.duration;
                            audioSourcesRef.current.add(source);
                        }

                        if (message.serverContent?.interrupted) {
                            audioSourcesRef.current.forEach(source => { source.stop(); audioSourcesRef.current.delete(source); });
                            nextStartTimeRef.current = 0;
                        }
                    },
                    onerror: (e: ErrorEvent) => { console.error('Live session error:', e); setError('A connection error occurred.'); setStatus('ERROR'); stopSession(); },
                    onclose: () => { stopSession(); },
                },
                config: {
                    responseModalities: [Modality.AUDIO], inputAudioTranscription: {},
                    outputAudioTranscription: {}, systemInstruction: 'You are MarkAI, a friendly marketing assistant.',
                },
            });
            sessionPromiseRef.current = sessionPromise;

        } catch (err) {
            console.error('Failed to start session:', err);
            const message = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(`Failed to start session: ${message}. Ensure microphone access is allowed.`);
            setStatus('ERROR');
        }
    }, [stopSession, currentTranscription]);

    useEffect(() => () => stopSession(), [stopSession]);

    const isSessionActive = status === 'CONNECTED' || status === 'CONNECTING';

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-primary mb-2 text-center">Live AI Conversation</h2>
            <p className="text-secondary mb-8 text-center">Speak directly with MarkAI and get instant voice responses.</p>
            
            <div className="bg-secondary rounded-2xl shadow-lg p-6 border border-default">
                <div className="flex flex-col items-center justify-center mb-6">
                    <button 
                        onClick={isSessionActive ? stopSession : startSession}
                        className={`relative flex items-center justify-center w-24 h-24 rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-50
                            ${status === 'DISCONNECTED' && 'bg-green-500 hover:bg-green-600 focus:ring-green-400'}
                            ${status === 'CONNECTING' && 'bg-yellow-500 cursor-not-allowed'}
                            ${status === 'CONNECTED' && 'bg-red-500 hover:bg-red-600 focus:ring-red-400'}
                            ${status === 'ERROR' && 'bg-gray-500 hover:bg-gray-600 focus:ring-gray-400'}
                        `}>
                        {status === 'CONNECTED' && <div className="absolute inset-0 rounded-full bg-red-500 animate-ping"></div>}
                        {status === 'CONNECTING' && <Spinner className="w-12 h-12 border-white" />}
                        {status !== 'CONNECTING' && (isSessionActive ? <MicOff className="w-10 h-10 text-white" /> : <Mic className="w-10 h-10 text-white" />)}
                    </button>
                    <p className="mt-4 font-semibold text-primary">
                        {status === 'DISCONNECTED' && 'Tap to Start'}
                        {status === 'CONNECTING' && 'Connecting...'}
                        {status === 'CONNECTED' && 'Connected (Tap to End)'}
                        {status === 'ERROR' && 'Error (Tap to Retry)'}
                    </p>
                </div>
                
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-4" role="alert">
                        <div className="flex"><AlertTriangle className="h-5 w-5 text-red-500 mr-3" /><div><p className="font-bold">Error</p><p>{error}</p></div></div>
                    </div>
                )}

                <div ref={chatLogRef} className="bg-primary rounded-lg p-4 h-80 overflow-y-auto space-y-4 border border-default">
                    {transcriptionHistory.length === 0 && !currentTranscription && (
                        <div className="flex flex-col items-center justify-center h-full text-secondary/50">
                            <MicOff className="w-12 h-12 mb-2"/><p className="font-semibold">Your conversation will appear here.</p>
                        </div>
                    )}
                    {transcriptionHistory.map(entry => (
                        <div key={entry.id} className={`flex ${entry.speaker === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-3 rounded-xl ${entry.speaker === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-slate-700 text-primary'}`}>
                                <p className="font-bold text-sm mb-1 capitalize">{entry.speaker}</p><p>{entry.text}</p>
                            </div>
                        </div>
                    ))}
                     {currentTranscription && (
                        <div className={`flex ${currentTranscription.speaker === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-3 rounded-xl opacity-70 ${currentTranscription.speaker === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-slate-700 text-primary'}`}>
                                <p className="font-bold text-sm mb-1 capitalize">{currentTranscription.speaker}</p>
                                <p>{currentTranscription.text}<span className="inline-block w-2 h-4 bg-current animate-ping ml-1"></span></p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LiveChatView;
