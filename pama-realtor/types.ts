export enum PropertyType {
  RENT = 'RENT',
  SALE = 'SALE'
}

export interface Property {
  id: string;
  title: string;
  type: PropertyType;
  price: number;
  location: string;
  description: string;
  bedrooms?: number;
  areaSize?: string;
  image: string;
  driveToViewPrice: number;
}

export interface CartItem {
  id: string; // Composite ID: propertyId_serviceType
  propertyId: string;
  title: string;
  serviceType: 'Purchase/Rent' | 'Drive-to-View';
  price: number;
}

export interface OrderFormValues {
  name: string;
  email: string;
  phone: string;
  region: string;
  town: string;
  area: string;
  addressType: 'Home' | 'Office' | 'Campus';
}

export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  action: string;
  details: string;
  user: string;
}

export type ThemeMode = 'light' | 'dark' | 'high-contrast';

export const VAT_RATE = 0.00;
export const SERVICE_CHARGE_RATE = 0.05;

// Testing Framework Types
export type TestStatus = 'idle' | 'running' | 'passed' | 'failed';

export interface TestResult {
  id: string;
  name: string;
  status: TestStatus;
  message: string;
  duration: number;
}

export interface TestSuite {
  name: string;
  tests: TestResult[];
}