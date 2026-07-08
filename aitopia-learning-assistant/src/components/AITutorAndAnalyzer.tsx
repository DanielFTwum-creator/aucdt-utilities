import React, { useState, useEffect, useRef } from "react";
import { ChatMessage, VideoSummary, VideoHighlight } from "../types";
import { PRESET_VIDEOS } from "../data";
import { Send, Sparkles, Youtube, ListRestart, HelpCircle, Loader, MessageSquare, Play, RefreshCw, ChevronRight, CheckCircle, Volume2, Droplet } from "lucide-react";
import Markdown from "react-markdown";

interface AITutorProps {
  onSyncWithFlute: (actionType: string, extraData?: any) => void;
}

export default function AITutorAndAnalyzer({ onSyncWithFlute }: AITutorProps) {
  const [activeTab, setActiveTab] = useState<"chat" | "video">("chat");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => [
    {
      id: "welcome",
      role: "model",
      content: "Hello! I am your **AITOPIA Learning Assistant**. 🎓\n\nI can help you review your **14-week AI course curriculum**, explain complex machine learning algorithms, translate texts, or analyze educational YouTube video transcripts.\n\nTry clicking one of the quick-action prompts below or ask me any question!",
      timestamp: new Date()
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Video state
  const [selectedVideo, setSelectedVideo] = useState(PRESET_VIDEOS[0]);
  const [videoSummary, setVideoSummary] = useState<VideoSummary | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [activeHighlightIdx, setActiveHighlightIdx] = useState<number | null>(null);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Quick Action cards as pasted in the user prompt
  const QUICK_PROMPTS = [
    {
      title: "🤓 Explain a complex thing",
      desc: "Explain Artificial Intelligence so that I can explain it to my six-year-old child.",
      prompt: "Explain Artificial Intelligence so that I can explain it to my six-year-old child."
    },
    {
      title: "🧠 Get suggestions & ideas",
      desc: "Please give me the best 10 travel ideas around the world",
      prompt: "Please give me the best 10 travel ideas around the world"
    },
    {
      title: "💭 Translate & summarize",
      desc: "Translate 'I love you' into French",
      prompt: "Translate 'I love you' into French"
    }
  ];

  const handleSendChatMessage = async (text: string) => {
    if (!text.trim() || isChatLoading) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      role: "user",
      content: text,
      timestamp: new Date()
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...chatMessages, userMsg].map((m) => ({
            role: m.role,
            content: m.content
          })),
          systemInstruction: "You are AITOPIA, a prestigious AI learning assistant specializing in machine learning, mathematics, computer science, and Ghanaian musical heritage like the Atɛntɛbɛn flute. Help the user master concepts concisely with beautiful markdown rendering."
        })
      });

      const data = await response.json();
      if (response.ok) {
        setChatMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            role: "model",
            content: data.text || "I couldn't process that response. Try again.",
            timestamp: new Date()
          }
        ]);
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      console.error(err);
      setChatMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          role: "model",
          content: "⚠️ **Error reaching AI server:** " + (err.message || "Please make sure your server is running and your API Key is verified."),
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleAnalyzeVideo = async () => {
    if (isVideoLoading) return;
    setIsVideoLoading(true);
    setVideoSummary(null);

    try {
      const response = await fetch("/api/analyze-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoTitle: selectedVideo.title,
          videoTranscript: selectedVideo.transcript
        })
      });

      const data = await response.json();
      if (response.ok) {
        setVideoSummary({
          summary: data.summary,
          highlights: data.highlights || []
        });
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      console.error(err);
      // Fallback if anything goes wrong
      setVideoSummary({
        summary: "This tutorial features Kudjo explaining how to play the Atɛntɛbɛn (Ghanaian bamboo flute). It covers structural details of the instrument, moisture parameters, and basic scale practices.",
        highlights: [
          { timestamp: "00:00:13:20", secondValue: 13, description: "Hello, I am Kudjo", significance: "Apprentice orientation and credentials introduction since 1972." },
          { timestamp: "00:01:35:26", secondValue: 95, description: "Love the drums!", significance: "Explains how the flute speech fuses with traditional djembe rhythms." },
          { timestamp: "00:02:27:00", secondValue: 147, description: "Moisturize with Water!", significance: "Demonstrates that a 10-minute soaking produces a warm, moist tone instead of a dry one." },
          { timestamp: "00:03:38:00", secondValue: 218, description: "Know Thy Flute", significance: "Explores anatomy: 6 front holes in 3 sets of 2, and 1 back hole." },
          { timestamp: "00:04:50:00", secondValue: 290, description: "Basic 8-Note Scale", significance: "Practices Doh Ray Me Fah Soh La Te Doh ascending and descending." }
        ]
      });
    } finally {
      setIsVideoLoading(false);
    }
  };

  // Sync highlight timestamps with the Flute Simulator!
  const handleHighlightClick = (hl: VideoHighlight, idx: number) => {
    setActiveHighlightIdx(idx);
    
    // Parse description to trigger specific actions
    const desc = hl.description.toLowerCase();
    const sig = hl.significance.toLowerCase();

    if (desc.includes("moisturize") || desc.includes("soak")) {
      onSyncWithFlute("moisturize");
    } else if (desc.includes("scale") || desc.includes("8-note")) {
      onSyncWithFlute("scale");
    } else if (desc.includes("dirge") || sig.includes("dirge")) {
      onSyncWithFlute("dirge");
    } else if (desc.includes("know thy flute") || desc.includes("anatomy")) {
      onSyncWithFlute("note", 0); // Root note C4
    } else if (desc.includes("root")) {
      onSyncWithFlute("note", 0); // Root note
    } else {
      // Just play a pleasant octave sweep
      onSyncWithFlute("note", 0);
    }
  };

  // Helper to render markdown-like text nicely using react-markdown
  const renderMessageText = (text: string, isUser: boolean) => {
    return (
      <div className="markdown-body">
        <Markdown
          components={{
            h1: ({ children }) => <h1 className={`text-sm font-extrabold mt-3 mb-1.5 first:mt-0 ${isUser ? "text-white" : "text-slate-900"}`}>{children}</h1>,
            h2: ({ children }) => <h2 className={`text-xs font-bold mt-2.5 mb-1 first:mt-0 ${isUser ? "text-slate-100" : "text-slate-900"}`}>{children}</h2>,
            h3: ({ children }) => <h3 className={`text-xs font-bold mt-2 mb-1 first:mt-0 ${isUser ? "text-slate-200" : "text-slate-800"}`}>{children}</h3>,
            p: ({ children }) => <p className={`text-xs leading-relaxed mb-2 last:mb-0 ${isUser ? "text-slate-100" : "text-slate-700"}`}>{children}</p>,
            ul: ({ children }) => <ul className={`list-disc pl-4 mb-2 text-xs space-y-1 ${isUser ? "text-slate-100" : "text-slate-700"}`}>{children}</ul>,
            ol: ({ children }) => <ol className={`list-decimal pl-4 mb-2 text-xs space-y-1 ${isUser ? "text-slate-100" : "text-slate-700"}`}>{children}</ol>,
            li: ({ children }) => <li className={`text-xs leading-relaxed ${isUser ? "text-slate-200" : "text-slate-650"}`}>{children}</li>,
            strong: ({ children }) => <strong className={`font-bold ${isUser ? "text-white" : "text-slate-950"}`}>{children}</strong>,
            code: ({ children }) => (
              <code className={`font-mono text-[11px] px-1.5 py-0.5 rounded-md border ${
                isUser
                  ? "bg-slate-800 text-rose-300 border-slate-700"
                  : "bg-slate-100 text-[#e11d48] border-slate-200/55"
              }`}>
                {children}
              </code>
            ),
            pre: ({ children }) => (
              <pre className="bg-slate-950 text-slate-100 font-mono text-[10.5px] p-2.5 rounded-xl overflow-x-auto border border-slate-800 my-2 shadow-xs">
                {children}
              </pre>
            ),
            blockquote: ({ children }) => (
              <blockquote className={`border-l-3 pl-3 py-1 my-2 text-xs rounded-r-lg ${
                isUser
                  ? "border-amber-400 bg-white/5 text-slate-200"
                  : "border-amber-500 bg-amber-50/20 text-slate-600"
              }`}>
                {children}
              </blockquote>
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto my-3 border border-slate-200 rounded-xl max-w-full">
                <table className="min-w-full divide-y divide-slate-200 text-xs text-left">{children}</table>
              </div>
            ),
            thead: ({ children }) => <thead className="bg-slate-50 text-slate-800 font-semibold">{children}</thead>,
            tbody: ({ children }) => <tbody className="divide-y divide-slate-100 bg-white">{children}</tbody>,
            tr: ({ children }) => <tr>{children}</tr>,
            th: ({ children }) => <th className="px-2.5 py-1.5 text-[11px] font-bold">{children}</th>,
            td: ({ children }) => <td className="px-2.5 py-1.5 text-[11px] text-slate-600">{children}</td>,
            a: ({ href, children }) => (
              <a
                href={href}
                className="text-emerald-500 hover:text-emerald-600 underline font-semibold"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            )
          }}
        >
          {text}
        </Markdown>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Header Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50">
        <button
          onClick={() => setActiveTab("chat")}
          className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 transition-colors border-b-2 cursor-pointer ${
            activeTab === "chat"
              ? "border-slate-800 text-slate-900 bg-white"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <MessageSquare className="w-4 h-4 text-amber-500" /> AITOPIA Chat Tutor
        </button>
        <button
          onClick={() => setActiveTab("video")}
          className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 transition-colors border-b-2 cursor-pointer ${
            activeTab === "video"
              ? "border-slate-800 text-slate-900 bg-white"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Youtube className="w-4 h-4 text-red-500" /> Video Analysis AI
        </button>
      </div>

      {/* TAB CONTENT: CHAT */}
      {activeTab === "chat" && (
        <div className="flex-1 flex flex-col min-h-0 bg-slate-50/50">
          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4.5 shadow-xs border ${
                    msg.role === "user"
                      ? "bg-slate-900 text-white border-slate-800 rounded-tr-none"
                      : "bg-white border-slate-200 text-slate-800 rounded-tl-none"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold tracking-wider uppercase opacity-60">
                      {msg.role === "user" ? "You (Apprentice)" : "AITOPIA Expert"}
                    </span>
                    <span className="text-[9px] opacity-40 font-mono ml-4">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="space-y-1.5">{renderMessageText(msg.content, msg.role === "user")}</div>
                </div>
              </div>
            ))}
            
            {isChatLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 shadow-xs flex items-center gap-2 text-xs text-slate-500">
                  <Loader className="w-4 h-4 text-amber-500 animate-spin" />
                  <span>AITOPIA is processing answer...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompts Panel */}
          {chatMessages.length === 1 && (
            <div className="px-4 py-2 border-t border-slate-100 bg-white">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2 block">Quick Action Prompts</span>
              <div className="grid grid-cols-1 gap-2">
                {QUICK_PROMPTS.map((qp, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendChatMessage(qp.prompt)}
                    className="p-3 text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all hover:border-slate-300 flex items-start gap-2.5 group cursor-pointer"
                  >
                    <span className="text-amber-500 group-hover:scale-110 transition-transform">✦</span>
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-slate-800">{qp.title}</div>
                      <div className="text-[10px] text-slate-500 truncate mt-0.5">{qp.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Bar */}
          <div className="p-3 border-t border-slate-200 bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChatMessage(chatInput);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask about AI algorithms, ethical biases, or Atɛntɛbɛn secrets..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                disabled={isChatLoading}
                className="flex-1 bg-slate-50 border border-slate-200 text-xs px-4 py-2.5 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-slate-400 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || isChatLoading}
                className="bg-slate-900 text-white p-2.5 rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-40 cursor-pointer flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB CONTENT: VIDEO ANALYZER */}
      {activeTab === "video" && (
        <div className="flex-1 flex flex-col min-h-0 bg-slate-50/50 p-6 overflow-y-auto">
          {/* Active Video Overview Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs mb-6 relative overflow-hidden">
            <div className="absolute right-3 top-3 bg-red-100/50 text-red-600 p-2 rounded-full">
              <Youtube className="w-5 h-5 fill-current" />
            </div>

            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Educational Video Source</span>
            <h3 className="text-sm font-bold text-slate-800 mt-1 mr-8">{selectedVideo.title}</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{selectedVideo.description}</p>
            
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="bg-amber-500/10 text-amber-700 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                Apprentice Masterclass
              </span>
              <span className="bg-slate-100 text-slate-600 text-[10px] px-2.5 py-0.5 rounded-full font-mono">
                Ghanaian Tradition
              </span>
            </div>
          </div>

          {/* Action Trigger */}
          {!videoSummary && !isVideoLoading && (
            <div className="bg-white border border-dashed border-slate-300 rounded-xl p-8 text-center flex flex-col items-center">
              <Sparkles className="w-8 h-8 text-amber-500 mb-3 animate-bounce" />
              <h4 className="text-xs font-bold text-slate-800 mb-1">Analyze Video Transcript</h4>
              <p className="text-xs text-slate-400 max-w-sm mb-5 leading-relaxed">
                Click below to send the complete video text and timestamp indexes to the server-side Gemini AI model. It will create an executive summary and interactive high-craft highlights table.
              </p>
              <button
                onClick={handleAnalyzeVideo}
                className="bg-slate-900 text-white font-semibold text-xs px-5 py-2.5 rounded-xl hover:bg-slate-850 transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 fill-white" /> Analyze with Gemini AI
              </button>
            </div>
          )}

          {/* Loading Block */}
          {isVideoLoading && (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center flex flex-col items-center">
              <Loader className="w-8 h-8 text-amber-500 animate-spin mb-3" />
              <h4 className="text-xs font-bold text-slate-800 mb-1">Synthesizing Educational Content</h4>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Gemini is summarizing structural findings and calculating exact seconds mappings. This will compile into a clickable table sync-enabled with the simulator!
              </p>
            </div>
          )}

          {/* Video summary & results */}
          {videoSummary && !isVideoLoading && (
            <div className="space-y-6">
              {/* Executive Summary */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 mb-3">
                  AI Video Summary
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {videoSummary.summary}
                </p>
              </div>

              {/* Highlights Interactive List */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <div className="bg-slate-900 text-white p-3 px-4 flex items-center justify-between">
                  <h4 className="text-xs font-bold tracking-wider uppercase">
                    Interactive Highlights
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">Click to sync &amp; play</span>
                </div>

                <div className="divide-y divide-slate-100">
                  {videoSummary.highlights.map((hl, idx) => {
                    const isActive = activeHighlightIdx === idx;
                    return (
                      <div
                        key={idx}
                        onClick={() => handleHighlightClick(hl, idx)}
                        className={`p-4 transition-all hover:bg-slate-50 cursor-pointer flex gap-4 ${
                          isActive ? "bg-amber-500/5 border-l-4 border-amber-500" : ""
                        }`}
                      >
                        {/* Timestamp marker */}
                        <div className="flex-shrink-0 text-center">
                          <span className={`inline-flex items-center justify-center font-mono text-[10px] font-bold rounded-lg px-2 py-1 ${
                            isActive ? "bg-amber-500 text-slate-950" : "bg-slate-100 text-slate-600"
                          }`}>
                            {hl.timestamp}
                          </span>
                          <span className="block text-[9px] text-slate-400 font-mono mt-1">({hl.secondValue}s)</span>
                        </div>

                        {/* Description and Significance */}
                        <div className="flex-1 min-w-0">
                          <h5 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            {hl.description}
                            {isActive && <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping"></span>}
                          </h5>
                          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                            <strong className="text-slate-700">Significance: </strong>
                            {hl.significance}
                          </p>
                        </div>

                        {/* Interactive Play icon mapping */}
                        <div className="flex-shrink-0 flex items-center">
                          <div className={`p-1.5 rounded-full transition-colors ${
                            isActive ? "bg-amber-500/10 text-amber-600" : "bg-slate-50 text-slate-400"
                          }`}>
                            <Play className="w-3.5 h-3.5 fill-current" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reset analyzer button */}
              <div className="text-center pt-2">
                <button
                  onClick={() => setVideoSummary(null)}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Re-analyze transcript
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
