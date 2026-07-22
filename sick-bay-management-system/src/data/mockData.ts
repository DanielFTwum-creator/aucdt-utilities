import { Patient, Medication, Visit, Referral, FacilityLog, DailyHealthCheck } from '../types';

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: "STU-2026-001",
    name: "Kwame Boateng",
    type: "Student",
    gender: "Male",
    age: 15,
    classOrDept: "Grade 10 Blue",
    emergencyContactName: "Ama Boateng (Mother)",
    emergencyContactPhone: "055-123-4567",
    allergies: ["Penicillin"],
    chronicConditions: ["Asthma"]
  },
  {
    id: "STU-2026-002",
    name: "Abena Mensah",
    type: "Student",
    gender: "Female",
    age: 16,
    classOrDept: "Grade 11 Gold",
    emergencyContactName: "Kofi Mensah (Father)",
    emergencyContactPhone: "024-987-6543",
    allergies: ["Sulfa Drugs", "Nuts"],
    chronicConditions: ["G6PD Deficiency"]
  },
  {
    id: "STU-2026-003",
    name: "John Kamara",
    type: "Student",
    gender: "Male",
    age: 14,
    classOrDept: "Grade 9 Red",
    emergencyContactName: "Marie Kamara (Aunt)",
    emergencyContactPhone: "054-321-0987",
    allergies: [],
    chronicConditions: ["Epilepsy"]
  },
  {
    id: "STU-2026-004",
    name: "Esi Ansah",
    type: "Student",
    gender: "Female",
    age: 17,
    classOrDept: "Grade 12 Science",
    emergencyContactName: "George Ansah (Father)",
    emergencyContactPhone: "020-555-8899",
    allergies: ["Aspirin"],
    chronicConditions: ["Peptic Ulcer Disease (PUD)"]
  },
  {
    id: "STU-2026-005",
    name: "Emmanuel Osei",
    type: "Student",
    gender: "Male",
    age: 15,
    classOrDept: "Grade 10 Gold",
    emergencyContactName: "Sarah Osei (Mother)",
    emergencyContactPhone: "027-444-1122",
    allergies: [],
    chronicConditions: []
  },
  {
    id: "STU-2026-006",
    name: "Naa Adjei",
    type: "Student",
    gender: "Female",
    age: 15,
    classOrDept: "Grade 10 Blue",
    emergencyContactName: "Robert Adjei (Father)",
    emergencyContactPhone: "024-333-7766",
    allergies: ["Dust Mites"],
    chronicConditions: ["Allergic Rhinitis"]
  },
  {
    id: "STU-2026-007",
    name: "Moussa Diop",
    type: "Student",
    gender: "Male",
    age: 16,
    classOrDept: "Grade 11 Blue",
    emergencyContactName: "Fatoumata Diop (Mother)",
    emergencyContactPhone: "055-777-8811",
    allergies: [],
    chronicConditions: ["Type 1 Diabetes"]
  },
  {
    id: "STU-2026-008",
    name: "Yasmine Alhassan",
    type: "Student",
    gender: "Female",
    age: 13,
    classOrDept: "Grade 8 Green",
    emergencyContactName: "Ibrahim Alhassan (Father)",
    emergencyContactPhone: "026-111-9922",
    allergies: ["Dairy"],
    chronicConditions: []
  },
  // Staff Profiles
  {
    id: "STF-2026-101",
    name: "Mr. Peter Fleischer-Djoleto",
    type: "Staff",
    gender: "Male",
    age: 42,
    classOrDept: "Science Department",
    emergencyContactName: "Grace Fleischer-Djoleto (Wife)",
    emergencyContactPhone: "024-888-9999",
    allergies: ["Amoxicillin"],
    chronicConditions: ["Hypertension"]
  },
  {
    id: "STF-2026-102",
    name: "Mrs. Theresa Asante",
    type: "Staff",
    gender: "Female",
    age: 38,
    classOrDept: "Administration",
    emergencyContactName: "Samuel Asante (Husband)",
    emergencyContactPhone: "050-222-3344",
    allergies: [],
    chronicConditions: []
  },
  {
    id: "STF-2026-103",
    name: "Dr. Kweku Arthur",
    type: "Staff",
    gender: "Male",
    age: 50,
    classOrDept: "Languages Department",
    emergencyContactName: "Linda Arthur (Wife)",
    emergencyContactPhone: "027-666-3322",
    allergies: ["Ibuprofen"],
    chronicConditions: ["Mild Asthma"]
  }
];

