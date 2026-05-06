
import React, { useState, useCallback } from 'react';
import { ProgramData } from './types';
import { convertPdfToJson } from './services/geminiService';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import JsonDisplay from './components/JsonDisplay';
import Loader from './components/Loader';
import { DocumentTextIcon, XCircleIcon } from './components/IconComponents';

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jsonData, setJsonData] = useState<ProgramData[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleConvert = useCallback(async () => {
    if (!selectedFile) {
      setError('Please select a PDF file first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setJsonData(null);

    try {
      const base64String = await fileToBase64(selectedFile);
      const result = await convertPdfToJson(base64String);
      setJsonData(result);
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to convert PDF. ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [selectedFile]);
  
  const handleReset = () => {
    setSelectedFile(null);
    setJsonData(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header />
        <main className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Input & Controls */}
          <div className="bg-slate-800/50 rounded-lg p-6 ring-1 ring-white/10 flex flex-col">
            <h2 className="text-xl font-semibold text-sky-400 mb-4">1. Upload PDF</h2>
            <FileUpload onFileSelect={setSelectedFile} file={selectedFile} disabled={isLoading} />
            
            {error && (
              <div className="mt-4 bg-red-900/50 border border-red-700 text-red-300 p-3 rounded-md flex items-start space-x-2">
                <XCircleIcon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="mt-auto pt-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={handleConvert}
                disabled={!selectedFile || isLoading}
                className="w-full flex-1 inline-flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 disabled:bg-slate-700 disabled:cursor-not-allowed disabled:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500 transition-colors"
              >
                {isLoading ? 'Converting...' : 'Convert to JSON'}
              </button>
              <button
                onClick={handleReset}
                disabled={isLoading}
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-3 border border-slate-600 text-base font-medium rounded-md shadow-sm text-slate-300 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-slate-500 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Right Column: Output */}
          <div className="bg-slate-800/50 rounded-lg p-6 ring-1 ring-white/10 flex flex-col min-h-[400px] lg:min-h-0">
            <h2 className="text-xl font-semibold text-emerald-400 mb-4">2. JSON Output</h2>
            <div className="flex-grow bg-slate-900 rounded-md p-4 overflow-auto relative">
              {isLoading && <Loader />}
              {!isLoading && jsonData && <JsonDisplay data={jsonData} />}
              {!isLoading && !jsonData && (
                <div className="flex flex-col items-center justify-center h-full text-slate-500">
                  <DocumentTextIcon className="h-16 w-16 mb-4" />
                  <p className="text-center">Your generated JSON will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
