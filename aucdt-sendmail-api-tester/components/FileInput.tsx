import React, { ChangeEvent, useRef } from 'react';

interface FileInputProps {
  label: string;
  id: string;
  selectedFile: File | null;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onClearFile: () => void;
  className?: string;
}

const FileInput: React.FC<FileInputProps> = ({ label, id, selectedFile, onFileChange, onClearFile, className }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    onClearFile();
  }

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="flex items-center justify-between w-full px-3 py-2 text-[#2C1810] bg-white border border-[#F0DBC6] rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-[#8B1538] focus-within:border-transparent transition">
        <span className="truncate text-gray-500">
          {selectedFile ? selectedFile.name : 'No file selected'}
        </span>
        <div className="flex items-center flex-shrink-0">
          {selectedFile && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B1538] rounded-full mr-2"
              aria-label="Clear selected file"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <input
            type="file"
            id={id}
            ref={inputRef}
            onChange={onFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={handleButtonClick}
            className="px-3 py-1 text-xs bg-[#8B1538]/20 text-[#8B1538] font-semibold rounded-md hover:bg-[#8B1538]/30 transition-colors duration-200"
          >
            Browse
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileInput;
