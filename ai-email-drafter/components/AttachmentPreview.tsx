
import React from 'react';
import { Attachment } from '../types';
import { XCircleIcon } from './icons';

interface AttachmentPreviewProps {
  attachment: Attachment;
  onRemove: (id: string) => void;
}

export const AttachmentPreview: React.FC<AttachmentPreviewProps> = ({ attachment, onRemove }) => {
  const fileSize = (attachment.size / 1024).toFixed(1); // in KB
  return (
    <div className="relative group bg-gray-100 dark:bg-gray-800 rounded-lg p-2 flex items-center gap-3 text-sm border border-gray-200 dark:border-gray-700">
      <img src={attachment.previewUrl} alt={attachment.name} className="w-10 h-10 object-cover rounded" />
      <div className="flex-grow overflow-hidden">
        <p className="font-medium text-gray-800 dark:text-gray-200 truncate">{attachment.name}</p>
        <p className="text-gray-500 dark:text-gray-400">{fileSize} KB</p>
      </div>
      <button
        onClick={() => onRemove(attachment.id)}
        className="absolute -top-2 -right-2 bg-gray-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
        aria-label={`Remove ${attachment.name}`}
      >
        <XCircleIcon className="w-5 h-5" />
      </button>
    </div>
  );
};
