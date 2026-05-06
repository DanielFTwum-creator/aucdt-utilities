import { Check, Copy } from "lucide-react";
import React, { useState } from "react";

interface CopyCellProps {
  value: string;
}

export const CopyCell: React.FC<CopyCellProps> = ({ value }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <td 
      onClick={handleCopy}
      className={`px-4 py-3 cursor-pointer font-mono text-[13px] border-b border-white/5 transition-all duration-200 group relative ${
        copied ? "bg-emerald-500/10 text-emerald-400" : "hover:bg-white/5 text-slate-300"
      }`}
      title={`Click to copy: ${value}`}
    >
      <div className="flex items-start gap-2">
        <span className="flex-1 break-all">{value}</span>
        <span className={`shrink-0 transition-opacity duration-200 ${copied ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
          {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} className="text-slate-500" />}
        </span>
      </div>
    </td>
  );
};
