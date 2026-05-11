import { Environment, FormData } from './types';

export const API_ENDPOINTS: Record<Environment, string> = {
  // Development environment endpoint
  [Environment.DEV]: 'https://portal.aucdt.edu.gh/aucdt-dev/sendMail',
  
  // Quality Assurance environment endpoint
  [Environment.QA]: 'https://portal.aucdt.edu.gh/aucdt-qa/sendMail',
  
  // User Acceptance Testing environment endpoint
  [Environment.UAT]: 'https://portal.aucdt.edu.gh/aucdt-uat/sendMail',
};

export const SAMPLE_FORM_DATA: Record<Environment, FormData> = {
  [Environment.DEV]: {
    applicantId: 'DEV-12345',
    fullName: 'Dev Tester',
    senderEmailId: 'helpdesk@aucdt.edu.gh',
    receiverEmailId: 'helpdesk@aucdt.edu.gh',
    subject: 'DEV: Test Email',
    message: 'This is a test message from the DEVELOPMENT environment.',
    attachment: null,
  },
  [Environment.QA]: {
    applicantId: 'QA-67890',
    fullName: 'QA Tester',
    senderEmailId: 'helpdesk@aucdt.edu.gh',
    receiverEmailId: 'helpdesk@aucdt.edu.gh',
    subject: 'QA: Test Email',
    message: 'This is a test message from the QUALITY ASSURANCE environment.',
    attachment: null,
  },
  [Environment.UAT]: {
    applicantId: 'UAT-54321',
    fullName: 'UAT Tester',
    senderEmailId: 'helpdesk@aucdt.edu.gh',
    receiverEmailId: 'helpdesk@aucdt.edu.gh',
    subject: 'UAT: Test Email',
    message: 'This is a test message from the USER ACCEPTANCE TESTING environment.',
    attachment: null,
  },
};


export const INITIAL_FORM_DATA: FormData = SAMPLE_FORM_DATA[Environment.UAT];