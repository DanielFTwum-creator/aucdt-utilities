import React, { useState } from 'react';

interface ToggleProps {
  label: string;
  id: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  isOverridden?: boolean;
  disabled?: boolean;
}

const Toggle: React.FC<ToggleProps> = ({ label, id, enabled, onChange, isOverridden = false, disabled = false }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`flex items-center ${label ? 'justify-between' : 'justify-center'}`}>
      {label && <span className="text-sm font-medium" data-component="label">{label}</span>}
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={enabled}
        onClick={() => !disabled && onChange(!enabled)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        data-component="toggle-switch"
        data-state={enabled ? 'on' : 'off'}
        data-overridden={isOverridden}
        disabled={disabled}
        className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="sr-only">Use setting</span>
         <span
          data-component="toggle-thumb"
          className={`${isFocused ? 'ring-2 ring-offset-2' : ''}
            ${enabled ? 'translate-x-6' : 'translate-x-1'}
            inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out`}
        />
      </button>
    </div>
  );
};

export default Toggle;