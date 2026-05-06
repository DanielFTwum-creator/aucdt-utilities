import { motion } from "motion/react";
import { ChapterData } from "../types";
import React from "react";
import { toast } from "sonner";

interface ChapterProps extends ChapterData {
  isLast?: boolean;
}

const Chapter: React.FC<ChapterProps> = ({ id, number, title, headline, whyMatters, stages, stat, chart, isLast }) => {
  const [shareUrl, setShareUrl] = React.useState("");

  React.useEffect(() => {
    setShareUrl(`${window.location.origin}${window.location.pathname}#${id}`);
  }, [id]);

  const shareText = `Check out the ${title} chapter of the AI Transformation Framework: ${headline}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("LINK SECURED");
  };

  return (
    <section id={id} className="relative py-24 border-t border-[var(--border-card)]">
      {/* SLUGLINE HEADER */}
      <div className="max-w-5xl mx-auto px-8 mb-16">
        <div className="bg-[var(--bg-elevated)] p-4 flex justify-between items-center border-l-4 border-[var(--accent-red)]">
          <h2 className="font-mono text-white text-lg md:text-xl uppercase tracking-widest">
            INT. {title} — DAY
          </h2>
          <span className="font-mono text-[var(--accent-red)] text-lg font-bold">
            SC. {number}
          </span>
        </div>
        <div className="mt-6 ml-4 border-l border-[var(--border-card)] pl-6">
          <h3 className="font-masthead text-4xl md:text-5xl text-black mb-2">
            {headline}
          </h3>
        </div>
      </div>

      {/* Why This Matters */}
      <div className="bg-white py-16 border-y border-[var(--border-card)]">
        <div className="max-w-5xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            <h4 className="font-label text-[var(--accent-red)] text-sm tracking-[3px] uppercase mb-6">
              The Stakes
            </h4>
            <p className="font-mono text-lg leading-relaxed text-[#333]">
              {whyMatters}
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="bg-[var(--bg-card)] p-8 border border-[var(--border-card)] h-full flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-[var(--accent-red)]"></div>
              <div className="font-masthead text-7xl text-[var(--accent-red)] mb-2">{stat.value}</div>
              <p className="font-label text-xs text-[var(--text-muted)] uppercase tracking-widest leading-relaxed">
                {stat.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stages Grid */}
      {stages.length > 0 && (
        <div className="max-w-5xl mx-auto px-8 py-16">
          <h3 className="font-label text-xl mb-12 text-center uppercase tracking-[4px] text-black">
            Action Sequence
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-[var(--border-card)]">
            {stages.map((stage, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-[var(--bg-card)] p-8 border border-[var(--border-card)] hover:bg-white transition-colors group"
              >
                <div className="font-mono text-[10px] text-[var(--text-muted)] mb-2">
                  STEP 0{index + 1}
                </div>
                <h4 className="font-label text-lg uppercase tracking-widest text-[var(--accent-red)] mb-3 group-hover:underline decoration-[var(--accent-red)] underline-offset-4">
                  {stage.name}
                </h4>
                <p className="font-mono text-sm leading-relaxed text-[#333]">
                  {stage.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Chart Section (if present) */}
      {chart && (
        <div className="max-w-4xl mx-auto px-8 py-16">
          <h3 className="font-label text-xl mb-12 text-center uppercase tracking-[4px] text-black">{chart.title}</h3>
          <div className="space-y-8">
            {chart.data.map((item, index) => (
              <div key={index} className="relative">
                <div className="flex items-end justify-between mb-2 font-mono text-xs uppercase tracking-wider text-[#555]">
                  <span>{item.label}</span>
                  <span className="font-bold text-[var(--accent-red)]">{item.value}%</span>
                </div>
                <div className="h-6 bg-[#ddd] w-full relative">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.value}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: index * 0.1, ease: "circOut" }}
                    className="h-full bg-[var(--accent-red)] absolute top-0 left-0"
                  />
                  {/* Thumb indicator */}
                  <motion.div 
                     initial={{ left: 0 }}
                     whileInView={{ left: `${item.value}%` }}
                     viewport={{ once: true }}
                     transition={{ duration: 1, delay: index * 0.1, ease: "circOut" }}
                     className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-[var(--accent-red)] rounded-full z-10 -ml-2"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Share Section */}
      <div className="max-w-5xl mx-auto px-8 py-12 flex flex-col items-center justify-center border-t border-[var(--border-card)] mt-12">
        <p className="font-mono text-[10px] uppercase text-[var(--text-muted)] mb-6 tracking-widest">
          Distribute Intelligence
        </p>
        <div className="flex gap-0 border border-[var(--border-subtle)]">
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-white text-black hover:bg-[var(--accent-red)] hover:text-white transition-colors border-r border-[var(--border-subtle)]"
            title="Share on Twitter"
          >
            {/* Unicode Twitter/X replacement or generic share */}
            <span className="font-label text-sm">TWITTER</span>
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-white text-black hover:bg-[var(--accent-red)] hover:text-white transition-colors border-r border-[var(--border-subtle)]"
            title="Share on LinkedIn"
          >
            <span className="font-label text-sm">LINKEDIN</span>
          </a>
          <button
            onClick={handleCopyLink}
            className="p-4 bg-white text-black hover:bg-[var(--accent-red)] hover:text-white transition-colors"
            title="Copy Link"
          >
            <span className="font-label text-sm">COPY LINK ⟳</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default Chapter;
