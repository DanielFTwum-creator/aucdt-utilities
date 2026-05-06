// Golden Mathematics Class 4 - Lessons Module
class LessonsModule {
    constructor(app) {
        this.app = app;
        this.interactiveComponents = new Map();
        this.setupInteractiveElements();
    }
    
    setupInteractiveElements() {
        this.setupMathManipulatives();
        this.setupVisualPatterns();
        this.setupShapeRecognition();
        this.setupDataVisualization();
    }
    
    setupMathManipulatives() {
        // Base-ten blocks for place value understanding
        this.createBaseTenBlocks();
    }
    
    createBaseTenBlocks() {
        this.interactiveComponents.set('base-ten-blocks', {
            create: (container, number) => {
                const blocks = this.generateBaseTenBlocks(number);
                container.innerHTML = `
                    <div class="base-ten-container">
                        <h4>Represent ${number} with base-ten blocks</h4>
                        <div class="blocks-visualization">
                            <div class="thousands-group">${blocks.thousands > 0 ? '🟫'.repeat(blocks.thousands) : ''}</div>
                            <div class="hundreds-group">${blocks.hundreds > 0 ? '🟨'.repeat(blocks.hundreds) : ''}</div>
                            <div class="tens-group">${blocks.tens > 0 ? '🟩'.repeat(blocks.tens) : ''}</div>
                            <div class="ones-group">${blocks.ones > 0 ? '🟥'.repeat(blocks.ones) : ''}</div>
                        </div>
                        <div class="blocks-legend">
                            <div><span class="block-symbol">🟫</span> Thousands</div>
                            <div><span class="block-symbol">🟨</span> Hundreds</div>
                            <div><span class="block-symbol">🟩</span> Tens</div>
                            <div><span class="block-symbol">🟥</span> Ones</div>
                        </div>
                    </div>
                `;
            },
            generateBaseTenBlocks: (number) => {
                return {
                    thousands: Math.floor(number / 1000),
                    hundreds: Math.floor((number % 1000) / 100),
                    tens: Math.floor((number % 100) / 10),
                    ones: number % 10
                };
            }
        });
    }
    
    setupVisualPatterns() {
        // Pattern creation and recognition tools
        this.interactiveComponents.set('pattern-creator', {
            create: (container, patternType) => {
                container.innerHTML = `
                    <div class="pattern-creator">
                        <h4>Create a ${patternType} pattern</h4>
                        <div class="pattern-sequence" id="pattern-sequence">
                            <!-- Pattern will be generated -->
                        </div>
                        <div class="pattern-builder">
                            <h5>Click blocks to add to your pattern:</h5>
                            <div class="pattern-blocks">
                                <button class="pattern-block" data-shape="circle" style="background: #3B82F6;">●</button>
                                <button class="pattern-block" data-shape="square" style="background: #EF4444;">■</button>
                                <button class="pattern-block" data-shape="triangle" style="background: #10B981;">▲</button>
                                <button class="pattern-block" data-shape="star" style="background: #F59E0B;">★</button>
                            </div>
                        </div>
                        <div class="pattern-feedback">
                            <p>Create a repeating pattern using the blocks above!</p>
                        </div>
                    </div>
                `;
                
                this.setupPatternInteraction(container);
            },
            setupPatternInteraction: (container) => {
                const sequence = container.querySelector('#pattern-sequence');
                const blocks = container.querySelectorAll('.pattern-block');
                const feedback = container.querySelector('.pattern-feedback');
                
                blocks.forEach(block => {
                    block.addEventListener('click', () => {
                        const shape = block.dataset.shape;
                        const shapeSymbol = block.textContent;
                        
                        // Add to sequence
                        const newBlock = document.createElement('span');
                        newBlock.className = 'pattern-element';
                        newBlock.textContent = shapeSymbol;
                        newBlock.style.cssText = block.style.cssText;
                        sequence.appendChild(newBlock);
                        
                        // Check pattern
                        this.checkPattern(container);
                    });
                });
                
                // Create initial pattern
                this.generatePattern(container, patternType);
            },
            generatePattern: (container, type) => {
                const sequence = container.querySelector('#pattern-sequence');
                const patterns = {
                    'ABAB': ['circle', 'square', 'circle', 'square'],
                    'ABC': ['circle', 'square', 'triangle'],
                    'AABB': ['circle', 'circle', 'square', 'square']
                };
                
                const pattern = patterns[type] || patterns['ABAB'];
                const symbols = { circle: '●', square: '■', triangle: '▲' };
                
                pattern.forEach(shape => {
                    const element = document.createElement('span');
                    element.className = 'pattern-element';
                    element.textContent = symbols[shape];
                    sequence.appendChild(element);
                });
            },
            checkPattern: (container) => {
                const sequence = container.querySelector('#pattern-sequence');
                const elements = sequence.querySelectorAll('.pattern-element');
                const feedback = container.querySelector('.pattern-feedback p');
                
                if (elements.length >= 4) {
                    const lastElements = Array.from(elements).slice(-4);
                    const colors = lastElements.map(el => el.style.background);
                    
                    // Simple pattern checking
                    const hasPattern = this.detectPattern(colors);
                    if (hasPattern) {
                        feedback.textContent = '🎉 Great pattern! Can you make it repeat?';
                        feedback.style.color = '#22C55E';
                    } else {
                        feedback.textContent = 'Keep going! Try to create a repeating pattern.';
                        feedback.style.color = '#F59E0B';
                    }
                }
            },
            detectPattern: (colors) => {
                // Simple pattern detection for ABAB or ABC patterns
                if (colors.length < 4) return false;
                
                const lastFour = colors.slice(-4);
                return (
                    (lastFour[0] === lastFour[2] && lastFour[1] === lastFour[3]) || // ABAB
                    (lastFour[0] === lastFour[1] && lastFour[2] === lastFour[3]) || // AABB
                    true // Accept all patterns for now
                );
            }
        });
    }
    
