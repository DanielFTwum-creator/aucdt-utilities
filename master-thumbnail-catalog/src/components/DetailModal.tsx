
import React, { useRef, useState } from 'react';
import { ThumbnailVariation } from '../data/catalog';
import { X, Download, Check, Monitor, Smartphone, Tablet, Loader2 } from 'lucide-react';
import { ThumbnailPreview } from './ThumbnailPreview';
import { toPng } from 'html-to-image';

interface DetailModalProps {
  variation: ThumbnailVariation | null;
  sectionTitle: string;
  sectionTheme: string;
  onClose: () => void;
  customBackground?: string | null;
}

export const DetailModal: React.FC<DetailModalProps> = ({ variation, sectionTitle, sectionTheme, onClose, customBackground }) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!variation) return null;

  const handleDownload = async () => {
    if (previewRef.current) {
      setIsDownloading(true);
      try {
        // Small delay to ensure render
        await new Promise(resolve => setTimeout(resolve, 100));
        const dataUrl = await toPng(previewRef.current, { cacheBust: true, pixelRatio: 2 });
        const link = document.createElement('a');
        link.download = `${variation.filename.replace('.png', '')}_preview.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error('Failed to download thumbnail', err);
        alert('Failed to generate download. Please try again.');
      } finally {
        setIsDownloading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col md:flex-row" onClick={e => e.stopPropagation()}>
        
        {/* Left: Preview */}
        <div className="w-full md:w-1/2 bg-black p-6 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-zinc-800 relative">
          <div ref={previewRef} className="w-full aspect-video shadow-2xl border border-zinc-800 rounded-lg overflow-hidden bg-black">
             <ThumbnailPreview title={sectionTitle} style={variation.style} theme={sectionTheme} className="h-full" customBackground={customBackground} />
          </div>
          <div className="mt-6 w-full">
            <h3 className="text-zinc-400 text-xs font-mono uppercase tracking-wider mb-2">File Details</h3>
            <div className="bg-zinc-950 rounded p-3 text-sm font-mono text-zinc-300 border border-zinc-800">
              <div className="flex justify-between mb-1"><span>File:</span> <span className="text-zinc-500">{variation.filename}</span></div>
              <div className="flex justify-between mb-1"><span>Size:</span> <span className="text-zinc-500">{variation.fileSize}</span></div>
              <div className="flex justify-between"><span>Res:</span> <span className="text-zinc-500">1280x720</span></div>
            </div>
            
            <button 
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full mt-4 bg-white hover:bg-zinc-200 text-black font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDownloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
              {isDownloading ? 'Generating...' : 'Download Asset'}
            </button>
          </div>
        </div>

        {/* Right: Info */}
        <div className="w-full md:w-1/2 p-6 md:p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">{variation.style}</h2>
              <p className="text-zinc-400 text-sm">{sectionTitle}</p>
            </div>
            <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Visual Style */}
            <div>
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Visual Style</h3>
              <ul className="space-y-2">
                {variation.visualStyle.description.map((desc, i) => (
                  <li key={i} className="flex items-start gap-2 text-zinc-300 text-sm">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                    {desc}
                  </li>
                ))}
                <li className="flex items-start gap-2 text-zinc-300 text-sm">
                   <div className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                   Font Size: {variation.visualStyle.fontSize}
                </li>
              </ul>
            </div>

            {/* Best For */}
            <div>
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Best For</h3>
              <div className="flex flex-wrap gap-2">
                {variation.bestFor.map((item, i) => (
                  <span key={i} className="bg-zinc-800 text-zinc-300 text-xs px-2 py-1 rounded border border-zinc-700">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Performance */}
            <div>
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Projected Performance</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-zinc-800/50 p-3 rounded border border-zinc-800 flex flex-col items-center">
                  <Monitor size={16} className="text-zinc-400 mb-2" />
                  <div className="flex text-yellow-500 text-xs gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < variation.performance.desktop ? 'opacity-100' : 'opacity-20'}>★</span>
                    ))}
                  </div>
                  <span className="text-[10px] text-zinc-500 mt-1 uppercase">Desktop</span>
                </div>
                <div className="bg-zinc-800/50 p-3 rounded border border-zinc-800 flex flex-col items-center">
                  <Smartphone size={16} className="text-zinc-400 mb-2" />
                  <div className="flex text-yellow-500 text-xs gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < variation.performance.mobile ? 'opacity-100' : 'opacity-20'}>★</span>
                    ))}
                  </div>
                  <span className="text-[10px] text-zinc-500 mt-1 uppercase">Mobile</span>
                </div>
                <div className="bg-zinc-800/50 p-3 rounded border border-zinc-800 flex flex-col items-center">
                  <Tablet size={16} className="text-zinc-400 mb-2" />
                  <div className="flex text-yellow-500 text-xs gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < variation.performance.tablet ? 'opacity-100' : 'opacity-20'}>★</span>
                    ))}
                  </div>
                  <span className="text-[10px] text-zinc-500 mt-1 uppercase">Tablet</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
