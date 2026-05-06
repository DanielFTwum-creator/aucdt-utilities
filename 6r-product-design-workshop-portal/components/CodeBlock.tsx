import React, { useEffect, useRef } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.min.css'; // Dark theme for code blocks
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup'; // For HTML
import Button from './ui/Button';

interface CodeBlockProps {
  code: string;
  language: string;
  sandboxUrl?: string; // Optional CodeSandbox URL
  className?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language, sandboxUrl, className = '' }) => {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code, language]);

  const handleTryItClick = () => {
    if (sandboxUrl) {
      window.open(sandboxUrl, '_blank');
    }
  };

  return (
    <div className={`relative bg-gray-900 rounded-lg shadow-md overflow-hidden ${className}`}>
      <div className="absolute top-2 right-2 flex space-x-2">
        {sandboxUrl && (
          <Button variant="secondary" size="sm" onClick={handleTryItClick}>
            Try it
          </Button>
        )}
      </div>
      <pre className="p-4 overflow-x-auto">
        <code ref={codeRef} className={`language-${language} font-mono text-sm`}>
          {code}
        </code>
      </pre>
    </div>
  );
};

export default CodeBlock;