    setupShapeRecognition() {
        // Interactive shape identification and properties
        this.interactiveComponents.set('shape-explorer', {
            create: (container, shapes) => {
                container.innerHTML = `
                    <div class="shape-explorer">
                        <h4>Explore 2D and 3D Shapes</h4>
                        <div class="shapes-grid">
                            ${shapes.map(shape => `
                                <div class="shape-card" data-shape="${shape.id}">
                                    <div class="shape-visual">${shape.symbol}</div>
                                    <h5>${shape.name}</h5>
                                    <div class="shape-properties">
                                        <p><strong>Sides:</strong> ${shape.sides}</p>
                                        <p><strong>Corners:</strong> ${shape.corners}</p>
                                        ${shape.volume ? `<p><strong>Volume:</strong> ${shape.volume}</p>` : ''}
                                    </div>
                                    <button class="explore-shape-btn">Explore</button>
                                </div>
                            `).join('')}
                        </div>
                        <div class="shape-details" id="shape-details"></div>
                    </div>
                `;
                
                this.setupShapeInteraction(container);
            },
            setupShapeInteraction: (container) => {
                const shapeCards = container.querySelectorAll('.shape-card');
                const detailsContainer = container.querySelector('#shape-details');
                
                shapeCards.forEach(card => {
                    card.addEventListener('click', () => {
                        const shape = card.dataset.shape;
                        this.showShapeDetails(detailsContainer, shape, card);
                    });
                });
            },
            showShapeDetails: (container, shapeId, card) => {
                const shapeData = {
                    circle: {
                        name: 'Circle',
                        properties: [
                            'A circle has no sides or corners',
                            'All points are the same distance from the center',
                            'It can roll easily'
                        ],
                        realWorld: ['Wheels', 'Coins', 'Clock faces', 'Pizza']
                    },
                    square: {
                        name: 'Square',
                        properties: [
                            'A square has 4 equal sides',
                            'A square has 4 corners (right angles)',
                            'All angles are 90 degrees'
                        ],
                        realWorld: ['Dice', 'Windows', 'Tiles', 'Boxes']
                    },
                    triangle: {
                        name: 'Triangle',
                        properties: [
                            'A triangle has 3 sides',
                            'A triangle has 3 corners',
                            'The sides can be different lengths'
                        ],
                        realWorld: ['Roofs', 'Slices of pizza', 'Sails', 'Mountain peaks']
                    }
                };
                
                const shape = shapeData[shapeId];
                if (!shape) return;
                
                container.innerHTML = `
                    <div class="shape-detail-card">
                        <h5>${shape.name} Details</h5>
                        <div class="shape-detail-content">
                            <div class="shape-properties-detail">
                                <h6>Properties:</h6>
                                <ul>
                                    ${shape.properties.map(prop => `<li>${prop}</li>`).join('')}
                                </ul>
                            </div>
                            <div class="shape-examples">
                                <h6>Real World Examples:</h6>
                                <div class="examples-list">
                                    ${shape.realWorld.map(example => `<span class="example-tag">${example}</span>`).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }
        });
    }
    
    setupDataVisualization() {
        // Interactive data collection and graphing
        this.interactiveComponents.set('data-collector', {
            create: (container) => {
                container.innerHTML = `
                    <div class="data-collector">
                        <h4>Collect and Display Data</h4>
                        <div class="survey-creator">
                            <h5>Create a survey question:</h5>
                            <div class="survey-options">
                                <button class="survey-question" data-question="favorite-color">
                                    What is your favorite color?
                                </button>
                                <button class="survey-question" data-question="transportation">
                                    How do you get to school?
                                </button>
                                <button class="survey-question" data-question="pets">
                                    Do you have pets?
                                </button>
                            </div>
                        </div>
                        <div class="data-visualization">
                            <canvas id="data-chart" width="400" height="200"></canvas>
                        </div>
                        <div class="survey-results" id="survey-results"></div>
                    </div>
                `;
                
                this.setupSurveyInteraction(container);
            },
            setupSurveyInteraction: (container) => {
                const questions = container.querySelectorAll('.survey-question');
                const chart = container.querySelector('#data-chart');
                const results = container.querySelector('#survey-results');
                
                const surveyData = {
                    'favorite-color': {
                        question: 'What is your favorite color?',
                        options: ['Red', 'Blue', 'Green', 'Yellow'],
                        data: [8, 12, 6, 4]
                    },
                    'transportation': {
                        question: 'How do you get to school?',
                        options: ['Walk', 'Car', 'Bus', 'Bicycle'],
                        data: [10, 8, 5, 2]
                    },
                    'pets': {
                        question: 'Do you have pets?',
                        options: ['Yes', 'No'],
                        data: [18, 7]
                    }
                };
                
                questions.forEach(question => {
                    question.addEventListener('click', () => {
                        const questionId = question.dataset.question;
                        const data = surveyData[questionId];
                        this.displaySurveyResults(results, data);
                        this.drawChart(chart, data);
                    });
                });
            },
            displaySurveyResults: (container, data) => {
                container.innerHTML = `
                    <div class="results-display">
                        <h5>${data.question}</h5>
                        <div class="results-list">
                            ${data.options.map((option, index) => `
                                <div class="result-item">
                                    <span class="result-label">${option}:</span>
                                    <div class="result-bar">
                                        <div class="result-fill" style="width: ${(data.data[index] / Math.max(...data.data)) * 100}%"></div>
                                    </div>
                                    <span class="result-count">${data.data[index]}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            },
            drawChart: (canvas, data) => {
                const ctx = canvas.getContext('2d');
                const width = canvas.width;
                const height = canvas.height;
                const padding = 40;
                
                // Clear canvas
                ctx.clearRect(0, 0, width, height);
                
                // Draw bar chart
                const barWidth = (width - 2 * padding) / data.data.length;
                const maxValue = Math.max(...data.data);
                
                data.data.forEach((value, index) => {
                    const barHeight = (value / maxValue) * (height - 2 * padding);
                    const x = padding + index * barWidth;
                    const y = height - padding - barHeight;
                    
                    // Colour palette for bars
                    const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6'];
                    ctx.fillStyle = colors[index % colors.length];
                    
                    // Draw bar
                    ctx.fillRect(x + 5, y, barWidth - 10, barHeight);
                    
                    // Draw label
                    ctx.fillStyle = '#413A28';
                    ctx.font = '12px Nunito';
                    ctx.textAlign = 'center';
                    ctx.fillText(data.options[index], x + barWidth / 2, height - 20);
                    
                    // Draw value
                    ctx.fillText(value.toString(), x + barWidth / 2, y - 5);
                });
            }
        });
    }
    
    // Enhanced lesson content generators
    createNumberOperationsLesson(lessonType) {
        const lessons = {
            'counting': {
                title: 'Counting to 1000',
                activities: [
                    {
                        type: 'sequence-builder',
                        instruction: 'Build the number sequence by clicking the next number',
                        content: this.createSequenceBuilder()
                    },
                    {
                        type: 'number-line',
                        instruction: 'Find the missing numbers on the number line',
                        content: this.createNumberLine()
                    }
                ]
            },
            'place-value': {
                title: 'Place Value Understanding',
                activities: [
                    {
                        type: 'base-ten-blocks',
                        instruction: 'Represent the number using base-ten blocks',
                        content: this.createPlaceValueBlocks()
                    }
                ]
            },
            'addition': {
                title: 'Addition with Regrouping',
                activities: [
                    {
                        type: 'column-addition',
                        instruction: 'Solve these addition problems',
                        content: this.createAdditionProblems()
                    }
                ]
            }
        };
        
        return lessons[lessonType];
    }
    
    createSequenceBuilder() {
        return `
            <div class="sequence-builder">
                <h4>Number Sequence Builder</h4>
                <p>Click the numbers in order from 1 to 20:</p>
                <div class="number-grid">
                    ${Array.from({length: 20}, (_, i) => 
                        `<button class="sequence-number" data-number="${i + 1}">${i + 1}</button>`
                    ).join('')}
                </div>
                <div class="sequence-feedback">
                    <p>Click the numbers in order!</p>
                </div>
            </div>
        `;
    }
    
    createNumberLine() {
        return `
            <div class="number-line">
                <h4>Number Line Challenge</h4>
                <p>Fill in the missing numbers:</p>
                <div class="number-line-visual">
                    <span class="number-marker">0</span>
                    <span class="number-marker">2</span>
                    <span class="number-marker gap">?</span>
                    <span class="number-marker">6</span>
                    <span class="number-marker">8</span>
                    <span class="number-marker gap">?</span>
                    <span class="number-marker">12</span>
                </div>
                <div class="number-line-inputs">
                    <input type="number" placeholder="First gap" class="gap-input" data-gap="1">
                    <input type="number" placeholder="Second gap" class="gap-input" data-gap="2">
                    <button class="check-answers-btn">Check Answers</button>
                </div>
            </div>
        `;
    }
    
    createPlaceValueBlocks() {
        return `
            <div class="place-value-blocks">
                <h4>Build the Number</h4>
                <p>Represent the number using base-ten blocks:</p>
                <div class="number-display">
                    <span class="target-number">347</span>
                </div>
                <div class="blocks-workspace">
                    <div class="block-category">
                        <h5>🟨 Hundreds (100s)</h5>
                        <div class="block-options">
                            <button class="block hundreds" data-value="100">100</button>
                            <button class="block hundreds" data-value="200">200</button>
                            <button class="block hundreds" data-value="300">300</button>
                        </div>
                    </div>
                    <div class="block-category">
                        <h5>🟩 Tens (10s)</h5>
                        <div class="block-options">
                            <button class="block tens" data-value="10">10</button>
                            <button class="block tens" data-value="20">20</button>
                            <button class="block tens" data-value="30">30</button>
                            <button class="block tens" data-value="40">40</button>
                        </div>
                    </div>
                    <div class="block-category">
                        <h5>🟥 Ones (1s)</h5>
                        <div class="block-options">
                            <button class="block ones" data-value="1">1</button>
                            <button class="block ones" data-value="2">2</button>
                            <button class="block ones" data-value="3">3</button>
                            <button class="block ones" data-value="4">4</button>
                            <button class="block ones" data-value="5">5</button>
                            <button class="block ones" data-value="6">6</button>
                            <button class="block ones" data-value="7">7</button>
                        </div>
                    </div>
                </div>
                <div class="current-total">
                    <p>Current Total: <span id="total-display">0</span></p>
                </div>
            </div>
        `;
    }
    
    createAdditionProblems() {
        const problems = [
            { num1: 247, num2: 158 },
            { num1: 369, num2: 174 },
            { num1: 156, num2: 287 }
        ];
        
        return `
            <div class="addition-problems">
                <h4>Column Addition Practice</h4>
                ${problems.map((problem, index) => `
                    <div class="addition-problem" data-problem="${index}">
                        <div class="problem-numbers">
                            <div class="number-line">
                                <span class="addend">${problem.num1}</span>
                                <span class="operator">+</span>
                                <span class="addend">${problem.num2}</span>
                            </div>
                        </div>
                        <div class="addition-grid">
                            <div class="digit-column">
                                <label>Hundreds:</label>
                                <input type="number" class="digit-input" data-place="hundreds" min="0" max="9">
                            </div>
                            <div class="digit-column">
                                <label>Tens:</label>
                                <input type="number" class="digit-input" data-place="tens" min="0" max="9">
                            </div>
                            <div class="digit-column">
                                <label>Ones:</label>
                                <input type="number" class="digit-input" data-place="ones" min="0" max="9">
                            </div>
                        </div>
                        <div class="problem-feedback" id="feedback-${index}"></div>
                    </div>
                `).join('')}
                <button class="check-all-btn">Check All Answers</button>
            </div>
        `;
    }
    
    // Algebra and Pattern lessons
    createPatternLesson(lessonType) {
        const lessons = {
            'visual-patterns': {
                title: 'Visual Patterns',
                content: `
                    <div class="pattern-lesson">
                        <h4>Find the Pattern</h4>
                        <p>Look at the sequence and identify what comes next:</p>
                        <div class="pattern-sequence-display">
                            <span class="pattern-item">🔵</span>
                            <span class="pattern-item">🔴</span>
                            <span class="pattern-item">🔵</span>
                            <span class="pattern-item">🔴</span>
                            <span class="pattern-item">🔵</span>
                            <span class="pattern-item">🔴</span>
                            <span class="pattern-item">?</span>
                        </div>
                        <div class="pattern-choices">
                            <button class="pattern-choice" data-answer="blue">🔵</button>
                            <button class="pattern-choice" data-answer="red">🔴</button>
                            <button class="pattern-choice" data-answer="green">🟢</button>
                        </div>
                    </div>
                `
            },
            'number-sequences': {
                title: 'Number Sequences',
                content: `
                    <div class="sequence-lesson">
                        <h4>Number Patterns</h4>
                        <p>Find the missing numbers in these sequences:</p>
                        <div class="sequence-problems">
                            <div class="sequence-problem">
                                <p>2, 4, 6, 8, __, 12</p>
                                <input type="number" class="sequence-input" placeholder="Enter the missing number">
                            </div>
                            <div class="sequence-problem">
                                <p>1, 4, 7, 10, __, 16</p>
                                <input type="number" class="sequence-input" placeholder="Enter the missing number">
                            </div>
                            <div class="sequence-problem">
                                <p>20, 15, 10, 5, __, -5</p>
                                <input type="number" class="sequence-input" placeholder="Enter the missing number">
                            </div>
                        </div>
                        <button class="check-sequences-btn">Check Sequences</button>
                    </div>
                `
            }
        };
        
        return lessons[lessonType];
    }
    
    // Geometry and Measurement lessons
    createGeometryLesson(lessonType) {
        const lessons = {
            '2d-shapes': {
                title: '2D Shapes',
                content: this.interactiveComponents.get('shape-explorer')?.create || this.createBasicShapeLesson()
            },
            '3d-shapes': {
                title: '3D Shapes',
                content: `
                    <div class="shapes-3d">
                        <h4>Explore 3D Shapes</h4>
                        <div class="shapes-3d-grid">
                            <div class="shape-3d-card">
                                <div class="shape-3d-visual">📦</div>
                                <h5>Cube</h5>
                                <p>6 faces, 8 corners, 12 edges</p>
                            </div>
                            <div class="shape-3d-card">
                                <div class="shape-3d-visual">⚽</div>
                                <h5>Sphere</h5>
                                <p>0 faces, 0 corners, 0 edges</p>
                            </div>
                            <div class="shape-3d-card">
                                <div class="shape-3d-visual">🥤</div>
                                <h5>Cylinder</h5>
                                <p>3 faces, 0 corners, 2 edges</p>
                            </div>
                            <div class="shape-3d-card">
                                <div class="shape-3d-visual">🔺</div>
                                <h5>Triangular Pyramid</h5>
                                <p>4 faces, 4 corners, 6 edges</p>
                            </div>
                        </div>
                    </div>
                `
            },
            'measurement': {
                title: 'Measuring Length',
                content: `
                    <div class="measurement-lesson">
                        <h4>Length Measurement</h4>
                        <p>Use the ruler to measure these objects:</p>
                        <div class="measurement-tools">
                            <div class="ruler">
                                <div class="ruler-ticks">
                                    ${Array.from({length: 21}, (_, i) => 
                                        `<div class="ruler-tick" data-length="${i}">${i}</div>`
                                    ).join('')}
                                </div>
                            </div>
                        </div>
                        <div class="objects-measure">
                            <div class="measurement-object" data-object="pencil">
                                <div class="object-visual" style="width: 12cm; height: 1cm; background: #F59E0B;">✏️</div>
                                <p>How long is this pencil?</p>
                                <input type="number" class="measurement-input" placeholder="centimeters">
                            </div>
                            <div class="measurement-object" data-object="book">
                                <div class="object-visual" style="width: 25cm; height: 2cm; background: #3B82F6;">📕</div>
                                <p>How wide is this book?</p>
                                <input type="number" class="measurement-input" placeholder="centimeters">
                            </div>
                        </div>
                        <button class="check-measurements-btn">Check Measurements</button>
                    </div>
                `
            }
        };
        
        return lessons[lessonType];
    }
    
    createBasicShapeLesson() {
        const shapes = [
            { id: 'circle', name: 'Circle', symbol: '⭕', sides: 0, corners: 0 },
            { id: 'square', name: 'Square', symbol: '⬜', sides: 4, corners: 4 },
            { id: 'triangle', name: 'Triangle', symbol: '🔺', sides: 3, corners: 3 },
            { id: 'rectangle', name: 'Rectangle', symbol: '▬', sides: 4, corners: 4 }
        ];
        
        return this.interactiveComponents.get('shape-explorer')?.create(null, shapes) || 
               `<div class="basic-shape-lesson">Shape lesson content will be displayed here.</div>`;
    }
    
    // Data Handling lessons
    createDataLesson(lessonType) {
        return this.interactiveComponents.get('data-collector')?.create || 
               `<div class="data-lesson">Data lesson content will be displayed here.</div>`;
    }
    
    // Utility methods for lesson interactions
    setupLessonInteractivity(container) {
        // Sequence number interactions
        const sequenceNumbers = container.querySelectorAll('.sequence-number');
        let currentNumber = 1;
        
        sequenceNumbers.forEach(btn => {
            btn.addEventListener('click', () => {
                if (parseInt(btn.dataset.number) === currentNumber) {
                    btn.style.background = '#22C55E';
                    btn.style.color = 'white';
                    currentNumber++;
                    
                    if (currentNumber > 20) {
                        this.showSuccess(container, '🎉 Excellent! You completed the sequence!');
                    }
                } else {
                    btn.style.background = '#EF4444';
                    btn.style.color = 'white';
                    setTimeout(() => {
                        btn.style.background = '';
                        btn.style.color = '';
                    }, 500);
                }
            });
        });
        
        // Number line gap checking
        const gapInputs = container.querySelectorAll('.gap-input');
        const checkBtn = container.querySelector('.check-answers-btn');
        
        checkBtn?.addEventListener('click', () => {
            const answers = Array.from(gapInputs).map(input => parseInt(input.value));
            const correctAnswers = [4, 10];
            
            if (answers.length === correctAnswers.length && 
                answers.every((ans, i) => ans === correctAnswers[i])) {
                this.showSuccess(container, '✅ Perfect! All answers are correct!');
            } else {
                this.showError(container, '❌ Not quite right. Try again!');
            }
        });
        
        // Block selection for place value
        const blocks = container.querySelectorAll('.block');
        let total = 0;
        
        blocks.forEach(block => {
            block.addEventListener('click', () => {
                const value = parseInt(block.dataset.value);
                total += value;
                
                const display = container.querySelector('#total-display');
                display.textContent = total;
                
                // Visual feedback
                block.style.background = '#22C55E';
                block.style.color = 'white';
                
                setTimeout(() => {
                    block.style.background = '';
                    block.style.color = '';
                }, 300);
            });
        });
    }
    
    showSuccess(container, message) {
        const feedback = container.querySelector('.sequence-feedback') || 
                        container.querySelector('.pattern-feedback') ||
                        container;
        
        if (feedback) {
            feedback.innerHTML = `<p style="color: #22C55E; font-weight: bold;">${message}</p>`;
            feedback.style.background = '#F0FDF4';
            feedback.style.border = '2px solid #22C55E';
            feedback.style.borderRadius = '8px';
            feedback.style.padding = '12px';
        }
    }
    
    showError(container, message) {
        const feedback = container.querySelector('.sequence-feedback') || 
                        container.querySelector('.pattern-feedback') ||
                        container;
        
        if (feedback) {
            feedback.innerHTML = `<p style="color: #EF4444; font-weight: bold;">${message}</p>`;
            feedback.style.background = '#FEF2F2';
            feedback.style.border = '2px solid #EF4444';
            feedback.style.borderRadius = '8px';
            feedback.style.padding = '12px';
        }
    }
}

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LessonsModule;
}