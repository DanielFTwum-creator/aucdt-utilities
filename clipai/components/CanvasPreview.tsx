import React from 'react';
import { DownloadIcon, ImageIcon, MinusIcon, PlusIcon, ResetIcon, FileTextIcon } from '../constants';
import { ClippingMode } from '../types';

interface CanvasPreviewProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  image: HTMLImageElement | null;
  clippingMode: ClippingMode;
  zoom: number;
  isPanning: boolean;
  onMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp: () => void;
  onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseLeave: () => void;
  onWheel: (e: React.WheelEvent<HTMLCanvasElement>) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onDownloadPng: () => void;
  onDownloadPdf: () => void;
  isDownloadDisabled: boolean;
  downloadTooltip: string;
}

const CanvasPreview: React.FC<CanvasPreviewProps> = ({
  canvasRef, image, clippingMode, zoom, isPanning,
  onMouseDown, onMouseUp, onMouseMove, onMouseLeave, onWheel,
  onZoomIn, onZoomOut, onReset, onDownloadPng, onDownloadPdf,
  isDownloadDisabled, downloadTooltip,
}) => {
  const showCanvas = image || clippingMode === 'outline';
  const cursorClass = showCanvas ? (isPanning ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default';

  return (
    <div className="hc-bg hc-border hc-text bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white hc-text mb-4">
        Step 3: Adjust & Download
      </h2>
      
      <div className="w-full aspect-square bg-grid-pattern rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden relative">
        {!showCanvas && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 pointer-events-none">
            <ImageIcon />
            <p className="mt-4 text-sm font-medium text-gray-500 dark:text-gray-400">Your image preview will appear here</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Use your mouse wheel to zoom and drag to pan</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Keyboard: +/- to zoom, R to reset</p>
          </div>
        )}
        
        <canvas
          ref={canvasRef}
          className={`w-full h-full ${cursorClass}`}
          onMouseDown={onMouseDown} onMouseUp={onMouseUp}
          onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}
          onWheel={onWheel}
          title={showCanvas ? 'Scroll to zoom, click and drag to pan' : 'Upload an image to see the preview'}
        />
        
        {showCanvas && (
          <>
            <div className="absolute bottom-3 right-3 flex items-center gap-1">
              <button onClick={onZoomOut} className="p-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white dark:hover:bg-gray-700 transition-colors" title="Zoom out (-)" aria-label="Zoom out"><MinusIcon className="h-4 w-4" /></button>
              <button onClick={onReset} className="p-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white dark:hover:bg-gray-700 transition-colors" title="Reset zoom and position (R)" aria-label="Reset transforms"><ResetIcon className="h-4 w-4" /></button>
              <button onClick={onZoomIn} className="p-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white dark:hover:bg-gray-700 transition-colors" title="Zoom in (+)" aria-label="Zoom in"><PlusIcon className="h-4 w-4" /></button>
            </div>
            <div className="absolute top-3 left-3 px-2 py-1 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-md shadow-md text-xs font-medium text-gray-600 dark:text-gray-300">
              {Math.round(zoom * 100)}%
            </div>
          </>
        )}
      </div>

      <div className="mt-6 w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button onClick={onDownloadPng} disabled={isDownloadDisabled} title={downloadTooltip} className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200">
          <DownloadIcon className="h-5 w-5" />
          <span>Download PNG</span>
        </button>
        <button onClick={onDownloadPdf} disabled={isDownloadDisabled} title={downloadTooltip.replace('Image', 'PDF')} className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200">
          <FileTextIcon className="h-5 w-5" />
          <span>Download PDF</span>
        </button>
      </div>
    </div>
  );
};

export default CanvasPreview;
