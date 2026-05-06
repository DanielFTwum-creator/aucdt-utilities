import React, { useCallback } from 'react';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { ExclamationIcon } from './icons/ExclamationIcon';
import { BeakerIcon } from './icons/BeakerIcon';
import { DownloadIcon } from './icons/DownloadIcon';

interface ReviewDisplayProps {
  review: string;
  isLoading: boolean;
  error: string;
}

const MarkdownContent: React.FC<{ content: string }> = ({ content }) => {
    // This component remains the same for parsing and displaying markdown.
    const renderLine = (line: string, index: number) => {
        if (line.startsWith('### ')) {
            return <h3 key={index} className="text-xl font-bold text-cyan-400 mt-6 mb-3">{line.substring(4)}</h3>;
        }
        if (line.startsWith('## ')) {
            return <h2 key={index} className="text-2xl font-bold text-cyan-300 mt-8 mb-4">{line.substring(3)}</h2>;
        }
        if (line.startsWith('* ') || line.startsWith('- ')) {
            return <li key={index} className="ml-5 list-disc text-slate-300">{line.substring(2)}</li>;
        }
        if (line.startsWith('```')) {
            return <pre key={index} className="bg-slate-900/70 p-4 rounded-md my-4 text-sm font-mono overflow-x-auto">{line.substring(3).replace(/```/g, '')}</pre>
        }
        if (line.trim() === '') {
            return <br key={index} />;
        }
        return <p key={index} className="text-slate-300 leading-relaxed">{line}</p>;
    };

    const blocks = content.split(/(\n```[a-z]*\n[\s\S]*?\n```\n)/g);
    
    return (
        <div>
            {blocks.map((block, i) => {
                if (block.startsWith('\n```')) {
                    const codeBlock = block.replace(/`{3}[a-z]*\n?/g, '').trim();
                    return <pre key={i} className="bg-slate-900 p-4 rounded-md my-4 text-sm font-mono overflow-x-auto border border-slate-700"><code className="text-cyan-300">{codeBlock}</code></pre>;
                }
                return block.split('\n').map(renderLine);
            })}
        </div>
    );
};


export const ReviewDisplay: React.FC<ReviewDisplayProps> = ({ review, isLoading, error }) => {
  const handleExport = useCallback(() => {
    if (!review) return;

    const blob = new Blob([review], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ai-code-review.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [review]);

  const Placeholder = () => (
    <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
      <CheckCircleIcon className="w-16 h-16 mb-4" />
      <h3 className="text-xl font-semibold">Ready for Review</h3>
      <p>Your expert AI code analysis will appear here.</p>
    </div>
  );

  const LoadingState = () => (
     <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
        <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h3 className="text-xl font-semibold">Analyzing Code...</h3>
        <p>The AI is thinking. This may take a moment.</p>
    </div>
  );

  const ErrorState = () => (
    <div className="flex flex-col items-center justify-center h-full text-center text-red-400 bg-red-900/20 rounded-lg p-4">
        <ExclamationIcon className="w-16 h-16 mb-4"/>
        <h3 className="text-xl font-semibold">An Error Occurred</h3>
        <p className="max-w-md">{error}</p>
    </div>
  );

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 shadow-lg flex flex-col max-h-[calc(100vh-120px)] md:max-h-full">
      <div className="flex items-center justify-between p-3 border-b border-slate-700 flex-shrink-0">
        <div className="flex items-center gap-2">
            <BeakerIcon className="w-5 h-5 text-slate-400" />
            <h2 className="text-lg font-semibold text-slate-200">AI Analysis</h2>
        </div>
        <button
          onClick={handleExport}
          disabled={!review || isLoading}
          className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-700/50 disabled:cursor-not-allowed disabled:text-slate-500 text-slate-200 font-semibold py-1 px-3 rounded-md text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500"
          aria-label="Export review as Markdown file"
        >
          <DownloadIcon className="w-4 h-4" />
          Export
        </button>
      </div>
       <div className="p-4 flex-grow overflow-y-auto">
        {isLoading && <LoadingState />}
        {!isLoading && error && <ErrorState />}
        {!isLoading && !error && !review && <Placeholder />}
        {!isLoading && !error && review && (
            <div className="prose prose-invert max-w-none prose-headings:text-cyan-400 prose-p:text-slate-300 prose-li:text-slate-300 prose-pre:bg-slate-900 prose-code:text-cyan-300">
                 <MarkdownContent content={review} />
            </div>
        )}
       </div>
    </div>
  );
};