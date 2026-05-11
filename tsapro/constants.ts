import { StepCodeData } from './types';

export const SSNIT_RATE = 0.055;
export const SSNIT_TIER1_CAP = 42000; // Annual cap for SSNIT contribution calculation

// PAYE Annual Bands based on Ghana Revenue Authority 2025 monthly data.
// This structure defines the width of each income band for a clearer progressive calculation.
// Monthly bands: First 490, Next 110, Next 130, Next 3166.67, etc.
export const PAYE_ANNUAL_BANDS_2025 = [
  { width: 5880, rate: 0 },         // 490 * 12
  { width: 1320, rate: 0.05 },      // 110 * 12
  { width: 1560, rate: 0.10 },      // 130 * 12
  { width: 38000.04, rate: 0.175 }, // 3166.67 * 12
  { width: 192000, rate: 0.25 },    // 16000 * 12
  { width: 366240, rate: 0.30 },    // 30520 * 12
  { width: Infinity, rate: 0.35 }
];

export const STUDENT_LOAN_RATE = 0.05; // 5% deduction on taxable income if applicable, as per SRS

// This data is now the single source of truth, derived from the official salary data sheet.
// UPDATED: Validated against ASANSKA UNIVERSITY COLLEGE SALARY SCALE (01/07/2024)
export const STEP_CODES: StepCodeData[] = [
    // SM0101/2 -> PDF Step 2: 54,655.42 (Was 55,727.09 which is Step 3)
    { empCode: 'Emp1', code: 'SM0101/2', status: 'President', annualSalary: 54655.42, allowance: 6176.12, isSsnitExempt: true, netSalaryInSheet: 8449.56, studentLoanInSheet: null },
    
    // SM0102/7 -> PDF Step 7: 48,696.61 (Matched)
    { empCode: 'Emp2', code: 'SM0102/7', status: 'Vice-President', annualSalary: 48696.61, allowance: 4396.44, isSsnitExempt: true, netSalaryInSheet: 6742.37, studentLoanInSheet: null },
    
    // SM0102/7 -> PDF Step 7: 48,696.61 (Matched)
    { empCode: 'Emp3', code: 'SM0102/7', status: 'SA to Founder', annualSalary: 48696.61, allowance: 4396.44, isSsnitExempt: true, netSalaryInSheet: 6742.37, studentLoanInSheet: null },
    
    // SM0106/8 -> PDF Step 8: 26,371.43 (Was 37,609.11 which is SM0104 Step 1. Updated to match Code.)
    { empCode: 'Emp30', code: 'SM0106/8', status: 'Registrar', annualSalary: 26371.43, allowance: 2451.59, isSsnitExempt: false, netSalaryInSheet: 3797.76, studentLoanInSheet: null },
    
    // SM0104/2 -> PDF Step 2: 38,361.29 (Matched)
    { empCode: 'Emp4', code: 'SM0104/2', status: 'Senior Lecturer (HoD)', annualSalary: 38361.29, allowance: 3008.23, isSsnitExempt: false, netSalaryInSheet: 4923.38, studentLoanInSheet: null },
    
    // SM0105/4 -> PDF Step 4: 29,133.11 (Matched)
    { empCode: 'Emp5', code: 'SM0105/4', status: 'Lecturer', annualSalary: 29133.11, allowance: 2470.12, isSsnitExempt: false, netSalaryInSheet: 3974.76, studentLoanInSheet: null },
    
    // SS0102/6 -> PDF Step 6: 25,532.80 (Matched)
    { empCode: 'Emp6', code: 'SS0102/6', status: 'Machnist', annualSalary: 25532.80, allowance: 1288.32, isSsnitExempt: true, netSalaryInSheet: 2927.49, studentLoanInSheet: null },
    
    // SM0105/3 -> PDF Step 3: 28,561.87 (Was 28,001.83 which is Step 2. Updated to match Code.)
    { empCode: 'Emp7', code: 'SM0105/3', status: 'Lecturer', annualSalary: 28561.87, allowance: 2342.92, isSsnitExempt: false, netSalaryInSheet: 3812.55, studentLoanInSheet: null },
    
    // SM0105/1 -> PDF Step 1: 27,452.78 (Matched)
    { empCode: 'Emp8', code: 'SM0105/1', status: 'Lecturer', annualSalary: 27452.78, allowance: 1927.65, isSsnitExempt: false, netSalaryInSheet: 3468.66, studentLoanInSheet: null },
    
    // SS0102/2 -> PDF Step 2: 23,588.36 (Matched)
    { empCode: 'Emp9', code: 'SS0102/2', status: 'Principal Technician', annualSalary: 23588.36, allowance: 1101.70, isSsnitExempt: false, netSalaryInSheet: 2250.66, studentLoanInSheet: 300.00 },
    
    // SM0105/2 -> PDF Step 2: 28,001.83 (Matched)
    { empCode: 'Emp10', code: 'SM0105/2', status: 'Lecturer (HoD)', annualSalary: 28001.83, allowance: 3217.45, isSsnitExempt: false, netSalaryInSheet: 4468.44, studentLoanInSheet: null },
    
    // SM0107/5 -> PDF Step 5: 23,230.01 (Was 23,230.00. Minor fix)
    { empCode: 'Emp11', code: 'SM0107/5', status: 'Teaching Assistant', annualSalary: 23230.01, allowance: 2082.52, isSsnitExempt: false, netSalaryInSheet: 3335.41, studentLoanInSheet: null },
    
    // SM0107/3 -> PDF Step 3: 22,327.96 (Matched)
    { empCode: 'Emp12', code: 'SM0107/3', status: 'Technical Instructor', annualSalary: 22327.96, allowance: 1197.25, isSsnitExempt: false, netSalaryInSheet: 2197.60, studentLoanInSheet: 350.00 },
    
    // SM0105/1 -> PDF Step 1: 27,452.78 (Matched)
    { empCode: 'Emp13', code: 'SM0105/1', status: 'Lecturer', annualSalary: 27452.78, allowance: 1927.65, isSsnitExempt: false, netSalaryInSheet: 3468.66, studentLoanInSheet: null },
    
    // SM0105/2 -> PDF Step 2: 28,001.83 (Matched)
    { empCode: 'Emp14', code: 'SM0105/2', status: 'Lecturer (HoD)', annualSalary: 28001.83, allowance: 3217.45, isSsnitExempt: false, netSalaryInSheet: 4468.44, studentLoanInSheet: null },
    
    // SS0104/5 -> PDF Step 5: 22,459.88 (Matched)
    { empCode: 'Emp15', code: 'SS0104/5', status: 'Software Engineer', annualSalary: 22459.88, allowance: 1211.50, isSsnitExempt: false, netSalaryInSheet: 2567.93, studentLoanInSheet: null },
    
    // SM0105/2 -> PDF Step 2: 28,001.83 (Matched)
    { empCode: 'Emp16', code: 'SM0105/2', status: 'Lecturer (HoD)', annualSalary: 28001.83, allowance: 3217.45, isSsnitExempt: false, netSalaryInSheet: 4468.44, studentLoanInSheet: null },
    
    // SM0105/2 -> PDF Step 2: 28,001.83 (Matched)
    { empCode: 'Emp17', code: 'SM0105/2', status: 'Lecturer', annualSalary: 28001.83, allowance: 2470.12, isSsnitExempt: false, netSalaryInSheet: 3907.95, studentLoanInSheet: null },
    
    // SM0105/2 (Note: Librarian usually SM0102, but code says SM0105) -> PDF Step 2: 28,001.83. (Was 30,916.28 which is Step 7)
    // Updated to match code SM0105/2.
    { empCode: 'Emp18', code: 'SM0105/2', status: 'Librarian', annualSalary: 28001.83, allowance: 2499.20, isSsnitExempt: false, netSalaryInSheet: 4101.89, studentLoanInSheet: null },
    
    // SM0105/2 -> PDF Step 2: 28,001.83 (Matched)
    { empCode: 'Emp19', code: 'SM0105/2', status: 'Lecturer', annualSalary: 28001.83, allowance: 2470.12, isSsnitExempt: false, netSalaryInSheet: 3907.95, studentLoanInSheet: null },
    
    // SM0107/2 -> PDF Step 2: 21,890.16 (Matched)
    { empCode: 'Emp20', code: 'SM0107/2', status: 'Technical Instructor', annualSalary: 21890.16, allowance: 1197.25, isSsnitExempt: false, netSalaryInSheet: 2519.16, studentLoanInSheet: null },
    
    // SM0107/3 -> PDF Step 3: 22,327.96 (Was 22,327.00. Updated)
    { empCode: 'Emp21', code: 'SM0107/3', status: 'Lecturer', annualSalary: 22327.96, allowance: 1282.60, isSsnitExempt: false, netSalaryInSheet: 2617.95, studentLoanInSheet: null },
    
    // SS0103/7 -> PDF Step 7: 23,938.33 (Matched)
    { empCode: 'Emp22', code: 'SS0103/7', status: 'Snr Acc. Assistant', annualSalary: 23938.33, allowance: 1632.85, isSsnitExempt: false, netSalaryInSheet: 3011.59, studentLoanInSheet: null },
    
    // SS0103/3 -> PDF Step 3: 22,115.31 (Matched)
    { empCode: 'Emp23', code: 'SS0103/3', status: 'Snr Admin. Assistant', annualSalary: 22115.31, allowance: 1192.04, isSsnitExempt: false, netSalaryInSheet: 2529.49, studentLoanInSheet: null },
    
    // SS0104/1 -> PDF Step 1: 20,156.62 (Matched)
    { empCode: 'Emp24', code: 'SS0104/1', status: 'Receptionist', annualSalary: 20156.62, allowance: 1197.35, isSsnitExempt: false, netSalaryInSheet: 2406.61, studentLoanInSheet: null },
    
    // JS0104/2 -> PDF Step 2: 6,123.81 (Matched)
    { empCode: 'Emp26', code: 'JS0104/2', status: 'Security Guard', annualSalary: 6123.81, allowance: 703.10, isSsnitExempt: false, netSalaryInSheet: 1087.16, studentLoanInSheet: null },
    
    // JS0104/2 -> PDF Step 2: 6,123.81 (Matched)
    { empCode: 'Emp27', code: 'JS0104/2', status: 'Labourer', annualSalary: 6123.81, allowance: 703.10, isSsnitExempt: true, netSalaryInSheet: 1110.32, studentLoanInSheet: null },
    
    // JS0104/2 -> PDF Step 2: 6,123.81 (Matched)
    { empCode: 'Emp28', code: 'JS0104/2', status: 'Labourer', annualSalary: 6123.81, allowance: 703.10, isSsnitExempt: true, netSalaryInSheet: 1110.32, studentLoanInSheet: null },
    
    // JS0104/2 -> PDF Step 2: 6,123.81 (Matched)
    { empCode: 'Emp29', code: 'JS0104/2', status: 'Janitor', annualSalary: 6123.81, allowance: 703.10, isSsnitExempt: false, netSalaryInSheet: 1087.16, studentLoanInSheet: null },
    
    // JS0104/2 -> PDF Step 2: 6,123.81 (Matched)
    { empCode: 'Emp31', code: 'JS0104/2', status: 'Janitor', annualSalary: 6123.81, allowance: 703.10, isSsnitExempt: true, netSalaryInSheet: 1110.32, studentLoanInSheet: null },
    
    // JS0104/2 -> PDF Step 2: 6,123.81 (Matched)
    { empCode: 'Emp32', code: 'JS0104/2', status: 'Janitor', annualSalary: 6123.81, allowance: 703.10, isSsnitExempt: false, netSalaryInSheet: 1087.16, studentLoanInSheet: null },
    
    // JS0104/2 -> PDF Step 2: 6,123.81 (Matched)
    { empCode: 'Emp33', code: 'JS0104/2', status: 'Janitor', annualSalary: 6123.81, allowance: 703.10, isSsnitExempt: false, netSalaryInSheet: 1087.16, studentLoanInSheet: null },
    
    // JS0104/2 -> PDF Step 2: 6,123.81 (Matched)
    { empCode: 'Emp34', code: 'JS0104/2', status: 'Janitor', annualSalary: 6123.81, allowance: 703.10, isSsnitExempt: false, netSalaryInSheet: 1087.16, studentLoanInSheet: null },
    
    // Emp35: PDF lists "Driver" under JS0103. Code should reflect this to match Salary 8374.42 (JS0103 Step 2).
    // UPDATED: Changed Code from JS0104/2 to JS0103/2.
    { empCode: 'Emp35', code: 'JS0103/2', status: 'Driver', annualSalary: 8374.42, allowance: 759.36, isSsnitExempt: false, netSalaryInSheet: 1279.80, studentLoanInSheet: null },
    
    // SM0106/8 -> PDF Step 8: 26,371.43 (Matched)
    { empCode: 'Emp36', code: 'SM0106/8', status: 'QA Officer', annualSalary: 26371.43, allowance: 1968.00, isSsnitExempt: false, netSalaryInSheet: 3435.06, studentLoanInSheet: null },
    
    // JS0104/2 -> PDF Step 2: 6,123.81 (Matched)
    { empCode: 'Emp37', code: 'JS0104/2', status: 'Janitor', annualSalary: 6123.81, allowance: 703.10, isSsnitExempt: false, netSalaryInSheet: 1087.16, studentLoanInSheet: null },
    
    // SS0104/1 -> PDF Step 1: 20,156.62 (Was .63)
    { empCode: 'EMP38', code: 'SS0104/1', status: 'IT Technician', annualSalary: 20156.62, allowance: 740.00, isSsnitExempt: false, netSalaryInSheet: 2029.30, studentLoanInSheet: null },
    
    // JS0104/2 -> PDF Step 2: 6,123.81 (Matched)
    { empCode: 'Emp39', code: 'JS0104/2', status: 'Security Guard', annualSalary: 6123.81, allowance: 703.10, isSsnitExempt: false, netSalaryInSheet: 1087.16, studentLoanInSheet: null },
    
    // JS0104/2 -> PDF Step 2: 6,123.81 (Matched)
    { empCode: 'Emp40', code: 'JS0104/2', status: 'Security Guard', annualSalary: 6123.81, allowance: 703.10, isSsnitExempt: false, netSalaryInSheet: 1087.16, studentLoanInSheet: null },
    
    // JS0104/2 -> PDF Step 2: 6,123.81 (Matched)
    { empCode: 'Emp41', code: 'JS0104/2', status: 'Security Guard', annualSalary: 6123.81, allowance: 703.10, isSsnitExempt: false, netSalaryInSheet: 1087.16, studentLoanInSheet: null },
    
    // JS0102/1 -> PDF Step 1: 8,712.75 (Matched)
    { empCode: 'Emp42', code: 'JS0102/1', status: 'Hostel Janitor', annualSalary: 8712.75, allowance: 1057.37, isSsnitExempt: false, netSalaryInSheet: 1547.64, studentLoanInSheet: null },
    
    // SS0104/1 -> PDF Step 1: 20,156.62 (Matched)
    { empCode: 'Emp43', code: 'SS0104/1', status: 'Library Assistant', annualSalary: 20156.62, allowance: 1197.11, isSsnitExempt: false, netSalaryInSheet: 2406.42, studentLoanInSheet: null },
    
    // SS0104/1 -> PDF Step 1: 20,156.62 (Matched)
    { empCode: 'Emp44', code: 'SS0104/1', status: 'Estate Officer', annualSalary: 20156.62, allowance: 1197.11, isSsnitExempt: false, netSalaryInSheet: 2406.42, studentLoanInSheet: null }
];


export const DEFAULT_PASSWORD = '%oyibi%ghana+';
export const MIN_PASSWORD_LENGTH = 8;