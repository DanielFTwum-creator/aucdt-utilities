

import { FormData } from '../types';

export interface TestResult {
  id: string;
  timestamp: string;
  status: 'passed' | 'failed';
  screenshot?: string; // Base64
  duration: number;
  log: string[];
}

const TEST_RESULTS_KEY = 'techbridge_test_results';

export const getTestResults = (): TestResult[] => {
  try {
    const data = localStorage.getItem(TEST_RESULTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const saveTestResult = (result: TestResult) => {
  const existing = getTestResults();
  const updated = [result, ...existing].slice(0, 10); // Keep last 10
  localStorage.setItem(TEST_RESULTS_KEY, JSON.stringify(updated));
};

export const MOCK_TEST_DATA: Partial<FormData> = {
  meta: {
    madeAt: "Automated City",
    date: new Date().toISOString().split('T')[0],
  },
  scholar: {
    title: "Dr",
    fullName: "Automated Test User",
    idNumber: "TEST-AUTO-999-0", // Updated to match mask
    parentName: "Parent Test",
    address: "123 Memory Lane, Server RAM",
    email: "test.bot@techbridge.edu.gh",
    phone: "+233 50 000 0000" // Updated to match mask
  },
  program: {
    department: "DIGITAL MEDIA AND COMMUNICATION DESIGN",
    programDuration: "4 Years",
    fundingSource: "Techbridge Scholarship Grant",
    phdSubject: "Automated Systems",
    serviceYears: 10
  },
  guarantor: {
    name: "System Administrator",
    idNumber: "ADMIN-001",
    address: "Data Center 1",
    phone: "233123456789" // Added phone number
  },
  witnesses: {
    techbridgeWitness: {
      name: "TUC Witness",
      idNumber: "TUC-WIT-001"
    },
    scholarWitness: {
      name: "Scholar Friend",
      idNumber: "SFR-WIT-002"
    }
  },
  signatures: {
    scholarSign: "Automated Test User",
    signatureType: 'text',
    agreedToTerms: true // Ensure terms are agreed for simulation
  }
};