export const INITIAL_MEDICATIONS: Medication[] = [
  {
    id: "MED-001",
    name: "Paracetamol 500mg Tablets",
    category: "Analgesics",
    quantityOnHand: 450,
    unit: "tablets",
    reorderThreshold: 100,
    batchNumber: "B-PC2026A",
    expiryDate: "2027-08-15",
    overStockThreshold: 1000
  },
  {
    id: "MED-002",
    name: "Ibuprofen 400mg Tablets",
    category: "Analgesics",
    quantityOnHand: 40, // Low Stock Alert
    unit: "tablets",
    reorderThreshold: 100,
    batchNumber: "B-IB2026B",
    expiryDate: "2026-11-20",
    overStockThreshold: 500
  },
  {
    id: "MED-003",
    name: "Salbutamol Inhaler (100mcg/dose)",
    category: "Inhalers",
    quantityOnHand: 15,
    unit: "inhalers",
    reorderThreshold: 5,
    batchNumber: "B-SB2026X",
    expiryDate: "2026-08-10", // Expiring Very Soon
    overStockThreshold: 30
  },
  {
    id: "MED-004",
    name: "Cetirizine 10mg (Antihistamine)",
    category: "Antihistamines",
    quantityOnHand: 320,
    unit: "tablets",
    reorderThreshold: 50,
    batchNumber: "B-CT2025C",
    expiryDate: "2025-12-01", // Expired
    overStockThreshold: 400
  },
  {
    id: "MED-005",
    name: "Amoxicillin 250mg Capsules",
    category: "Other",
    quantityOnHand: 1200, // Overstock Risk
    unit: "tablets",
    reorderThreshold: 200,
    batchNumber: "B-AMX991",
    expiryDate: "2028-01-30",
    overStockThreshold: 1000
  },
  {
    id: "MED-006",
    name: "Oral Rehydration Salts (ORS)",
    category: "Gastrointestinal",
    quantityOnHand: 80,
    unit: "sachets",
    reorderThreshold: 30,
    batchNumber: "B-ORS102",
    expiryDate: "2027-04-12",
    overStockThreshold: 200
  },
  {
    id: "MED-007",
    name: "Antacid Chewable Tablets",
    category: "Gastrointestinal",
    quantityOnHand: 150,
    unit: "tablets",
    reorderThreshold: 50,
    batchNumber: "B-ANT881",
    expiryDate: "2027-03-05",
    overStockThreshold: 300
  },
  {
    id: "MED-008",
    name: "Sterile Gauze Rolls & Bandages",
    category: "First Aid",
    quantityOnHand: 25,
    unit: "rolls",
    reorderThreshold: 10,
    batchNumber: "B-GZ004",
    expiryDate: "2029-06-30",
    overStockThreshold: 80
  },
  {
    id: "MED-009",
    name: "Methylated Spirit 250ml",
    category: "First Aid",
    quantityOnHand: 8,
    unit: "bottles",
    reorderThreshold: 5,
    batchNumber: "B-MS112",
    expiryDate: "2028-09-15",
    overStockThreshold: 20
  }
];

