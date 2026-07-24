import React, { useState, useEffect, useMemo } from 'react';

interface LatexRendererProps {
  children: string;
}

declare global {
  interface Window {
    katex: any;
  }
}

export const LatexRenderer: React.FC<LatexRendererProps> = ({ children }) => {
  const [isKatexAvailable, setIsKatexAvailable] = useState(false);

  useEffect(() => {
    // Check for KaTeX immediately and periodically
    const checkKatex = () => {
      if (typeof window !== 'undefined' && window.katex) {
        console.log('KaTeX found!');
        setIsKatexAvailable(true);
        return true;
      }
      return false;
    };

    // Initial check
    if (checkKatex()) {
      return;
    }

    // Wait for DOM to be ready, then check
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', checkKatex);
    }

    // Also check on window load
    window.addEventListener('load', checkKatex);

    // Poll as backup
    const intervalId = setInterval(checkKatex, 100);

    // Cleanup after 10 seconds
    const timeoutId = setTimeout(() => {
      clearInterval(intervalId);
      console.warn("KaTeX failed to load after 10 seconds, using fallback");
    }, 10000);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
      document.removeEventListener('DOMContentLoaded', checkKatex);
      window.removeEventListener('load', checkKatex);
    };
  }, []);

  const content = useMemo(() => {
    console.log('LatexRenderer - isKatexAvailable:', isKatexAvailable);
    console.log('LatexRenderer - children:', children);
    console.log('LatexRenderer - window.katex:', !!window.katex);
    
    if (typeof children !== 'string' || !children) {
      return <span>{children}</span>;
    }

    // If KaTeX is not available, provide a basic fallback for common math expressions
    if (!isKatexAvailable) {
      console.log("LatexRenderer - using improved fallback rendering");

      let fallbackContent = children;

      // Handle matrices: replace with a more readable format
      fallbackContent = fallbackContent.replace(/\\begin{bmatrix}(.*?)\\end{bmatrix}/g, (match, matrixContent) => {
        const rows = matrixContent.trim().split("\\\\").map(row => 
          row.trim().split("&").map(cell => cell.trim()).join("  ")
        );
        return `<div class="matrix-fallback">${rows.join("<br>")}</div>`;
      });

      // Handle percentages
      fallbackContent = fallbackContent.replace(/([0-9]+)\\%/g, "$1%");

      // Handle general LaTeX expressions (inline and block)
      fallbackContent = fallbackContent.replace(/\\times/g, "x"); // Replace \times with 'x'
      fallbackContent = fallbackContent.replace(/\$\$([^$]+)\$\$/g, "<p><em>$1</em></p>");
      fallbackContent = fallbackContent.replace(/\$([^$]+)\$/g, "<em>$1</em>");

      return <span dangerouslySetInnerHTML={{ __html: fallbackContent }} />;
    }

    // Regex to find and split by KaTeX delimiters ($...$ or $$...$$).
    const regex = /(\$\$[\s\S]+?\$\$|\$[\s\S]+?\$)/g;
    const parts = children.split(regex);
    console.log('LatexRenderer - parts:', parts);

    return (
      <>
        {parts.map((part, i) => {
          if (i % 2 === 1) { // Matched delimiters will be at odd indices.
            const isBlock = part.startsWith('$$');
            const latex = part.slice(isBlock ? 2 : 1, isBlock ? -2 : -1);
            console.log('LatexRenderer - rendering LaTeX:', latex);
            // Use displayMode for block-level math or expressions with newlines (like matrices).
            const useDisplayMode = isBlock || latex.includes('\\begin{') || latex.includes('\\\\');

            try {
              const html = window.katex.renderToString(latex, {
                throwOnError: false,
                displayMode: useDisplayMode,
              });
              const className = useDisplayMode ? "latex-block" : "latex-inline";
              console.log('LatexRenderer - rendered HTML:', html);
              return <span key={i} className={className} dangerouslySetInnerHTML={{ __html: html }} />;
            } catch (e) {
              console.error("KaTeX rendering error:", e);
              // Fallback to displaying raw text on error to prevent crashing.
              return <span key={i} className="text-red-500 font-mono">{part}</span>;
            }
          } else {
            // This is plain text.
            return <span key={i}>{part}</span>;
          }
        })}
      </>
    );
  }, [children, isKatexAvailable]);

  return content;
};
