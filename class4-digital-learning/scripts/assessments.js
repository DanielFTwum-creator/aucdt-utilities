// Golden Mathematics Class 4 - Assessments Module
class AssessmentsModule {
    constructor(app) {
        this.app = app;
        this.currentAssessment = null;
        this.assessmentTypes = {
            'quick-quiz': {
                name: 'Quick Quiz',
                timeLimit: 5,
                totalQuestions: 5,
                points: 25
            },
            'number-operations': {
                name: 'Number Operations Test',
                timeLimit: 30,
                totalQuestions: 15,
                points: 75
            },
            'algebra': {
                name: 'Algebra Patterns Test',
                timeLimit: 20,
                totalQuestions: 10,
                points: 50
            },
            'geometry': {
                name: 'Geometry Test',
                timeLimit: 25,
                totalQuestions: 12,
                points: 60
            },
            'data-handling': {
                name: 'Data Handling Test',
                timeLimit: 20,
                totalQuestions: 10,
                points: 50
            }
        };
    }
    
    startAssessment(assessmentType, assessmentId = null) {
        const assessment = this.assessmentTypes[assessmentType] || this.assessmentTypes['quick-quiz'];
        
        if (assessmentId) {
            const detailedAssessment = this.getAssessmentDetails(assessmentType, assessmentId);
            Object.assign(assessment, detailedAssessment);
        }
        
        this.currentAssessment = {
            type: assessmentType,
            data: assessment,
            questions: this.generateQuestions(assessmentType),
            currentQuestion: 0,
            answers: [],
            startTime: Date.now(),
            isCompleted: false
        };
        
        this.showAssessmentInterface();
    }
    
    getAssessmentDetails(type, id) {
        const detailedAssessments = {
            'quick-quiz': {
                id: 'quick-001',
                title: 'Daily Quick Quiz',
                description: 'Practice today\'s lessons',
                completed: false,
                score: null
            },
            'number-operations': {
                id: 'num-assess-001',
                title: 'Number Operations Test',
                description: 'Comprehensive test on number operations',
                completed: true,
                score: 85
            },
            'geometry': {
                id: 'geo-assess-001',
                title: 'Geometry Shapes Quiz',
                description: 'Identify 2D and 3D shapes',
                completed: false,
                score: null
            }
        };
        
        return detailedAssessments[type] || {};
    }
    
    generateQuestions(assessmentType) {
        const questionBanks = {
            'quick-quiz': this.getQuickQuizQuestions(),
            'number-operations': this.getNumberOperationsQuestions(),
            'algebra': this.getAlgebraQuestions(),
            'geometry': this.getGeometryQuestions(),
            'data-handling': this.getDataHandlingQuestions()
        };
        
        return questionBanks[assessmentType] || [];
    }
    
    getQuickQuizQuestions() {
        return [
            {
                id: 1,
                question: 'What comes after 999?',
                options: ['1000', '999', '1001', '9999'],
                correct: 0,
                explanation: 'After 999 comes 1000, which is one thousand.',
                difficulty: 'easy',
                strand: 'number-operations'
            },
            {
                id: 2,
                question: 'In the number 2,345, what digit is in the hundreds place?',
                options: ['2', '3', '4', '5'],
                correct: 1,
                explanation: 'In 2,345, the hundreds place has the digit 3.',
                difficulty: 'easy',
                strand: 'number-operations'
            },
            {
                id: 3,
                question: 'What shape has 3 sides?',
                options: ['Square', 'Triangle', 'Circle', 'Rectangle'],
                correct: 1,
                explanation: 'A triangle has exactly 3 sides and 3 corners.',
                difficulty: 'easy',
                strand: 'geometry'
            },
            {
                id: 4,
                question: 'Complete the pattern: 2, 4, 6, 8, ___',
                options: ['9', '10', '11', '12'],
                correct: 1,
                explanation: 'This pattern increases by 2 each time: 2, 4, 6, 8, 10',
                difficulty: 'easy',
                strand: 'algebra'
            },
            {
                id: 5,
                question: '25 + 18 = ?',
                options: ['43', '42', '44', '41'],
                correct: 0,
                explanation: '25 + 18 = 43. You can add 20 + 10 = 30, then 5 + 8 = 13, so 30 + 13 = 43.',
                difficulty: 'medium',
                strand: 'number-operations'
            }
        ];
    }
    
