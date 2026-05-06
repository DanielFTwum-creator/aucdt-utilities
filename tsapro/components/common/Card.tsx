
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  // FIX: Allow 'aside' as a valid tag for the Card component. This is used in DashboardPage for the payslip display.
  as?: 'div' | 'section' | 'aside';
  ariaLabelledby?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', as = 'div', ariaLabelledby }) => {
  const Component = as;
  return (
    <Component
      aria-labelledby={ariaLabelledby}
      data-component="card"
      className={`rounded-lg shadow-md p-6 ${className}`}
    >
      {children}
    </Component>
  );
};

export default Card;
