import { Camera, ChevronLeft, Mic, MoreVertical, Phone, Smile, Video } from "lucide-react";
import React from "react";
import { ChatBubble } from "./components/ChatBubble";
import { CHAT_SCRIPT } from "./constants";
import "./styles/global.css";

const PhoneHeader: React.FC = () => {
  return (
    <header className="bg-[#202c33] px-3 py-2.5 flex items-center gap-2 border-b border-[#2a3942] sticky top-0 z-20">
      <div className="flex items-center gap-1.5">
        <ChevronLeft size={20} className="text-[#00a884] cursor-pointer" />
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00a884] to-[#025c4c] flex items-center justify-center text-xl shadow-md border border-white/5">
          👨‍💻
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <h2 className="text-[15px] font-bold text-[#e9edef] truncate">Daniel 🔥</h2>
        <span className="text-[11px] text-[#8696a0] block -mt-0.5">online</span>
      </div>
      <div className="flex items-center gap-5 text-[#8696a0]">
        <Video size={18} className="cursor-pointer hover:text-white transition-colors" />
        <Phone size={18} className="cursor-pointer hover:text-white transition-colors" />
        <MoreVertical size={18} className="cursor-pointer hover:text-white transition-colors" />
      </div>
    </header>
  );
};

const ChatInput: React.FC = () => {
  return (
    <div className="bg-[#202c33] p-2.5 flex items-center gap-2.5 border-t border-[#2a3942]">
      <div className="flex-1 bg-[#2a3942] rounded-full px-4 py-2 flex items-center gap-3">
        <Smile size={20} className="text-[#8696a0] cursor-pointer" />
        <input 
          placeholder="Message" 
          className="flex-1 bg-transparent border-none text-[14px] text-[#e9edef] outline-none placeholder:text-[#8696a0]"
        />
        <Camera size={20} className="text-[#8696a0] cursor-pointer" />
      </div>
      <div className="w-11 h-11 bg-[#00a884] rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform cursor-pointer">
        <Mic size={20} className="text-white" />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#111b21] selection:bg-[#00a884]/30 selection:text-white">
      <div className="w-full max-w-[420px] bg-[#111b21] rounded-[3rem] border-[6px] border-[#2a3942] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] flex flex-col h-[85vh] relative">
        <PhoneHeader />
        
        <main className="flex-1 overflow-y-auto custom-scrollbar bg-[#0b141a] chat-bg-pattern flex flex-col p-4 gap-2 scroll-smooth">
          <div className="self-center bg-[#182229] text-[#8696a0] text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-lg mb-4 shadow-sm">
            Today
          </div>
          
          {CHAT_SCRIPT.map((msg, idx) => (
            <ChatBubble key={msg.id} message={msg} index={idx} />
          ))}
          
          <div className="mt-8 text-center text-[#2a3942] text-[10px] font-black uppercase tracking-[0.2em] py-4">
            Parody • Not a real conversation
          </div>
        </main>

        <ChatInput />
      </div>
    </div>
  );
};

export default App;