    getNumberOperationsQuestions() {
        return [
            {
                id: 1,
                question: 'What is the place value of 5 in 3,456?',
                options: ['Ones', 'Tens', 'Hundreds', 'Thousands'],
                correct: 1,
                explanation: 'In 3,456, the 5 is in the tens place.',
                difficulty: 'easy',
                strand: 'number-operations'
            },
            {
                id: 2,
                question: 'Calculate: 456 + 289',
                options: ['735', '745', '725', '755'],
                correct: 1,
                explanation: '456 + 289 = 745. Add: 400 + 200 = 600, 50 + 80 = 130, 6 + 9 = 15, so 600 + 130 + 15 = 745.',
                difficulty: 'medium',
                strand: 'number-operations'
            },
            {
                id: 3,
                question: 'Which number is greater: 1,234 or 1,243?',
                options: ['1,234', '1,243', 'They are equal', 'Cannot be determined'],
                correct: 1,
                explanation: '1,243 is greater than 1,234 because 243 > 234.',
                difficulty: 'easy',
                strand: 'number-operations'
            },
            {
                id: 4,
                question: 'What is 800 - 347?',
                options: ['453', '463', '443', '473'],
                correct: 0,
                explanation: '800 - 347 = 453. You can borrow: 800 - 300 = 500, then 500 - 47 = 453.',
                difficulty: 'medium',
                strand: 'number-operations'
            },
            {
                id: 5,
                question: 'Count by 5s: 5, 10, 15, __, 25',
                options: ['18', '20', '22', '24'],
                correct: 1,
                explanation: 'The pattern is counting by 5s, so the missing number is 20.',
                difficulty: 'easy',
                strand: 'number-operations'
            },
            {
                id: 6,
                question: 'What is 6 × 4?',
                options: ['20', '24', '26', '28'],
                correct: 1,
                explanation: '6 × 4 = 24. You can think of it as 6 + 6 + 6 + 6 = 24.',
                difficulty: 'easy',
                strand: 'number-operations'
            },
            {
                id: 7,
                question: 'Round 456 to the nearest hundred',
                options: ['400', '450', '500', '460'],
                correct: 2,
                explanation: '456 rounds to 500 because 456 is closer to 500 than to 400.',
                difficulty: 'medium',
                strand: 'number-operations'
            },
            {
                id: 8,
                question: 'Which number is odd?',
                options: ['246', '358', '479', '682'],
                correct: 2,
                explanation: '479 is odd because it ends with 9, which is an odd digit.',
                difficulty: 'easy',
                strand: 'number-operations'
            },
            {
                id: 9,
                question: 'What comes next: 100, 200, 300, __',
                options: ['350', '400', '450', '500'],
                correct: 1,
                explanation: 'The pattern increases by 100 each time, so the next number is 400.',
                difficulty: 'easy',
                strand: 'number-operations'
            },
            {
                id: 10,
                question: 'If you have 12 pencils and give away 5, how many are left?',
                options: ['5', '6', '7', '8'],
                correct: 2,
                explanation: '12 - 5 = 7 pencils are left.',
                difficulty: 'easy',
                strand: 'number-operations'
            },
            {
                id: 11,
                question: 'What is the value of the digit 7 in 2,738?',
                options: ['7', '70', '700', '7,000'],
                correct: 1,
                explanation: 'The digit 7 is in the tens place, so its value is 70.',
                difficulty: 'medium',
                strand: 'number-operations'
            },
            {
                id: 12,
                question: 'Complete: 500 + __ = 750',
                options: ['200', '250', '300', '350'],
                correct: 1,
                explanation: '500 + 250 = 750, so the missing number is 250.',
                difficulty: 'medium',
                strand: 'number-operations'
            },
            {
                id: 13,
                question: 'Which number is between 1,234 and 1,245?',
                options: ['1,233', '1,236', '1,230', '1,250'],
                correct: 1,
                explanation: '1,236 is between 1,234 and 1,245.',
                difficulty: 'easy',
                strand: 'number-operations'
            },
            {
                id: 14,
                question: 'What is 9 × 7?',
                options: ['56', '63', '72', '81'],
                correct: 1,
                explanation: '9 × 7 = 63. You can use the 9 times table or think of it as (10 × 7) - 7 = 70 - 7 = 63.',
                difficulty: 'medium',
                strand: 'number-operations'
            },
            {
                id: 15,
                question: 'If a book costs 345 cedis and you pay with 500 cedis, how much change do you get?',
                options: ['145 cedis', '155 cedis', '165 cedis', '175 cedis'],
                correct: 1,
                explanation: '500 - 345 = 155 cedis change.',
                difficulty: 'medium',
                strand: 'number-operations'
            }
        ];
    }
    
