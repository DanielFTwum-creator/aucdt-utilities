// Class 4 Mathematics Assessments Data

export const ASSESSMENTS_DATA = [
  {
    id: 'assessment-num-ops',
    title: 'Number Operations Test',
    description: 'Test your understanding of addition and subtraction',
    strand: 'number-operations',
    status: 'completed',
    type: 'strand-assessment',
    questions: 15,
    duration: '30 minutes',
    points: 150,
    passScore: 70
  },
  {
    id: 'assessment-geometry',
    title: 'Geometry Shapes Quiz',
    description: 'Identify 2D and 3D shapes',
    strand: 'geometry',
    status: 'available',
    type: 'strand-assessment',
    questions: 10,
    duration: '20 minutes',
    points: 100,
    passScore: 70
  },
  {
    id: 'assessment-algebra',
    title: 'Patterns & Sequences',
    description: 'Find and create number patterns',
    strand: 'algebra',
    status: 'locked',
    type: 'strand-assessment',
    questions: 12,
    duration: '25 minutes',
    points: 120,
    passScore: 70,
    prerequisite: 'assessment-geometry'
  },
  {
    id: 'assessment-data',
    title: 'Data Handling Quiz',
    description: 'Read and create simple graphs',
    strand: 'data-handling',
    status: 'locked',
    type: 'strand-assessment',
    questions: 8,
    duration: '20 minutes',
    points: 80,
    passScore: 70,
    prerequisite: 'assessment-algebra'
  },
  {
    id: 'assessment-mid-term',
    title: 'Mid-term Assessment',
    description: 'Comprehensive test covering all strands',
    strand: 'all',
    status: 'locked',
    type: 'comprehensive',
    questions: 30,
    duration: '60 minutes',
    points: 300,
    passScore: 75,
    prerequisites: ['assessment-num-ops', 'assessment-geometry']
  },
  {
    id: 'assessment-final',
    title: 'Final Year Assessment',
    description: 'Complete end-of-year assessment',
    strand: 'all',
    status: 'locked',
    type: 'comprehensive',
    questions: 50,
    duration: '90 minutes',
    points: 500,
    passScore: 80,
    prerequisites: ['assessment-mid-term']
  }
]

// Quiz questions for the daily quick quiz
export const QUIZ_QUESTIONS = {
  'daily-quiz': [
    {
      id: 1,
      question: 'What is 245 + 367?',
      options: ['512', '602', '612', '702'],
      correct: 2,
      explanation: '245 + 367 = 612'
    },
    {
      id: 2,
      question: 'Which shape has 4 equal sides?',
      options: ['Circle', 'Triangle', 'Square', 'Rectangle'],
      correct: 2,
      explanation: 'A square has 4 equal sides and 4 equal angles'
    },
    {
      id: 3,
      question: 'Continue the pattern: 2, 4, 6, 8, __',
      options: ['9', '10', '11', '12'],
      correct: 1,
      explanation: 'This is the pattern of even numbers: 2, 4, 6, 8, 10'
    },
    {
      id: 4,
      question: 'What is 48 ÷ 6?',
      options: ['6', '7', '8', '9'],
      correct: 2,
      explanation: '48 ÷ 6 = 8 because 6 × 8 = 48'
    },
    {
      id: 5,
      question: 'How many sides does a triangle have?',
      options: ['2', '3', '4', '5'],
      correct: 1,
      explanation: 'A triangle always has 3 sides'
    }
  ],
  'assessment-num-ops': [
    {
      id: 1,
      question: 'Write 4,567 in words',
      options: [
        'Four thousand five hundred sixty-seven',
        'Four thousand five hundred seventy-six',
        'Four thousand six hundred fifty-seven',
        'Four thousand seven hundred sixty-five'
      ],
      correct: 0
    },
    {
      id: 2,
      question: 'What is the value of the digit 7 in 6,732?',
      options: ['7', '70', '700', '7,000'],
      correct: 1
    },
    {
      id: 3,
      question: 'Compare: 3,456 _____ 3,465',
      options: ['>', '<', '=', 'Cannot determine'],
      correct: 1
    },
    // Add more questions...
  ],
  'assessment-geometry': [
    {
      id: 1,
      question: 'Which of these is a 3D shape?',
      options: ['Square', 'Circle', 'Cube', 'Triangle'],
      correct: 2
    },
    {
      id: 2,
      question: 'How many faces does a cube have?',
      options: ['4', '6', '8', '12'],
      correct: 1
    },
    {
      id: 3,
      question: 'What do we use to measure length?',
      options: ['Scale', 'Ruler', 'Clock', 'Thermometer'],
      correct: 1
    },
    // Add more questions...
  ]
}

// Assessment results tracking
export const ASSESSMENT_RESULTS = {
  'assessment-num-ops': {
    score: 85,
    totalQuestions: 15,
    correctAnswers: 13,
    timeSpent: 25 * 60, // in seconds
    completedAt: new Date('2025-12-05'),
    passed: true
  },
  'daily-quiz': {
    score: 100,
    totalQuestions: 5,
    correctAnswers: 5,
    timeSpent: 3 * 60, // in seconds
    completedAt: new Date('2025-12-06'),
    passed: true
  }
}