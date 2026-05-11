import { Question } from './types';

export const sampleQuestions: Question[] = [
  {
    id: 1,
    question: "Based on the diagram, what is the area of the circle with radius 5?",
    options: ["25π cm²", "10π cm²", "15π cm²", "5π cm²"],
    correct: 0,
    topic: "Geometry",
    cognitive_level: "Application",
    svgContent: `<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagram of a circle with its radius labeled as 5.">
      <title>Circle Diagram</title>
      <desc>A circle with its center marked. A horizontal line extends from the center to the edge, representing the radius, which is labeled 'r = 5'.</desc>
      <circle cx="100" cy="100" r="60" stroke="var(--text-primary)" stroke-width="2" fill="none"/>
      <line x1="100" y1="100" x2="160" y2="100" stroke="var(--text-primary)" stroke-width="1"/>
      <text x="125" y="95" fill="var(--text-primary)" font-size="12">r = 5</text>
      <circle cx="100" cy="100" r="2" fill="var(--text-primary)"/>
    </svg>`,
    chartJsConfig: null
  },
  {
    id: 2,
    question: "According to the chart, which student scored the highest on the test?",
    options: ["Alice", "Bob", "Charlie", "Diana"],
    correct: 3,
    topic: "Statistics",
    cognitive_level: "Analysis",
    svgContent: null,
    chartJsConfig: {
      type: 'bar',
      data: {
        labels: ['Alice', 'Bob', 'Charlie', 'Diana'],
        datasets: [{
          data: [78, 85, 72, 92],
          backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
          borderColor: '#FFFFFF',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Test Scores',
            color: '#FFFFFF',
            font: { size: 16 }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { color: '#FFFFFF' },
            grid: { color: '#374151' },
            title: {
              display: true,
              text: 'Score',
              color: '#FFFFFF'
            }
          },
          x: {
            ticks: { color: '#FFFFFF' },
            grid: { color: '#374151' },
            title: {
              display: true,
              text: 'Students',
              color: '#FFFFFF'
            }
          }
        }
      }
    }
  },
  {
    id: 3,
    question: "Based on the coordinate plane, what are the coordinates of point P?",
    options: ["(3, 2)", "(2, 3)", "(4, 1)", "(1, 4)"],
    correct: 0,
    topic: "Coordinate Geometry",
    cognitive_level: "Knowledge",
    svgContent: `<svg width="300" height="300" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A coordinate plane showing point P located at coordinates (3, 2).">
      <title>Coordinate Plane</title>
      <desc>A grid with x and y axes. The origin (0,0) is at the center. Point P is marked in the top-right quadrant, 3 units to the right on the x-axis and 2 units up on the y-axis.</desc>
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--border-primary)" stroke-width="0.5"/>
        </pattern>
      </defs>
      <rect width="300" height="300" fill="url(#grid)"/>
      <line x1="0" y1="150" x2="300" y2="150" stroke="var(--text-primary)" stroke-width="2"/>
      <line x1="150" y1="0" x2="150" y2="300" stroke="var(--text-primary)" stroke-width="2"/>
      <circle cx="210" cy="110" r="4" fill="var(--feedback-error)"/>
      <text x="220" y="105" fill="var(--text-primary)" font-size="14" font-weight="bold">P</text>
      <text x="290" y="145" fill="var(--text-primary)" font-size="12">x</text>
      <text x="155" y="15" fill="var(--text-primary)" font-size="12">y</text>
      <text x="145" y="165" fill="var(--text-primary)" font-size="10">0</text>
    </svg>`,
    chartJsConfig: null
  },
  {
    id: 4,
    question: "Solve for x: $3x + 7 = 16$",
    options: ["x = 3", "x = 4", "x = 5", "x = 2"],
    correct: 0,
    topic: "Algebra",
    cognitive_level: "Application",
    svgContent: null,
    chartJsConfig: null
  },
  {
    id: 5,
    question: "What is the area of the rectangle shown below?",
    options: ["24 cm²", "28 cm²", "48 cm²", "12 cm²"],
    correct: 0,
    topic: "Geometry",
    cognitive_level: "Knowledge",
    svgContent: `<svg width="200" height="150" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A rectangle with its length labeled as 8 cm and its width as 3 cm.">
      <title>Rectangle Diagram</title>
      <desc>A horizontal rectangle. The bottom side is labeled 'Length = 8 cm' and the left side is labeled 'Width = 3 cm'.</desc>
      <rect x="50" y="25" width="100" height="75" stroke="var(--text-primary)" stroke-width="2" fill="none"/>
      <text x="95" y="110" fill="var(--text-primary)" font-size="12">Length = 8 cm</text>
      <text x="30" y="60" fill="var(--text-primary)" font-size="12" transform="rotate(-90 30 60)">Width = 3 cm</text>
    </svg>`,
    chartJsConfig: null
  },
  {
    id: 6,
    question: "Based on the pie chart, what percentage of the survey respondents preferred apples?",
    options: ["25%", "30%", "40%", "20%"],
    correct: 1,
    topic: "Statistics",
    cognitive_level: "Analysis",
    svgContent: null,
    chartJsConfig: {
      type: 'doughnut',
      data: {
        labels: ['Apples', 'Oranges', 'Bananas', 'Grapes'],
        datasets: [{
          data: [30, 25, 20, 25],
          backgroundColor: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6'],
          borderColor: '#FFFFFF',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#FFFFFF' } },
          title: { display: true, text: 'Favorite Fruits', color: '#FFFFFF', font: { size: 16 } }
        }
      }
    }
  },
  {
    id: 7,
    question: "Which of the following is a prime number?",
    options: ["9", "15", "17", "21"],
    correct: 2,
    topic: "Number Theory",
    cognitive_level: "Knowledge",
    svgContent: null,
    chartJsConfig: null
  },
  {
    id: 8,
    question: "What is the perimeter of the triangle shown?",
    options: ["12 cm", "15 cm", "18 cm", "20 cm"],
    correct: 1,
    topic: "Geometry",
    cognitive_level: "Application",
    svgContent: `<svg width="200" height="150" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A triangle with side lengths labeled 4 cm, 5 cm, and 6 cm.">
      <title>Triangle Diagram</title>
      <desc>A scalene triangle with its three sides explicitly labeled with their lengths: 4 cm, 5 cm, and 6 cm.</desc>
      <polygon points="100,20 160,120 40,120" stroke="var(--text-primary)" stroke-width="2" fill="none"/>
      <text x="95" y="135" fill="var(--text-primary)" font-size="12">6 cm</text>
      <text x="145" y="70" fill="var(--text-primary)" font-size="12">5 cm</text>
      <text x="50" y="70" fill="var(--text-primary)" font-size="12">4 cm</text>
    </svg>`,
    chartJsConfig: null
  },
  {
    id: 9,
    question: "What was the highest temperature recorded on Tuesday?",
    options: ["20°C", "22°C", "25°C", "18°C"],
    correct: 1,
    topic: "Algebra (Graph Interpretation)",
    cognitive_level: "Analysis",
    svgContent: null,
    chartJsConfig: {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        datasets: [{ label: 'Temperature (°C)', data: [18, 22, 20, 23, 19], borderColor: '#3B82F6', tension: 0.1, borderWidth: 2, pointBackgroundColor: '#3B82F6' }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#FFFFFF' } },
          title: { display: true, text: 'Weekly Temperatures', color: '#FFFFFF', font: { size: 16 } }
        },
        scales: {
          y: { ticks: { color: '#FFFFFF' }, grid: { color: '#374151' }, title: { display: true, text: 'Temperature (°C)', color: '#FFFFFF' } },
          x: { ticks: { color: '#FFFFFF' }, grid: { color: '#374151' }, title: { display: true, text: 'Day', color: '#FFFFFF' } }
        }
      }
    }
  },
  {
    id: 10,
    question: "What is the volume of a cube with side length 4 units?",
    options: ["16 cubic units", "32 cubic units", "64 cubic units", "8 cubic units"],
    correct: 2,
    topic: "Geometry",
    cognitive_level: "Application",
    svgContent: `<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A 3D representation of a cube with its side length labeled as 4.">
      <title>Cube Diagram</title>
      <desc>A wireframe drawing of a cube, showing its three-dimensional form. A label below reads 'Side = 4'.</desc>
      <path d="M 50 50 L 150 50 L 150 150 L 50 150 Z" stroke="var(--text-primary)" stroke-width="2" fill="none"/>
      <path d="M 50 50 L 100 20 L 200 20 L 150 50 L 150 150 L 200 120 L 100 120 L 50 150 Z" stroke="var(--text-primary)" stroke-width="2" fill="none"/>
      <path d="M 100 20 L 100 120" stroke="var(--text-primary)" stroke-width="2" fill="none"/>
      <text x="100" y="165" fill="var(--text-primary)" font-size="12">Side = 4</text>
    </svg>`,
    chartJsConfig: null
  },
  {
    id: 11,
    question: "What is the mean of the following numbers: 5, 8, 10, 7, 5?",
    options: ["7", "7.5", "8", "6.5"],
    correct: 0,
    topic: "Statistics",
    cognitive_level: "Application",
    svgContent: null,
    chartJsConfig: null
  },
  {
    id: 12,
    question: "Which value of 'y' satisfies the inequality: $2y - 3 < 7$?",
    options: ["y = 5", "y = 6", "y = 4", "y = 7"],
    correct: 2,
    topic: "Algebra",
    cognitive_level: "Application",
    svgContent: null,
    chartJsConfig: null
  },
  {
    id: 13,
    question: "If two angles of a triangle are 60° and 80°, what is the measure of the third angle?",
    options: ["40°", "50°", "60°", "70°"],
    correct: 3,
    topic: "Geometry",
    cognitive_level: "Application",
    svgContent: `<svg width="250" height="200" viewBox="0 0 250 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A triangle with two angles labeled 60 degrees and 80 degrees, and the third angle labeled 'x degrees'.">
      <title>Triangle Angles Diagram</title>
      <desc>A triangle showing its three interior angles. The bottom-left angle is 60 degrees, the bottom-right is 80 degrees, and the top angle is unknown, marked as 'x'.</desc>
      <polygon points="50,150 200,150 125,50" stroke="var(--text-primary)" stroke-width="2" fill="none"/>
      <text x="60" y="140" fill="var(--text-primary)" font-size="12">60°</text>
      <text x="175" y="140" fill="var(--text-primary)" font-size="12">80°</text>
      <text x="120" y="70" fill="var(--text-primary)" font-size="12">x°</text>
    </svg>`,
    chartJsConfig: null
  },
  {
    id: 14,
    question: "Which of the following is a factor of 36?",
    options: ["7", "8", "9", "10"],
    correct: 2,
    topic: "Number Theory",
    cognitive_level: "Knowledge",
    svgContent: null,
    chartJsConfig: null
  },
  {
    id: 15,
    question: "How many more books did Student C read than Student A?",
    options: ["2", "3", "4", "5"],
    correct: 1,
    topic: "Statistics",
    cognitive_level: "Analysis",
    svgContent: null,
    chartJsConfig: {
      type: 'bar',
      data: {
        labels: ['Student A', 'Student B', 'Student C', 'Student D'],
        datasets: [{ label: 'Books Read', data: [8, 12, 11, 9], backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'], borderColor: '#FFFFFF', borderWidth: 1 }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#FFFFFF' } },
          title: { display: true, text: 'Books Read by Students', color: '#FFFFFF', font: { size: 16 } }
        },
        scales: {
          y: { beginAtZero: true, ticks: { color: '#FFFFFF' }, grid: { color: '#374151' }, title: { display: true, text: 'Number of Books', color: '#FFFFFF' } },
          x: { ticks: { color: '#FFFFFF' }, grid: { color: '#374151' }, title: { display: true, text: 'Student', color: '#FFFFFF' } }
        }
      }
    }
  },
  {
    id: 16,
    question: "What is the slope of the line passing through points (2, 3) and (4, 7)?",
    options: ["1", "2", "3", "4"],
    correct: 1,
    topic: "Algebra",
    cognitive_level: "Application",
    svgContent: `<svg width="300" height="300" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A coordinate plane showing a line passing through points (2, 3) and (4, 7).">
      <title>Line Slope Diagram</title>
      <desc>A grid with x and y axes. Two points are marked: one at (2, 3) and another at (4, 7). A straight line connects these two points.</desc>
      <defs>
        <pattern id="grid2" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--border-primary)" stroke-width="0.5"/>
        </pattern>
      </defs>
      <rect width="300" height="300" fill="url(#grid2)"/>
      <line x1="0" y1="280" x2="300" y2="280" stroke="var(--text-primary)" stroke-width="2"/>
      <line x1="20" y1="0" x2="20" y2="300" stroke="var(--text-primary)" stroke-width="2"/>
      <circle cx="60" cy="240" r="4" fill="var(--feedback-error)"/>
      <text x="65" y="235" fill="var(--text-primary)" font-size="12">(2, 3)</text>
      <circle cx="100" cy="160" r="4" fill="var(--feedback-success)"/>
      <text x="105" y="155" fill="var(--text-primary)" font-size="12">(4, 7)</text>
      <line x1="60" y1="240" x2="100" y2="160" stroke="var(--accent-primary)" stroke-width="2"/>
    </svg>`,
    chartJsConfig: null
  },
  {
    id: 17,
    question: "What is the least common multiple (LCM) of 4 and 6?",
    options: ["12", "18", "24", "36"],
    correct: 0,
    topic: "Number Theory",
    cognitive_level: "Knowledge",
    svgContent: null,
    chartJsConfig: null
  },
  {
    id: 18,
    question: "In a right-angled triangle, if the two shorter sides are 3 and 4 units, what is the length of the hypotenuse?",
    options: ["5 units", "6 units", "7 units", "8 units"],
    correct: 0,
    topic: "Geometry",
    cognitive_level: "Application",
    svgContent: `<svg width="250" height="200" viewBox="0 0 250 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A right-angled triangle with the two shorter sides labeled 3 and 4, and the hypotenuse labeled 'x'.">
      <title>Right-Angled Triangle Diagram</title>
      <desc>A triangle with a right angle symbol. The vertical side is labeled '3', the horizontal side is labeled '4', and the longest side (hypotenuse) is labeled 'x'.</desc>
      <polygon points="50,150 150,150 150,50" stroke="var(--text-primary)" stroke-width="2" fill="none"/>
      <line x1="150" y1="150" x2="160" y2="140" stroke="var(--text-primary)" stroke-width="1"/>
      <line x1="160" y1="140" x2="150" y2="130" stroke="var(--text-primary)" stroke-width="1"/>
      <text x="95" y="165" fill="var(--text-primary)" font-size="12">4</text>
      <text x="155" y="100" fill="var(--text-primary)" font-size="12">3</text>
      <text x="90" y="90" fill="var(--text-primary)" font-size="12">x</text>
    </svg>`,
    chartJsConfig: null
  },
  {
    id: 19,
    question: "What is the mode of the following data set: 2, 3, 5, 2, 7, 2, 8?",
    options: ["3", "5", "2", "7"],
    correct: 2,
    topic: "Statistics",
    cognitive_level: "Knowledge",
    svgContent: null,
    chartJsConfig: null
  },
  {
    id: 20,
    question: "Factor the expression: $x^2 - 4$",
    options: ["(x-2)(x-2)", "(x+2)(x+2)", "(x-2)(x+2)", "x(x-4)"],
    correct: 2,
    topic: "Algebra",
    cognitive_level: "Application",
    svgContent: null,
    chartJsConfig: null
  },
  {
    id: 21,
    question: "If an angle on a straight line is 120°, what is the measure of the adjacent angle 'x'?",
    options: ["30°", "45°", "60°", "90°"],
    correct: 2,
    topic: "Geometry",
    cognitive_level: "Application",
    svgContent: `<svg width="250" height="100" viewBox="0 0 250 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A straight line with a ray extending upwards, forming two adjacent angles. One angle is labeled 120 degrees, and the other is labeled 'x degrees'.">
      <title>Adjacent Angles Diagram</title>
      <desc>A horizontal line is intersected by another line segment originating from the center. This creates two angles on the straight line. The obtuse angle is marked as 120 degrees, and the acute angle next to it is marked as 'x'.</desc>
      <line x1="20" y1="70" x2="230" y2="70" stroke="var(--text-primary)" stroke-width="2"/>
      <line x1="100" y1="70" x2="150" y2="20" stroke="var(--text-primary)" stroke-width="2"/>
      <text x="110" y="85" fill="var(--text-primary)" font-size="12">120°</text>
      <text x="160" y="55" fill="var(--text-primary)" font-size="12">x°</text>
    </svg>`,
    chartJsConfig: null
  },
  {
    id: 22,
    question: "Simplify the fraction: $12/16$",
    options: ["1/2", "3/4", "2/3", "4/5"],
    correct: 1,
    topic: "Number Theory",
    cognitive_level: "Application",
    svgContent: null,
    chartJsConfig: null
  },
  {
    id: 23,
    question: "What is the range of the following data set: 15, 22, 10, 30, 18?",
    options: ["10", "15", "20", "25"],
    correct: 2,
    topic: "Statistics",
    cognitive_level: "Knowledge",
    svgContent: null,
    chartJsConfig: null
  },
  {
    id: 24,
    question: "Which of the following are the roots of the equation: $(x-2)(x+3) = 0$?",
    options: ["x = 2, x = 3", "x = -2, x = -3", "x = 2, x = -3", "x = -2, x = 3"],
    correct: 2,
    topic: "Algebra",
    cognitive_level: "Application",
    svgContent: null,
    chartJsConfig: null
  },
  {
    id: 25,
    question: "A triangle has a base of 10 cm and a height of 6 cm. What is its area?",
    options: ["30 cm²", "60 cm²", "16 cm²", "40 cm²"],
    correct: 0,
    topic: "Geometry",
    cognitive_level: "Application",
    svgContent: null,
    chartJsConfig: null
  },
  {
    id: 26,
    question: "What is the median of the following numbers: 1, 5, 2, 8, 3?",
    options: ["2", "3", "4", "5"],
    correct: 1,
    topic: "Statistics",
    cognitive_level: "Knowledge",
    svgContent: null,
    chartJsConfig: null
  },
  {
    id: 27,
    question: "What type of angle is shown in the diagram?",
    options: ["Acute", "Obtuse", "Right", "Straight"],
    correct: 1,
    topic: "Geometry",
    cognitive_level: "Knowledge",
    svgContent: `<svg width="200" height="150" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="An obtuse angle labeled as 'x'.">
      <title>Obtuse Angle Diagram</title>
      <desc>Two lines originating from a single point form an angle greater than 90 degrees, which is labeled 'x'.</desc>
      <line x1="50" y1="100" x2="150" y2="100" stroke="var(--text-primary)" stroke-width="2"/>
      <line x1="50" y1="100" x2="20" y2="60" stroke="var(--text-primary)" stroke-width="2"/>
      <path d="M 70 100 A 20 20, 0, 0, 0, 38 84" fill="none" stroke="var(--text-secondary)" stroke-width="1.5"/>
      <text x="50" y="80" fill="var(--text-primary)" font-size="14">x</text>
    </svg>`,
    chartJsConfig: null
  },
  {
    id: 28,
    question: "The graph of $y = x^2 - 4$ is shown. What are the roots of the equation?",
    options: ["x = 0, x = 4", "x = 2, x = -2", "x = 1, x = -1", "x = 4, x = -4"],
    correct: 1,
    topic: "Algebra",
    cognitive_level: "Analysis",
    svgContent: `<svg width="300" height="300" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A coordinate plane showing a parabola opening upwards, crossing the x-axis at -2 and 2.">
      <title>Parabola Graph</title>
      <desc>A U-shaped curve representing a quadratic function. It intersects the horizontal x-axis at two points, indicating its roots.</desc>
      <line x1="0" y1="150" x2="300" y2="150" stroke="var(--text-primary)" stroke-width="2"/>
      <line x1="150" y1="0" x2="150" y2="300" stroke="var(--text-primary)" stroke-width="2"/>
      <path d="M 90 200 Q 150 50, 210 200" stroke="var(--accent-primary)" stroke-width="3" fill="none"/>
      <text x="290" y="145" fill="var(--text-primary)" font-size="12">x</text>
      <text x="155" y="15" fill="var(--text-primary)" font-size="12">y</text>
      <text x="145" y="165" fill="var(--text-primary)" font-size="10">0</text>
      <text x="208" y="165" fill="var(--text-primary)" font-size="10">2</text>
      <text x="85" y="165" fill="var(--text-primary)" font-size="10">-2</text>
    </svg>`,
    chartJsConfig: null
  },
  {
    id: 29,
    question: "The chart displays project completion status. Which task took the most time?",
    options: ["Planning", "Design", "Development", "Testing"],
    correct: 2,
    topic: "Statistics",
    cognitive_level: "Analysis",
    svgContent: null,
    chartJsConfig: {
      type: 'polarArea',
      data: {
        labels: ['Planning', 'Design', 'Development', 'Testing'],
        datasets: [{
          label: 'Hours Spent',
          data: [20, 35, 80, 45],
          backgroundColor: [
            'rgba(59, 130, 246, 0.7)',
            'rgba(245, 158, 11, 0.7)',
            'rgba(239, 68, 68, 0.7)',
            'rgba(16, 185, 129, 0.7)'
          ],
          borderWidth: 1,
          borderColor: '#FFFFFF'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { color: '#FFFFFF' } },
          title: { display: true, text: 'Project Time Allocation (Hours)', color: '#FFFFFF', font: { size: 16 } }
        },
        scales: {
          r: {
            ticks: { color: '#FFFFFF', backdropColor: 'transparent' },
            grid: { color: '#374151' }
          }
        }
      }
    }
  },
  {
    id: 30,
    question: "What is the Greatest Common Divisor (GCD) of 18 and 24?",
    options: ["4", "6", "8", "12"],
    correct: 1,
    topic: "Number Theory",
    cognitive_level: "Knowledge",
    svgContent: null,
    chartJsConfig: null
  }
];