    getAlgebraQuestions() {
        return [
            {
                id: 1,
                question: 'What comes next: Circle, Square, Circle, Square, __',
                options: ['Triangle', 'Circle', 'Square', 'Star'],
                correct: 1,
                explanation: 'The pattern alternates between circle and square, so the next shape is a circle.',
                difficulty: 'easy',
                strand: 'algebra'
            },
            {
                id: 2,
                question: 'Complete the pattern: A, B, C, A, B, C, __',
                options: ['A', 'B', 'C', 'D'],
                correct: 0,
                explanation: 'The pattern repeats A, B, C, so the next letter is A.',
                difficulty: 'easy',
                strand: 'algebra'
            },
            {
                id: 3,
                question: 'If 2 + 3 = 5, then what does 20 + 30 equal?',
                options: ['50', '53', '23', '32'],
                correct: 0,
                explanation: 'The pattern shows that when both numbers are multiplied by 10, the answer is also multiplied by 10.',
                difficulty: 'medium',
                strand: 'algebra'
            },
            {
                id: 4,
                question: 'Look at this pattern: 🔴🔵🔴🔵🔴__',
                options: ['🔴', '🔵', '🟡', '⚫'],
                correct: 1,
                explanation: 'The pattern alternates between red and blue circles.',
                difficulty: 'easy',
                strand: 'algebra'
            },
            {
                id: 5,
                question: 'If △ = 3 and ○ = 5, what is △ + ○?',
                options: ['7', '8', '9', '6'],
                correct: 1,
                explanation: '△ + ○ = 3 + 5 = 8.',
                difficulty: 'medium',
                strand: 'algebra'
            },
            {
                id: 6,
                question: 'Complete: 5, 10, 15, 20, __',
                options: ['22', '24', '25', '30'],
                correct: 2,
                explanation: 'The pattern increases by 5 each time, so the next number is 25.',
                difficulty: 'easy',
                strand: 'algebra'
            },
            {
                id: 7,
                question: 'If the scale is balanced with 2 apples on one side and 4 oranges on the other, what does 1 apple equal?',
                options: ['1 orange', '2 oranges', '3 oranges', '4 oranges'],
                correct: 1,
                explanation: 'If 2 apples = 4 oranges, then 1 apple = 2 oranges.',
                difficulty: 'medium',
                strand: 'algebra'
            },
            {
                id: 8,
                question: 'Pattern: 1, 4, 9, 16, __ (What are the square numbers?)',
                options: ['20', '25', '30', '36'],
                correct: 1,
                explanation: 'This sequence shows perfect squares: 1², 2², 3², 4², 5², so the next is 25.',
                difficulty: 'hard',
                strand: 'algebra'
            },
            {
                id: 9,
                question: 'If A = 3 and B = 6, what is A + A + B?',
                options: ['9', '12', '15', '18'],
                correct: 1,
                explanation: 'A + A + B = 3 + 3 + 6 = 12.',
                difficulty: 'easy',
                strand: 'algebra'
            },
            {
                id: 10,
                question: 'Pattern: 2, 4, 8, 16, __ (Each number is doubled)',
                options: ['24', '28', '30', '32'],
                correct: 3,
                explanation: 'Each number is doubled: 2×2=4, 4×2=8, 8×2=16, 16×2=32.',
                difficulty: 'medium',
                strand: 'algebra'
            }
        ];
    }
    
