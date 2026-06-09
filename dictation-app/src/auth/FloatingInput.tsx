import React, { useState, useEffect } from 'react';

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  type?: string;
  icon?: React.ReactNode;
  isError?: boolean;
  children?: React.ReactNode;
}

export function FloatingInput({
  id,
  label,
  type = 'text',
  icon,
  isError = false,
  children,
  className = '',
  ...props
}: FloatingInputProps) {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!props.value);

  // Keep hasValue in sync if value changes programmatically (e.g., reset)
  useEffect(() => {
    setHasValue(!!props.value);
  }, [props.value]);

  const lifted = focused || hasValue || !!props.placeholder;

  return (
    <div className={`float-input ${lifted ? 'lifted' : ''} ${focused ? 'focused' : ''} ${isError ? 'error-shake' : ''} ${className}`}>
      {icon && <span className="float-icon" aria-hidden="true">{icon}</span>}
      <input
        id={id}
        type={type}
        onFocus={(e) => {
          setFocused(true);
          if (props.onFocus) props.onFocus(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          setHasValue(!!e.target.value);
          if (props.onBlur) props.onBlur(e);
        }}
        onChange={(e) => {
          setHasValue(!!e.target.value);
          if (props.onChange) props.onChange(e);
        }}
        className={children ? 'pr-12' : ''}
        {...props}
      />
      <label htmlFor={id}>{label}</label>
      {children}
    </div>
  );
}
