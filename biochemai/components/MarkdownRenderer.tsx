import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const elements: React.ReactElement[] = [];
  let listItems: string[] = [];
  let codeBlockLines: string[] = [];
  let inCodeBlock = false;
  let codeLanguage = '';

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul className="list-disc list-inside space-y-1 my-2" key={`list-${elements.length}`}>
          {listItems.map((item, index) => (
            <li key={index} className="text-[var(--color-text-primary)]" dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  const flushCodeBlock = () => {
    if (codeBlockLines.length > 0) {
      const codeContent = codeBlockLines.join('\n');
      elements.push(
        <pre
          key={`code-${elements.length}`}
          className="bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] p-4 rounded-lg overflow-x-auto my-3 border border-[var(--color-border-primary)]"
        >
          <code className={`font-mono text-sm ${codeLanguage ? `language-${codeLanguage}` : ''}`}>
            {codeContent}
          </code>
        </pre>
      );
      codeBlockLines = [];
      codeLanguage = '';
      inCodeBlock = false;
    }
  };

  const processInlineMarkdown = (text: string): string => {
    return text
      .replace(/`([^`]+)`/g, '<code class="bg-[var(--color-bg-secondary)] text-[var(--color-accent-primary)] px-1.5 py-0.5 rounded font-mono text-sm">$1</code>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-[var(--color-accent-primary)]">$1</strong>')
      .replace(/__(.*?)__/g, '<u>$1</u>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  };

  content.split('\n').forEach((line, index) => {
    // Check for code block markers
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        flushCodeBlock();
      } else {
        flushList();
        codeLanguage = line.trim().substring(3).trim();
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeBlockLines.push(line);
      return;
    }

    const trimmedLine = line.trim();

    if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
      const itemContent = processInlineMarkdown(trimmedLine.substring(2).trim());
      listItems.push(itemContent);
      return;
    }

    flushList(); // End any list before processing other elements

    if (trimmedLine.startsWith('### ')) {
      const headerContent = processInlineMarkdown(trimmedLine.substring(4));
      elements.push(
        <h3
          key={index}
          className="text-lg font-semibold mt-4 mb-2 text-[var(--color-text-primary)] border-l-4 border-[var(--color-accent-primary)] pl-3"
          dangerouslySetInnerHTML={{ __html: headerContent }}
        />
      );
    } else if (trimmedLine.startsWith('## ')) {
      const headerContent = processInlineMarkdown(trimmedLine.substring(3));
      elements.push(
        <h2
          key={index}
          className="text-xl font-bold mt-6 mb-3 text-[var(--color-text-primary)] border-l-4 border-[var(--color-accent-primary)] pl-3"
          dangerouslySetInnerHTML={{ __html: headerContent }}
        />
      );
    } else if (trimmedLine.startsWith('# ')) {
      const headerContent = processInlineMarkdown(trimmedLine.substring(2));
      elements.push(
        <h1
          key={index}
          className="text-2xl font-extrabold mt-8 mb-4 text-[var(--color-text-primary)] border-l-4 border-[var(--color-accent-primary)] pl-3"
          dangerouslySetInnerHTML={{ __html: headerContent }}
        />
      );
    } else if (trimmedLine.startsWith('> ')) {
      const quoteContent = processInlineMarkdown(trimmedLine.substring(2));
      elements.push(
        <blockquote
          key={index}
          className="border-l-4 border-[var(--color-accent-primary)] pl-4 italic text-[var(--color-text-secondary)] my-2"
          dangerouslySetInnerHTML={{ __html: quoteContent }}
        />
      );
    } else if (trimmedLine) {
      const pContent = processInlineMarkdown(line);
      elements.push(
        <p
          key={index}
          className="text-[var(--color-text-primary)] leading-relaxed mb-2"
          dangerouslySetInnerHTML={{ __html: pContent }}
        />
      );
    } else {
      elements.push(<div key={index} className="my-1" />);
    }
  });

  flushList();
  flushCodeBlock();

  return <>{elements}</>;
};