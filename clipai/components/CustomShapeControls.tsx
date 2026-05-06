import React from 'react';
import { SparkleIcon, ClipboardIcon, CheckIcon, GridIcon, XIcon, UploadIcon } from '../constants';
import { CustomShapeSource } from '../types';

interface CustomShapeControlsProps {
  customMode: 'ai' | 'paste' | null;
  activeCustomSource: CustomShapeSource | null;
  aiPrompt: string;
  customSvgPath: string | null;
  isGeneratingShape: boolean;
  generationError: string | null;
  pasteError: string | null;
  isCopied: boolean;
  onCustomModeClick: (mode: 'ai' | 'paste') => void;
  onUploadClick: () => void;
  onLibraryClick: () => void;
  onAiPromptChange: (prompt: string) => void;
  onGenerateShape: () => void;
  onStopGenerating: () => void;
  onPastedPathChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onCopyPath: () => void;
  onSvgShapeUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  svgShapeFileInputRef: React.RefObject<HTMLInputElement>;
}

const CustomShapeControls: React.FC<CustomShapeControlsProps> = ({
  customMode,
  activeCustomSource,
  aiPrompt,
  customSvgPath,
  isGeneratingShape,
  generationError,
  pasteError,
  isCopied,
  onCustomModeClick,
  onUploadClick,
  onLibraryClick,
  onAiPromptChange,
  onGenerateShape,
  onStopGenerating,
  onPastedPathChange,
  onCopyPath,
  onSvgShapeUpload,
  svgShapeFileInputRef
}) => {
  return (
    <div>
      <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 hc-text">
        Or Create a Custom Shape
      </h3>
      
      <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          onClick={() => onCustomModeClick('ai')}
          className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-colors ${
            activeCustomSource === 'ai' ? 'bg-purple-100 dark:bg-purple-900/50 border-purple-600 text-purple-800 dark:text-purple-300' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
          }`}
          title="Generate a custom shape using an AI prompt"
          aria-pressed={activeCustomSource === 'ai'}
        >
          <SparkleIcon className="h-5 w-5" />
          <span className="font-medium text-sm">Generate</span>
        </button>
        
        <button
          onClick={onUploadClick}
          className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-colors ${
            activeCustomSource === 'upload' ? 'bg-purple-100 dark:bg-purple-900/50 border-purple-600 text-purple-800 dark:text-purple-300' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
          }`}
          title="Upload an SVG file to use as a shape"
          aria-pressed={activeCustomSource === 'upload'}
        >
          <UploadIcon className="h-5 w-5" />
          <span className="font-medium text-sm">Upload</span>
        </button>
        
        <button
          onClick={() => onCustomModeClick('paste')}
          className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-colors ${
            activeCustomSource === 'paste' ? 'bg-purple-100 dark:bg-purple-900/50 border-purple-600 text-purple-800 dark:text-purple-300' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
          }`}
          title="Paste a custom SVG path to use as a shape"
          aria-pressed={activeCustomSource === 'paste'}
        >
          <ClipboardIcon className="h-5 w-5" />
          <span className="font-medium text-sm">Paste</span>
        </button>
        
        <button
          onClick={onLibraryClick}
          className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-colors ${
            activeCustomSource === 'library' ? 'bg-purple-100 dark:bg-purple-900/50 border-purple-600 text-purple-800 dark:text-purple-300' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
          }`}
          title="Browse icon library for a shape"
          aria-pressed={activeCustomSource === 'library'}
        >
          <GridIcon />
          <span className="font-medium text-sm">Library</span>
        </button>
      </div>
      
      <input
        ref={svgShapeFileInputRef}
        type="file"
        accept=".svg, image/svg+xml"
        onChange={onSvgShapeUpload}
        className="hidden"
        aria-hidden="true"
      />

      {customMode === 'ai' && (
        <div className="mt-4 space-y-3">
          <input
            type="text" value={aiPrompt} onChange={(e) => onAiPromptChange(e.target.value)}
            placeholder="e.g., a fluffy cloud, a running cat"
            className="hc-bg hc-border hc-text hc-placeholder block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            disabled={isGeneratingShape} title="Describe the shape you want to generate"
          />
          {isGeneratingShape ? (
            <button onClick={onStopGenerating} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors" title="Stop generating the shape">
              <XIcon className="h-5 w-5" /> Stop Generating
            </button>
          ) : (
            <button onClick={onGenerateShape} disabled={!aiPrompt.trim()} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors" title="Generate shape from your description">
              <SparkleIcon className="h-5 w-5" /> Generate Shape
            </button>
          )}
           <div aria-live="polite">
            {isGeneratingShape && <p className="text-sm text-gray-600 dark:text-gray-300">Generating, please wait...</p>}
            {generationError && <p className="text-sm text-red-600 dark:text-red-400">{generationError}</p>}
          </div>
        </div>
      )}

      {customMode === 'paste' && (
        <div className="mt-4 relative">
            <label htmlFor="svg-path-input" className="sr-only">Paste SVG Path Data</label>
          <textarea
            id="svg-path-input" value={customSvgPath || ''} onChange={onPastedPathChange}
            placeholder="Paste your SVG path data here (e.g., M10 80 C ...)"
            className="hc-bg hc-border hc-text hc-placeholder block w-full h-28 px-3 py-2 pr-12 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm resize-y"
            title="Paste SVG path data"
          />
          <button onClick={onCopyPath} disabled={!customSvgPath} className="absolute top-2 right-2 p-1.5 text-gray-500 dark:text-gray-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 disabled:text-gray-300 dark:disabled:text-gray-500 disabled:hover:bg-transparent" title={isCopied ? 'Copied!' : 'Copy SVG Path'}>
            {isCopied ? <CheckIcon className="h-5 w-5 text-green-600" /> : <ClipboardIcon className="h-5 w-5" />}
          </button>
          {pasteError && <p className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">{pasteError}</p>}
          {isCopied && <div className="sr-only" role="alert">SVG path copied to clipboard.</div>}
        </div>
      )}
    </div>
  );
}

export default CustomShapeControls;