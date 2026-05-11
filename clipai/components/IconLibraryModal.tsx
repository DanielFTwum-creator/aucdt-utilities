import React, { useState } from 'react';
import { XIcon } from '../constants';
import { IconData } from '../types';

interface IconLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (path: string) => void;
  iconLibrary: IconData[];
}

const IconLibraryModal: React.FC<IconLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  iconLibrary,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredIcons = iconLibrary.filter((icon) =>
    icon.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="icon-library-title"
    >
      <div
        className="hc-bg hc-border bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-4xl h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 id="icon-library-title" className="text-lg font-semibold text-gray-900 dark:text-white hc-text">
            Select an Icon Shape
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Close library"
            aria-label="Close icon library"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <input
            type="search"
            placeholder="Search icons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="hc-bg hc-border hc-text hc-placeholder w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            title="Search for an icon by name"
            aria-label="Search icons"
          />
        </div>

        <div className="p-4 overflow-y-auto">
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
            {filteredIcons.map((icon) => (
              <button
                key={icon.name}
                onClick={() => onSelect(icon.path)}
                title={`Select ${icon.name} icon`}
                className="aspect-square flex items-center justify-center p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/50 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                aria-label={`Select ${icon.name} icon`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-full h-full"
                  aria-hidden="true"
                >
                  <path d={icon.path} />
                </svg>
              </button>
            ))}
          </div>
          
          {filteredIcons.length === 0 && (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
              <p>No icons found for "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default IconLibraryModal;