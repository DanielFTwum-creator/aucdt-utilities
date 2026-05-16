import React from 'react';
import { Eye, EyeOff, LucideIcon } from 'lucide-react';

interface FormInputProps {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'number';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
  icon?: LucideIcon;
  required?: boolean;
  optional?: boolean;
  helpText?: string;
  isPassword?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  minLength?: number;
  maxLength?: number;
}

export const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  error,
  icon: Icon,
  required = false,
  optional = false,
  helpText,
  isPassword = false,
  showPassword = false,
  onTogglePassword,
  minLength,
  maxLength,
}) => {
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className="space-y-2">
      {/* R2 + R6: Refined label — sentence case, muted terracotta-gray, DM Sans weight */}
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="block font-medium" style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.04em', color: '#6B6560' }}>
          {label}
          {required && <span className="text-red-500 ml-1">·</span>}
        </label>
        {optional && <span className="text-xs text-slate-400">Optional</span>}
      </div>

      {/* R5: Micro-interactions on focus */}
      <div className="relative group">
        {Icon && (
          <Icon className="absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none transition-all duration-200 group-focus-within:text-orange-600 group-focus-within:scale-110" />
        )}
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          minLength={minLength}
          maxLength={maxLength}
          className={`w-full border rounded-2xl px-4 py-3.5 text-sm font-medium outline-none bg-white ${
            Icon ? 'pl-12' : ''
          } ${
            isPassword && onTogglePassword ? 'pr-12' : ''
          } ${
            error
              ? 'border-red-300 focus:border-red-500 hover:border-red-300'
              : 'border-slate-200 focus:border-orange-600 hover:border-slate-300'
          } shadow-sm disabled:opacity-50 disabled:cursor-not-allowed`}
          style={{
            transition: 'box-shadow 0.15s ease, border-color 0.15s ease',
            boxShadow: error ? undefined : 'none'
          }}
          onFocus={(e) => {
            if (!error) {
              e.currentTarget.style.boxShadow = '0 0 0 2px rgba(224, 79, 26, 0.35)';
            }
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = 'none';
          }}
          required={required}
        />
        {isPassword && onTogglePassword && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-400 hover:text-orange-600 transition-colors disabled:opacity-50 p-1 rounded hover:bg-orange-50"
            disabled={disabled}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* R2: Refined error and help text contrast */}
      {error && <p className="text-red-600 text-xs font-medium leading-relaxed">{error}</p>}
      {helpText && !error && <p className="text-slate-500 text-xs leading-relaxed">{helpText}</p>}
    </div>
  );
};
