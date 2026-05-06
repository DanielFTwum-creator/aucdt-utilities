import React, { useState, useRef, useEffect, useCallback } from 'react';
import { UploadCloud, File as FileIcon, X, Loader, CheckCircle, AlertCircle, Server } from 'lucide-react';
import ConfirmationModal from './ConfirmationModal';
import { ExtractedProgramme } from '../types';

interface PdfExtractorProps {
  onPdfUpdate: (data: ExtractedProgramme[], file: File, duration: number) => void;
  onPdfError: (error: Error, file: File) => void;
}

type ProcessStage = 'idle' | 'uploading' | 'processing' | 'success' | 'error';

const StageIndicator: React.FC<{
    stage: ProcessStage;
    currentStage: ProcessStage;
    label: string;
    icon: React.ReactNode;
}> = ({ stage, currentStage, label, icon }) => {
    const isActive = currentStage === stage;
    const isCompleted = 
      (currentStage === 'processing' && stage === 'uploading') ||
      (currentStage === 'success' && (stage === 'uploading' || stage === 'processing'));

    const isPending = !isActive && !isCompleted && currentStage !== 'error';

    return (
        <div className="flex flex-col items-center gap-2 text-center">
            <div className={`
                w-10 h-10 rounded-full flex items-center justify-center transition-colors
                ${isActive ? 'bg-sky-100 dark:bg-sky-900/50 text-sky-500 animate-pulse [.high-contrast_&]:bg-cyan-900/50 [.high-contrast_&]:text-cyan-400' : ''}
                ${isCompleted ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-500 [.high-contrast_&]:bg-green-900/50 [.high-contrast_&]:text-green-400' : ''}
                ${isPending ? 'bg-slate-200 dark:bg-slate-600 text-slate-500 [.high-contrast_&]:bg-slate-700 [.high-contrast_&]:text-slate-300' : ''}
                ${currentStage === 'error' ? 'bg-red-100 dark:bg-red-900/50 text-red-500' : ''}
            `}>
                {isCompleted ? <CheckCircle size={20} /> : (currentStage === 'error' ? <X size={20}/> : icon)}
            </div>
            <div className="text-xs font-medium text-slate-700 dark:text-slate-300 [.high-contrast_&]:text-white">
                <p>{label}</p>
            </div>
        </div>
    );
};