export const INITIAL_VISITS: Visit[] = [
  {
    id: "VST-2026-001",
    patientId: "STU-2026-001",
    patientName: "Kwame Boateng",
    patientType: "Student",
    classOrDept: "Grade 10 Blue",
    gender: "Male",
    dateTime: "2026-07-15T08:30:00Z",
    temperature: 38.6,
    bloodPressure: "115/75",
    pulseRate: 88,
    symptoms: "High temperature, chills, sore throat, runny nose for 2 days.",
    presentingConditions: ["URTI (Upper Respiratory Infection)"],
    severity: "Moderate",
    treatment: "First-aid cooling sponge, lukewarm water offered.",
    medicationDispensedId: "MED-001",
    medicationDispensedQty: 2,
    disposition: "Observe in Sick Bay",
    observedBedNo: "Bed A",
    observationEndTime: "2026-07-15T12:00:00Z",
    notes: "Temperature reduced to 37.2°C after resting. Discharged back to class with guidance.",
    treatedBy: "Nurse T. Asante"
  },
  {
    id: "VST-2026-002",
    patientId: "STU-2026-002",
    patientName: "Abena Mensah",
    patientType: "Student",
    classOrDept: "Grade 11 Gold",
    gender: "Female",
    dateTime: "2026-07-16T10:15:00Z",
    temperature: 36.8,
    bloodPressure: "105/65",
    pulseRate: 72,
    symptoms: "Accidental fall on the basketball court, scraped right knee with swelling.",
    presentingConditions: ["Minor Injury / Wound"],
    severity: "Mild",
    treatment: "Wound cleaned with Antiseptic liquid, dressed with sterile gauze and bandage.",
    medicationDispensedId: "MED-008",
    medicationDispensedQty: 1,
    disposition: "Back to Class",
    notes: "Informed student to return tomorrow for redressing. Advised to avoid heavy physical strain.",
    treatedBy: "Nurse P. Fleischer-Djoleto"
  },
  {
    id: "VST-2026-003",
    patientId: "STU-2026-004",
    patientName: "Esi Ansah",
    patientType: "Student",
    classOrDept: "Grade 12 Science",
    gender: "Female",
    dateTime: "2026-07-17T09:00:00Z",
    temperature: 37.1,
    bloodPressure: "110/70",
    pulseRate: 90,
    symptoms: "Severe burning stomach ache, nausea, skipped breakfast.",
    presentingConditions: ["Peptic Ulcer Disease (PUD)"],
    severity: "Moderate",
    treatment: "Administered Antacid tablet. Let patient lie down on Bed B.",
    medicationDispensedId: "MED-007",
    medicationDispensedQty: 1,
    disposition: "Observe in Sick Bay",
    observedBedNo: "Bed B",
    observationEndTime: "2026-07-17T11:30:00Z",
    notes: "Stomach burn resolved after Antacid and resting. Discharged home under parent's supervision.",
    treatedBy: "Nurse T. Asante"
  },
  {
    id: "VST-2026-004",
    patientId: "STF-2026-101",
    patientName: "Mr. Peter Fleischer-Djoleto",
    patientType: "Staff",
    classOrDept: "Science Department",
    gender: "Male",
    dateTime: "2026-07-18T14:00:00Z",
    temperature: 36.5,
    bloodPressure: "145/95", // High BP
    pulseRate: 84,
    symptoms: "Slight dizziness, fatigue after back-to-back classroom lectures.",
    presentingConditions: ["Hypertension Monitoring"],
    severity: "Moderate",
    treatment: "Offered glass of water, vital checks, recommended 30-minute rest.",
    disposition: "Observe in Sick Bay",
    observedBedNo: "Bed A",
    observationEndTime: "2026-07-18T15:00:00Z",
    notes: "BP rechecked after rest: 138/88. Advised reduction in physical activity and consultation with personal physician.",
    treatedBy: "Nurse T. Asante"
  },
  {
    id: "VST-2026-005",
    patientId: "STU-2026-003",
    patientName: "John Kamara",
    patientType: "Student",
    classOrDept: "Grade 9 Red",
    gender: "Male",
    dateTime: "2026-07-19T11:00:00Z",
    temperature: 37.5,
    bloodPressure: "112/70",
    pulseRate: 110,
    symptoms: "Sudden seizure episode during physical education lesson, lasting about 2 minutes.",
    presentingConditions: ["Epileptic Fit / Seizure"],
    severity: "Severe",
    treatment: "Cleared nearby hazards, placed in recovery position, administered high-flow oxygen, kept airway safe.",
    disposition: "Referral to Hospital",
    notes: "Emergency call placed to parents and school vehicle. Patient stabilized but referred to municipal hospital for complete evaluation.",
    treatedBy: "Nurse P. Fleischer-Djoleto"
  },
  {
    id: "VST-2026-006",
    patientId: "STU-2026-001",
    patientName: "Kwame Boateng",
    patientType: "Student",
    classOrDept: "Grade 10 Blue",
    gender: "Male",
    dateTime: "2026-07-20T08:15:00Z",
    temperature: 37.8,
    bloodPressure: "110/72",
    pulseRate: 85,
    symptoms: "Persistent dry cough, wheezing, shortness of breath on arrival.",
    presentingConditions: ["Asthma Attack"],
    severity: "Moderate",
    treatment: "Administered 2 puffs of Salbutamol, patient placed in semi-Fowler position.",
    medicationDispensedId: "MED-003",
    medicationDispensedQty: 1,
    disposition: "Observe in Sick Bay",
    observedBedNo: "Bed C",
    notes: "Wheezing subsided, respiratory rate normalized to 18 breaths/min. Still resting on Bed C.",
    treatedBy: "Nurse T. Asante"
  }
];

