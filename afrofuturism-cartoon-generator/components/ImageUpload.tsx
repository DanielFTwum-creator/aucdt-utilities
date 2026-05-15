import React, { useRef, useState } from 'react';
import { UploadIcon } from './icons';

interface ImageUploadProps {
  label: string;
  onImage: (base64: string, mimeType: string) => void;
  onClear: () => void;
  preview?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ label, onImage, onClear, preview }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = e => {
      const dataUrl = e.target?.result as string;
      const base64 = dataUrl.split(',')[1];
      onImage(base64, file.type);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-purple-200 mb-2">{label}</label>
      {preview ? (
        <div className="relative rounded-xl overflow-hidden border border-purple-700/50">
          <img src={`data:image/jpeg;base64,${preview}`} alt="Uploaded cartoon" className="w-full max-h-64 object-contain bg-black/40" />
          <button
            onClick={onClear}
            className="absolute top-2 right-2 bg-black/60 text-white rounded-full px-3 py-1 text-xs hover:bg-red-900/70 transition-colors"
          >
            Remove
          </button>
        </div>
      ) : (
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
            dragging
              ? 'border-amber-400 bg-amber-900/10'
              : 'border-purple-700/50 bg-black/20 hover:border-purple-500/70 hover:bg-purple-900/10'
          }`}
        >
          <UploadIcon className="w-8 h-8 text-purple-400" />
          <p className="text-sm text-purple-300">Drop image here or <span className="text-amber-400 font-medium">click to browse</span></p>
          <p className="text-xs text-purple-500">PNG, JPG, WebP supported</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) processFile(file);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
