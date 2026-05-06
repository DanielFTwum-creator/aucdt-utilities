

import { Patient, Appointment, AppointmentStatus, Alert, AlertSeverity, AlertType, User, UserRole } from '../types';

export const mockUsers: User[] = [
  {
    id: 'U001',
    username: 'admin',
    name: 'Clinical Admin',
    role: UserRole.ADMIN,
    password: 'password123'
  },
  {
    id: 'U002',
    username: 'doctor',
    name: 'Dr. Yacoba Atiase',
    role: UserRole.DOCTOR,
    password: 'password123'
  },
  {
    id: 'U003',
    username: 'nurse',
    name: 'Nurse Abena',
    role: UserRole.NURSE,
    password: 'password123'
  }
];

export const mockPatients: Patient[] = [
  {
    id: 'P001',
    firstName: 'Kofi',
    lastName: 'Mensah',
    dob: '1985-05-12',
    gender: 'Male',
    phone: '+233 20 123 4567',
    email: 'kofi.mensah@example.com',
    address: 'Baiden Ave, Accra',
    // Added missing required property emergencyContact
    emergencyContact: 'Mary Mensah (+233 20 111 2222)',
    bloodGroup: 'A+',
    allergies: ['Penicillin'],
    medicalHistory: ['Hypertension'],
    insuranceProvider: 'NHIS',
    insuranceId: 'NHIS-123456',
    createdAt: '2023-01-15',
    status: 'Active'
  },
  {
    id: 'P002',
    firstName: 'Ama',
    lastName: 'Asante',
    dob: '1992-11-20',
    gender: 'Female',
    phone: '+233 24 987 6543',
    email: 'ama.asante@example.com',
    address: 'East Legon, Accra',
    // Added missing required property emergencyContact
    emergencyContact: 'John Asante (+233 24 000 0000)',
    bloodGroup: 'O+',
    allergies: [],
    medicalHistory: ['Asthma'],
    insuranceProvider: 'Star Assurance',
    insuranceId: 'STA-789012',
    createdAt: '2023-06-10',
    status: 'Active'
  }
];

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

export const mockAppointments: Appointment[] = [
  {
    id: 'A001',
    patientId: 'P001',
    providerId: 'D001',
    date: today.toISOString().split('T')[0],
    time: '09:00',
    duration: 30,
    type: 'Consultation',
    status: AppointmentStatus.SCHEDULED,
    notes: 'Regular BP checkup',
    dueDate: '2024-12-25',
    reasonForVisit: 'Severe persistent headache for 3 days',
    details: 'Patient requested an early morning slot. Remind to bring old prescription sheets.'
  },
  {
    id: 'A002',
    patientId: 'P002',
    providerId: 'D001',
    date: today.toISOString().split('T')[0],
    time: '10:30',
    duration: 15,
    type: 'Follow-up',
    status: AppointmentStatus.SCHEDULED,
    notes: 'Asthma follow-up',
    dueDate: '2024-12-30',
    reasonForVisit: 'Review of inhaler efficacy',
    details: 'Follow-up on the new steroidal inhaler started last month.'
  },
  {
    id: 'A003',
    patientId: 'P002',
    providerId: 'D001',
    date: tomorrow.toISOString().split('T')[0],
    time: '14:00',
    duration: 45,
    type: 'Video Consultation',
    status: AppointmentStatus.SCHEDULED,
    notes: 'Remote dietary review',
    reasonForVisit: 'Routine dietary plan adjustment',
    details: 'Video link to be sent 15 mins prior.'
  }
];

export const mockAlerts: Alert[] = [
  {
    id: 'AL001',
    patientId: 'P001',
    message: 'Hypertensive crisis suspected: BP 160/100 detected.',
    severity: AlertSeverity.CRITICAL,
    type: AlertType.VITAL,
    timestamp: new Date().toISOString(),
    resolved: false
  },
  {
    id: 'AL002',
    patientId: 'P002',
    message: 'Abnormal Lab: Glucose levels elevated in latest screening.',
    severity: AlertSeverity.WARNING,
    type: AlertType.LAB,
    timestamp: new Date().toISOString(),
    resolved: false
  }
];