export const INITIAL_REFERRALS: Referral[] = [
  {
    id: "REF-2026-001",
    visitId: "VST-2026-005",
    patientName: "John Kamara",
    patientId: "STU-2026-003",
    dateTime: "2026-07-19T11:15:00Z",
    referralHospital: "Ridge Municipal Hospital",
    reason: "Post-ictal evaluation and neurological checkup after severe tonic-clonic seizure.",
    status: "Transferred",
    outcomeNotes: "Parents joined student in transit. Received word that he is awake and being monitored under pediatric care."
  }
];

export const INITIAL_FACILITY_LOGS: FacilityLog[] = [
  {
    id: "FAC-001",
    dateTime: "2026-07-01T08:00:00Z",
    equipmentName: "Veronica Handwashing Bucket",
    status: "Non-Functional",
    reportedIssue: "Foot pedal linkage is broken, preventing handwashing. Crucial for infection control at the door.",
    reportedBy: "Nurse T. Asante",
    isResolved: false
  },
  {
    id: "FAC-002",
    dateTime: "2026-07-10T10:00:00Z",
    equipmentName: "Digital Infrared Thermometer",
    status: "Needs Maintenance",
    reportedIssue: "Battery cap cracked, battery loose inside. Needs electrical tape or replacement cap.",
    reportedBy: "Nurse P. Fleischer-Djoleto",
    isResolved: true,
    resolutionDays: 2
  },
  {
    id: "FAC-003",
    dateTime: "2026-07-12T09:00:00Z",
    equipmentName: "Oxygen Concentrator / Cylinder",
    status: "Functional",
    reportedIssue: "Refilled oxygen supply tank to maximum capacity.",
    reportedBy: "Nurse T. Asante",
    isResolved: true,
    resolutionDays: 0
  }
];

export const INITIAL_DAILY_CHECKS: DailyHealthCheck[] = [
  {
    id: "DHC-2026-001",
    patientId: "STU-2026-001",
    patientName: "Kwame Boateng",
    classOrDept: "Grade 10 Blue",
    dateTime: "2026-07-20T08:15:00Z",
    temperature: 36.6,
    symptoms: ["Healthy / None"],
    status: "Healthy",
    notes: "Regular morning check-in. Subject cleared for normal lessons."
  },
  {
    id: "DHC-2026-002",
    patientId: "STU-2026-002",
    patientName: "Abena Mensah",
    classOrDept: "Grade 11 Gold",
    dateTime: "2026-07-20T08:30:00Z",
    temperature: 37.9,
    symptoms: ["Headache", "Cough"],
    status: "Needs Monitor",
    notes: "Mild fever detected. Advised to drink warm water and return if symptoms worsen."
  }
];

export const INITIAL_AUDIT_LOGS: any[] = [
  {
    id: "AUD-2026-001",
    dateTime: "2026-07-15T08:00:00Z",
    action: "Successful Administrator Login",
    category: "AUTH",
    actor: "Daniel Twum (Head of ICT)",
    details: "Administrator session established from TUC ICT subnet."
  },
  {
    id: "AUD-2026-002",
    dateTime: "2026-07-15T11:22:00Z",
    action: "Pharmacy Restock",
    category: "INVENTORY",
    actor: "Nurse T. Asante",
    details: "Restocked 100 tablets of Paracetamol (Batch: B-PC2026)."
  },
  {
    id: "AUD-2026-003",
    dateTime: "2026-07-18T09:40:00Z",
    action: "Log Patient Encounter",
    category: "CLINICAL",
    actor: "Nurse P. Fleischer-Djoleto",
    details: "Registered student Kwame Boateng with moderate asthma symptoms."
  },
  {
    id: "AUD-2026-004",
    dateTime: "2026-07-20T14:30:00Z",
    action: "Resolved Facility Defect",
    category: "FACILITY",
    actor: "Daniel Twum (Head of ICT)",
    details: "Marked Digital Infrared Thermometer (FAC-002) resolved in 2 days."
  }
];

