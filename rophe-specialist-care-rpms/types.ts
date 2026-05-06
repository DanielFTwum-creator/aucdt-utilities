
export enum UserRole {
  ADMIN = 'Administrator',
  DOCTOR = 'Doctor',
  NURSE = 'Nurse',
  RECEPTIONIST = 'Receptionist'
}

export enum AppointmentStatus {
  SCHEDULED = 'Scheduled',
  CHECKED_IN = 'Checked-In',
  IN_PROGRESS = 'In-Progress',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled'
}

export enum AlertSeverity {
  INFO = 'Info',
  WARNING = 'Warning',
  CRITICAL = 'Critical'
}

export enum AlertType {
  VITAL = 'Vital Signs',
  LAB = 'Lab Result',
  SCHEDULE = 'Schedule',
  CLINICAL = 'Clinical'
}

export type ThemeType = 'light' | 'dark' | 'high-contrast';

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  password?: string;
  lastLogin?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
}

export interface AlertThresholds {
  bpSystolicMax: number;
  bpDiastolicMax: number;
  pulseMin: number;
  pulseMax: number;
  spo2Min: number;
  tempMax: number;
}

export interface Alert {
  id: string;
  patientId: string;
  message: string;
  severity: AlertSeverity;
  type: AlertType;
  timestamp: string;
  resolved: boolean;
}

export interface PatientRecording {
  id: string;
  patientId: string;
  appointmentId: string;
  date: string;
  duration: number; // seconds
  videoUrl: string; // blob url or storage path
  fileName: string;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  address: string;
  emergencyContact: string;
  bloodGroup?: string;
  allergies: string[];
  medicalHistory: string[];
  currentMedications?: string[]; // Array of medication IDs
  prescriptions?: Prescription[];
  insuranceProvider?: string;
  insuranceId?: string;
  createdAt: string;
  recordings?: PatientRecording[];
  status: 'Active' | 'Inactive';
  deactivationReason?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  providerId: string;
  date: string;
  time: string;
  duration: number; // minutes
  type: 'Consultation' | 'Follow-up' | 'Procedure' | 'Video Consultation';
  status: AppointmentStatus;
  notes?: string;
  dueDate?: string;
  reasonForVisit?: string;
  details?: string;
  cancellationReason?: string;
}

export interface TestResult {
  id: string;
  name: string;
  status: 'passed' | 'failed' | 'running' | 'idle';
  duration: number;
  error?: string;
  logs: string[];
  screenshot?: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  medicationId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: string;
  refills: number;
  instructions: string;
  prescribedBy: string;
  prescribedDate: string;
  status: 'Active' | 'Completed' | 'Discontinued';
  discontinuedReason?: string;
}

export interface ClinicalReminder {
  id: string;
  patientId: string;
  type: 'Preventive Care' | 'Chronic Disease' | 'Overdue Screening' | 'Quality Measure';
  title: string;
  message: string;
  priority: 'High' | 'Medium' | 'Low';
  dueDate?: string;
  dismissed: boolean;
  dismissedReason?: string;
  dismissedBy?: string;
  dismissedAt?: string;
}