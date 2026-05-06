import React from 'react';
import type { Module } from './types';

const IconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="w-6 h-6">{children}</div>
);

export const MODULES: Module[] = [
  {
    id: 'tracks',
    title: 'Track Library',
    description: 'Manage your catalogue of tracks, sources, and rights statuses.',
    icon: <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" /></svg></IconWrapper>,
    color: 'text-[var(--color-primary)]',
  },
  {
    id: 'releases',
    title: 'Release Manager',
    description: 'Bundle tracks into releases and prepare them for distribution.',
    icon: <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" /></svg></IconWrapper>,
    color: 'text-[var(--color-primary)]',
  },
  {
    id: 'rights-audit',
    title: 'Rights Audit',
    description: 'Review and verify rights status, NON_COMMERCIAL gate enforcement.',
    icon: <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" /></svg></IconWrapper>,
    color: 'text-[var(--color-primary)]',
  },
  {
    id: 'stage-pipeline',
    title: 'Stage Pipeline',
    description: 'Track progression through S1→S5 production stages.',
    icon: <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" /></svg></IconWrapper>,
    color: 'text-[var(--color-primary)]',
  },
  {
    id: 'authorship-registry',
    title: 'Authorship Registry',
    description: 'Document human authorship elements required for S4 gate clearance.',
    icon: <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg></IconWrapper>,
    color: 'text-[var(--color-primary)]',
  },
  {
    id: 'distribution',
    title: 'Distribution',
    description: 'Submit cleared releases to DSPs. Only COMMERCIAL tracks can proceed.',
    icon: <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" /></svg></IconWrapper>,
    color: 'text-[var(--color-primary)]',
  },
];

export const STAGES = [
  { id: 'S1', label: 'Ingestion', description: 'Raw upload and metadata capture' },
  { id: 'S2', label: 'Rights Check', description: 'Platform tier and rights status resolution' },
  { id: 'S3', label: 'Editorial', description: 'Editorial review and quality gate' },
  { id: 'S4', label: 'Authorship', description: 'Human authorship element verification (≥2 required)' },
  { id: 'S5', label: 'Distribution Ready', description: 'Cleared for DSP submission' },
] as const;

export const RIGHTS_STATUS_COLORS: Record<string, string> = {
  COMMERCIAL: 'text-green-400 bg-green-400/10 border-green-400/20',
  NON_COMMERCIAL: 'text-red-400 bg-red-400/10 border-red-400/20',
  PENDING: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  DISPUTED: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
};
