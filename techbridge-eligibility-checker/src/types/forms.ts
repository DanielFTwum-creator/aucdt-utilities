export type ProgramType = 'First Degree' | 'Diploma' | 'Certificate'

export type ProgrammeType = 
  | 'Jewellery Design Technology'
  | 'Fashion Design Technology'
  | 'Digital Media & Communication Design'
  | 'Product Design & Entrepreneurship'

export type ProgrammeCode = 'JDT' | 'FDT' | 'DMCD' | 'PDE'

export interface ProgrammeInfo {
  code: ProgrammeCode
  name: ProgrammeType
  fullName: string
  availableLevels: ProgramType[]
}

export type ExaminationType = 
  | 'WASSCE' 
  | 'SSSCE' 
  | 'GBCE' 
  | 'GCE Advanced Level' 
  | 'HND' 
  | 'Mature Student'

export interface GradeData {
  english: string
  mathematics: string
  science: string
  elective1: string
  elective2: string
  elective3: string
}

export interface GCEAdvancedData {
  aLevelPasses: number
  gradeDOrBetter: boolean
  oLevelPasses: number
  oLevelEnglish: boolean
  oLevelMath: boolean
  oLevelScience: boolean
}

export interface HNDData {
  class: string
}

export interface MatureStudentData {
  dateOfBirth: string
  entranceExam: boolean
}

export interface FormData {
  programme: ProgrammeType | ''
  programType: ProgramType
  examinationType: ExaminationType
  grades: GradeData
  gceAdvanced: GCEAdvancedData
  hnd: HNDData
  matureStudent: MatureStudentData
}

export interface EligibilityResult {
  eligible: boolean
  message: string
  details: string[]
}
