import { Module, Quest, BadgeLevel } from './types';

// UI Colour Palette (from SRS)
export const COLORS = {
  primary: '#2563EB', // blue
  success: '#10B981', // green
  warning: '#F59E0B', // amber
  error: '#EF4444', // red
  backgroundLight: '#FFFFFF',
  backgroundDark: '#0F172A',
  textLight: '#333333',
  textDark: '#EEEEEE',
  mutedTextLight: '#666666',
  mutedTextDark: '#BBBBBB',
  borderLight: '#E0E0E0',
  borderDark: '#444444',
};

// Application Routes
export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  ONBOARDING: '/onboarding',
  DASHBOARD: '/dashboard',
  MODULES: '/modules',
  LESSON: '/modules/:moduleId/lesson/:lessonId',
  QUEST: '/modules/:moduleId/quest/:questId',
  PORTFOLIO: '/portfolio',
  SHOWCASE: '/showcase',
  PROFILE: '/profile',
  NOT_FOUND: '/404',
};

// 6R Module Definitions (from SRS)
export const MODULES_DATA: Module[] = [
  {
    id: 'R1',
    name: 'Review',
    theme: 'Design Auditing & Critical Analysis',
    description: 'Learn to conduct comprehensive UX/UI audits identifying usability, accessibility, and visual hierarchy issues.',
    lessons: [
      { id: 'L1', title: 'Introduction to 6R Methodology', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?si=0i1I0U_M6z4y6V9A', duration: '3:00', transcription: 'This lesson introduces the 6R methodology...' },
      { id: 'L2', title: 'Design Audit Frameworks', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?si=0i1I0U_M6z4y6V9A', duration: '4:32', transcription: 'Understanding Nielsen\'s heuristics and WCAG guidelines.' },
      { id: 'L3', title: 'Visual Hierarchy Analysis', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?si=0i1I0U_M6z4y6V9A', duration: '5:15', transcription: 'Explore F-pattern, Z-pattern, and Gestalt principles.' },
      { id: 'L4', title: 'Accessibility Testing Tools', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?si=0i1I0U_M6z4y6V9A', duration: '4:00', transcription: 'Using WAVE, axe DevTools, and Lighthouse.' },
    ],
    quizzes: [
      { id: 'Q1', title: 'Audit Fundamentals', passScore: 80, questions: [] },
    ],
    quests: [
      { id: 'QA1', title: 'Design Audit Quest', type: 'design-audit', description: 'Conduct a design audit of an existing website/app and identify key issues. AI feedback will be provided.' },
    ],
    resources: [
      { name: 'Wireframe Grids (PDF)', url: '/path/to/R1_WireframeGrids.pdf' },
      { name: 'Audit Checklist (PDF)', url: '/path/to/R1_AuditChecklist.pdf' },
    ],
    timeEstimate: '~4 hours remaining',
  },
  {
    id: 'R2',
    name: 'Reimagine',
    theme: 'Design Thinking & User-Centered Strategy',
    description: 'Apply design thinking principles to reimagine user experiences based on research and best practices.',
    locked: true, // Initially locked
    lessons: [
      { id: 'L1', title: 'User Persona Development', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?si=0i1I0U_M6z4y6V9A', duration: '3:00', transcription: 'Creating effective user personas.' },
      { id: 'L2', title: 'Jobs-to-be-Done Framework', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?si=0i1I0U_M6z4y6V9A', duration: '4:32', transcription: 'Understanding user needs with JTBD.' },
    ],
    quizzes: [{ id: 'Q1', title: 'Strategy Basics', passScore: 80, questions: [] }],
    quests: [{ id: 'QR2', title: 'Strategy Document Quest', type: 'text-submission', description: 'Develop a design strategy document based on personas and research.' }],
    resources: [{ name: 'User Persona Template (PDF)', url: '/path/to/R2_PersonaTemplate.pdf' }],
    timeEstimate: '~5 hours remaining',
  },
  {
    id: 'R3',
    name: 'Restructure',
    theme: 'Information Architecture & Interaction Patterns',
    description: 'Structure information architecture using industry-standard patterns and progressive disclosure.',
    locked: true,
    lessons: [
      { id: 'L1', title: 'Layout Systems (Grid Theory)', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?si=0i1I0U_M6z4y6V9A', duration: '3:00', transcription: 'Understanding grid theory and whitespace.' },
      { id: 'L2', title: 'Navigation Patterns', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?si=0i1I0U_M6z4y6V9A', duration: '4:32', transcription: 'Tabs, breadcrumbs, and sidebar design.' },
      {
        id: 'L3',
        title: 'Interactive Code Example',
        videoUrl: null,
        duration: 'N/A',
        transcription: 'Example of CSS Grid layout.',
        codeExample: {
          language: 'css',
          code: `.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.grid-item {
  background-color: #efefef;
  padding: 20px;
  border-radius: 8px;
}`,
          sandboxUrl: 'https://codesandbox.io/embed/new', // Placeholder CodeSandbox URL
        },
      },
    ],
    quizzes: [{ id: 'Q1', title: 'IA Fundamentals', passScore: 80, questions: [] }],
    quests: [{ id: 'QW1', title: 'Wireframing Challenge', type: 'wireframing', description: 'Design low-fidelity wireframes for a mobile app (3 key screens). Upload sketches or use the canvas below. AI feedback on information hierarchy clarity, component labeling, and navigation logic will be provided.' }],
    resources: [{ name: 'Wireframing Template (Figma)', url: '/path/to/R3_WireframingTemplate.fig' }],
    timeEstimate: '~6 hours remaining',
  },
  {
    id: 'R4',
    name: 'Refine',
    theme: 'Design Systems & Component Libraries',
    description: 'Build systematic design systems with tokens, scales, and reusable components.',
    locked: true,
    lessons: [
      { id: 'L1', title: 'Design Tokens', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?si=0i1I0U_M6z4y6V9A', duration: '3:00', transcription: 'Understanding color, spacing, and typography tokens.' },
      { id: 'L2', title: 'Component Anatomy', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?si=0i1I0U_M6z4y6V9A', duration: '4:32', transcription: 'Modular scales and component states.' },
    ],
    quizzes: [{ id: 'Q1', title: 'Design System Principles', passScore: 80, questions: [] }],
    quests: [{ id: 'QDS1', title: 'Design System Quest', type: 'design-system', description: 'Define design tokens and generate a visual preview.' }],
    resources: [{ name: 'Design System Starter (Figma)', url: '/path/to/R4_DSStarter.fig' }],
    timeEstimate: '~7 hours remaining',
  },
  {
    id: 'R5',
    name: 'Recolor',
    theme: 'Visual Design & Brand Expression',
    description: 'Apply color theory, typography, and visual design principles to create cohesive interfaces.',
    locked: true,
    lessons: [
      { id: 'L1', title: 'Colour Theory & Accessibility', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?si=0i1I0U_M6z4y6V9A', duration: '3:00', transcription: 'Psychology, contrast, and accessibility in color.' },
      { id: 'L2', title: 'Elevation & Motion', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?si=0i1I0U_M6z4y6V9A', duration: '4:32', transcription: 'Elevation, shadow systems, and micro-interactions.' },
    ],
    quizzes: [{ id: 'Q1', title: 'Visual Design Quiz', passScore: 80, questions: [] }],
    quests: [{ id: 'QVD1', title: 'High-Fidelity Mockup Quest', type: 'image-submission', description: 'Apply high-fidelity visual design to wireframes.' }],
    resources: [{ name: 'Mood Board Template (PDF)', url: '/path/to/R5_MoodBoard.pdf' }],
    timeEstimate: '~6 hours remaining',
  },
  {
    id: 'R6',
    name: 'Render',
    theme: 'Implementation & Handoff',
    description: 'Implement responsive, accessible interfaces using modern front-end technologies.',
    locked: true,
    lessons: [
      { id: 'L1', title: 'Design-to-Code Workflow', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?si=0i1I0U_M6z4y6V9A', duration: '3:00', transcription: 'Figma to React with Tailwind.' },
      { id: 'L2', title: 'Responsive Strategies', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?si=0i1I0U_M6z4y6V9A', duration: '4:32', transcription: 'Implementing responsive breakpoints.' },
      { id: 'L3', title: 'Performance Optimization', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?si=0i1I0U_M6z4y6V9A', duration: '5:00', transcription: 'Optimizing for fast load times and smooth animations.' },
      { id: 'L4', title: 'Accessibility Audit on Code', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?si=0i1I0U_M6z4y6V9A', duration: '4:00', transcription: 'Running automated and manual accessibility tests.' },
    ],
    quizzes: [{ id: 'Q1', title: 'Implementation Best Practices', passScore: 80, questions: [] }],
    quests: [{ id: 'QCI1', title: 'Code Implementation Quest', type: 'code-submission', description: 'Implement 3 key screens using React + Tailwind CSS.' }],
    resources: [{ name: 'React Component Boilerplates', url: '/path/to/R6_Boilerplates.zip' }],
    timeEstimate: '~8 hours remaining',
  },
];

// Badge Thresholds (from SRS)
export const BADGE_THRESHOLDS: { [key in BadgeLevel]: number } = {
  bronze: 60,
  silver: 75,
  gold: 90,
  // Fix: Add 'none' property as required by BadgeLevel type
  none: 0,
};

export const AVATAR_PLACEHOLDER_URL = 'https://picsum.photos/100/100';

export const USER_ROLES = ['learner', 'educator', 'admin'];

export const ONBOARDING_QUESTIONS = [
  // Fix: Renamed 'role' to 'onboardingUserRole' to avoid conflict with User.role
  {
    id: 'onboardingUserRole',
    question: 'What is your current role?',
    options: ['Student', 'Professional', 'Educator', 'Other'],
  },
  {
    id: 'experienceLevel',
    question: 'What is your design experience level?',
    options: ['Beginner', 'Intermediate', 'Advanced'],
  },
  {
    id: 'primaryGoal',
    question: 'What is your primary goal for this course?',
    options: ['Build Portfolio', 'Career Advancement', 'Education', 'Curiosity'],
  },
  {
    id: 'availableHours',
    question: 'Approximately how many hours can you commit per week?',
    options: ['1-5', '6-10', '11+'],
  },
  {
    id: 'learningStyle',
    question: 'What is your preferred learning style?',
    options: ['Video', 'Text', 'Interactive Exercises'],
  },
];

export const AI_MOCK_FEEDBACK = {
  completeness: {
    good: "Excellent! You've thoroughly covered all the key heuristics, demonstrating a strong understanding.",
    average: "Good effort. Most heuristics were addressed, but consider revisiting a few for more depth.",
    poor: "Some heuristics were missed. It's important to cover all aspects for a comprehensive audit.",
  },
  quality: {
    good: "Your observations are highly specific and insightful, clearly articulating the impact of each issue. Well done!",
    average: "Observations are generally good, but some could benefit from more specificity and detailed examples.",
    poor: "Observations are too vague. Try to provide concrete examples and explain the 'why' behind each observation.",
  },
  prioritization: {
    good: "Your prioritization logic is sound and well-justified, focusing on high-impact areas.",
    average: "Prioritization is mostly logical, but consider providing stronger justifications for critical issues.",
    poor: "Prioritization seems arbitrary. Re-evaluate based on impact and effort for a more effective plan.",
  },
  nextSteps: [
    "Review Module R2 content on user personas to refine your understanding of user needs.",
    "Practice identifying specific examples for each heuristic on a different website.",
    "Consider how these audit findings would translate into actionable design changes for your next quest.",
    "Re-read the relevant sections of Nielsen's heuristics for a deeper dive.",
  ],
  encouragingPhrases: [
    "Keep up the great work!",
    "You're making excellent progress!",
    "This is a solid start, with lots of potential.",
    "Your dedication to learning is really showing!",
  ],
};

export const QUIZ_QUESTIONS_MOCK_R1 = [
  {
    id: 'q1',
    question: 'Which of the following is NOT one of Nielsen\'s 10 Usability Heuristics?',
    type: 'single-choice',
    options: [
      { text: 'Visibility of system status', isCorrect: false },
      { text: 'Aesthetic and minimalist design', isCorrect: false },
      { text: 'User control and freedom', isCorrect: false },
      { text: 'Maximum feature set', isCorrect: true },
    ],
    explanation: 'Maximum feature set is not a heuristic. Nielsen emphasizes minimalist design to avoid cognitive overload.',
  },
  {
    id: 'q2',
    question: 'What is the primary goal of a design audit?',
    type: 'single-choice',
    options: [
      { text: 'To redesign the entire product', isCorrect: false },
      { text: 'To identify usability issues and suggest improvements', isCorrect: true },
      { text: 'To evaluate the visual aesthetics only', isCorrect: false },
      { text: 'To compare with competitors', isCorrect: false },
    ],
    explanation: 'A design audit primarily aims to identify usability issues and provide actionable recommendations for improvement.',
  },
  {
    id: 'q3',
    question: 'Which of these would you consider when assessing "Consistency and standards"? (Select all that apply)',
    type: 'multi-choice',
    options: [
      { text: 'Using consistent icons for similar actions', isCorrect: true },
      { text: 'Following platform conventions (e.g., iOS vs Android)', isCorrect: true },
      { text: 'Having different button styles on every page', isCorrect: false },
      { text: 'Using a consistent color palette', isCorrect: true },
    ],
    explanation: 'Consistency in icons, platform conventions, and visual elements like color palettes are crucial for good usability. Inconsistent button styles would violate this heuristic.',
  },
  {
    id: 'q4',
    question: 'True or False: Providing clear error messages with solutions is an example of "Error prevention".',
    type: 'true-false',
    options: [
      { text: 'True', isCorrect: false },
      { text: 'False', isCorrect: true },
    ],
    explanation: 'This is an example of "Help users recognize, diagnose, and recover from errors". Error prevention focuses on designing to prevent problems from occurring in the first place.',
  },
  {
    id: 'q5',
    question: 'A good design audit observation should be...',
    type: 'multi-choice',
    options: [
      { text: 'Vague and general', isCorrect: false },
      { text: 'Specific and actionable', isCorrect: true },
      { text: 'Focused on developer implementation details', isCorrect: false },
      { text: 'Linked to a specific heuristic or guideline', isCorrect: true },
    ],
    explanation: 'Effective observations are specific, actionable, and grounded in design principles or heuristics. They should not be vague or overly technical.',
  },
];
// Mock data for showcase projects
export const MOCK_SHOWCASE_PROJECTS = [
  {
    id: 'proj1',
    title: 'E-commerce Redesign for Local Ghanaian Business',
    description: 'A complete UX/UI redesign focusing on improving conversion rates and localizing the shopping experience.',
    heroImages: ['https://picsum.photos/800/600?random=1', 'https://picsum.photos/800/600?random=2'],
    tags: ['e-commerce', 'local business', 'mobile-first', 'R5'],
    moduleNumber: 'R5',
    isFeatured: true,
    author: 'Sarah (Design Student)',
    status: 'approved',
    publishedAt: new Date('2024-03-10T10:00:00Z'),
    portfolioLink: '/portfolio/sarah123',
    viewCount: 150,
  },
  {
    id: 'proj2',
    title: 'Dashboard for TechBridge Internal Tool',
    description: 'Information architecture and design system implementation for a complex internal analytics dashboard.',
    heroImages: ['https://picsum.photos/800/600?random=3', 'https://picsum.photos/800/600?random=4'],
    tags: ['dashboard', 'design system', 'data visualization', 'R4'],
    moduleNumber: 'R4',
    isFeatured: false,
    author: 'James (Career Switcher)',
    status: 'approved',
    publishedAt: new Date('2024-03-05T14:30:00Z'),
    portfolioLink: '/portfolio/james456',
    viewCount: 80,
  },
  {
    id: 'proj3',
    title: 'Mobile Banking App Wireframe',
    description: 'Low-fidelity wireframes and user flows for a secure and intuitive mobile banking application.',
    heroImages: ['https://picsum.photos/800/600?random=5'],
    tags: ['fintech', 'wireframing', 'mobile', 'R3'],
    moduleNumber: 'R3',
    isFeatured: false,
    author: 'Dr. Mensah (Educator)', // Example: Educators can also submit
    status: 'approved',
    publishedAt: new Date('2024-03-12T09:00:00Z'),
    portfolioLink: '/portfolio/mensah789',
    viewCount: 120,
  },
  {
    id: 'proj4',
    title: 'Accessibility Audit of Government Website',
    description: 'A comprehensive audit identifying WCAG 2.1 violations and proposing solutions for a government service portal.',
    heroImages: ['https://picsum.photos/800/600?random=6', 'https://picsum.photos/800/600?random=7'],
    tags: ['accessibility', 'audit', 'WCAG', 'R1'],
    moduleNumber: 'R1',
    isFeatured: true,
    author: 'Sarah (Design Student)',
    status: 'approved',
    publishedAt: new Date('2024-02-28T11:00:00Z'),
    portfolioLink: '/portfolio/sarah123',
    viewCount: 200,
  },
  {
    id: 'proj5',
    title: 'Productivity App Code Implementation',
    description: 'React + Tailwind implementation of key screens for a new productivity application, focusing on responsive design.',
    heroImages: ['https://picsum.photos/800/600?random=8'],
    tags: ['React', 'Tailwind CSS', 'frontend', 'R6'],
    moduleNumber: 'R6',
    isFeatured: false,
    author: 'James (Career Switcher)',
    status: 'approved',
    publishedAt: new Date('2024-03-15T16:00:00Z'),
    portfolioLink: '/portfolio/james456',
    viewCount: 95,
  },
];