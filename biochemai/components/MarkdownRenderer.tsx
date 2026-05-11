import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const elements: React.ReactElement[] = [];
  let listItems: string[] = [];
  
  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul className="list-disc list-inside space-y-1 my-2" key={`list-${elements.length}`}>
          {listItems.map((item, index) => (
            <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  const processInlineMarkdown = (text: string): string => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  };

  content.split('\n').forEach((line, index) => {
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
      const itemContent = processInlineMarkdown(trimmedLine.substring(2).trim());
      listItems.push(itemContent);
      return;
    }

    flushList(); // End any list before processing other elements

    if (trimmedLine.startsWith('### ')) {
      const headerContent = processInlineMarkdown(trimmedLine.substring(4));
      elements.push(<h3 key={index} className="text-lg font-semibold mt-4 mb-2" dangerouslySetInnerHTML={{ __html: headerContent }} />);
    } else if (trimmedLine.startsWith('## ')) {
      const headerContent = processInlineMarkdown(trimmedLine.substring(3));
      elements.push(<h2 key={index} className="text-xl font-bold mt-6 mb-3" dangerouslySetInnerHTML={{ __html: headerContent }} />);
    } else if (trimmedLine.startsWith('# ')) {
        const headerContent = processInlineMarkdown(trimmedLine.substring(2));
        elements.push(<h1 key={index} className="text-2xl font-extrabold mt-8 mb-4" dangerouslySetInnerHTML={{ __html: headerContent }} />);
    } else if (trimmedLine) {
      const pContent = processInlineMarkdown(line);
      elements.push(<p key={index} dangerouslySetInnerHTML={{ __html: pContent }} />);
    }
    // Empty lines will create space, which is fine.
  });
  
  flushList(); // Flush any remaining list at the end

  return <>{elements}</>;
};