    getGeometryQuestions() {
        return [
            {
                id: 1,
                question: 'How many sides does a triangle have?',
                options: ['2', '3', '4', '5'],
                correct: 1,
                explanation: 'A triangle has exactly 3 sides and 3 corners.',
                difficulty: 'easy',
                strand: 'geometry'
            },
            {
                id: 2,
                question: 'Which shape has all sides equal and all angles equal?',
                options: ['Rectangle', 'Square', 'Triangle', 'Circle'],
                correct: 1,
                explanation: 'A square has 4 equal sides and 4 equal right angles.',
                difficulty: 'easy',
                strand: 'geometry'
            },
            {
                id: 3,
                question: 'How many corners does a cube have?',
                options: ['6', '8', '10', '12'],
                correct: 1,
                explanation: 'A cube has 8 corners (vertices) where 3 edges meet.',
                difficulty: 'medium',
                strand: 'geometry'
            },
            {
                id: 4,
                question: 'Which 3D shape can roll easily?',
                options: ['Cube', 'Cylinder', 'Cone', 'Pyramid'],
                correct: 1,
                explanation: 'A cylinder can roll easily because it has curved surfaces.',
                difficulty: 'easy',
                strand: 'geometry'
            },
            {
                id: 5,
                question: 'How many faces does a cylinder have?',
                options: ['2', '3', '4', '5'],
                correct: 1,
                explanation: 'A cylinder has 3 faces: 2 circles and 1 curved surface.',
                difficulty: 'medium',
                strand: 'geometry'
            },
            {
                id: 6,
                question: 'Which shape has no corners?',
                options: ['Square', 'Triangle', 'Circle', 'Rectangle'],
                correct: 2,
                explanation: 'A circle has no corners or straight sides.',
                difficulty: 'easy',
                strand: 'geometry'
            },
            {
                id: 7,
                question: 'If you cut a rectangle diagonally, how many triangles do you get?',
                options: ['1', '2', '3', '4'],
                correct: 1,
                explanation: 'A diagonal cut splits a rectangle into 2 triangles.',
                difficulty: 'medium',
                strand: 'geometry'
            },
            {
                id: 8,
                question: 'How many edges does a triangular pyramid have?',
                options: ['4', '6', '8', '12'],
                correct: 1,
                explanation: 'A triangular pyramid has 6 edges connecting the 4 vertices.',
                difficulty: 'hard',
                strand: 'geometry'
            },
            {
                id: 9,
                question: 'Which shape has exactly 6 sides?',
                options: ['Pentagon', 'Hexagon', 'Heptagon', 'Octagon'],
                correct: 1,
                explanation: 'A hexagon has exactly 6 sides.',
                difficulty: 'easy',
                strand: 'geometry'
            },
            {
                id: 10,
                question: 'If you fold a square along its diagonal, what shape do you get?',
                options: ['2 squares', '2 rectangles', '2 triangles', '4 triangles'],
                correct: 2,
                explanation: 'Folding a square along the diagonal creates 2 right-angled triangles.',
                difficulty: 'medium',
                strand: 'geometry'
            },
            {
                id: 11,
                question: 'How many sides does a pentagon have?',
                options: ['4', '5', '6', '7'],
                correct: 1,
                explanation: 'A pentagon has exactly 5 sides.',
                difficulty: 'easy',
                strand: 'geometry'
            },
            {
                id: 12,
                question: 'Which 3D shape has only one vertex?',
                options: ['Cube', 'Sphere', 'Cone', 'Cylinder'],
                correct: 2,
                explanation: 'A cone has exactly one vertex (pointed end).',
                difficulty: 'hard',
                strand: 'geometry'
            }
        ];
    }
    
