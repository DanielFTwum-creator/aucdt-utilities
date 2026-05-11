import { useState } from 'react'
import { FormData } from '../types/forms'
import EligibilityResult from './EligibilityResult'
import ErrorModal from './ErrorModal'
import ExaminationTypeSelection from './ExaminationTypeSelection'
import GCEAdvancedLevelForm from './GCEAdvancedLevelForm'
import HNDForm from './HNDForm'
import MatureStudentForm from './MatureStudentForm'
import ProgrammeSelection from './ProgrammeSelection'
import ProgramSelection from './ProgramSelection'
import SubjectGradesForm from './SubjectGradesForm'

const EligibilityChecker = () => {
  const [formData, setFormData] = useState<FormData>({
    programme: '',
    programType: 'First Degree',
    examinationType: 'WASSCE',
    grades: {
      english: '',
      mathematics: '',
      science: '',
      elective1: '',
      elective2: '',
      elective3: ''
    },
    gceAdvanced: {
      aLevelPasses: 0,
      gradeDOrBetter: false,
      oLevelPasses: 0,
      oLevelEnglish: false,
      oLevelMath: false,
      oLevelScience: false
    },
    hnd: {
      class: ''
    },
    matureStudent: {
      dateOfBirth: '',
      entranceExam: false
    }
  })

  const [showResult, setShowResult] = useState(false)
  const [eligibilityResult, setEligibilityResult] = useState<{
    eligible: boolean
    message: string
    details: string[]
  }>({ eligible: false, message: '', details: [] })
  
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      }
      
      // If programme is changed, validate that the current program type is available
      if (field === 'programme' && value) {
        const programmes = [
          { name: 'Jewellery Design Technology', availableLevels: ['First Degree', 'Diploma', 'Certificate'] },
          { name: 'Fashion Design Technology', availableLevels: ['First Degree', 'Certificate'] },
          { name: 'Digital Media & Communication Design', availableLevels: ['First Degree', 'Certificate'] },
          { name: 'Product Design & Entrepreneurship', availableLevels: ['First Degree', 'Certificate'] }
        ]
        
        const selectedProgramme = programmes.find(p => p.name === value)
        if (selectedProgramme && !selectedProgramme.availableLevels.includes(prev.programType)) {
          // Reset to the first available level if current selection is not available
          newData.programType = selectedProgramme.availableLevels[0] as any
        }
      }
      
      return newData
    })
  }

  const updateNestedFormData = (section: keyof FormData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: value
      }
    }))
  }

  const checkEligibility = () => {
    // Validate that programme is selected
    if (!formData.programme || formData.programme.trim() === '') {
      setErrorMessage('Please select a programme before checking eligibility.')
      setShowErrorModal(true)
      return
    }
    
    const result = calculateEligibility(formData)
    setEligibilityResult(result)
    setShowResult(true)
  }

  const resetForm = () => {
    setShowResult(false)
    setFormData({
      programme: '',
      programType: 'First Degree',
      examinationType: 'WASSCE',
      grades: {
        english: '',
        mathematics: '',
        science: '',
        elective1: '',
        elective2: '',
        elective3: ''
      },
      gceAdvanced: {
        aLevelPasses: 0,
        gradeDOrBetter: false,
        oLevelPasses: 0,
        oLevelEnglish: false,
        oLevelMath: false,
        oLevelScience: false
      },
      hnd: {
        class: ''
      },
      matureStudent: {
        dateOfBirth: '',
        entranceExam: false
      }
    })
  }

  const renderConditionalForm = () => {
    switch (formData.examinationType) {
      case 'WASSCE':
      case 'SSSCE':
      case 'GBCE':
        return (
          <SubjectGradesForm
            grades={formData.grades}
            examinationType={formData.examinationType}
            onChange={(field, value) => updateNestedFormData('grades', field, value)}
          />
        )
      case 'GCE Advanced Level':
        return (
          <GCEAdvancedLevelForm
            data={formData.gceAdvanced}
            onChange={(field, value) => updateNestedFormData('gceAdvanced', field, value)}
          />
        )
      case 'HND':
        return (
          <HNDForm
            data={formData.hnd}
            onChange={(field, value) => updateNestedFormData('hnd', field, value)}
          />
        )
      case 'Mature Student':
        return (
          <MatureStudentForm
            data={formData.matureStudent}
            onChange={(field, value) => updateNestedFormData('matureStudent', field, value)}
          />
        )
      default:
        return null
    }
  }

  if (showResult) {
    return (
      <EligibilityResult
        result={eligibilityResult}
        onReset={resetForm}
      />
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Main Form */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-8">
        {/* Section 1: Programme Selection */}
        <ProgrammeSelection
          programme={formData.programme}
          onProgrammeChange={(value) => updateFormData('programme', value)}
        />

        {/* Section 2: Admission Type Selection */}
        <div className="mb-8">
          <ProgramSelection
            selectedProgram={formData.programType}
            selectedProgramme={formData.programme}
            onChange={(value) => updateFormData('programType', value)}
          />
        </div>

        {/* Section 3: Examination Type Selection */}
        <div className="mb-8">
          <ExaminationTypeSelection
            selectedType={formData.examinationType}
            programType={formData.programType}
            onChange={(value) => updateFormData('examinationType', value)}
          />
        </div>

        {/* Section 4: Conditional Forms */}
        <div className="mb-8">
          {renderConditionalForm()}
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            onClick={checkEligibility}
            aria-label="Check eligibility based on entered information"
            className="bg-red-800 hover:bg-red-900 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Check Eligibility
          </button>
        </div>
      </div>

      {/* Error Modal */}
      <ErrorModal
        isOpen={showErrorModal}
        message={errorMessage}
        onClose={() => setShowErrorModal(false)}
      />
    </div>
  )
}

