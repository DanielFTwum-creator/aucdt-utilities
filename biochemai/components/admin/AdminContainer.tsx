import React from 'react';
import { PasswordSettings } from './PasswordSettings';
import { AuditLog } from './AuditLog';
import { QuizSettings } from './QuizSettings';

export const AdminContainer: React.FC = () => {
  return (
    <div className="w-full space-y-8">
      <div className="bg-[var(--color-bg-secondary)] p-6 sm:p-8 rounded-2xl shadow-lg border border-[var(--color-border-primary)]">
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)]">Admin Panel</h1>
        <p className="text-[var(--color-text-secondary)] mt-1">Manage application settings and view activity logs.</p>
      </div>
      <PasswordSettings />
      <QuizSettings />
      <AuditLog />
    </div>
  );
};