    getDataHandlingQuestions() {
        return [
            {
                id: 1,
                question: 'What is the best way to show favorite colors of students?',
                options: ['List', 'Bar graph', 'Number line', 'Table'],
                correct: 1,
                explanation: 'A bar graph is excellent for comparing categories like favorite colors.',
                difficulty: 'easy',
                strand: 'data-handling'
            },
            {
                id: 2,
                question: 'In a bar graph, if Red has 8 blocks and Blue has 12 blocks, which color is more popular?',
                options: ['Red', 'Blue', 'They are equal', 'Cannot tell'],
                correct: 1,
                explanation: 'Blue has 12 blocks, which is more than Red\'s 8 blocks.',
                difficulty: 'easy',
                strand: 'data-handling'
            },
            {
                id: 3,
                question: 'How many students like apples if the graph shows: Apples: 15, Bananas: 10, Oranges: 8?',
                options: ['8', '10', '15', '33'],
                correct: 2,
                explanation: 'The bar for apples reaches 15, so 15 students like apples.',
                difficulty: 'easy',
                strand: 'data-handling'
            },
            {
                id: 4,
                question: 'What type of graph shows data over time?',
                options: ['Bar graph', 'Line graph', 'Pie chart', 'Table'],
                correct: 1,
                explanation: 'A line graph is best for showing how data changes over time.',
                difficulty: 'medium',
                strand: 'data-handling'
            },
            {
                id: 5,
                question: 'If 20 students were surveyed about their pets, and the graph shows: Dogs: 8, Cats: 6, Birds: 4, Fish: 2, how many students have pets?',
                options: ['10', '15', '20', '18'],
                correct: 2,
                explanation: 'Adding all the numbers: 8 + 6 + 4 + 2 = 20 students.',
                difficulty: 'medium',
                strand: 'data-handling'
            },
            {
                id: 6,
                question: 'What should be the title of a graph showing favorite sports?',
                options: ['Student Names', 'Favorite Sports of Our Class', 'School Colors', 'Test Scores'],
                correct: 1,
                explanation: 'The title should clearly describe what the graph is showing.',
                difficulty: 'easy',
                strand: 'data-handling'
            },
            {
                id: 7,
                question: 'In a pictograph where each icon represents 2 students, if you see 6 icons for mathematics, how many students chose mathematics?',
                options: ['6', '8', '12', '16'],
                correct: 2,
                explanation: '6 icons × 2 students per icon = 12 students.',
                difficulty: 'medium',
                strand: 'data-handling'
            },
            {
                id: 8,
                question: 'What is the range of these test scores: 65, 78, 82, 90, 95?',
                options: ['15', '20', '25', '30'],
                correct: 2,
                explanation: 'Range = highest score - lowest score = 95 - 65 = 30.',
                difficulty: 'hard',
                strand: 'data-handling'
            },
            {
                id: 9,
                question: 'Which measure tells us the most common value in a data set?',
                options: ['Mean', 'Median', 'Mode', 'Range'],
                correct: 2,
                explanation: 'Mode is the value that appears most frequently in a data set.',
                difficulty: 'medium',
                strand: 'data-handling'
            },
            {
                id: 10,
                question: 'If you flip a coin 10 times and get 6 heads and 4 tails, what fraction of flips were heads?',
                options: ['4/10', '6/10', '4/6', '6/4'],
                correct: 1,
                explanation: '6 heads out of 10 total flips = 6/10.',
                difficulty: 'medium',
                strand: 'data-handling'
            }
        ];
    }
    
