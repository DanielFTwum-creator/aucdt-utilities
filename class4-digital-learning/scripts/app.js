// Golden Mathematics Class 4 - Main Application
class GMLSApp {
    constructor() {
        this.currentUser = {
            name: 'Amina',
            level: 3,
            totalPoints: 1250,
            completedLessons: 28,
            totalLessons: 45,
            currentStrand: 'number-operations'
        };
        
        this.currentSection = 'dashboard';
        this.lessonData = this.initializeLessonData();
        this.assessmentData = this.initializeAssessmentData();
        this.progressData = this.initializeProgressData();
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadInitialContent();
        this.startLoadingAnimation();
        this.initializeTeacherMode();
    }
    
    // Initialize lesson data for all curriculum strands
    initializeLessonData() {
        return {
            'number-operations': [
                {
                    id: 'num-001',
                    title: 'Counting to 1000',
                    description: 'Learn to count numbers up to 1000 with fun activities',
                    difficulty: 'easy',
                    duration: 15,
                    objectives: [
                        'Count numbers from 1 to 1000',
                        'Recognize number patterns',
                        'Practice skip counting by 2s, 5s, and 10s'
                    ],
                    progress: 0,
                    completed: false,
                    icon: '🔢',
                    color: '#3B82F6'
                },
                {
                    id: 'num-002',
                    title: 'Place Value Understanding',
                    description: 'Understand ones, tens, hundreds, and thousands places',
                    difficulty: 'easy',
                    duration: 20,
                    objectives: [
                        'Identify place values',
                        'Use base-ten blocks',
                        'Read and write numbers to 1000'
                    ],
                    progress: 65,
                    completed: false,
                    icon: '📊',
                    color: '#3B82F6'
                },
                {
                    id: 'num-003',
                    title: 'Addition with Regrouping',
                    description: 'Master addition problems that require regrouping',
                    difficulty: 'medium',
                    duration: 25,
                    objectives: [
                        'Add 2-digit and 3-digit numbers',
                        'Regroup when necessary',
                        'Solve word problems'
                    ],
                    progress: 0,
                    completed: false,
                    icon: '➕',
                    color: '#3B82F6'
                },
                {
                    id: 'num-004',
                    title: 'Subtraction with Borrowing',
                    description: 'Learn subtraction with borrowing for larger numbers',
                    difficulty: 'medium',
                    duration: 25,
                    objectives: [
                        'Subtract 2-digit and 3-digit numbers',
                        'Borrow when necessary',
                        'Apply to real-world problems'
                    ],
                    progress: 0,
                    completed: false,
                    icon: '➖',
                    color: '#3B82F6'
                },
                {
                    id: 'num-005',
                    title: 'Multiplication Basics',
                    description: 'Introduction to multiplication as repeated addition',
                    difficulty: 'medium',
                    duration: 30,
                    objectives: [
                        'Understand multiplication concept',
                        'Memorize multiplication tables',
                        'Solve multiplication problems'
                    ],
                    progress: 0,
                    completed: false,
                    icon: '✖️',
                    color: '#3B82F6'
                }
            ],
            'algebra': [
                {
                    id: 'alg-001',
                    title: 'Number Patterns',
                    description: 'Identify and create simple number patterns',
                    difficulty: 'easy',
                    duration: 15,
                    objectives: [
                        'Recognize patterns in sequences',
                        'Continue patterns',
                        'Create your own patterns'
                    ],
                    progress: 100,
                    completed: true,
                    icon: '🔗',
                    color: '#EC4899'
                },
                {
                    id: 'alg-002',
                    title: 'Shape Patterns',
                    description: 'Find patterns using shapes and colors',
                    difficulty: 'easy',
                    duration: 15,
                    objectives: [
                        'Identify visual patterns',
                        'Continue shape sequences',
                        'Predict next elements'
                    ],
                    progress: 80,
                    completed: false,
                    icon: '🔶',
                    color: '#EC4899'
                },
                {
                    id: 'alg-003',
                    title: 'Equality and Balance',
                    description: 'Understand that both sides of an equation must be equal',
                    difficulty: 'medium',
                    duration: 20,
                    objectives: [
                        'Use balance scales',
                        'Understand equality',
                        'Solve simple equations'
                    ],
                    progress: 0,
                    completed: false,
                    icon: '⚖️',
                    color: '#EC4899'
                }
            ],
            'geometry': [
                {
                    id: 'geo-001',
                    title: '2D Shapes Identification',
                    description: 'Identify and name basic 2D shapes',
                    difficulty: 'easy',
                    duration: 15,
                    objectives: [
                        'Identify circles, squares, triangles',
                        'Count sides and corners',
                        'Match shapes to real objects'
                    ],
                    progress: 100,
                    completed: true,
                    icon: '⭕',
                    color: '#8B5CF6'
                },
                {
                    id: 'geo-002',
                    title: '3D Shapes Exploration',
                    description: 'Explore cubes, spheres, cylinders, and cones',
                    difficulty: 'medium',
                    duration: 20,
                    objectives: [
                        'Identify 3D shapes',
                        'Count faces, edges, vertices',
                        'Sort shapes by properties'
                    ],
                    progress: 0,
                    completed: false,
                    icon: '🎲',
                    color: '#8B5CF6'
                }
            ],
            'data-handling': [
                {
                    id: 'data-001',
                    title: 'Data Collection',
                    description: 'Learn to collect and organize data',
                    difficulty: 'easy',
                    duration: 15,
                    objectives: [
                        'Create simple surveys',
                        'Collect data from classmates',
                        'Organize information'
                    ],
                    progress: 100,
                    completed: true,
                    icon: '📋',
                    color: '#10B981'
                },
                {
                    id: 'data-002',
                    title: 'Creating Bar Graphs',
                    description: 'Turn data into visual bar graphs',
                    difficulty: 'medium',
                    duration: 20,
                    objectives: [
                        'Draw bar graphs',
                        'Read information from graphs',
                        'Compare data visually'
                    ],
                    progress: 0,
                    completed: false,
                    icon: '📊',
                    color: '#10B981'
                }
            ]
        };
    }
    