// Eligibility calculation logic
const calculateEligibility = (data: FormData) => {
  const details: string[] = []
  let eligible = false
  let message = ''

  // Check program-specific examination type restrictions
  if (data.programType === 'Diploma' && 
      ['GBCE', 'GCE Advanced Level', 'HND', 'Mature Student'].includes(data.examinationType)) {
    return {
      eligible: false,
      message: 'Not Eligible',
      details: [`${data.examinationType} is only available for First Degree programmes.`]
    }
  }

  switch (data.examinationType) {
    case 'WASSCE':
      return calculateWASSCEEligibility(data.grades, details)
    case 'SSSCE':
      return calculateSSSCEEligibility(data.grades, details)
    case 'GBCE':
      return calculateGBCEEligibility(data.grades, details)
    case 'GCE Advanced Level':
      return calculateGCEAdvancedEligibility(data.gceAdvanced, details)
    case 'HND':
      return calculateHNDEligibility(data.hnd, details)
    case 'Mature Student':
      return calculateMatureStudentEligibility(data.matureStudent, details)
    default:
      return {
        eligible: false,
        message: 'Please select an examination type',
        details: []
      }
  }
}

const calculateWASSCEEligibility = (grades: any, details: string[]) => {
  const creditPasses = ['A1', 'B2', 'B3', 'C4', 'C5', 'C6']
  const coreSubjects = [grades.english, grades.mathematics, grades.science]
  const electiveSubjects = [grades.elective1, grades.elective2, grades.elective3].filter(g => g)

  // Check core subjects
  const coreCredits = coreSubjects.filter(grade => creditPasses.includes(grade)).length
  const electiveCredits = electiveSubjects.filter(grade => creditPasses.includes(grade)).length
  const totalCredits = coreCredits + electiveCredits

  details.push(`Core subjects with credit passes: ${coreCredits}/3`)
  details.push(`Elective subjects with credit passes: ${electiveCredits}/${electiveSubjects.length}`)
  details.push(`Total credit passes: ${totalCredits}`)

  if (coreCredits === 3 && totalCredits >= 6) {
    return {
      eligible: true,
      message: 'Congratulations! You are eligible for admission.',
      details: [...details, 'You meet all requirements for WASSCE entry.']
    }
  } else {
    const missing = []
    if (coreCredits < 3) missing.push('All three core subjects must have credit passes')
    if (totalCredits < 6) missing.push('You need at least 6 total credit passes')
    
    return {
      eligible: false,
      message: 'Sorry, you do not meet the eligibility requirements.',
      details: [...details, ...missing]
    }
  }
}

