import { motion } from "framer-motion";
import { CheckCheck } from "lucide-react";
import React from "react";
import { Message } from "../types";
import { DashboardCard } from "./DashboardCard";

interface ChatBubbleProps {
  message: Message;
  index: number;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, index }) => {
  const isSent = message.sender === "me";

  return (
    <motion.div
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        duration: 0.3, 
        delay: index * 0.15,
        type: "spring",
        stiffness: 260,
        damping: 20 
      }}
      className={`max-w-[80%] p-2.5 rounded-xl text-[13.5px] leading-relaxed relative ${
        isSent 
        ? "bg-[#005c4b] text-[#e9edef] self-flex-end rounded-tr-none ml-auto" 
        : "bg-[#202c33] text-[#e9edef] self-flex-start rounded-tl-none mr-auto"
      }`}
      style={{
        alignSelf: isSent ? "flex-end" : "flex-start",
        marginTop: index === 0 ? "0" : "4px"
      }}
    >
      {message.isDashboard ? (
        <DashboardCard />
      ) : (
        <div className="whitespace-pre-wrap">{message.content}</div>
      )}
      
      <div className="flex items-center justify-end gap-1 mt-1">
        <span className="text-[10px] text-[#8696a0]">{message.time}</span>
        {isSent && (
          <CheckCheck size={12} className="text-[#53bdeb]" />
        )}
      </div>

      {message.reaction && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.15 + 0.3, type: "spring" }}
          className="absolute -bottom-3 right-2 bg-[#202c33] border border-[#2a3942] rounded-full px-1.5 py-0.5 text-sm shadow-lg pointer-events-none"
        >
          {message.reaction}
        </motion.div>
      )}
    </motion.div>
  );
};
