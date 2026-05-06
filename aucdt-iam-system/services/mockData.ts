import { Role, User, LogEntry, LogStatus, Message, AuditLog } from '../types';

export const INITIAL_USERS: User[] = [
  { 
    id: 'u1', 
    name: 'Sampson Danso', 
    role: Role.STUDENT, 
    email: 'sampson.danso@aucdt.edu.gh', 
    avatar: 'https://aucdt.edu.gh/storage/aistudio-hosting/aucdt-assets/Sampson.png' 
  },
  { 
    id: 'u2', 
    name: 'Daniel F. Twum', 
    role: Role.ORGANIZATION, 
    email: 'daniel.twum@techcorp.com', 
    avatar: 'https://aucdt.edu.gh/storage/aistudio-hosting/aucdt-assets/ClipAI%2Dfill%2Dtriangle.png' 
  },
  { 
    id: 'u3', 
    name: 'Emmanuel A. Asante PhD', 
    role: Role.INSTITUTION, 
    email: 'e.asante@aucdt.edu.gh', 
    avatar: 'https://aucdt.edu.gh/storage/aistudio-hosting/aucdt-assets/ClipAI%2Dfill%2Dhexagon%2D1.png' 

  },
  { 
    id: 'u4', 
    name: 'System Admin', 
    role: Role.ADMIN, 
    email: 'admin@aucdt.edu.gh', 
    avatar: 'https://aucdt.edu.gh/storage/aistudio-hosting/aucdt-assets/ClipAI%2Dfill-arrow.png' 
  },
];

export const INITIAL_LOGS: LogEntry[] = [
  {
    id: 'l1',
    studentId: 'u1',
    date: '2023-10-25',
    hours: 8,
    activities: 'Assisted in fashion pattern drafting. Learned about CAD for garment design.',
    summary: 'Supported the design team with pattern drafting and received training on Computer-Aided Design (CAD) software for garment construction.',
    status: LogStatus.APPROVED
  },
  {
    id: 'l2',
    studentId: 'u1',
    date: '2023-10-26',
    hours: 6,
    activities: 'Started documentation for the new collection launch.',
    summary: 'Initiated the creation of technical documentation for the upcoming seasonal fashion collection.',
    status: LogStatus.PENDING
  }
];

export const INITIAL_MESSAGES: Message[] = [
  { id: 'm1', senderId: 'u2', receiverId: 'u1', content: 'Please submit your report by Friday.', timestamp: Date.now() - 86400000, read: false }
];

export const INITIAL_AUDIT: AuditLog[] = [
  { id: 'a1', timestamp: Date.now() - 100000, action: 'System Health Check Initiated', adminId: 'u4' }
];