const calculateSSSCEEligibility = (grades: any, details: string[]) => {
  const creditPasses = ['A', 'B', 'C', 'D']
  const coreSubjects = [grades.english, grades.mathematics, grades.science]
  const electiveSubjects = [grades.elective1, grades.elective2, grades.elective3].filter(g => g)

  const coreCredits = coreSubjects.filter(grade => creditPasses.includes(grade)).length
  const electiveCredits = electiveSubjects.filter(grade => creditPasses.includes(grade)).length
  const totalCredits = coreCredits + electiveCredits

  details.push(`Core subjects with credit passes: ${coreCredits}/3`)
  details.push(`Elective subjects with credit passes: ${electiveCredits}/${electiveSubjects.length}`)
  details.push(`Total credit passes: ${totalCredits}`)

  if (coreCredits === 3 && totalCredits >= 6) {
    return {
      eligible: true,
      message: 'Congratulations! You are eligible for admission.',
      details: [...details, 'You meet all requirements for SSSCE entry.']
    }
  } else {
    const missing = []
    if (coreCredits < 3) missing.push('All three core subjects must have credit passes')
    if (totalCredits < 6) missing.push('You need at least 6 total credit passes')
    
    return {
      eligible: false,
      message: 'Sorry, you do not meet the eligibility requirements.',
      details: [...details, ...missing]
    }
  }
}

const calculateGBCEEligibility = (grades: any, details: string[]) => {
  // GBCE follows similar pattern to WASSCE
  return calculateWASSCEEligibility(grades, details)
}

const calculateGCEAdvancedEligibility = (data: any, details: string[]) => {
  details.push(`A-Level passes: ${data.aLevelPasses}`)
  details.push(`Grade D or better: ${data.gradeDOrBetter ? 'Yes' : 'No'}`)
  details.push(`O-Level credit passes: ${data.oLevelPasses}`)
  
  const requirements = [
    data.aLevelPasses >= 2,
    data.gradeDOrBetter,
    data.oLevelPasses >= 5,
    data.oLevelEnglish,
    data.oLevelMath,
    data.oLevelScience
  ]

  if (requirements.every(req => req)) {
    return {
      eligible: true,
      message: 'Congratulations! You are eligible for admission.',
      details: [...details, 'You meet all requirements for GCE Advanced Level entry.']
    }
  } else {
    const missing = []
    if (data.aLevelPasses < 2) missing.push('You need at least 2 A-Level passes')
    if (!data.gradeDOrBetter) missing.push('You need at least one Grade D or better')
    if (data.oLevelPasses < 5) missing.push('You need at least 5 O-Level credit passes')
    if (!data.oLevelEnglish) missing.push('You need O-Level English credit')
    if (!data.oLevelMath) missing.push('You need O-Level Mathematics credit')
    if (!data.oLevelScience) missing.push('You need O-Level Science/Arts credit')
    
    return {
      eligible: false,
      message: 'Sorry, you do not meet the eligibility requirements.',
      details: [...details, ...missing]
    }
  }
}

const calculateHNDEligibility = (data: any, details: string[]) => {
  details.push(`HND Class: ${data.class}`)

  if (data.class && data.class !== '') {
    return {
      eligible: true,
      message: 'Congratulations! You are eligible for admission.',
      details: [...details, `Your ${data.class} HND qualifies you for admission.`]
    }
  } else {
    return {
      eligible: false,
      message: 'Please select your HND class.',
      details: [...details, 'HND class selection is required.']
    }
  }
}

const calculateMatureStudentEligibility = (data: any, details: string[]) => {
  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string): number => {
    if (!dateOfBirth || dateOfBirth.trim() === '') return 0
    
    try {
      const today = new Date()
      const birthDate = new Date(dateOfBirth)
      
      // Check if the date is valid
      if (isNaN(birthDate.getTime())) return 0
      
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      
      return Math.max(0, age) // Ensure non-negative age
    } catch (error) {
      console.error('Error calculating age:', error)
      return 0
    }
  }

  const currentAge = calculateAge(data.dateOfBirth)
  
  details.push(`Date of Birth: ${data.dateOfBirth}`)
  details.push(`Calculated Age: ${currentAge} years`)
  details.push(`Willing to take entrance exam: ${data.entranceExam ? 'Yes' : 'No'}`)

  const requirements = [
    currentAge >= 25,
    data.entranceExam
  ]

  if (requirements.every(req => req)) {
    return {
      eligible: true,
      message: 'Congratulations! You are eligible for admission.',
      details: [...details, 'You meet all requirements for mature student entry.']
    }
  } else {
    const missing = []
    if (currentAge < 25) missing.push('You must be at least 25 years old')
    if (!data.entranceExam) missing.push('You must be willing to take an entrance examination')
    
    return {
      eligible: false,
      message: 'Sorry, you do not meet the eligibility requirements.',
      details: [...details, ...missing]
    }
  }
}

export default EligibilityChecker
