export enum Category {
  Research = 'Research',
  Development = 'Development',
  Analysis = 'Analysis',
  Education = 'Education',
}

export interface TestResult {
    description: string;
    status: 'PASS' | 'FAIL';
    error?: string;
    screenshot?: string;
}


export interface AppItem {
  id: number;
  name: string;
  title: string;
  description: string;
  category: Category;
  url: string;
  imageUrl?: string;
}

export type Theme = 'light' | 'dark' | 'high-contrast';