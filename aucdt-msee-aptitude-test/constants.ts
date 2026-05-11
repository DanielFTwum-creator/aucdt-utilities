import { Question } from './types';

export const AUCDT_COLORS = {
  gold: '#D4AF37',
  deepBrown: '#5C4033',
  green: '#4CAF50',
  lightGreen: '#E8F5E9',
  white: '#FFFFFF',
  lightGray: '#F9FAFB',
  darkGray: '#374151',
  red: '#DC2626',
};

export const EXAM_DURATION_SECONDS = 7200; // 2 hours

export const EXAM_SUBJECTS = [
    "General Mathematics",
    "English Language",
    "Integrated Science",
    "Social Studies",
    "Agriculture",
    "Biology",
    "Chemistry",
    "Business Management",
    "Financial Accounting",
    "Economics",
    "Geography",
    "History",
    "Literature in English",
    "Christian Religious Studies",
    "Islamic Religious Studies",
    "Applied Technology",
    "Computer Science",
    "Visual Arts",
    "Home Economics",
    "Foods and Nutrition",
];


export const DEFAULT_QUESTIONS: Question[] = [
    // Algebra
    { id: 1, question: "Evaluate the expression $5x - 2y - 3$ for $x=3$ and $y=-1$.", options: ["14", "16", "20", "22"], correct: 0 },
    { id: 2, question: "Solve for p in the equation: $3(p + 5) = 21$", options: ["p=2", "p=4", "p=6", "p=8", "None of these"], correct: 1 },
    { id: 3, question: "Simplify the expression: $7(2m - 3) - 4(m+5)$", options: ["10m-1", "10m-41", "14m-1", "14m-41", "None of these"], correct: 1 },
    { id: 4, question: "If $f(x) = 3x^2 - 7x + 2$, evaluate $f(-2)$.", options: ["-24", "0", "12", "28", "None of these"], correct: 3 },
    { id: 5, question: "Solve the inequality: $2x + 9 > 1$", options: ["x > 4", "x < 4", "x > -4", "x < -4", "None of these"], correct: 2 },
    { id: 6, question: "The sum of two numbers is 25 and their difference is 5. What are the numbers?", options: ["10 and 15", "5 and 20", "12 and 13", "8 and 17", "None of these"], correct: 0 },
    
    // Statistics & Probability
    { id: 7, question: "The ages of five friends are 23, 18, 20, 25, and 21. What is the median age?", options: ["20", "21", "22", "23", "None of these"], correct: 1 },
    { id: 8, question: "A bag contains 3 red marbles, 5 blue marbles, and 2 green marbles. If a marble is selected at random, what is the probability that it is NOT blue?", options: ["1/5", "2/5", "3/5", "4/5", "1/2"], correct: 4 },
    { id: 9, question: "If a dice is rolled once, what is the probability of getting an even number?", options: ["1/6", "1/3", "1/2", "2/3", "None of these"], correct: 2 },

    // Number Theory & Arithmetic
    { id: 10, question: "Arrange the following numbers in ascending order: $0.35, 1/3, 25\\%$", options: ["0.35, 1/3, 25%", "1/3, 25%, 0.35", "25%, 0.35, 1/3", "25%, 1/3, 0.35", "None of these"], correct: 3 },
    { id: 11, question: "Find the next number in the sequence: 3, 7, 11, 15, __", options: ["18", "19", "20", "21", "None of these"], correct: 1 },
    { id: 12, question: "Evaluate $\log_{10}(1000)$.", options: ["2", "3", "10", "100", "None of these"], correct: 1 },
    { id: 13, question: "Simplify: $\sqrt{144} + \sqrt{25}$", options: ["13", "17", "169", "289", "None of these"], correct: 1 },

    // Geometry & Trigonometry
    { id: 14, question: "In the diagram below, find the value of angle y.", options: ["65°", "75°", "85°", "95°", "None of these"], correct: 1, diagram: 'angles_on_line' },
    { id: 15, question: "In the right-angled triangle ABC shown in the diagram, side AB has length 6 and side BC has length 8. What is the length of the hypotenuse AC?", options: ["10", "12", "14", "100", "None of these"], correct: 0, diagram: 'right_triangle_abc' },
    { id: 16, question: "What is the slope of the line passing through the points (2, 5) and (4, 9)?", options: ["-2", "1/2", "1", "2", "None of these"], correct: 3 },
    { id: 17, question: "What is the area of a circle with a radius of 5 cm? (Use $\pi \approx 3.14$)", options: ["15.7 cm²", "25 cm²", "78.5 cm²", "157 cm²", "None of these"], correct: 2, diagram: 'circle_radius' },
    { id: 18, question: "The pie chart below shows the distribution of favourite colours among a group of students. What angle would represent the colour blue?", options: ["30°", "90°", "120°", "135°", "150°"], correct: 3, diagram: 'pie_chart_colors' },
    { id: 19, question: "Find the volume of a cube with side length 4 cm.", options: ["12 cm³", "16 cm³", "48 cm³", "64 cm³", "None of these"], correct: 3, diagram: 'cube_side' },
    { id: 20, question: "If $\sin(\theta) = 3/5$ and $\theta$ is an acute angle, what is $\cos(\theta)$?", options: ["3/4", "4/5", "5/4", "5/3", "None of these"], correct: 1 },

    // Word Problems & Applications
    { id: 21, question: "A car travels 180 km in 3 hours. What is its average speed in km/h?", options: ["50 km/h", "60 km/h", "70 km/h", "90 km/h", "None of these"], correct: 1 },
    { id: 22, question: "What is the simple interest on a principal of GHS 500 at a rate of 10% per annum for 4 years?", options: ["GHS 50", "GHS 100", "GHS 200", "GHS 500", "None of these"], correct: 2 },
    
    // Advanced
    { id: 23, question: "Find the derivative of $f(x) = x^3 + 2x$.", options: ["$3x^2$", "$x^2+2$", "$3x^2+2$", "$3x+2$", "None of these"], correct: 2 },
    { id: 24, question: "Consider the following matrix multiplication: $\\begin{bmatrix} 6 & 5 & 3 & 7 \\\\ 3 & 2 & 1 & 3 \\\\ 5 & 3 & 2 & 5 \\\\ 7 & 5 & 3 & 6 \\end{bmatrix} \\times \\begin{bmatrix} 7 & 2 & 1 & 2 \\\\ 2 & 7 & 1 & 2 \\\\ 1 & 1 & 3 & 1 \\\\ 2 & 2 & 1 & 7 \\end{bmatrix}$. Which of the options is the correct resulting matrix?", options: ["$\\begin{bmatrix} 69 & 64 & 27 & 74 \\\\ 32 & 23 & 10 & 32 \\\\ 54 & 43 & 19 & 54 \\\\ 74 & 64 & 27 & 69 \\end{bmatrix}$", "$\\begin{bmatrix} 67 & 50 & 30 & 70 \\\\ 31 & 20 & 10 & 30 \\\\ 52 & 35 & 20 & 50 \\\\ 72 & 50 & 30 & 67 \\end{bmatrix}$", "A 2x2 Matrix", "An identity matrix", "None of these"], correct: 0, bonus: { title: "Honors Section: A Beautiful Coincidence", content: "This specific matrix multiplication, where a symmetric matrix is multiplied by another symmetric matrix, results in a new symmetric matrix. This is a fascinating example of how properties of matrices are preserved through certain operations." } }
];