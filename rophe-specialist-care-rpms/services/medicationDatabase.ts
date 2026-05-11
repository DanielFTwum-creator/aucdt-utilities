/**
 * Medication Database
 *
 * Common medications available in Ghana with interaction data
 * Based on WHO Essential Medicines List and common tropical disease treatments
 */

export interface Medication {
  id: string;
  name: string;
  genericName: string;
  category: MedicationCategory;
  commonDosages: string[];
  contraindications: string[];
  sideEffects: string[];
  pregnancyCategory?: 'A' | 'B' | 'C' | 'D' | 'X';
  interactions: DrugInteraction[];
}

export enum MedicationCategory {
  ANTIMALARIAL = 'Antimalarial',
  ANTIBIOTIC = 'Antibiotic',
  ANTIHYPERTENSIVE = 'Antihypertensive',
  ANALGESIC = 'Analgesic/Pain Relief',
  ANTIDIABETIC = 'Antidiabetic',
  ANTIRETROVIRAL = 'Antiretroviral',
  CARDIOVASCULAR = 'Cardiovascular',
  RESPIRATORY = 'Respiratory',
  GASTROINTESTINAL = 'Gastrointestinal',
  OTHER = 'Other'
}

export interface DrugInteraction {
  drugId: string;
  drugName: string;
  severity: 'Severe' | 'Moderate' | 'Minor';
  effect: string;
  mechanism: string;
  recommendation: string;
}

/**
 * Medication Database
 * Ghana-focused with endemic disease treatments
 */