    showAssessmentInterface() {
        const modal = document.getElementById('lesson-modal');
        const content = document.getElementById('lesson-content');
        
        content.innerHTML = this.createAssessmentInterface();
        modal.classList.remove('hidden');
        
        this.setupAssessmentInterface();
    }
    
    createAssessmentInterface() {
        const assessment = this.currentAssessment;
        const progress = ((assessment.currentQuestion + 1) / assessment.questions.length) * 100;
        
        return `
            <div class="assessment-container">
                <div class="assessment-header">
                    <h2 class="assessment-title">${assessment.data.name}</h2>
                    <div class="assessment-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progress}%"></div>
                        </div>
                        <span class="progress-text">Question ${assessment.currentQuestion + 1} of ${assessment.questions.length}</span>
                    </div>
                    <div class="assessment-timer" id="assessment-timer">
                        <span class="timer-icon">⏱️</span>
                        <span class="timer-text">${assessment.data.timeLimit}:00</span>
                    </div>
                </div>
                
                <div class="assessment-question" id="assessment-question">
                    ${this.createQuestionDisplay()}
                </div>
                
                <div class="assessment-navigation">
                    <button class="nav-btn" id="prev-question" ${assessment.currentQuestion === 0 ? 'disabled' : ''}>
                        ← Previous
                    </button>
                    <div class="question-indicator">
                        ${this.createQuestionIndicator()}
                    </div>
                    <button class="nav-btn nav-btn-primary" id="next-question">
                        ${assessment.currentQuestion === assessment.questions.length - 1 ? 'Finish Assessment' : 'Next →'}
                    </button>
                </div>
            </div>
        `;
    }
    
    createQuestionDisplay() {
        const question = this.currentAssessment.questions[this.currentAssessment.currentQuestion];
        
        return `
            <div class="question-content">
                <div class="question-header">
                    <span class="question-number">Question ${this.currentAssessment.currentQuestion + 1}</span>
                    <span class="question-difficulty difficulty-${question.difficulty}">${question.difficulty}</span>
                    <span class="question-strand">${this.getStrandDisplay(question.strand)}</span>
                </div>
                
                <h3 class="question-text">${question.question}</h3>
                
                <div class="answer-options">
                    ${question.options.map((option, index) => `
                        <button class="answer-option ${this.currentAssessment.answers[this.currentAssessment.currentQuestion] === index ? 'selected' : ''}" 
                                data-answer="${index}">
                            <span class="option-letter">${String.fromCharCode(65 + index)}</span>
                            <span class="option-text">${option}</span>
                        </button>
                    `).join('')}
                </div>
                
                ${this.currentAssessment.answers[this.currentAssessment.currentQuestion] !== undefined ? 
                    this.createFeedbackDisplay(question) : ''}
            </div>
        `;
    }
    
    createFeedbackDisplay(question) {
        const userAnswer = this.currentAssessment.answers[this.currentAssessment.currentQuestion];
        const isCorrect = userAnswer === question.correct;
        
        return `
            <div class="question-feedback ${isCorrect ? 'correct' : 'incorrect'}">
                <div class="feedback-icon">${isCorrect ? '✅' : '❌'}</div>
                <div class="feedback-content">
                    <div class="feedback-title">${isCorrect ? 'Correct!' : 'Incorrect'}</div>
                    <div class="feedback-explanation">${question.explanation}</div>
                    ${!isCorrect ? `<div class="correct-answer">The correct answer is: ${question.options[question.correct]}</div>` : ''}
                </div>
            </div>
        `;
    }
    
