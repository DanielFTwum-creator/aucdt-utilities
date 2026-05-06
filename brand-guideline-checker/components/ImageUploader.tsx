
import React, { useCallback, useState } from 'react';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  imagePreviewUrl: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUpload,
  onAnalyze,
  isAnalyzing,
  imagePreviewUrl,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const handleDragEvent = useCallback((e: React.DragEvent<HTMLDivElement>, dragging: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(dragging);
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    handleDragEvent(e, false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        onImageUpload(e.dataTransfer.files[0]);
    }
  }, [handleDragEvent, onImageUpload]);

  return (
    <div className="flex flex-col items-center">
      <div 
        className={`w-full max-w-lg p-4 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors duration-300 ${isDragging ? 'border-[#8B1538] bg-[#F4E4BC]/20' : 'border-gray-300 hover:border-[#D4AF37]'}`}
        onDragEnter={(e) => handleDragEvent(e, true)}
        onDragLeave={(e) => handleDragEvent(e, false)}
        onDragOver={(e) => handleDragEvent(e, true)}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <input 
          type="file" 
          id="file-upload" 
          className="hidden" 
          accept="image/png, image/jpeg, image/webp" 
          onChange={handleFileChange} 
        />
        {imagePreviewUrl ? (
          <img src={imagePreviewUrl} alt="Preview" className="max-h-64 mx-auto rounded-md object-contain" />
        ) : (
          <div className="py-10">
            <p className="text-gray-500">
              <span className="font-semibold text-[#6B1028]">Click to upload</span> or drag and drop an image
            </p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG, or WEBP</p>
          </div>
        )}
      </div>
      
      {imagePreviewUrl && (
        <button
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className="mt-6 w-full max-w-xs px-8 py-3 bg-[#8B1538] text-white font-bold rounded-lg shadow-md hover:bg-[#6B1028] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D4AF37] transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyse Image'}
        </button>
      )}
    </div>
  );
};
