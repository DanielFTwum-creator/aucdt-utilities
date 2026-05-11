import { Download, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { generateProjectZip } from "../services/ZipService";

export const ProjectDownloader: React.FC = () => {
  const [progress, setProgress] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      await generateProjectZip(setProgress);
    } catch (error) {
      setProgress("Download failed. Please try again.");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-8 mt-auto border-t border-[var(--border)] bg-[var(--surface-alt)]/50">
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between gap-8">
        <div className="flex-1">
          <h3 className="text-lg font-bold mb-1">Export Baseline Project</h3>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            Generate a pre-configured Vite + React 19 project structure containing this workflow 
            utility as a standalone implementation. Ready for <code className="bg-white/5 px-1 rounded text-[var(--accent)]">pnpm install</code>.
          </p>
        </div>
        
        <div className="flex flex-col items-end gap-3 min-w-[240px]">
          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className={`w-full flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 shadow-2xl ${
              isGenerating 
              ? "bg-[var(--surface-alt)] text-[var(--text-dim)] cursor-not-allowed" 
              : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:-translate-y-1 hover:shadow-blue-500/20"
            }`}
          >
            {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
            {isGenerating ? "GENERATING..." : "DOWNLOAD BASELINE"}
          </button>
          
          {progress && (
            <div className="text-[10px] font-bold text-[var(--text-muted)] italic animate-pulse">
              {progress}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