const PdfExtractor: React.FC<PdfExtractorProps> = ({ onPdfUpdate, onPdfError }) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStage, setCurrentStage] = useState<ProcessStage>('idle');
  const [finalMessage, setFinalMessage] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  
  const timerRef = useRef<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const startTimer = () => {
      const startTime = performance.now();
      timerRef.current = window.setInterval(() => {
          setElapsedTime((performance.now() - startTime) / 1000);
      }, 100);
  };
  
  const stopTimer = () => {
      if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
      }
      return elapsedTime;
  };

  // FIX: The original useEffect was duplicated, had a TypeScript error because its cleanup function returned a value,
  // and a logic bug from its dependency array that stopped the timer prematurely.
  // This single useEffect correctly cleans up the timer interval on component unmount as a safeguard.
  useEffect(() => {
      return () => {
          if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
          }
      };
  }, []);

  const resetState = useCallback(() => {
    setFile(null);
    setError('');
    setIsProcessing(false);
    setCurrentStage('idle');
    setFinalMessage('');
    // FIX: Inlined timer cleanup logic to avoid stale closure issues with stopTimer in useCallback.
    if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
    }
    setElapsedTime(0);
  }, []);

  const handleFile = (selectedFile: File) => {
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please upload a valid PDF file.');
      setFile(null);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    resetState();
    handleFile(e.target.files?.[0] as File);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isProcessing) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (isProcessing) return;
    
    resetState();
    handleFile(e.dataTransfer.files?.[0] as File);
  };


  const handleExtract = async () => {
    if (!file) return;
    
    setIsModalOpen(false);
    setIsProcessing(true);
    startTimer();

    try {
        setCurrentStage('uploading');
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('/api/v1/admin/curriculum/upload', {
            method: 'POST',
            body: formData,
        });

        setCurrentStage('processing'); // Visually move to next stage while waiting for json

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Extraction failed: ${response.status} - ${errorBody}`);
        }

        const extractedData: ExtractedProgramme[] = await response.json();
        
        const totalDuration = stopTimer();
        onPdfUpdate(extractedData, file, totalDuration);
        
        setCurrentStage('success');
        setFinalMessage(`Found ${extractedData.length} programmes. Total time: ${totalDuration.toFixed(1)}s`);

    } catch (err: any) {
        stopTimer();
        const error = err instanceof Error ? err : new Error('An unknown error occurred during extraction.');
        console.error("Extraction failed:", error);
        setError(error.message);
        setCurrentStage('error');
        setFinalMessage(error.message);
        if (file) {
            onPdfError(error, file);
        }
    }
  };
  
  const formatBytes = (bytes: number, decimals = 0) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors w-full ${
                isDragOver
                  ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/30 [.high-contrast_&]:bg-cyan-900/50 [.high-contrast_&]:border-cyan-400'
                  : 'border-slate-300 dark:border-slate-600 hover:border-sky-500 dark:hover:border-sky-400 [.high-contrast_&]:border-yellow-300 [.high-contrast_&]:hover:border-cyan-400'
              }`}
            >
              <input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="application/pdf" disabled={isProcessing} />
              
              {isDragOver && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-slate-900/80 [.high-contrast_&]:bg-black/80 rounded-lg pointer-events-none z-10">
                  <UploadCloud className="h-12 w-12 text-sky-500 [.high-contrast_&]:text-cyan-400 animate-bounce" />
                  <p className="mt-2 text-lg font-semibold text-sky-600 dark:text-sky-400 [.high-contrast_&]:text-cyan-400">Drop PDF here to upload</p>
                </div>
              )}

              {!file ? (
                  <>
                      <UploadCloud className="mx-auto h-10 w-10 text-slate-400" />
                      <label htmlFor="file-upload" className="mt-2 block text-sm font-semibold text-sky-600 dark:text-sky-400 [.high-contrast_&]:text-cyan-400 cursor-pointer">
                          Choose a PDF file
                          <span className="text-slate-500 dark:text-slate-400 [.high-contrast_&]:text-slate-300 font-normal"> or drag and drop</span>
                      </label>
                  </>
              ) : (
                   <div className="flex items-center justify-between text-left">
                      <div className="flex items-center gap-4">
                          <div className="bg-red-100 dark:bg-red-900/50 [.high-contrast_&]:bg-black [.high-contrast_&]:border [.high-contrast_&]:border-yellow-300 p-3 rounded-lg flex-shrink-0">
                            <FileIcon className="text-red-500 dark:text-red-300 [.high-contrast_&]:text-yellow-300" size={24} />
                          </div>
                          <div>
                              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 [.high-contrast_&]:text-white truncate" title={file.name}>{file.name}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 [.high-contrast_&]:text-slate-300">{formatBytes(file.size)}</p>
                          </div>
                      </div>
                      <button onClick={() => resetState()} disabled={isProcessing} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 [.high-contrast_&]:hover:bg-slate-600 transition-colors">
                          <X className="text-slate-500 hover:text-red-500" />
                      </button>
                  </div>
              )}
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              disabled={!file || isProcessing}
              className="w-full sm:w-auto flex-shrink-0 flex items-center justify-center gap-2 bg-[#2E4034] text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-colors disabled:bg-slate-400 dark:disabled:bg-slate-600 [.high-contrast_&]:disabled:bg-slate-700 [.high-contrast_&]:disabled:text-slate-400 [.high-contrast_&]:disabled:border-slate-700 disabled:cursor-not-allowed [.high-contrast_&]:bg-black [.high-contrast_&]:border-2 [.high-contrast_&]:border-yellow-300 [.high-contrast_&]:text-yellow-300 [.high-contrast_&]:hover:bg-yellow-300 [.high-contrast_&]:hover:text-black"
            >
              {isProcessing ? <><Loader size={18} className="animate-spin" /> Processing...</> : 'Extract & Update Data'}
            </button>
        </div>

        {error && !isProcessing && <p className="text-sm text-red-600 dark:text-red-400 text-center pt-2">{error}</p>}
        
        {(isProcessing || currentStage === 'success' || currentStage === 'error') && (
            <div className="bg-slate-50 dark:bg-slate-800/50 [.high-contrast_&]:bg-black p-4 rounded-lg space-y-4 border border-slate-200 dark:border-slate-700 [.high-contrast_&]:border-yellow-300 mt-4">
                <div className="flex justify-between items-center">
                    <p className="text-lg font-bold text-slate-800 dark:text-slate-200 [.high-contrast_&]:text-white">
                        Processing Status
                    </p>
                     {isProcessing && (
                         <p className="text-lg font-mono font-semibold text-slate-600 dark:text-slate-300 [.high-contrast_&]:text-white">
                            {elapsedTime.toFixed(1)}s
                        </p>
                     )}
                </div>
                
                <div className="flex justify-around items-start pt-2">
                    <StageIndicator stage="uploading" currentStage={currentStage} label="Upload PDF" icon={<UploadCloud size={18} />} />
                    <StageIndicator stage="processing" currentStage={currentStage} label="Processing on Server" icon={<Server size={18} />} />
                </div>
                
                {currentStage === 'processing' && (
                     <div className="text-center text-sm text-sky-600 dark:text-sky-400 [.high-contrast_&]:text-cyan-400 font-medium pt-2">
                        <p>Server is analyzing the document with AI. This may take a moment...</p>
                    </div>
                )}

                {(currentStage === 'success' || currentStage === 'error') && (
                    <div className={`flex items-center gap-3 p-3 rounded-md text-sm font-medium
                        ${currentStage === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-500/30 [.high-contrast_&]:bg-green-900/50 [.high-contrast_&]:text-green-300 [.high-contrast_&]:border-green-500/50' : ''}
                        ${currentStage === 'error' ? 'bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-500/30' : ''}
                    `}>
                        {currentStage === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                        <p>{finalMessage}</p>
                    </div>
                )}
            </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleExtract}
        title="Confirm Data Update & Deletion"
      >
        <p>This action will permanently delete all existing evaluation data.</p>
        <p className="mt-2">It will then analyze the uploaded PDF to update the curriculum (programmes, courses, and lecturers).</p>
        <p className="mt-4 font-semibold text-red-600 dark:text-red-400">This action cannot be undone. Are you sure you want to proceed?</p>
      </ConfirmationModal>
    </>
  );
};

export default PdfExtractor;