import type React from 'react';

export interface StatCardProps {
  number: string;
  label: string;
}

export interface Programme {
  name: string;
  duration: string;
}

export interface Feature {
  iconText: string;
  text: React.ReactNode;
}

export interface AuditLogEntry {
  email: string;
  timestamp: string;
  status: 'Success' | 'Failed';
}