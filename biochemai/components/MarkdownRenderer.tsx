import React from 'react';
import { GoogleInfographic } from './GoogleInfographic';

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

  const parseInfographic = (text: string) => {
    const match = text.match(/<!-- infographic\s+([\s\S]*?)-->/);
    if (!match) return null;

    const infoDef = match[1];
    const titleMatch = infoDef.match(/title:\s*"([^"]+)"/);
    const stepsMatch = infoDef.match(/steps:\s*([\s\S]*?)(?=-->|$)/);

    if (!titleMatch || !stepsMatch) return null;

    const title = titleMatch[1];
    const stepsText = stepsMatch[1];
    const stepLines = stepsText.split('\n').filter(l => l.includes('icon:'));

    const steps = stepLines.map((line: string) => {
      const iconMatch = line.match(/icon:\s*"([^"]+)"/);
      const labelMatch = line.match(/label:\s*"([^"]+)"/);
      const isEmphasis = line.includes('(emphasis)');

      return {
        icon: iconMatch?.[1] || '●',
        label: labelMatch?.[1]?.replace(/\\n/g, '\n') || 'Step',
        emphasis: isEmphasis,
      };
    });

    return { title, steps };
  };

  // First pass: extract and render infographics
  let processedContent = content;
  const infographicRegex = /<!-- infographic\s+([\s\S]*?)-->/g;
  let infographicMatch;
  let elementIndex = 0;

  while ((infographicMatch = infographicRegex.exec(content)) !== null) {
    const infographicData = parseInfographic(infographicMatch[0]);
    if (infographicData) {
      elements.push(
        <GoogleInfographic
          key={`infographic-${elementIndex}`}
          title={infographicData.title}
          steps={infographicData.steps}
        />
      );
      elementIndex++;
    }
    processedContent = processedContent.replace(infographicMatch[0], '');
  }

  processedContent.split('\n').forEach((line, index) => {
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
          className="text-lg font-bold mt-4 mb-2 text-[var(--color-text-inverted)] bg-[var(--color-accent-primary)] border-l-4 border-[var(--color-accent-primary)] pl-3 py-2 rounded"
          dangerouslySetInnerHTML={{ __html: headerContent }}
        />
      );
    } else if (trimmedLine.startsWith('## ')) {
      const headerContent = processInlineMarkdown(trimmedLine.substring(3));
      elements.push(
        <h2
          key={index}
          className="text-xl font-extrabold mt-6 mb-3 text-[var(--color-text-inverted)] bg-[var(--color-accent-primary)] border-l-4 border-[var(--color-accent-primary)] pl-3 py-2 rounded"
          dangerouslySetInnerHTML={{ __html: headerContent }}
        />
      );
    } else if (trimmedLine.startsWith('# ')) {
      const headerContent = processInlineMarkdown(trimmedLine.substring(2));
      elements.push(
        <h1
          key={index}
          className="text-2xl font-extrabold mt-8 mb-4 text-[var(--color-text-inverted)] bg-[var(--color-accent-primary)] border-l-4 border-[var(--color-accent-primary)] pl-3 py-3 rounded"
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