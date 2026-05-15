import React, { ReactNode } from 'react';

interface GlassmorphismCardProps {
  children: ReactNode;
  className?: string;
}

/**
 * GlassmorphismCard Component
 *
 * A reusable wrapper component that applies glassmorphic styling to content.
 * Uses semi-transparent background, backdrop blur, and theme-aware border colors.
 * Adapts to all theme variants via CSS variables.
 *
 * @param children - Content to wrap inside the card
 * @param className - Additional CSS classes to apply
 */
export const GlassmorphismCard: React.FC<GlassmorphismCardProps> = ({
  children,
  className = '',
}) => {
  return (
    <div
      className={`relative bg-opacity-5 border border-opacity-20 backdrop-blur-lg rounded-2xl p-8 ${className}`}
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderColor: `rgba(var(--color-accent-primary-rgb, 167 139 250), 0.2)`,
        backdropFilter: 'blur(12px)',
        borderRadius: '16px',
        padding: '2rem',
      }}
    >
      {children}
    </div>
  );
};