    // Initialize assessment data
    initializeAssessmentData() {
        return {
            quickQuiz: {
                id: 'quick-001',
                title: 'Daily Quick Quiz',
                description: '5 questions to practice today\'s lessons',
                timeLimit: 5,
                totalQuestions: 5,
                points: 25,
                available: true,
                completed: false,
                questions: [
                    {
                        id: 1,
                        question: 'What comes after 999?',
                        options: ['1000', '999', '1001', '9999'],
                        correct: 0,
                        explanation: 'After 999 comes 1000, which is one thousand.'
                    },
                    {
                        id: 2,
                        question: 'In the number 2,345, what digit is in the hundreds place?',
                        options: ['2', '3', '4', '5'],
                        correct: 1,
                        explanation: 'In 2,345, the hundreds place has the digit 3.'
                    },
                    {
                        id: 3,
                        question: 'What shape has 3 sides?',
                        options: ['Square', 'Triangle', 'Circle', 'Rectangle'],
                        correct: 1,
                        explanation: 'A triangle has exactly 3 sides and 3 corners.'
                    },
                    {
                        id: 4,
                        question: 'Complete the pattern: 2, 4, 6, 8, ___',
                        options: ['9', '10', '11', '12'],
                        correct: 1,
                        explanation: 'This pattern increases by 2 each time: 2, 4, 6, 8, 10'
                    },
                    {
                        id: 5,
                        question: '25 + 18 = ?',
                        options: ['43', '42', '44', '41'],
                        correct: 0,
                        explanation: '25 + 18 = 43'
                    }
                ]
            },
            strandAssessments: [
                {
                    id: 'num-assessment-001',
                    title: 'Number Operations Test',
                    description: 'Test your understanding of addition and subtraction',
                    strand: 'number-operations',
                    available: true,
                    completed: true,
                    score: 85,
                    totalQuestions: 15,
                    timeLimit: 30
                },
                {
                    id: 'geo-assessment-001',
                    title: 'Geometry Shapes Quiz',
                    description: 'Identify 2D and 3D shapes',
                    strand: 'geometry',
                    available: true,
                    completed: false,
                    score: null,
                    totalQuestions: 10,
                    timeLimit: 20
                },
                {
                    id: 'alg-assessment-001',
                    title: 'Patterns & Sequences',
                    description: 'Find and create number patterns',
                    strand: 'algebra',
                    available: false,
                    completed: false,
                    score: null,
                    totalQuestions: 12,
                    timeLimit: 25,
                    lockedReason: 'Complete Geometry first'
                }
            ]
        };
    }
    
