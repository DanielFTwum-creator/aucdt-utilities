
import React, { useState, KeyboardEvent } from 'react';
import { XCircleIcon } from './icons';

interface RecipientInputProps {
  recipients: string[];
  setRecipients: (recipients: string[]) => void;
  placeholder: string;
}

const RecipientPill: React.FC<{ email: string, onRemove: () => void }> = ({ email, onRemove }) => {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    return (
        <div className={`flex items-center gap-1.5 text-sm rounded-full pl-3 pr-1.5 py-0.5 ${isValid ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
            <span>{email}</span>
            <button onClick={onRemove} className="rounded-full hover:bg-black/10 dark:hover:bg-white/10 p-0.5 focus:outline-none focus:ring-1 focus:ring-white">
                <XCircleIcon className="w-4 h-4" />
            </button>
        </div>
    );
};

export const RecipientInput: React.FC<RecipientInputProps> = ({ recipients, setRecipients, placeholder }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (['Enter', 'Tab', ','].includes(e.key) && inputValue.trim()) {
      e.preventDefault();
      const newRecipients = inputValue.trim().split(/[\s,]+/).filter(email => email && !recipients.includes(email));
      if (newRecipients.length > 0) {
        setRecipients([...recipients, ...newRecipients]);
      }
      setInputValue('');
    } else if (e.key === 'Backspace' && !inputValue && recipients.length > 0) {
      setRecipients(recipients.slice(0, -1));
    }
  };
  
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const newRecipients = pastedText.split(/[\s,;]+/).filter(email => email && !recipients.includes(email));
    if(newRecipients.length > 0) {
        setRecipients([...recipients, ...newRecipients]);
    }
    setInputValue('');
  };

  const removeRecipient = (indexToRemove: number) => {
    setRecipients(recipients.filter((_, index) => index !== indexToRemove));
  };
  
  const handleBlur = () => {
      if (inputValue.trim()) {
          const newRecipients = inputValue.trim().split(/[\s,]+/).filter(email => email && !recipients.includes(email));
          if (newRecipients.length > 0) {
              setRecipients([...recipients, ...newRecipients]);
          }
          setInputValue('');
      }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-2 border-b border-gray-300 dark:border-gray-700">
      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">{placeholder}</label>
      <div className="flex flex-wrap gap-2 flex-grow">
        {recipients.map((email, index) => (
          <RecipientPill key={index} email={email} onRemove={() => removeRecipient(index)} />
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onBlur={handleBlur}
          className="flex-grow bg-transparent focus:outline-none min-w-[120px] text-gray-900 dark:text-gray-100"
        />
      </div>
    </div>
  );
};