    createQuestionIndicator() {
        const total = this.currentAssessment.questions.length;
        const current = this.currentAssessment.currentQuestion;
        
        return `
            <div class="question-dots">
                ${Array.from({length: total}, (_, i) => `
                    <span class="question-dot ${i === current ? 'current' : ''} ${this.currentAssessment.answers[i] !== undefined ? 'answered' : ''}"></span>
                `).join('')}
            </div>
        `;
    }
    
    getStrandDisplay(strand) {
        const strandMap = {
            'number-operations': 'Number Operations',
            'algebra': 'Algebra & Patterns',
            'geometry': 'Geometry',
            'data-handling': 'Data Handling'
        };
        
        return strandMap[strand] || strand;
    }
    
    setupAssessmentInterface() {
        // Answer selection
        const answerOptions = document.querySelectorAll('.answer-option');
        answerOptions.forEach(option => {
            option.addEventListener('click', () => {
                this.selectAnswer(parseInt(option.dataset.answer));
            });
        });
        
        // Navigation
        document.getElementById('prev-question')?.addEventListener('click', () => {
            this.previousQuestion();
        });
        
        document.getElementById('next-question')?.addEventListener('click', () => {
            if (this.currentAssessment.currentQuestion === this.currentAssessment.questions.length - 1) {
                this.completeAssessment();
            } else {
                this.nextQuestion();
            }
        });
        
        // Start timer
        this.startTimer();
    }
    
    selectAnswer(answerIndex) {
        this.currentAssessment.answers[this.currentAssessment.currentQuestion] = answerIndex;
        this.updateQuestionDisplay();
        this.updateQuestionIndicator();
        
        // Auto-advance after showing feedback
        setTimeout(() => {
            if (this.currentAssessment.currentQuestion < this.currentAssessment.questions.length - 1) {
                this.nextQuestion();
            }
        }, 3000);
    }
    
    updateQuestionDisplay() {
        const questionContainer = document.getElementById('assessment-question');
        questionContainer.innerHTML = this.createQuestionDisplay();
        
        // Re-setup answer option listeners
        const answerOptions = questionContainer.querySelectorAll('.answer-option');
        answerOptions.forEach(option => {
            option.addEventListener('click', () => {
                this.selectAnswer(parseInt(option.dataset.answer));
            });
        });
    }
    
    updateQuestionIndicator() {
        const dotsContainer = document.querySelector('.question-dots');
        if (dotsContainer) {
            dotsContainer.innerHTML = this.createQuestionIndicator();
        }
    }
    
    previousQuestion() {
        if (this.currentAssessment.currentQuestion > 0) {
            this.currentAssessment.currentQuestion--;
            this.updateAssessmentDisplay();
        }
    }
    
    nextQuestion() {
        if (this.currentAssessment.currentQuestion < this.currentAssessment.questions.length - 1) {
            this.currentAssessment.currentQuestion++;
            this.updateAssessmentDisplay();
        }
    }
    
    updateAssessmentDisplay() {
        const assessmentContainer = document.querySelector('.assessment-container');
        assessmentContainer.innerHTML = this.createAssessmentInterface();
        this.setupAssessmentInterface();
    }
    
    startTimer() {
        const assessment = this.currentAssessment;
        let timeRemaining = assessment.data.timeLimit * 60; // Convert to seconds
        
        const timerDisplay = document.getElementById('assessment-timer');
        const timerText = timerDisplay.querySelector('.timer-text');
        
        const timer = setInterval(() => {
            const minutes = Math.floor(timeRemaining / 60);
            const seconds = timeRemaining % 60;
            timerText.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            if (timeRemaining <= 60) {
                timerDisplay.style.background = '#EF4444';
                timerDisplay.style.color = 'white';
            }
            
            timeRemaining--;
            
            if (timeRemaining < 0) {
                clearInterval(timer);
                this.completeAssessment(true); // Time's up
            }
        }, 1000);
    }
    
