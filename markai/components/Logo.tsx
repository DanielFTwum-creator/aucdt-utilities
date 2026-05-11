
import React from 'react';

const Logo: React.FC<{ size?: 'sm' | 'lg' }> = ({ size = 'sm' }) => {
  const isLarge = size === 'lg';
  return (
    <div className="animate-subtle-glow">
      <div className={`text-center ${isLarge ? 'text-5xl' : 'text-2xl'} font-extrabold tracking-tight leading-none`}>
        <span className="text-primary">Mark</span>
        <span className="text-accent-secondary">AI</span>
      </div>
      <p className={`text-center font-medium text-accent-tertiary tracking-wide ${isLarge ? 'text-base mt-1' : 'text-[10px]'}`}>
        marketing for non-marketers
      </p>
    </div>
  );
};

export default Logo;