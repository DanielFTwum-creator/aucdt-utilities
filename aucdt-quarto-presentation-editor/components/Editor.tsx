import React from 'react';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isSaved: boolean;
}

const Editor: React.FC<EditorProps> = ({ value, onChange, onUndo, onRedo, canUndo, canRedo, isSaved }) => {

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey;

    // Undo: Ctrl+Z (Win/Linux) or Cmd+Z (Mac)
    if (ctrlOrCmd && !e.shiftKey && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      if (canUndo) {
        onUndo();
      }
      return;
    }
    
    // Redo:
    // Mac: Cmd+Shift+Z
    // Windows/Linux: Ctrl+Y or Ctrl+Shift+Z
    if (isMac && ctrlOrCmd && e.shiftKey && e.key.toLowerCase() === 'z') { // Mac Redo
        e.preventDefault();
        if (canRedo) {
            onRedo();
        }
    } else if (!isMac && ctrlOrCmd && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))) { // Windows/Linux Redo
        e.preventDefault();
        if (canRedo) {
            onRedo();
        }
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gray-200 dark:bg-gray-700 p-2 border-b border-gray-300 dark:border-gray-600 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Content Editor (.qmd)</h2>
        <div className="flex items-center space-x-2">
           <span className={`text-sm italic mr-3 transition-opacity duration-300 ${isSaved ? 'text-gray-500' : 'text-gray-800 dark:text-gray-300'}`}>
            {isSaved ? 'Saved' : 'Saving...'}
          </span>
           <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-1 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
            aria-label="Undo change (Ctrl+Z)"
            title="Undo (Ctrl+Z)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l4-4m-4 4l4 4" />
            </svg>
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-1 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
            aria-label="Redo change (Ctrl+Y)"
            title="Redo (Ctrl+Y)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 10H11a8 8 0 00-8 8v2m18-10l-4-4m4 4l-4 4" />
            </svg>
          </button>
        </div>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-grow w-full h-full p-4 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 resize-none focus:outline-none font-mono text-sm leading-6"
        spellCheck="false"
        aria-label="Presentation Content Editor"
      />
    </div>
  );
};

export default Editor;