export const MEDICATION_DATABASE: Medication[] = [
  // ANTIMALARIALS
  {
    id: 'MED-001',
    name: 'Coartem',
    genericName: 'Artemether-Lumefantrine',
    category: MedicationCategory.ANTIMALARIAL,
    commonDosages: ['20mg/120mg tablet', '4 tablets twice daily for 3 days'],
    contraindications: ['Severe hepatic impairment', 'QT prolongation'],
    sideEffects: ['Headache', 'Dizziness', 'Nausea', 'Fatigue'],
    pregnancyCategory: 'C',
    interactions: [
      {
        drugId: 'MED-015',
        drugName: 'Amiodarone',
        severity: 'Severe',
        effect: 'Increased risk of QT prolongation and cardiac arrhythmias',
        mechanism: 'Both drugs prolong QT interval',
        recommendation: 'Avoid combination. Consider alternative antimalarial.'
      }
    ]
  },
  {
    id: 'MED-002',
    name: 'Chloroquine',
    genericName: 'Chloroquine Phosphate',
    category: MedicationCategory.ANTIMALARIAL,
    commonDosages: ['250mg tablet', '600mg initial, then 300mg at 6, 24, 48 hours'],
    contraindications: ['Retinopathy', 'G6PD deficiency (with primaquine)'],
    sideEffects: ['Nausea', 'Headache', 'Visual disturbances'],
    pregnancyCategory: 'C',
    interactions: []
  },

  // ANTIBIOTICS
  {
    id: 'MED-003',
    name: 'Amoxicillin',
    genericName: 'Amoxicillin',
    category: MedicationCategory.ANTIBIOTIC,
    commonDosages: ['250mg capsule', '500mg capsule', '500mg TID for 7-10 days'],
    contraindications: ['Penicillin allergy'],
    sideEffects: ['Diarrhea', 'Rash', 'Nausea'],
    pregnancyCategory: 'B',
    interactions: [
      {
        drugId: 'MED-011',
        drugName: 'Warfarin',
        severity: 'Moderate',
        effect: 'Increased anticoagulant effect, bleeding risk',
        mechanism: 'Alters gut flora affecting vitamin K production',
        recommendation: 'Monitor INR closely, adjust warfarin dose as needed'
      }
    ]
  },
  {
    id: 'MED-004',
    name: 'Ciprofloxacin',
    genericName: 'Ciprofloxacin',
    category: MedicationCategory.ANTIBIOTIC,
    commonDosages: ['250mg tablet', '500mg tablet', '500mg BID for 7-14 days'],
    contraindications: ['Age <18 years', 'Pregnancy', 'Tendon disorders'],
    sideEffects: ['Nausea', 'Diarrhea', 'Tendon rupture (rare)'],
    pregnancyCategory: 'C',
    interactions: [
      {
        drugId: 'MED-011',
        drugName: 'Warfarin',
        severity: 'Moderate',
        effect: 'Enhanced anticoagulation',
        mechanism: 'CYP450 enzyme inhibition',
        recommendation: 'Monitor INR, consider dose reduction'
      }
    ]
  },

  // ANTIHYPERTENSIVES
  {
    id: 'MED-005',
    name: 'Lisinopril',
    genericName: 'Lisinopril',
    category: MedicationCategory.ANTIHYPERTENSIVE,
    commonDosages: ['5mg tablet', '10mg tablet', '20mg tablet', '10-40mg once daily'],
    contraindications: ['Pregnancy', 'Angioedema history', 'Bilateral renal artery stenosis'],
    sideEffects: ['Dry cough', 'Dizziness', 'Hyperkalemia'],
    pregnancyCategory: 'D',
    interactions: [
      {
        drugId: 'MED-016',
        drugName: 'Spironolactone',
        severity: 'Moderate',
        effect: 'Severe hyperkalemia risk',
        mechanism: 'Both drugs retain potassium',
        recommendation: 'Monitor potassium levels closely, reduce dose if K+ >5.5'
      }
    ]
  },
  {
    id: 'MED-006',
    name: 'Amlodipine',
    genericName: 'Amlodipine',
    category: MedicationCategory.ANTIHYPERTENSIVE,
    commonDosages: ['5mg tablet', '10mg tablet', '5-10mg once daily'],
    contraindications: ['Severe aortic stenosis'],
    sideEffects: ['Peripheral edema', 'Flushing', 'Headache'],
    pregnancyCategory: 'C',
    interactions: []
  },

  // ANALGESICS
  {
    id: 'MED-007',
    name: 'Paracetamol',
    genericName: 'Acetaminophen',
    category: MedicationCategory.ANALGESIC,
    commonDosages: ['500mg tablet', '500-1000mg every 4-6 hours (max 4g/day)'],
    contraindications: ['Severe hepatic impairment'],
    sideEffects: ['Rare at therapeutic doses', 'Hepatotoxicity (overdose)'],
    pregnancyCategory: 'B',
    interactions: [
      {
        drugId: 'MED-011',
        drugName: 'Warfarin',
        severity: 'Minor',
        effect: 'Slight increase in INR with chronic high-dose use',
        mechanism: 'Unknown',
        recommendation: 'Monitor INR if using >2g/day regularly'
      }
    ]
  },
  {
    id: 'MED-008',
    name: 'Ibuprofen',
    genericName: 'Ibuprofen',
    category: MedicationCategory.ANALGESIC,
    commonDosages: ['200mg tablet', '400mg tablet', '400mg TID with food'],
    contraindications: ['Active PUD', 'Severe heart failure', 'Third trimester pregnancy'],
    sideEffects: ['GI upset', 'Bleeding risk', 'Renal impairment'],
    pregnancyCategory: 'C',
    interactions: [
      {
        drugId: 'MED-005',
        drugName: 'Lisinopril',
        severity: 'Moderate',
        effect: 'Reduced antihypertensive effect, increased renal toxicity',
        mechanism: 'Inhibits prostaglandin-mediated vasodilation',
        recommendation: 'Monitor BP and renal function, use lowest effective dose'
      },
      {
        drugId: 'MED-011',
        drugName: 'Warfarin',
        severity: 'Severe',
        effect: 'Significantly increased bleeding risk',
        mechanism: 'Platelet inhibition + anticoagulation',
        recommendation: 'Avoid combination. Use paracetamol instead.'
      }
    ]
  },

  // ANTIDIABETICS
  {
    id: 'MED-009',
    name: 'Metformin',
    genericName: 'Metformin HCl',
    category: MedicationCategory.ANTIDIABETIC,
    commonDosages: ['500mg tablet', '850mg tablet', '1000mg BID with meals'],
    contraindications: ['eGFR <30', 'Severe hepatic disease', 'Alcoholism'],
    sideEffects: ['Diarrhea', 'Nausea', 'Lactic acidosis (rare)'],
    pregnancyCategory: 'B',
    interactions: []
  },
  {
    id: 'MED-010',
    name: 'Glibenclamide',
    genericName: 'Glyburide',
    category: MedicationCategory.ANTIDIABETIC,
    commonDosages: ['5mg tablet', '2.5-10mg once daily before breakfast'],
    contraindications: ['Type 1 diabetes', 'Severe renal/hepatic disease'],
    sideEffects: ['Hypoglycemia', 'Weight gain', 'Rash'],
    pregnancyCategory: 'C',
    interactions: [
      {
        drugId: 'MED-011',
        drugName: 'Warfarin',
        severity: 'Moderate',
        effect: 'Enhanced hypoglycemic effect and altered INR',
        mechanism: 'CYP2C9 competition',
        recommendation: 'Monitor glucose and INR closely'
      }
    ]
  },

  // CARDIOVASCULAR
  {
    id: 'MED-011',
    name: 'Warfarin',
    genericName: 'Warfarin Sodium',
    category: MedicationCategory.CARDIOVASCULAR,
    commonDosages: ['2mg tablet', '5mg tablet', 'Dose varies (INR-guided)'],
    contraindications: ['Active bleeding', 'Pregnancy', 'Severe hepatic disease'],
    sideEffects: ['Bleeding', 'Bruising', 'Hair loss'],
    pregnancyCategory: 'X',
    interactions: [] // Reverse interactions handled above
  },
  {
    id: 'MED-012',
    name: 'Atorvastatin',
    genericName: 'Atorvastatin',
    category: MedicationCategory.CARDIOVASCULAR,
    commonDosages: ['10mg tablet', '20mg tablet', '40mg tablet', '10-80mg once daily'],
    contraindications: ['Active liver disease', 'Pregnancy'],
    sideEffects: ['Myalgia', 'Elevated liver enzymes', 'Rhabdomyolysis (rare)'],
    pregnancyCategory: 'X',
    interactions: []
  },

  // RESPIRATORY
  {
    id: 'MED-013',
    name: 'Salbutamol',
    genericName: 'Albuterol',
    category: MedicationCategory.RESPIRATORY,
    commonDosages: ['100mcg inhaler', '2 puffs every 4-6 hours PRN'],
    contraindications: ['Tachyarrhythmias'],
    sideEffects: ['Tremor', 'Tachycardia', 'Headache'],
    pregnancyCategory: 'C',
    interactions: []
  },
  {
    id: 'MED-014',
    name: 'Prednisolone',
    genericName: 'Prednisolone',
    category: MedicationCategory.RESPIRATORY,
    commonDosages: ['5mg tablet', '10mg tablet', '5-60mg daily (dose varies)'],
    contraindications: ['Systemic fungal infection'],
    sideEffects: ['Hyperglycemia', 'Weight gain', 'Immunosuppression', 'Osteoporosis'],
    pregnancyCategory: 'C',
    interactions: []
  },

  // Additional important drugs
  {
    id: 'MED-015',
    name: 'Amiodarone',
    genericName: 'Amiodarone HCl',
    category: MedicationCategory.CARDIOVASCULAR,
    commonDosages: ['200mg tablet', '200mg once daily (after loading)'],
    contraindications: ['Sinus bradycardia', 'AV block', 'Thyroid disorders'],
    sideEffects: ['Pulmonary fibrosis', 'Thyroid dysfunction', 'Corneal deposits'],
    pregnancyCategory: 'D',
    interactions: [
      {
        drugId: 'MED-011',
        drugName: 'Warfarin',
        severity: 'Severe',
        effect: 'Dramatically increased INR, bleeding risk',
        mechanism: 'CYP450 inhibition',
        recommendation: 'Reduce warfarin dose by 30-50%, monitor INR every 2-3 days initially'
      }
    ]
  },
  {
    id: 'MED-016',
    name: 'Spironolactone',
    genericName: 'Spironolactone',
    category: MedicationCategory.CARDIOVASCULAR,
    commonDosages: ['25mg tablet', '50mg tablet', '25-100mg once daily'],
    contraindications: ['Hyperkalemia', 'Severe renal failure'],
    sideEffects: ['Hyperkalemia', 'Gynecomastia', 'Menstrual irregularities'],
    pregnancyCategory: 'C',
    interactions: [] // Reverse interaction with ACE-I handled above
  }
];

/**
 * Search medications by name (fuzzy matching)
 */
export const searchMedications = (query: string): Medication[] => {
  const lowerQuery = query.toLowerCase();
  return MEDICATION_DATABASE.filter(med =>
    med.name.toLowerCase().includes(lowerQuery) ||
    med.genericName.toLowerCase().includes(lowerQuery)
  ).slice(0, 10); // Limit to 10 results
};

/**
 * Get medication by ID
 */
export const getMedicationById = (id: string): Medication | undefined => {
  return MEDICATION_DATABASE.find(med => med.id === id);
};

/**
 * Get medications by category
 */
export const getMedicationsByCategory = (category: MedicationCategory): Medication[] => {
  return MEDICATION_DATABASE.filter(med => med.category === category);
};

/**
 * Get all medication categories
 */
export const getAllCategories = (): MedicationCategory[] => {
  return Object.values(MedicationCategory);
};
