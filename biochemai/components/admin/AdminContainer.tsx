import React from 'react';
import { PasswordSettings } from './PasswordSettings';
import { AuditLog } from './AuditLog';
import { QuizSettings } from './QuizSettings';
import { SVGNetworkBackground } from '../SVGNetworkBackground';
import { GlassmorphismCard } from '../GlassmorphismCard';

export const AdminContainer: React.FC = () => {
  return (
    <div className="relative w-full space-y-8">
      <SVGNetworkBackground accentColor="--color-accent-primary" opacity={0.07} />

      <GlassmorphismCard>
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)]">Admin Panel</h1>
        <p className="text-[var(--color-text-secondary)] mt-1">Manage application settings and view activity logs.</p>
      </GlassmorphismCard>
      <PasswordSettings />
      <QuizSettings />
      <AuditLog />
    </div>
  );
};