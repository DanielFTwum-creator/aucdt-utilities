import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  className?: string;
}

const Input: React.FC<InputProps> = ({ label, id, className, ...props }) => {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {props.required && <span className="text-[#8B1538] ml-1">*</span>}
      </label>
      <input
        id={id}
        {...props}
        aria-required={props.required}
        className="w-full px-3 py-2 text-[#2C1810] bg-white border border-[#F0DBC6] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8B1538] focus:border-transparent transition"
      />
    </div>
  );
};

export default Input;