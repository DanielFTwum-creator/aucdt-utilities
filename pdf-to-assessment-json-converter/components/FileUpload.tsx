
import React, { useCallback, useState } from 'react';
import { UploadIcon, DocumentIcon, XMarkIcon } from './IconComponents';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  file: File | null;
  disabled: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, file, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      if (files[0].type === 'application/pdf') {
        onFileSelect(files[0]);
      }
    }
  }, [onFileSelect, disabled]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };
  
  const handleRemoveFile = () => {
    onFileSelect(null as any); // A bit hacky but works for resetting
  }

  const baseClasses = "flex-grow flex justify-center items-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors duration-200";
  const draggingClasses = "border-sky-500 bg-sky-900/20";
  const defaultClasses = "border-slate-600 hover:border-sky-500";

  if (file) {
    return (
        <div className="flex-grow flex items-center justify-between p-4 bg-slate-700/50 border border-slate-600 rounded-md">
            <div className="flex items-center space-x-3 overflow-hidden">
                <DocumentIcon className="h-8 w-8 text-sky-400 flex-shrink-0" />
                <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-medium text-slate-200 truncate">{file.name}</span>
                    <span className="text-xs text-slate-400">{Math.round(file.size / 1024)} KB</span>
                </div>
            </div>
            {!disabled && (
                 <button onClick={handleRemoveFile} className="p-1 text-slate-400 hover:text-white rounded-full hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500">
                    <XMarkIcon className="h-5 w-5" />
                </button>
            )}
        </div>
    )
  }

  return (
    <div
      className={`${baseClasses} ${isDragging ? draggingClasses : defaultClasses}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="space-y-1 text-center">
        <UploadIcon className="mx-auto h-12 w-12 text-slate-500" />
        <div className="flex text-sm text-slate-400">
          <label
            htmlFor="file-upload"
            className={`relative cursor-pointer bg-slate-900 rounded-md font-medium text-sky-400 hover:text-sky-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-slate-800/50 focus-within:ring-sky-500 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span>Upload a file</span>
            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".pdf" onChange={handleFileChange} disabled={disabled} />
          </label>
          <p className="pl-1">or drag and drop</p>
        </div>
        <p className="text-xs text-slate-500">PDF up to 10MB</p>
      </div>
    </div>
  );
};

export default FileUpload;
