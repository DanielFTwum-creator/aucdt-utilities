
import React from 'react';
import { ModuleStatus, WorkshopModule } from './types.ts';

export const WORKSHOP_MODULES: WorkshopModule[] = [
  {
    id: 'r1',
    title: 'R1: Review',
    subtitle: 'Audit & Analysis',
    description: 'Learn to conduct comprehensive UX/UI audits using professional heuristics and usability frameworks.',
    duration: '~4 hours',
    status: ModuleStatus.COMPLETED,
    progress: 100,
    color: 'blue',
    lessons: [
      { id: 'l1', title: 'Introduction to UX Audits', duration: '15m', content: 'UX Audits are the foundation...' },
      { id: 'l2', title: 'Heuristic Evaluation 101', duration: '30m', content: 'Nielsen\'s 10 principles...' }
    ],
    quizzes: [
      {
        id: 1,
        text: "What is the primary goal of a UX/UI audit?",
        options: [
          "To redesign the entire interface",
          "To identify usability issues and improvement opportunities",
          "To increase development costs",
          "To replace the development team"
        ],
        correct: 1
      }
    ]
  },
  {
    id: 'r2',
    title: 'R2: Reimagine',
    subtitle: 'Design Thinking',
    description: 'Apply high-level design thinking to challenge existing paradigms and create innovative user experiences.',
    duration: '~5 hours',
    status: ModuleStatus.IN_PROGRESS,
    progress: 65,
    color: 'purple',
    lessons: [],
    quizzes: []
  },
  {
    id: 'r3',
    title: 'R3: Restructure',
    subtitle: 'Information Architecture',
    description: 'Master the art of structuring information for optimal user flow and cognitive ease.',
    duration: '~4 hours',
    status: ModuleStatus.LOCKED,
    progress: 0,
    color: 'indigo',
    lessons: [],
    quizzes: []
  },
  {
    id: 'r4',
    title: 'R4: Refine',
    subtitle: 'Visual Design',
    description: 'Polish your interfaces until they meet pixel-perfect industry standards for clarity and aesthetics.',
    duration: '~6 hours',
    status: ModuleStatus.LOCKED,
    progress: 0,
    color: 'emerald',
    lessons: [],
    quizzes: []
  },
  {
    id: 'r5',
    title: 'R5: Recolor',
    subtitle: 'Colour & Typography',
    description: 'Dive deep into color theory, accessibility, and the psychology of typography for digital products.',
    duration: '~4 hours',
    status: ModuleStatus.LOCKED,
    progress: 0,
    color: 'rose',
    lessons: [],
    quizzes: []
  },
  {
    id: 'r6',
    title: 'R6: Render',
    subtitle: 'Implementation',
    description: 'Bridges the gap between design and development by mastering handoff and implementation details.',
    duration: '~7 hours',
    status: ModuleStatus.LOCKED,
    progress: 0,
    color: 'amber',
    lessons: [],
    quizzes: []
  }
];

export const ICONS = {
  Review: (className: string) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Trophy: (className: string) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  Clock: (className: string) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Target: (className: string) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  ChevronLeft: (className: string) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  ),
  ChevronRight: (className: string) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
  Bot: (className: string) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  Sun: (className: string) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 100 10 5 5 0 000-10z" />
    </svg>
  ),
  Moon: (className: string) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  ),
  Accessibility: (className: string) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  )
};
