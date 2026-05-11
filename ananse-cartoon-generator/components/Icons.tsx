
import React from 'react';

interface IconProps {
  className?: string;
}

export const SparklesIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 019.75 22.5a.75.75 0 01-.75-.75c0-5.056 2.383-9.555 6.084-12.436A6.75 6.75 0 019.315 7.584zM15 3a.75.75 0 01.75.75c0 2.682-1.06 5.235-2.936 7.11-1.877 1.875-4.428 2.935-7.11 2.935a.75.75 0 01-.75-.75c0-2.682 1.06-5.235 2.936-7.11C9.765 4.06 12.318 3 15 3z"
      clipRule="evenodd"
    />
  </svg>
);

export const AnanseIcon: React.FC<IconProps> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className={className}
    >
        <path d="M12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5M12,2A7,7 0 0,1 19,9C19,14.25 12,22 12,22C12,22 5,14.25 5,9A7,7 0 0,1 12,2M12,4A5,5 0 0,0 7,9C7,10,7,12 12,18.71C17,12 17,10 17,9A5,5 0 0,0 12,4Z" />
        <path d="M4.22,14.5A2.5,2.5 0 0,1 6.72,17A2.5,2.5 0 0,1 4.22,19.5A2.5,2.5 0 0,1 1.72,17A2.5,2.5 0 0,1 4.22,14.5M19.78,14.5A2.5,2.5 0 0,1 22.28,17A2.5,2.5 0 0,1 19.78,19.5A2.5,2.5 0 0,1 17.28,17A2.5,2.5 0 0,1 19.78,14.5M12,14A3,3 0 0,1 15,17A3,3 0 0,1 12,20A3,3 0 0,1 9,17A3,3 0 0,1 12,14Z" transform="translate(0, -6)" />
        <path d="M3.79,10.29L1.41,8.91L2.12,7.5L4.5,8.88L3.79,10.29M20.21,10.29L19.5,8.88L21.88,7.5L22.59,8.91L20.21,10.29M6.93,13.62L4.88,12.5L5.59,11.09L7.64,12.21L6.93,13.62M17.07,13.62L16.36,12.21L18.41,11.09L19.12,12.5L17.07,13.62M9.83,16.5L8.21,15.5L8.92,14.09L10.54,15.12L9.83,16.5M14.17,16.5L13.46,15.12L15.08,14.09L15.79,15.5L14.17,16.5M12,19V22" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
);

export const DownloadIcon: React.FC<IconProps> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={className}
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
);

export const HistoryIcon: React.FC<IconProps> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={className}
        viewBox="0 0 24 24"
        fill="currentColor"
    >
        <path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6a7 7 0 0 1 7-7 7 7 0 0 1 7 7 7 7 0 0 1-7 7v2a9 9 0 0 0 9-9 9 9 0 0 0-9-9z"></path>
        <path d="M12 8v5l4.25 2.52.75-1.23-3.5-2.07V8z"></path>
    </svg>
);

export const NextSceneIcon: React.FC<IconProps> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        viewBox="0 0 24 24"
        fill="currentColor"
    >
        <path d="M5.536 21.886a1.004 1.004 0 0 0 1.033-.064l13-9a1 1 0 0 0 0-1.644l-13-9A1 1 0 0 0 5 3v18a1 1 0 0 0 .536.886zM7 5.331l9.122 6.385L7 18.099V5.331z" />
        <path d="M18 3v18a1 1 0 0 0 2 0V3a1 1 0 0 0-2 0z" />
  </svg>
);

export const CopyIcon: React.FC<IconProps> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
);

export const FilmIcon: React.FC<IconProps> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={className} 
        viewBox="0 0 24 24" 
        fill="currentColor"
    >
        <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4zM6 18H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V8h2v2zm14 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V8h2v2z"/>
    </svg>
);

export const DownloadAllIcon: React.FC<IconProps> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className={className}
    >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
        <line x1="10" y1="3" x2="10" y2="6"></line>
        <line x1="14" y1="3" x2="14" y2="6"></line>
        <line x1="10" y1="9" x2="10" y2="12"></line>
        <line x1="14" y1="9" x2="14" y2="12"></line>
    </svg>
);