    // Initialize progress data
    initializeProgressData() {
        return {
            overall: {
                completion: 60,
                totalLessons: 45,
                completedLessons: 28,
                totalAssessments: 15,
                passedAssessments: 12,
                totalPoints: 1250,
                totalBadges: 12,
                earnedBadges: 8
            },
            strands: {
                'number-operations': {
                    name: 'Number Operations',
                    completion: 80,
                    totalLessons: 15,
                    completedLessons: 12,
                    points: 400
                },
                'algebra': {
                    name: 'Algebra & Patterns',
                    completion: 67,
                    totalLessons: 12,
                    completedLessons: 8,
                    points: 300
                },
                'geometry': {
                    name: 'Geometry & Measurement',
                    completion: 50,
                    totalLessons: 10,
                    completedLessons: 5,
                    points: 200
                },
                'data-handling': {
                    name: 'Data Handling',
                    completion: 38,
                    totalLessons: 8,
                    completedLessons: 3,
                    points: 150
                }
            },
            badges: [
                {
                    id: 'badge-001',
                    name: 'Number Master',
                    description: 'Complete all Number Operations lessons',
                    icon: '🏅',
                    earned: true,
                    earnedDate: '2025-12-04'
                },
                {
                    id: 'badge-002',
                    name: 'Quick Learner',
                    description: 'Complete 5 lessons in one day',
                    icon: '⚡',
                    earned: true,
                    earnedDate: '2025-11-30'
                },
                {
                    id: 'badge-003',
                    name: 'Perfect Score',
                    description: 'Get 100% on an assessment',
                    icon: '🌟',
                    earned: true,
                    earnedDate: '2025-11-25'
                },
                {
                    id: 'badge-004',
                    name: 'Geometry Expert',
                    description: 'Complete Geometry strand',
                    icon: '🏆',
                    earned: false,
                    requirement: 'Complete Geometry strand'
                },
                {
                    id: 'badge-005',
                    name: 'Pattern Detective',
                    description: 'Complete Algebra strand',
                    icon: '🎯',
                    earned: false,
                    requirement: 'Complete Algebra strand'
                },
                {
                    id: 'badge-006',
                    name: 'Data Champion',
                    description: 'Complete Data Handling strand',
                    icon: '📊',
                    earned: false,
                    requirement: 'Complete Data Handling'
                }
            ]
        };
    }
    
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                this.navigateToSection(section);
            });
        });
        
        // Strand filter
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const strand = e.currentTarget.dataset.strand;
                this.filterLessons(strand);
            });
        });
        
        // Lesson cards
        document.addEventListener('click', (e) => {
            if (e.target.closest('.lesson-card')) {
                const lessonCard = e.target.closest('.lesson-card');
                const lessonId = lessonCard.dataset.lessonId;
                const strand = lessonCard.dataset.strand;
                this.openLesson(strand, lessonId);
            }
        });
        
        // Strand cards
        document.addEventListener('click', (e) => {
            if (e.target.closest('.strand-card')) {
                const strandCard = e.target.closest('.strand-card');
                const strand = strandCard.dataset.strand;
                this.openStrandLessons(strand);
            }
        });
        
        // Assessment buttons
        document.querySelectorAll('.start-assessment-btn, .take-assessment-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const assessmentType = e.target.closest('.assessment-card') ? 'quick' : 'strand';
                const assessmentId = assessmentType === 'strand' ? 
                    e.target.closest('.assessment-item').dataset.assessmentId : 
                    'quick-001';
                this.startAssessment(assessmentType, assessmentId);
            });
        });
        
        // Modal close
        document.getElementById('close-modal').addEventListener('click', () => {
            this.closeModal();
        });
        
        // Continue learning button
        document.querySelector('.continue-btn')?.addEventListener('click', () => {
            this.continueLastLesson();
        });
        
        // Teacher mode toggle
        this.setupTeacherEventListeners();
    }
    
    startLoadingAnimation() {
        const progressBar = document.getElementById('loading-progress');
        let progress = 0;
        
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => {
                    this.hideLoadingScreen();
                }, 500);
            }
            progressBar.style.width = progress + '%';
        }, 200);
    }
    
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('hidden');
        
        // Show dashboard
        setTimeout(() => {
            this.navigateToSection('dashboard');
        }, 300);
    }
    
    navigateToSection(sectionName) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
        
        // Show/hide sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(`${sectionName}-section`).classList.add('active');
        
        this.currentSection = sectionName;
        
        // Load section content
        switch (sectionName) {
            case 'dashboard':
                this.loadDashboardContent();
                break;
            case 'lessons':
                this.loadLessonsContent();
                break;
            case 'assessments':
                this.loadAssessmentsContent();
                break;
            case 'progress':
                this.loadProgressContent();
                break;
            case 'teacher':
                this.loadTeacherContent();
                break;
        }
    }
    
    loadDashboardContent() {
        // Update student info
        document.querySelector('.user-name').textContent = this.currentUser.name;
        document.querySelector('.user-level').textContent = `Level ${this.currentUser.level}`;
        
        // Update stats
        document.querySelector('.stat-number').textContent = this.currentUser.completedLessons;
        
        // Continue lesson preview
        const continueLesson = document.querySelector('.continue-card .lesson-title');
        const progressText = document.querySelector('.continue-card .progress-text');
        const progressFill = document.querySelector('.continue-card .progress-fill-small');
        
        if (continueLesson) {
            continueLesson.textContent = 'Adding Big Numbers';
            progressText.textContent = '65% complete';
            progressFill.style.width = '65%';
        }
        
        // Animate progress indicators
        this.animateProgressIndicators();
    }
    
    loadLessonsContent() {
        this.renderLessonsGrid();
    }
    
    loadAssessmentsContent() {
        // Assessments content is already in HTML, just update dynamic parts
        this.updateAssessmentStatus();
    }
    
    loadProgressContent() {
        this.updateProgressDashboard();
    }
    
    renderLessonsGrid() {
        const grid = document.getElementById('lessons-grid');
        const activeFilter = document.querySelector('.filter-btn.active')?.dataset.strand || 'all';
        
        grid.innerHTML = '';
        
        // Render lessons from all strands or filtered strand
        Object.keys(this.lessonData).forEach(strandKey => {
            if (activeFilter === 'all' || activeFilter === strandKey) {
                const strandLessons = this.lessonData[strandKey];
                strandLessons.forEach(lesson => {
                    const lessonCard = this.createLessonCard(lesson, strandKey);
                    grid.appendChild(lessonCard);
                });
            }
        });
    }
    
    createLessonCard(lesson, strand) {
        const card = document.createElement('div');
        card.className = `lesson-card ${strand}`;
        card.dataset.lessonId = lesson.id;
        card.dataset.strand = strand;
        
        const statusIcon = lesson.completed ? '✅' : '⭕';
        const statusText = lesson.completed ? 'Completed' : 'Not started';
        const progressWidth = lesson.progress + '%';
        
        card.innerHTML = `
            <div class="lesson-card-header">
                <div class="lesson-card-icon">${lesson.icon}</div>
                <div>
                    <h4 class="lesson-card-title">${lesson.title}</h4>
                    <div class="lesson-status">
                        <span class="status-icon">${statusIcon}</span>
                        <span class="status-text">${statusText}</span>
                    </div>
                </div>
            </div>
            <p class="lesson-card-description">${lesson.description}</p>
            <div class="lesson-card-meta">
                <div class="lesson-meta-item">
                    <span>⏱️</span>
                    <span>${lesson.duration} min</span>
                </div>
                <span class="lesson-difficulty difficulty-${lesson.difficulty}">${lesson.difficulty}</span>
            </div>
            <div class="progress-bar-small">
                <div class="progress-fill-small" style="width: ${progressWidth};"></div>
            </div>
        `;
        
        return card;
    }
    
    filterLessons(strand) {
        // Update filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-strand="${strand}"]`).classList.add('active');
        
        // Re-render lessons
        this.renderLessonsGrid();
    }
    
    openLesson(strand, lessonId) {
        const lesson = this.lessonData[strand].find(l => l.id === lessonId);
        if (!lesson) return;
        
        const modal = document.getElementById('lesson-modal');
        const content = document.getElementById('lesson-content');
        
        content.innerHTML = this.createLessonContent(lesson, strand);
        modal.classList.remove('hidden');
        
        // Setup lesson navigation
        this.setupLessonNavigation(lesson, strand);
    }
    
    createLessonContent(lesson, strand) {
        return `
            <div class="lesson-container">
                <div class="lesson-header">
                    <div class="lesson-number">Lesson ${lesson.id}</div>
                    <h2 class="lesson-title-large">${lesson.title}</h2>
                    <p class="lesson-objective">Learn to: ${lesson.objectives.join(', ')}</p>
                </div>
                
                <div class="lesson-progress">
                    <div class="progress-step completed">Start</div>
                    <div class="progress-step current">Learn</div>
                    <div class="progress-step upcoming">Practice</div>
                    <div class="progress-step upcoming">Quiz</div>
                    <div class="progress-step upcoming">Complete</div>
                </div>
                
                <div class="lesson-content">
                    <div class="instruction-box">
                        <div class="instruction-title">📚 Learning Objectives</div>
                        <div class="instruction-text">
                            ${lesson.objectives.map(obj => `• ${obj}`).join('<br>')}
                        </div>
                    </div>
                    
                    <div class="interactive-area">
                        <div class="math-problem" id="math-problem">Let's start learning!</div>
                        <div class="answer-options" id="answer-options">
                            <!-- Interactive content will be populated here -->
                        </div>
                        <div class="feedback-area" id="feedback-area"></div>
                    </div>
                </div>
                
                <div class="lesson-navigation">
                    <button class="nav-btn" id="prev-btn" disabled>
                        <span>←</span> Previous
                    </button>
                    <div class="lesson-progress-info">
                        <span>Step 1 of 5</span>
                    </div>
                    <button class="nav-btn nav-btn-primary" id="next-btn">
                        Next <span>→</span>
                    </button>
                </div>
            </div>
        `;
    }
    
    setupLessonNavigation(lesson, strand) {
        const lessonSteps = [
            { title: 'Introduction', content: this.getLessonIntroduction(lesson) },
            { title: 'Learn', content: this.getLessonContent(lesson) },
            { title: 'Practice', content: this.getPracticeProblems(lesson) },
            { title: 'Quiz', content: this.getQuizQuestions(lesson) },
            { title: 'Complete', content: this.getCompletionContent(lesson) }
        ];
        
        let currentStep = 0;
        let progress = lesson.progress;
        
        const updateStep = () => {
            const step = lessonSteps[currentStep];
            const problemElement = document.getElementById('math-problem');
            const optionsElement = document.getElementById('answer-options');
            const feedbackElement = document.getElementById('feedback-area');
            const stepIndicator = document.querySelector('.lesson-progress-info span');
            
            // Update progress indicator
            document.querySelectorAll('.progress-step').forEach((el, index) => {
                el.classList.remove('completed', 'current', 'upcoming');
                if (index < currentStep) {
                    el.classList.add('completed');
                } else if (index === currentStep) {
                    el.classList.add('current');
                } else {
                    el.classList.add('upcoming');
                }
            });
            
            stepIndicator.textContent = `Step ${currentStep + 1} of ${lessonSteps.length}`;
            
            // Update content
            if (step.content.type === 'introduction') {
                problemElement.innerHTML = step.content.problem;
                optionsElement.innerHTML = '';
                feedbackElement.innerHTML = '';
            } else if (step.content.type === 'content') {
                problemElement.innerHTML = step.content.problem;
                optionsElement.innerHTML = step.content.options.map((option, index) => 
                    `<button class="answer-btn" data-answer="${index}">${option}</button>`
                ).join('');
                feedbackElement.innerHTML = '';
                
                // Setup answer button handlers
                optionsElement.querySelectorAll('.answer-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const answer = parseInt(e.target.dataset.answer);
                        const correct = step.content.correct;
                        
                        // Remove previous selections
                        optionsElement.querySelectorAll('.answer-btn').forEach(b => {
                            b.classList.remove('selected', 'correct', 'incorrect');
                        });
                        
                        // Mark selection
                        e.target.classList.add('selected');
                        
                        if (answer === correct) {
                            e.target.classList.add('correct');
                            feedbackElement.innerHTML = `
                                <div class="feedback-correct">
                                    ✅ Excellent! ${step.content.explanation}
                                </div>
                            `;
                            progress = Math.min(100, progress + 25);
                        } else {
                            e.target.classList.add('incorrect');
                            feedbackElement.innerHTML = `
                                <div class="feedback-incorrect">
                                    ❌ Not quite right. ${step.content.explanation}
                                </div>
                            `;
                        }
                    });
                });
            } else if (step.content.type === 'quiz') {
                problemElement.innerHTML = step.content.question;
                optionsElement.innerHTML = step.content.options.map((option, index) => 
                    `<button class="answer-btn" data-answer="${index}">${option}</button>`
                ).join('');
                feedbackElement.innerHTML = '';
            } else if (step.content.type === 'completion') {
                problemElement.innerHTML = step.content.message;
                optionsElement.innerHTML = '';
                feedbackElement.innerHTML = step.content.celebration;
            }
            
            // Update navigation buttons
            document.getElementById('prev-btn').disabled = currentStep === 0;
            document.getElementById('next-btn').textContent = 
                currentStep === lessonSteps.length - 1 ? 'Finish Lesson' : 'Next →';
        };
        
        // Navigation handlers
        document.getElementById('prev-btn').addEventListener('click', () => {
            if (currentStep > 0) {
                currentStep--;
                updateStep();
            }
        });
        
        document.getElementById('next-btn').addEventListener('click', () => {
            if (currentStep < lessonSteps.length - 1) {
                currentStep++;
                
                // Update lesson progress
                lesson.progress = Math.min(100, lesson.progress + 20);
                
                // Check if lesson is complete
                if (currentStep === lessonSteps.length - 1) {
                    lesson.completed = true;
                    this.currentUser.totalPoints += 50;
                    this.showCompletionCelebration(lesson);
                }
                
                updateStep();
            } else {
                this.closeModal();
                this.updateDashboardStats();
            }
        });
        
        // Initialize
        updateStep();
    }
    
    getLessonIntroduction(lesson) {
        return {
            type: 'introduction',
            problem: `
                <h3>Welcome to ${lesson.title}! 🌟</h3>
                <p>In this lesson, you will:</p>
                <ul>
                    ${lesson.objectives.map(obj => `<li>✅ ${obj}</li>`).join('')}
                </ul>
                <p><strong>Duration:</strong> ${lesson.duration} minutes</p>
                <p>Let's begin this exciting learning journey!</p>
            `
        };
    }
    
    getLessonContent(lesson) {
        const contentMap = {
            'num-001': {
                problem: '<h3>🔢 Counting to 1000</h3><p>Let's count together! Start from 1 and count to 10:</p><p style="font-size: 24px; text-align: center; margin: 20px 0;">1, 2, 3, 4, 5, 6, 7, 8, 9, 10</p><p>Great! Now can you count from 1 to 20?</p>',
                options: ['I can do it!', 'Let me practice more', 'Show me the pattern'],
                correct: 0,
                explanation: 'Wonderful! You\'re ready to count to 1000. Remember: the pattern increases by 1 each time.'
            },
            'num-002': {
                problem: '<h3>📊 Place Value Understanding</h3><p>Look at this number: <strong>2,345</strong></p><p>The place values are:</p><ul><li><strong>2</strong> = Thousands place</li><li><strong>3</strong> = Hundreds place</li><li><strong>4</strong> = Tens place</li><li><strong>5</strong> = Ones place</li></ul><p>What digit is in the hundreds place?</p>',
                options: ['2', '3', '4', '5'],
                correct: 1,
                explanation: 'Correct! The hundreds place is the third digit from the right, which is 3.'
            },
            'alg-001': {
                problem: '<h3>🔗 Number Patterns</h3><p>Look at this pattern: <strong>2, 4, 6, 8, ___</strong></p><p>What comes next?</p>',
                options: ['9', '10', '11', '12'],
                correct: 1,
                explanation: 'Great! The pattern increases by 2 each time: 2, 4, 6, 8, 10'
            },
            'geo-001': {
                problem: '<h3>⭕ 2D Shapes Identification</h3><p>Can you identify these shapes?</p><div style="font-size: 60px; text-align: center; margin: 20px 0;">⭕ 🔺 🔲</div><p>How many sides does a triangle have?</p>',
                options: ['2 sides', '3 sides', '4 sides', '5 sides'],
                correct: 1,
                explanation: 'Excellent! A triangle has exactly 3 sides and 3 corners.'
            }
        };
        
        return {
            type: 'content',
            ...contentMap[lesson.id] || {
                problem: '<h3>Learning Content</h3><p>Interactive learning content for this lesson will appear here.</p>',
                options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
                correct: 0,
                explanation: 'This is a sample explanation.'
            }
        };
    }
    
    getPracticeProblems(lesson) {
        return {
            type: 'content',
            problem: '<h3>🎯 Practice Time!</h3><p>Now let\'s practice what you learned. Answer this question:</p><p style="font-size: 20px; text-align: center; margin: 20px 0;"><strong>15 + 27 = ?</strong></p>',
            options: ['42', '41', '43', '40'],
            correct: 0,
            explanation: 'Perfect! 15 + 27 = 42. You can add the tens first: 10 + 20 = 30, then the ones: 5 + 7 = 12, so 30 + 12 = 42.'
        };
    }
    
    getQuizQuestions(lesson) {
        return {
            type: 'quiz',
            question: '<h3>🧠 Quick Quiz!</h3><p style="font-size: 18px;">What is 50 + 30?</p>',
            options: ['70', '80', '90', '60'],
            correct: 1
        };
    }
    
    getCompletionContent(lesson) {
        return {
            type: 'completion',
            message: '<h3>🎉 Congratulations!</h3><p>You have completed the lesson: <strong>' + lesson.title + '</strong></p>',
            celebration: `
                <div style="text-align: center; font-size: 80px; animation: pulse 2s infinite;">🎉</div>
                <div style="background: linear-gradient(45deg, #FFC02D, #F2A900); color: white; padding: 20px; border-radius: 16px; text-align: center;">
                    <h4>🏆 Achievement Unlocked!</h4>
                    <p>+50 Points Earned</p>
                    <p>Keep up the excellent work!</p>
                </div>
            `
        };
    }
    
    showCompletionCelebration(lesson) {
        // Update lesson in data
        lesson.completed = true;
        lesson.progress = 100;
        
        // Show confetti effect (simple version)
        this.createConfettiEffect();
        
        // Update global stats
        this.currentUser.completedLessons++;
        this.updateDashboardStats();
    }
    
    createConfettiEffect() {
        const colors = ['#FFC02D', '#3B82F6', '#EC4899', '#8B5CF6', '#10B981'];
        const confettiContainer = document.createElement('div');
        confettiContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1000;
        `;
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: absolute;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}%;
                animation: confetti-fall ${1 + Math.random()}s linear forwards;
            `;
            confettiContainer.appendChild(confetti);
        }
        
        document.body.appendChild(confettiContainer);
        
        setTimeout(() => {
            document.body.removeChild(confettiContainer);
        }, 3000);
    }
    
    updateDashboardStats() {
        // Update stat numbers
        document.querySelector('.stat-number').textContent = this.currentUser.completedLessons;
        
        // Update strand progress
        this.animateProgressIndicators();
    }
    
    animateProgressIndicators() {
        const progressBars = document.querySelectorAll('.progress-fill, .progress-fill-small, .progress-fill-detailed');
        progressBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        });
        
        const circularProgress = document.querySelectorAll('.progress-fill, .progress-fill-large');
        circularProgress.forEach(circle => {
            const dashArray = circle.style.strokeDasharray;
            circle.style.strokeDasharray = '0 408';
            setTimeout(() => {
                circle.style.strokeDasharray = dashArray;
            }, 200);
        });
    }
    
    closeModal() {
        document.getElementById('lesson-modal').classList.add('hidden');
    }
    
    updateAssessmentStatus() {
        // Quick quiz status
        const quickQuizCard = document.querySelector('.assessment-card');
        const isCompleted = this.assessmentData.quickQuiz.completed;
        const statusText = quickQuizCard.querySelector('.card-description');
        
        if (isCompleted) {
            statusText.textContent = 'Great job! Try tomorrow\'s new quiz';
        }
    }
    
    updateProgressDashboard() {
        const progress = this.progressData.overall;
        
        // Update overall progress circle
        const circumference = 2 * Math.PI * 65; // radius = 65
        const progressLength = (progress.completion / 100) * circumference;
        const progressFill = document.querySelector('.progress-fill-large');
        if (progressFill) {
            progressFill.style.strokeDasharray = `${progressLength} ${circumference}`;
        }
        
        // Update percentage text
        const percentageElement = document.querySelector('.progress-percentage-large');
        if (percentageElement) {
            percentageElement.textContent = progress.completion + '%';
        }
        
        // Update detailed progress bars
        const strandProgressItems = document.querySelectorAll('.strand-progress-item');
        strandProgressItems.forEach((item, index) => {
            const strandKeys = Object.keys(this.progressData.strands);
            const strandKey = strandKeys[index];
            if (strandKey) {
                const strandData = this.progressData.strands[strandKey];
                const progressFill = item.querySelector('.progress-fill-detailed');
                const completionText = item.querySelector('.strand-completion');
                
                if (progressFill) {
                    progressFill.style.width = strandData.completion + '%';
                }
                
                if (completionText) {
                    completionText.textContent = `${strandData.completedLessons}/${strandData.totalLessons} lessons (${strandData.completion}%)`;
                }
            }
        });
    }
    
    // Teacher Module Functions
    initializeTeacherMode() {
        this.teacherData = {
            currentClass: {
                name: 'Class 4A',
                totalStudents: 25,
                activeStudents: 18,
                averageProgress: 67,
                lessonsCompleted: 156
            },
            students: this.generateStudentData()
        };
    }
    
    generateStudentData() {
        const studentNames = [
            'Amina', 'Kwame', 'Fatima', 'Kojo', 'Asha', 'Yaw', 'Mariam', 'Samuel',
            'Zainab', 'Emmanuel', 'Hawa', 'David', 'Ruth', 'Joseph', 'Grace',
            'Isaac', 'Mercy', 'Peter', 'Joyce', 'Paul', 'Rebecca', 'John', 'Mary', 'Stephen', 'Elizabeth'
        ];
        
        return studentNames.map((name, index) => ({
            id: `student-${index + 1}`,
            name: name,
            progress: Math.floor(Math.random() * 40) + 60, // 60-100%
            status: index < 18 ? 'online' : 'offline',
            points: Math.floor(Math.random() * 500) + 800,
            lastActivity: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString().split('T')[0]
        }));
    }
    
    setupTeacherEventListeners() {
        // Teacher mode will be accessible via a special button or key combination
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'T') {
                this.toggleTeacherMode();
            }
        });
    }
    
    toggleTeacherMode() {
        const teacherNavItem = document.createElement('button');
        teacherNavItem.className = 'nav-item';
        teacherNavItem.dataset.section = 'teacher';
        teacherNavItem.innerHTML = `
            <span class="nav-icon">👩‍🏫</span>
            <span class="nav-label">Teacher</span>
        `;
        
        document.querySelector('.nav-menu').appendChild(teacherNavItem);
        this.setupEventListeners();
        
        this.showNotification('Teacher mode activated! Use Ctrl+Shift+T to toggle.', 'success');
    }
    
    loadTeacherContent() {
        const teacherContent = `
            <div class="section-header">
                <h1 class="section-title">Teacher Dashboard</h1>
                <p class="section-subtitle">Monitor student progress and manage your class</p>
            </div>
            
            <div class="teacher-dashboard">
                <div class="class-overview">
                    <h3 class="card-title">Class Overview</h3>
                    <div class="class-stats">
                        <div class="class-stat-item">
                            <div class="class-stat-icon">👥</div>
                            <div class="class-stat-content">
                                <span class="class-stat-number">${this.teacherData.currentClass.totalStudents}</span>
                                <span class="class-stat-label">Total Students</span>
                            </div>
                        </div>
                        <div class="class-stat-item">
                            <div class="class-stat-icon">🟢</div>
                            <div class="class-stat-content">
                                <span class="class-stat-number">${this.teacherData.currentClass.activeStudents}</span>
                                <span class="class-stat-label">Active Now</span>
                            </div>
                        </div>
                        <div class="class-stat-item">
                            <div class="class-stat-icon">📊</div>
                            <div class="class-stat-content">
                                <span class="class-stat-number">${this.teacherData.currentClass.averageProgress}%</span>
                                <span class="class-stat-label">Class Average</span>
                            </div>
                        </div>
                        <div class="class-stat-item">
                            <div class="class-stat-icon">🎯</div>
                            <div class="class-stat-content">
                                <span class="class-stat-number">${this.teacherData.currentClass.lessonsCompleted}</span>
                                <span class="class-stat-label">Lessons Completed</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="student-list">
                    <h3 class="card-title">Student Progress</h3>
                    <div class="student-list-container">
                        ${this.teacherData.students.map(student => `
                            <div class="student-item">
                                <div class="student-info">
                                    <div class="student-avatar">${student.name[0]}</div>
                                    <div class="student-details">
                                        <div class="student-name">${student.name}</div>
                                        <div class="student-progress">${student.progress}% complete • ${student.points} points</div>
                                    </div>
                                </div>
                                <div class="student-status status-${student.status}">
                                    <span>●</span>
                                    <span>${student.status === 'online' ? 'Online' : 'Offline'}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        const section = document.getElementById('teacher-section');
        if (section) {
            section.innerHTML = teacherContent;
        } else {
            // Create teacher section if it doesn't exist
            const teacherSection = document.createElement('section');
            teacherSection.id = 'teacher-section';
            teacherSection.className = 'content-section';
            teacherSection.innerHTML = teacherContent;
            document.querySelector('.app-container').appendChild(teacherSection);
        }
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#22C55E' : '#3B82F6'};
            color: white;
            padding: 16px 24px;
            border-radius: 16px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.1);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    openStrandLessons(strand) {
        // Switch to lessons section and filter by strand
        this.navigateToSection('lessons');
        this.filterLessons(strand);
    }
    
    continueLastLesson() {
        // Find the lesson with highest progress that's not complete
        let lastLesson = null;
        let highestProgress = 0;
        
        Object.values(this.lessonData).flat().forEach(lesson => {
            if (!lesson.completed && lesson.progress > highestProgress) {
                highestProgress = lesson.progress;
                lastLesson = lesson;
            }
        });
        
        if (lastLesson) {
            const strandKey = Object.keys(this.lessonData).find(key => 
                this.lessonData[key].some(l => l.id === lastLesson.id)
            );
            this.openLesson(strandKey, lastLesson.id);
        } else {
            // Start first incomplete lesson
            const firstIncomplete = Object.values(this.lessonData).flat().find(l => !l.completed);
            if (firstIncomplete) {
                const strandKey = Object.keys(this.lessonData).find(key => 
                    this.lessonData[key].some(l => l.id === firstIncomplete.id)
                );
                this.openLesson(strandKey, firstIncomplete.id);
            }
        }
    }
    
    startAssessment(type, assessmentId) {
        if (type === 'quick') {
            this.showNotification('Starting quick quiz...', 'success');
            // Implementation for quick quiz would go here
        } else {
            this.showNotification('Starting assessment...', 'success');
            // Implementation for strand assessment would go here
        }
    }
    
    loadInitialContent() {
        // Initialize content based on current section
        this.loadDashboardContent();
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.gmlsApp = new GMLSApp();
});

// Add CSS for confetti and notifications
const additionalStyles = `
    @keyframes confetti-fall {
        to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .class-stats {
        display: flex;
        flex-direction: column;
        gap: var(--space-md);
    }
    
    .class-stat-item {
        display: flex;
        align-items: center;
        gap: var(--space-sm);
        padding: var(--space-sm);
        background: var(--bg-page);
        border-radius: var(--radius-sm);
    }
    
    .class-stat-icon {
        font-size: 24px;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--primary-100);
        border-radius: var(--radius-sm);
    }
    
    .class-stat-content {
        flex: 1;
    }
    
    .class-stat-number {
        display: block;
        font-size: 20px;
        font-weight: 700;
        color: var(--primary-700);
    }
    
    .class-stat-label {
        font-size: 14px;
        color: var(--text-secondary);
    }
    
    .student-list-container {
        max-height: 500px;
        overflow-y: auto;
    }
`;

// Add the styles to the document
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);