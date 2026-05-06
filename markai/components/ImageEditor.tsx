
import React, { useState, useCallback, useRef } from 'react';
import { UploadCloud, Wand2, Download } from 'lucide-react';
import { editImageWithPrompt } from '../services/geminiService';
import Spinner from './Spinner';

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // remove the data url prefix
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });

const ImageEditor: React.FC = () => {
  const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);
  const [originalImagePreview, setOriginalImagePreview] = useState<string | null>(null);
  const [editPrompt, setEditPrompt] = useState<string>('Make the image black and white, but keep the main subject in color.');
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      setOriginalImageFile(file);
      setOriginalImagePreview(URL.createObjectURL(file));
      setEditedImage(null);
      setError(null);
    } else if (file) {
      setError('Please select a valid image file (e.g., JPG, PNG, WEBP).');
    }
  };

  const onDragAndDrop = (e: React.DragEvent<HTMLDivElement>, action: 'enter' | 'leave' | 'drop') => {
    e.preventDefault();
    e.stopPropagation();
    if (action === 'enter') setIsDragging(true);
    if (action === 'leave') setIsDragging(false);
    if (action === 'drop') {
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFileChange(file);
    }
  };
  
  const handleKeyboardUpload = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        fileInputRef.current?.click();
    }
  };

  const handleSubmit = useCallback(async () => {
    if (!originalImageFile || !editPrompt.trim()) {
      setError('Please upload an image and provide an editing prompt.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setEditedImage(null);

    try {
      const base64Data = await fileToBase64(originalImageFile);
      const resultDataUrl = await editImageWithPrompt(base64Data, originalImageFile.type, editPrompt);
      setEditedImage(resultDataUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during image editing.');
    } finally {
      setIsLoading(false);
    }
  }, [originalImageFile, editPrompt]);
  
  const ImageContainer: React.FC<{ title: string; imageUrl: string | null; children?: React.ReactNode, isLoading?: boolean }> = ({ title, imageUrl, children, isLoading = false }) => (
    <div className="w-full bg-primary rounded-xl border-2 border-default p-4 flex flex-col items-center justify-center aspect-video relative">
      <h3 className="absolute top-4 left-4 text-lg font-semibold text-primary bg-secondary/80 px-3 py-1 rounded-full">{title}</h3>
      {imageUrl && <img src={imageUrl} alt={title} className="max-w-full max-h-full object-contain rounded-md" />}
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-secondary/70 flex flex-col items-center justify-center rounded-lg">
          <Spinner className="w-12 h-12 text-accent-primary" />
          <p className="mt-4 text-lg font-semibold text-secondary">AI is editing...</p>
        </div>
      )}
      {imageUrl && title === "Edited Image" && (
         <a 
            href={imageUrl} 
            download={`markai-edited-${Date.now()}.png`}
            className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-accent-primary text-white text-sm font-semibold hover:bg-accent-primary/90 transition-colors shadow-lg"
        >
            <Download className="h-4 w-4" />
            <span>Download</span>
        </a>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-primary sm:text-5xl">AI Image Editor</h1>
        <p className="mt-4 text-xl text-secondary">
          Transform your images with simple text commands.
        </p>
      </div>

      <div className="bg-secondary p-6 rounded-2xl shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Input Section */}
            <div className="space-y-4">
                <div 
                    role="button"
                    tabIndex={0}
                    aria-label="Upload an image"
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary ${isDragging ? 'border-accent-primary bg-accent-primary/10' : 'border-default hover:border-accent-secondary'}`}
                    onClick={() => fileInputRef.current?.click()}
                    onKeyDown={handleKeyboardUpload}
                    onDragEnter={(e) => onDragAndDrop(e, 'enter')}
                    onDragOver={(e) => onDragAndDrop(e, 'enter')}
                    onDragLeave={(e) => onDragAndDrop(e, 'leave')}
                    onDrop={(e) => onDragAndDrop(e, 'drop')}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                    />
                    <UploadCloud className="mx-auto h-12 w-12 text-secondary" />
                    <p className="mt-2 text-sm text-secondary">
                        <span className="font-semibold text-accent-primary">Click to upload</span> or drag and drop an image
                    </p>
                    <p className="text-xs text-secondary/80">PNG, JPG, GIF up to 10MB</p>
                </div>
                 <div>
                    <label htmlFor="edit-prompt" className="block text-sm font-semibold text-primary mb-2">
                        How should we edit the image?
                    </label>
                    <textarea
                        id="edit-prompt"
                        rows={3}
                        value={editPrompt}
                        onChange={(e) => setEditPrompt(e.target.value)}
                        className="w-full p-3 bg-primary text-primary border border-default rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-accent-primary transition duration-200"
                        placeholder="e.g., Add a retro filter, remove the background"
                    />
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={isLoading || !originalImageFile}
                    className="w-full bg-accent-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-accent-primary/90 focus:outline-none focus:ring-4 focus:ring-accent-primary/50 transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                    {isLoading ? <Spinner /> : <Wand2 />}
                    <span>{isLoading ? 'Generating...' : 'Apply Edit'}</span>
                </button>
            </div>

            {/* Output Section */}
            <div className="space-y-6">
                 {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg" role="alert"><p>{error}</p></div>}
                <ImageContainer title="Original Image" imageUrl={originalImagePreview}>
                    {!originalImagePreview && <p className="text-secondary">Upload an image to get started</p>}
                </ImageContainer>
                <ImageContainer title="Edited Image" imageUrl={editedImage} isLoading={isLoading}>
                    {!editedImage && !isLoading && <p className="text-secondary">Your edited image will appear here</p>}
                </ImageContainer>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;
