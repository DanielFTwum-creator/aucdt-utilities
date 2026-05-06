import React, { useEffect, useRef } from 'react';

// KaTeX and its auto-render extension are loaded from the CDN and available on the window object.
declare const renderMathInElement: any;

interface KatexRendererProps {
  text: string;
  className?: string;
}

const KatexRenderer = ({ text, className }: KatexRendererProps) => {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (element && typeof renderMathInElement === 'function') {
      // To ensure React doesn't interfere with KaTeX's DOM manipulation,
      // we manually set the text content of the container element
      // and then let KaTeX render into it.
      element.textContent = text;
      
      try {
        renderMathInElement(element, {
          delimiters: [
            { left: '$', right: '$', display: false },
            { left: '$$', right: '$$', display: true },
            { left: '\\(', right: '\\)', display: false },
            { left: '\\[', right: '\\]', display: true },
          ],
          // This option prevents KaTeX from throwing an error on malformed
          // LaTeX. Instead, it will display the raw text.
          throwOnError: false,
        });
      } catch (error) {
        // This catch block is for unexpected errors during rendering.
        console.error('KaTeX rendering error:', error);
      }
    }
  }, [text]); // Re-run the effect whenever the text prop changes.

  // We render an empty span. The `useEffect` hook above will populate
  // and manage its content. This is a robust pattern for integrating
  // React with libraries that manipulate the DOM directly.
  return <span ref={containerRef} className={className} />;
};

export default KatexRenderer;
