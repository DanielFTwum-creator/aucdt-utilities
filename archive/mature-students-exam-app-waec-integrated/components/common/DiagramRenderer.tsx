import React, { useEffect, useRef } from 'react';
// @ts-ignore
import mermaid from 'mermaid';
import { Question } from '../../types'; // Make sure this path is correct

// The props now accept the entire question object to check for both diagram types
interface DiagramRendererProps {
  question: Question;
}

export const DiagramRenderer: React.FC<DiagramRendererProps> = ({ question }) => {
  const mermaidRef = useRef<HTMLDivElement>(null);

  // This effect handles rendering for MERMAID diagrams
  useEffect(() => {
    if (question.mermaidCode && mermaidRef.current) {
      const mermaidContainer = mermaidRef.current;
      mermaidContainer.innerHTML = ''; // Clear previous content
      mermaid.initialize({ startOnLoad: false, theme: 'base' });

      try {
        mermaid.render(`mermaid-svg-${question.id}`, question.mermaidCode)
          .then(({ svg }) => {
            if (mermaidContainer) {
              mermaidContainer.innerHTML = svg;
            }
          })
          .catch(error => {
            console.error("Mermaid rendering error:", error);
            if (mermaidContainer) {
              const message = error?.message || String(error);
              mermaidContainer.innerHTML = `<div class="text-red-600 p-4 bg-red-100 border border-red-400 rounded"><strong>Diagram Error:</strong><pre>${message}</pre></div>`;
            }
          });
      } catch (error: any) {
        console.error("Mermaid syntax error:", error);
        if (mermaidContainer) {
          mermaidContainer.innerHTML = `<div class="text-red-600 p-4 bg-red-100 border border-red-400 rounded"><strong>Diagram Syntax Error:</strong><pre>${error.message}</pre></div>`;
        }
      }
    }
  }, [question.mermaidCode, question.id]);

  // --- RENDER LOGIC ---

  // If the question has mermaidCode, we render the container for it.
  if (question.mermaidCode) {
    return <div ref={mermaidRef} className="w-full flex justify-center items-center my-4"></div>;
  }

  // If not, we check for a special, hardcoded SVG diagram type.
  // This is where we restore the beautiful triangle diagram.
  if (question.diagram === 'right_triangle_abc') {
    return (
      <div className="w-full flex justify-center items-center my-4">
        <svg viewBox="0 0 340 300" style={{ maxWidth: '300px', userSelect: 'none' }}>
            <polygon points="50,250 290,250 50,50" fill="none" stroke="#374151" strokeWidth="2" />
            <text x="295" y="260" dominantBaseline="middle" textAnchor="start" fontSize="24" fill="#5C4033" fontWeight="bold">A</text>
            <text x="40" y="260" dominantBaseline="middle" textAnchor="end" fontSize="24" fill="#5C4033" fontWeight="bold">B</text>
            <text x="40" y="45" dominantBaseline="middle" textAnchor="end" fontSize="24" fill="#5C4033" fontWeight="bold">C</text>
            <text x="170" y="270" dominantBaseline="middle" textAnchor="middle" fontSize="20" fill="#374151">6</text>
            <text x="30" y="150" dominantBaseline="middle" textAnchor="middle" fontSize="20" fill="#374151">8</text>
            <text x="170" y="140" dominantBaseline="middle" textAnchor="middle" fontSize="22" fill="#5C4033" fontStyle="italic">AC = ?</text>
            <rect x="50" y="225" width="25" height="25" fill="none" stroke="#374151" strokeWidth="2" />
        </svg>
      </div>
    );
  }

  // If no diagram is specified, render nothing.
  return null;
};
