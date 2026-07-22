export type PatientType = 'Student' | 'Staff';

export interface Patient {
  id: string; // ID or Admission Number
  name: string;
  type: PatientType;
  gender: 'Male' | 'Female';
  age: number;
  classOrDept: string; // e.g. "Grade 10A" or "Mathematics Dept"
  emergencyContactName: string;
  emergencyContactPhone: string;
  allergies: string[];
  chronicConditions: string[];
}

export type SeverityLevel = 'Mild' | 'Moderate' | 'Severe';

export type Disposition = 'Back to Class' | 'Sent Home' | 'Referral to Hospital' | 'Observe in Sick Bay';

export interface Visit {
  id: string;
  patientId: string;
  patientName: string;
  patientType: PatientType;
  classOrDept: string;
  gender: 'Male' | 'Female';
  dateTime: string; // ISO date string
  temperature: number; // °C
  bloodPressure: string; // e.g. "120/80"
  pulseRate: number; // bpm
  symptoms: string;
  presentingConditions: string[]; // e.g. ["URTI", "Asthma Attack", "Headache/Migraine"]
  severity: SeverityLevel;
  treatment: string;
  medicationDispensedId?: string;
  medicationDispensedQty?: number;
  disposition: Disposition;
  observedBedNo?: string;
  observationEndTime?: string; // If discharged from observation
  notes: string;
  treatedBy: string; // Nurse's name
}

export interface Medication {
  id: string;
  name: string;
  category: 'Analgesics' | 'Antihistamines' | 'Inhalers' | 'Gastrointestinal' | 'First Aid' | 'Supplies' | 'Other';
  quantityOnHand: number;
  unit: string; // e.g. "tablets", "bottles", "ointments", "rolls"
  reorderThreshold: number;
  batchNumber: string;
  expiryDate: string; // YYYY-MM-DD
  overStockThreshold: number; // relative threshold for warning
}

export interface Referral {
  id: string;
  visitId: string;
  patientName: string;
  patientId: string;
  dateTime: string;
  referralHospital: string;
  reason: string; // e.g. "Suspected Appendicitis", "High fever persistent"
  status: 'Pending' | 'Transferred' | 'Discharged' | 'Followed Up';
  outcomeNotes?: string;
}

export interface FacilityLog {
  id: string;
  dateTime: string;
  equipmentName: string; // e.g. "Veronica Bucket", "Oxygen Cylinder", "Digital Thermometer"
  status: 'Functional' | 'Needs Maintenance' | 'Non-Functional';
  reportedIssue?: string;
  reportedBy: string;
  resolutionDays?: number;
  isResolved: boolean;
}

export interface DailyHealthCheck {
  id: string;
  patientId: string;
  patientName: string;
  classOrDept: string;
  dateTime: string;
  temperature: number;
  symptoms: string[];
  status: 'Healthy' | 'Needs Monitor' | 'Refer to Sickbay';
  notes?: string;
}

export interface AuditLog {
  id: string;
  dateTime: string;
  action: string;
  category: 'AUTH' | 'CLINICAL' | 'INVENTORY' | 'FACILITY' | 'SYSTEM';
  actor: string;
  details: string;
}

