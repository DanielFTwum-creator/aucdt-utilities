import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content) return null;

  // Split content by lines
  const lines = content.split('\n');
  const renderedElements: React.ReactNode[] = [];
  
  let inList = false;
  let listItems: string[] = [];
  let isNumberedList = false;

  let inTable = false;
  let tableHeaders: string[] = [];
  let tableRows: string[][] = [];

  const flushList = (key: string) => {
    if (listItems.length === 0) return;
    const ListTag = isNumberedList ? 'ol' : 'ul';
    const listClass = isNumberedList ? 'list-decimal pl-6 my-3 space-y-1.5 text-slate-700 font-sans' : 'list-disc pl-6 my-3 space-y-1.5 text-slate-700 font-sans';
    
    renderedElements.push(
      <ListTag key={`list-${key}`} className={listClass}>
        {listItems.map((item, idx) => (
          <li key={idx} className="leading-relaxed">
            {renderInlineMarkdown(item)}
          </li>
        ))}
      </ListTag>
    );
    listItems = [];
    inList = false;
  };

  const flushTable = (key: string) => {
    if (tableRows.length === 0 && tableHeaders.length === 0) return;
    renderedElements.push(
      <div key={`table-${key}`} className="my-5 overflow-x-auto border border-slate-200 rounded-xl shadow-sm bg-white">
        <table className="w-full text-left border-collapse min-w-[500px]">
          {tableHeaders.length > 0 && (
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
              <tr>
                {tableHeaders.map((header, idx) => (
                  <th key={idx} className="px-5 py-3.5 font-display">
                    {renderInlineMarkdown(header.trim())}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {tableRows.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-slate-50/50 transition-colors duration-150">
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="px-5 py-3 font-sans leading-relaxed">
                    {renderInlineMarkdown(cell.trim())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableHeaders = [];
    tableRows = [];
    inTable = false;
  };

  const renderInlineMarkdown = (text: string): React.ReactNode[] => {
    // Basic bold **text** matching
    const parts: React.ReactNode[] = [];
    let currentText = text;
    let keyIdx = 0;

    // Match bold **word** or *word*
    const boldRegex = /\*\*([^*]+)\*\*/g;
    let lastIndex = 0;
    let match;

    while ((match = boldRegex.exec(currentText)) !== null) {
      if (match.index > lastIndex) {
        parts.push(<span key={keyIdx++}>{currentText.substring(lastIndex, match.index)}</span>);
      }
      parts.push(<strong key={keyIdx++} className="font-semibold text-slate-900">{match[1]}</strong>);
      lastIndex = boldRegex.lastIndex;
    }

    if (lastIndex < currentText.length) {
      parts.push(<span key={keyIdx++}>{currentText.substring(lastIndex)}</span>);
    }

    return parts.length > 0 ? parts : [currentText];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // 1. Detect Tables
    if (line.startsWith('|')) {
      if (inList) flushList(`pre-table-${i}`);
      inTable = true;
      const cells = line.split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
      
      // Check if it is a divider line like |---|---|
      const isDivider = cells.every(c => c.match(/^-+$/));
      
      if (isDivider) {
        continue; // skip divider rows
      }

      if (tableHeaders.length === 0 && tableRows.length === 0) {
        tableHeaders = cells;
      } else {
        tableRows.push(cells);
      }
      continue;
    } else if (inTable) {
      flushTable(`line-${i}`);
    }

    // 2. Detect lists
    const bulletMatch = line.match(/^[-*]\s+(.*)$/);
    const numberedMatch = line.match(/^(\d+)\.\s+(.*)$/);

    if (bulletMatch) {
      if (inList && isNumberedList) flushList(`switch-${i}`);
      inList = true;
      isNumberedList = false;
      listItems.push(bulletMatch[1]);
      continue;
    } else if (numberedMatch) {
      if (inList && !isNumberedList) flushList(`switch-${i}`);
      inList = true;
      isNumberedList = true;
      listItems.push(numberedMatch[2]);
      continue;
    } else if (inList) {
      flushList(`end-${i}`);
    }

    // 3. Headers
    if (line.startsWith('###')) {
      renderedElements.push(
        <h4 key={i} className="text-md font-semibold text-slate-800 font-display mt-5 mb-2 flex items-center gap-2">
          {renderInlineMarkdown(line.replace(/^###\s*/, ''))}
        </h4>
      );
    } else if (line.startsWith('##')) {
      renderedElements.push(
        <h3 key={i} className="text-lg font-bold text-slate-900 font-display mt-6 mb-3 border-b border-slate-100 pb-1.5">
          {renderInlineMarkdown(line.replace(/^##\s*/, ''))}
        </h3>
      );
    } else if (line.startsWith('#')) {
      renderedElements.push(
        <h2 key={i} className="text-xl font-bold text-teal-800 font-serif mt-7 mb-4">
          {renderInlineMarkdown(line.replace(/^#\s*/, ''))}
        </h2>
      );
    } else if (line === '') {
      // Empty line, add spacer or handle paragraph division
      renderedElements.push(<div key={i} className="h-2"></div>);
    } else {
      // Normal Paragraph
      renderedElements.push(
        <p key={i} className="text-slate-600 font-sans leading-relaxed text-sm my-2.5">
          {renderInlineMarkdown(line)}
        </p>
      );
    }
  }

  // Flush remaining lists or tables
  if (inList) flushList('final');
  if (inTable) flushTable('final');

  return <div className="space-y-1 font-sans">{renderedElements}</div>;
}
