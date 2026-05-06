
import React, { useState, useRef } from 'react';
import { X, Upload, Camera, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import { GoogleGenAI, Type } from '@google/genai';
import { Category } from '../types';

interface SmartAnalysisModalProps {
  onClose: () => void;
  onSuccess: (data: any) => void;
  categories: Category[];
}

const SmartAnalysisModal: React.FC<SmartAnalysisModalProps> = ({ onClose, onSuccess, categories }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      processReceipt(file);
    }
  };

  const processReceipt = async (file: File) => {
    setIsScanning(true);
    setError(null);
    
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
        
        const categoryList = categories.map(c => `${c.id}: ${c.name}`).join(', ');

        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType: file.type,
                  data: base64Data
                }
              },
              {
                text: `Analyse this receipt and extract: total amount (number), date (YYYY-MM-DD), merchant/description, and pick the best category ID from this list: [${categoryList}]. Return JSON format.`
              }
            ]
          },
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                amount: { type: Type.NUMBER },
                date: { type: Type.STRING },
                description: { type: Type.STRING },
                categoryId: { type: Type.STRING },
                tags: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["amount", "description"]
            }
          }
        });

        const result = JSON.parse(response.text);
        onSuccess(result);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      console.error('Gemini error:', err);
      setError('Failed to analyze receipt. Please try again or enter manually.');
      setIsScanning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        <div className="p-6 border-b flex items-center justify-between bg-indigo-600 text-white">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/20 rounded-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold">Smart Receipt Scan</h3>
              <p className="text-xs text-indigo-100">Powered by Gemini AI</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 flex-1 flex flex-col items-center justify-center text-center">
          {isScanning ? (
            <div className="space-y-6 py-12">
              <div className="relative">
                <div className="w-24 h-24 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <ReceiptScanIcon className="w-10 h-10 text-indigo-600 animate-pulse" />
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-gray-900 text-lg">Analyzing Receipt...</h4>
                <p className="text-sm text-gray-500 max-w-xs mx-auto">Gemini is extracting details, identifying merchant, and categorizing spending.</p>
              </div>
            </div>
          ) : previewUrl ? (
            <div className="w-full space-y-4">
              <div className="aspect-[3/4] w-full max-h-80 bg-gray-100 rounded-2xl overflow-hidden border-2 border-indigo-100 shadow-inner">
                <img src={previewUrl} alt="Receipt Preview" className="w-full h-full object-contain" />
              </div>
              <p className="text-sm text-gray-500 italic">Processing receipt image...</p>
            </div>
          ) : (
            <div className="space-y-8 w-full">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full aspect-video border-2 border-dashed border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/30 rounded-3xl flex flex-col items-center justify-center gap-4 cursor-pointer transition-all group"
              >
                <div className="p-4 bg-gray-50 rounded-2xl group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-gray-400 group-hover:text-indigo-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-700">Upload Receipt Image</p>
                  <p className="text-sm text-gray-400">PNG, JPG or PDF up to 10MB</p>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                />
              </div>

              <div className="flex items-center gap-3 py-4">
                <div className="flex-1 h-px bg-gray-100"></div>
                <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">or</span>
                <div className="flex-1 h-px bg-gray-100"></div>
              </div>

              <button className="w-full py-4 px-6 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-black transition-colors shadow-lg shadow-gray-200">
                <Camera className="w-6 h-6" />
                Capture with Camera
              </button>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-rose-50 text-rose-600 rounded-xl text-sm font-medium flex items-start gap-2">
              <X className="w-4 h-4 mt-0.5" />
              {error}
            </div>
          )}
        </div>

        <div className="p-6 bg-gray-50 border-t text-center">
          <p className="text-xs text-gray-400 leading-relaxed">
            By uploading, you agree to AI processing of your financial document. 
            All data is encrypted and used only for extraction purposes.
          </p>
        </div>
      </div>
    </div>
  );
};

const ReceiptScanIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z" />
    <path d="M16 8h-6" />
    <path d="M16 12H8" />
    <path d="M13 16H8" />
  </svg>
);

export default SmartAnalysisModal;
