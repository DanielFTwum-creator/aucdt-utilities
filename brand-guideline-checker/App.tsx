
import React, { useCallback, useState } from 'react';
import { AnalysisResult } from './components/AnalysisResult';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { SrsConverter } from './components/SrsConverter';
import { RefreshStatus } from './components/RefreshStatus';
import { analyzeImageForBrandCompliance, convertSrsToLatex } from './services/geminiService';
import AuditService from './services/AuditService';
import type { AnalysisReport } from './types';

type View = 'checker' | 'refresh';

const App: React.FC = () => {
  const [view, setView] = useState<View>('checker');
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [srsText, setSrsText] = useState<string>('');
  const [latexOutput, setLatexOutput] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [conversionError, setConversionError] = useState<string | null>(null);

  const handleImageUpload = useCallback((file: File) => {
    setImagePreviewUrl(URL.createObjectURL(file));
    setAnalysisResult(null);
    setError(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      setImageBase64(base64String);
    };
    reader.onerror = () => {
        setError('Failed to read the image file.');
        setImagePreviewUrl(null);
        setImageBase64(null);
    }
  }, []);

  const handleAnalyzeClick = useCallback(async () => {
    if (!imageBase64) {
      setError('Please upload an image first.');
      return;
    }

    setIsLoading(true);
    setAnalysisResult(null);
    setError(null);

    try {
      AuditService.log('ANALYSIS_START', 'Initiating AI brand compliance check', 'INFO');
      const result = await analyzeImageForBrandCompliance(imageBase64);
      setAnalysisResult(result);
      AuditService.log('ANALYSIS_SUCCESS', `Compliance Score: ${result.overallScore}/100`, 'SUCCESS');
    } catch (err) {
      console.error(err);
      setError('An error occurred during analysis. Please check your API key and try again.');
      AuditService.log('ANALYSIS_ERROR', err instanceof Error ? err.message : 'Unknown analysis failure', 'ERROR');
    } finally {
      setIsLoading(false);
    }
  }, [imageBase64]);

  const handleSrsConvert = useCallback(async () => {
    if (!srsText) {
        setConversionError('Please paste your SRS text first.');
        return;
    }

    setIsConverting(true);
    setLatexOutput(null);
    setConversionError(null);

    try {
        const result = await convertSrsToLatex(srsText);
        setLatexOutput(result);
    } catch (err) {
        console.error(err);
        setConversionError('An error occurred during conversion. Please try again.');
    } finally {
        setIsConverting(false);
    }
  }, [srsText]);


  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#2C1810]">
      <Header onRefreshClick={() => setView('refresh')} />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'refresh' ? (
            <RefreshStatus onBack={() => setView('checker')} />
        ) : (
            <div className="max-w-4xl mx-auto">
              <p className="text-center text-lg mb-8 text-gray-700">
                Upload a design or marketing material to automatically check its compliance with the TUC brand guidelines.
              </p>
              <div className="bg-white rounded-lg shadow-subtle p-6 md:p-8 border-l-4 border-[#C8A84B]">
                <ImageUploader 
                  onImageUpload={handleImageUpload}
                  onAnalyze={handleAnalyzeClick}
                  isAnalyzing={isLoading}
                  imagePreviewUrl={imagePreviewUrl}
                />
              </div>

              <AnalysisResult 
                result={analysisResult}
                isLoading={isLoading}
                error={error}
              />
              
              <hr className="my-16 border-t-2 border-dashed border-gray-300" />

              <SrsConverter
                srsText={srsText}
                onSrsTextChange={setSrsText}
                onConvert={handleSrsConvert}
                isConverting={isConverting}
                latexOutput={latexOutput}
                conversionError={conversionError}
              />
            </div>
        )}
      </main>
      <footer className="text-center py-6 text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Techbridge University College. All rights reserved.</p>
        <p>This tool is for internal guidance and review purposes.</p>
      </footer>
    </div>
  );
};

export default App;