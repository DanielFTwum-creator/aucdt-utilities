import React, { useId } from 'react';
import { AlertCircle, Check } from 'lucide-react';
import { IMaskInput } from 'react-imask';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  mask?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  className, 
  id, 
  mask,
  onChange,
  value,
  helperText,
  ...props 
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const hasValue = value && String(value).length > 0;

  // Magazine Input Styles
  const baseClasses = `w-full px-0 py-4 bg-transparent border-b-2 transition-all outline-none font-body text-xl
    text-tuc-ink dark:text-white placeholder-transparent
    disabled:opacity-50 disabled:cursor-not-allowed
    ${error 
        ? 'border-red-500 focus:border-red-400' 
        : 'border-tuc-ink/20 dark:border-tuc-gold/30 hover:border-tuc-gold/60 focus:border-tuc-gold'
    } ${className}`;

  // Label Styles
  const labelClasses = `absolute left-0 transition-all duration-300 pointer-events-none font-label tracking-widest uppercase
    ${hasValue || props.placeholder 
       ? '-top-3 text-xs text-tuc-gold' 
       : 'top-4 text-tuc-ink/40 dark:text-tuc-gold/50 text-sm'
    }
    peer-placeholder-shown:text-sm peer-placeholder-shown:text-tuc-ink/40 dark:peer-placeholder-shown:text-tuc-gold/50 peer-placeholder-shown:top-4
    peer-focus:-top-3 peer-focus:text-xs peer-focus:text-tuc-gold`;

  return (
    <div className="w-full relative mb-8 group">
      <div className="relative">
        {mask ? (
          <IMaskInput
            mask={mask}
            id={inputId}
            value={value as string}
            unmask={false} // We want to keep the mask in the visual value for consistency
            onAccept={(value, mask) => {
              if (onChange) {
                const event = {
                  target: { value, name: props.name },
                } as React.ChangeEvent<HTMLInputElement>;
                onChange(event);
              }
            }}
            className={`${baseClasses} peer`}
            placeholder=" "
            {...(props as any)}
          />
        ) : (
          <input
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            className={`${baseClasses} peer`}
            value={value}
            onChange={onChange}
            placeholder=" " 
            {...props}
          />
        )}
        
        {/* Floating Label */}
        <label htmlFor={inputId} className={labelClasses}>
          {label}
        </label>

        {/* Validation Icon */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
            {error ? (
                <AlertCircle className="text-red-500 animate-pulse" size={18} />
            ) : hasValue && !error ? (
                <Check className="text-tuc-gold opacity-50" size={18} />
            ) : null}
        </div>
      </div>
      
      {/* Helper / Error Text */}
      <div className="flex justify-between mt-2">
        {error ? (
          <p id={`${inputId}-error`} role="alert" className="text-xs font-label tracking-widest text-red-500 flex items-center animate-fade-in uppercase">
             {error}
          </p>
        ) : helperText ? (
          <p className="text-xs text-tuc-ink/40 dark:text-tuc-cream/40 font-body italic">{helperText}</p>
        ) : null}
      </div>
    </div>
  );
};
