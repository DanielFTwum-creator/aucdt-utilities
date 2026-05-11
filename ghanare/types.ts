// --- START OF FILE types.ts ---
export interface Vehicle {
  id: number;
  name: string;
  model: string;
  year: number;
  type: 'SUV' | 'Saloon' | 'Hatchback' | '4x4';
  pricePerDay: number; // in GHS
  location: string;
  imageUrl: string;
  features: string[];
  rating: number;
  reviewCount: number;
  isListed: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  isVerified: boolean;
}

export interface SearchParams {
  location: string;
  pickupDate: string;
  dropoffDate: string;
}

export interface Suggestion {
  title: string;
  description: string;
  mapUrl?: string;
}

export type Theme = 'light' | 'dark' | 'high-contrast';

export interface AuditLogEntry {
  timestamp: string;
  action: string;
  details: string;
}

export interface TestResult {
    name: string;
    status: 'passed' | 'failed' | 'running';
    details: string;
    screenshot?: string;
}
// --- END OF FILE types.ts ---