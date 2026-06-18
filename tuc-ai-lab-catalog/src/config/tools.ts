export interface Tool {
  slug: string;
  title: string;
  description: string;
  url: string;
  category: 'research' | 'development' | 'analysis' | 'education';
  screenshotUrl?: string; // Override URL for screenshot generation
  skipScreenshot?: boolean; // Set true to skip this tool
}

export const TOOLS: Tool[] = [
  {
    slug: 'markai',
    title: 'MarKAI',
    description: 'AI-powered project management and workflow orchestration',
    url: 'https://markai.techbridge.edu.gh',
    category: 'development',
  },
  {
    slug: 'biochemai',
    title: 'BioChemAI',
    description: 'Biochemistry research and analysis platform',
    url: 'https://biochemai.techbridge.edu.gh',
    category: 'research',
  },
  {
    slug: 'thesisai',
    title: 'ThesisAI',
    description: 'Thesis research and writing assistant',
    url: 'https://thesisai.techbridge.edu.gh',
    category: 'education',
  },
  {
    slug: 'learnai',
    title: 'LearnAI',
    description: 'Agentic learning management system',
    url: 'https://learnai.techbridge.edu.gh',
    category: 'education',
  },
  {
    slug: 'stockpulse',
    title: 'StockPulse',
    description: 'AI stock analysis, portfolio tracking, and paper trading platform',
    url: 'https://ai-tools.techbridge.edu.gh/stockpulse',
    category: 'analysis',
  },
  // Add more tools here as they're deployed
  // {
  //   slug: 'future-tool',
  //   title: 'Future Tool',
  //   description: '...',
  //   url: 'https://future-tool.techbridge.edu.gh',
  //   category: 'development',
  //   skipScreenshot: true, // Uncomment when ready to screenshot
  // }
];

export const getScreenshotTools = (): Tool[] => {
  return TOOLS.filter(tool => !tool.skipScreenshot);
};