    completeAssessment(timeUp = false) {
        const assessment = this.currentAssessment;
        assessment.isCompleted = true;
        assessment.endTime = Date.now();
        
        // Calculate score
        let correctAnswers = 0;
        assessment.questions.forEach((question, index) => {
            if (assessment.answers[index] === question.correct) {
                correctAnswers++;
            }
        });
        
        const score = Math.round((correctAnswers / assessment.questions.length) * 100);
        const pointsEarned = Math.round(score * (assessment.data.points / 100));
        
        // Update user progress
        this.app.currentUser.totalPoints += pointsEarned;
        
        this.showResults(correctAnswers, score, pointsEarned, timeUp);
    }
    
    showResults(correctAnswers, score, pointsEarned, timeUp) {
        const modal = document.getElementById('lesson-modal');
        const content = document.getElementById('lesson-content');
        
        const isExcellent = score >= 90;
        const isGood = score >= 70;
        const message = timeUp ? '⏰ Time\'s Up!' : 
                       isExcellent ? '🎉 Outstanding!' : 
                       isGood ? '😊 Well Done!' : 
                       '💪 Keep Practicing!';
        
        content.innerHTML = `
            <div class="assessment-results">
                <div class="results-header">
                    <h2>Assessment Complete!</h2>
                    <p class="results-message">${message}</p>
                </div>
                
                <div class="results-summary">
                    <div class="result-stat">
                        <div class="stat-icon">✅</div>
                        <div class="stat-content">
                            <span class="stat-number">${correctAnswers}</span>
                            <span class="stat-label">Correct Answers</span>
                        </div>
                    </div>
                    
                    <div class="result-stat">
                        <div class="stat-icon">📊</div>
                        <div class="stat-content">
                            <span class="stat-number">${score}%</span>
                            <span class="stat-label">Score</span>
                        </div>
                    </div>
                    
                    <div class="result-stat">
                        <div class="stat-icon">⭐</div>
                        <div class="stat-content">
                            <span class="stat-number">${pointsEarned}</span>
                            <span class="stat-label">Points Earned</span>
                        </div>
                    </div>
                </div>
                
                <div class="results-breakdown">
                    <h3>Performance by Strand</h3>
                    <div class="strand-breakdown">
                        ${this.createStrandBreakdown()}
                    </div>
                </div>
                
                <div class="results-actions">
                    <button class="btn btn-primary" id="retake-assessment">Retake Assessment</button>
                    <button class="btn btn-secondary" id="review-answers">Review Answers</button>
                    <button class="btn btn-secondary" id="continue-learning">Continue Learning</button>
                </div>
            </div>
        `;
        
        // Setup result actions
        document.getElementById('retake-assessment')?.addEventListener('click', () => {
            this.startAssessment(this.currentAssessment.type);
        });
        
        document.getElementById('continue-learning')?.addEventListener('click', () => {
            modal.classList.add('hidden');
            this.app.navigateToSection('dashboard');
        });
    }
    
    createStrandBreakdown() {
        const strandStats = {};
        this.currentAssessment.questions.forEach((question, index) => {
            const strand = question.strand;
            if (!strandStats[strand]) {
                strandStats[strand] = { correct: 0, total: 0 };
            }
            strandStats[strand].total++;
            if (this.currentAssessment.answers[index] === question.correct) {
                strandStats[strand].correct++;
            }
        });
        
        return Object.entries(strandStats).map(([strand, stats]) => {
            const percentage = Math.round((stats.correct / stats.total) * 100);
            const strandName = this.getStrandDisplay(strand);
            
            return `
                <div class="strand-stat">
                    <span class="strand-name">${strandName}</span>
                    <div class="strand-progress-bar">
                        <div class="strand-progress-fill" style="width: ${percentage}%"></div>
                    </div>
                    <span class="strand-percentage">${stats.correct}/${stats.total} (${percentage}%)</span>
                </div>
            `;
        }).join('');
    }
}

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AssessmentsModule;
}