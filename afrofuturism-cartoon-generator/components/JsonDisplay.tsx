import React, { useState } from 'react';
import { CopyIcon, CheckIcon, ChevronDownIcon } from './icons';

interface JsonDisplayProps {
  data: unknown;
  title?: string;
  defaultCollapsed?: boolean;
}

function colorizeJson(json: string): React.ReactNode[] {
  const tokens = json.split(/("(?:[^"\\]|\\.)*"(?:\s*:)?|\btrue\b|\bfalse\b|\bnull\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|[{}[\],])/g);
  return tokens.map((token, i) => {
    if (token.match(/^".*":$/)) {
      return <span key={i} className="text-amber-300">{token}</span>;
    }
    if (token.match(/^".*"$/)) {
      return <span key={i} className="text-emerald-300">{token}</span>;
    }
    if (token === 'true' || token === 'false') {
      return <span key={i} className="text-purple-300">{token}</span>;
    }
    if (token === 'null') {
      return <span key={i} className="text-gray-400">{token}</span>;
    }
    if (token.match(/^-?\d/)) {
      return <span key={i} className="text-cyan-300">{token}</span>;
    }
    if (token.match(/^[{}[\]]$/)) {
      return <span key={i} className="text-amber-500">{token}</span>;
    }
    return <span key={i} className="text-gray-300">{token}</span>;
  });
}

const JsonDisplay: React.FC<JsonDisplayProps> = ({ data, title, defaultCollapsed = false }) => {
  const [copied, setCopied] = useState(false);
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const jsonStr = JSON.stringify(data, null, 2);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-purple-800/40 bg-black/40 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-purple-800/30">
        <button
          onClick={() => setCollapsed(c => !c)}
          className="flex items-center gap-2 text-sm font-mono text-amber-300 hover:text-amber-200 transition-colors"
          aria-expanded={!collapsed}
        >
          <ChevronDownIcon className={`w-4 h-4 transition-transform ${collapsed ? '-rotate-90' : ''}`} />
          {title || 'JSON Output'}
        </button>
        <button
          onClick={handleCopy}
          aria-label="Copy JSON to clipboard"
          className="flex items-center gap-1.5 text-xs text-purple-300 hover:text-purple-100 transition-colors px-2 py-1 rounded-md hover:bg-purple-900/40"
        >
          {copied ? <CheckIcon className="w-3.5 h-3.5 text-emerald-400" /> : <CopyIcon className="w-3.5 h-3.5" />}
          {copied ? 'Copied!' : 'Copy JSON'}
        </button>
      </div>
      {!collapsed && (
        <pre className="p-4 text-xs leading-relaxed overflow-x-auto max-h-96 overflow-y-auto font-mono scrollbar-thin">
          {colorizeJson(jsonStr)}
        </pre>
      )}
    </div>
  );
};

export default JsonDisplay;
