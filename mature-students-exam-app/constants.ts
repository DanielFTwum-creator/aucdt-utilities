
export const COLORS = {
  aucdtGold: '#D4AF37',
  aucdtDeepBrown: '#5C4033',
  aucdtGreen: '#4CAF50',
  aucdtLightGreen: '#E8F5E9',
  aucdtWhite: '#FFFFFF',
  aucdtLightGray: '#F9FAFB',
  aucdtDarkGray: '#374151',
  aucdtRed: '#DC2626',
};

export const EXAM_DURATION = 7200; // 2 hours in seconds

export const LLM_PROMPT = `You are an expert mathematics exam question parser. Your task is to convert the following text from a mathematics exam paper into a clean JSON array of question objects.

REQUIRED STRUCTURE:
Each question object must have these properties:
- "id" (integer, sequential starting from 1)
- "question" (string, the question text)
- "options" (array of exactly 5 strings, labeled A through E)
- "correct" (integer, 0-based index of the correct answer)

OPTIONAL PROPERTIES:
- "diagram" (string, for questions requiring visual elements)
- "bonus" (object with "title" and "content" properties for additional information)

PARSING RULES:

1. CONTENT FILTERING:
   - Extract ONLY the actual questions and their multiple-choice options
   - Ignore headers, footers, page numbers, instructions, and administrative text
   - Focus on questions numbered sequentially (1, 2, 3, etc.)

2. MATHEMATICAL FORMATTING:
   - Use LaTeX delimiters: $...$ for inline math, $$...$$ for display math
   - Convert percentages: "25%" → "25\\%"
   - Convert fractions: "1/2" → "$\\frac{1}{2}$" (when appropriate)
   - Convert variables and expressions: "5x - 2y + 3" → "$5x - 2y + 3$"
   - Use \\times for multiplication symbols when needed

3. MATRIX FORMATTING:
   - Convert bracket notation to LaTeX bmatrix format
   - Example: "[2 -1; 0 5]" → "$\\begin{bmatrix} 2 & -1 \\\\ 0 & 5 \\end{bmatrix}$"
   - Preserve spacing and alignment in matrix expressions

4. DIAGRAM DETECTION:
   Add "diagram" property when questions mention:
   - "In the diagram below" or similar phrases
   - Geometric figures requiring visual representation
   
   Use these diagram types:
   - "angles_on_line": For angle problems with intersecting lines
   - "right_triangle_abc": For right triangle problems with labeled sides
   - "pie_chart_colors": For data distribution problems with color categories

5. OPTION FORMATTING:
   - Ensure exactly 5 options (A, B, C, D, E)
   - If only 4 options exist, add "E. None of these" as the 5th option
   - Apply mathematical formatting to options consistently
   - Preserve the original meaning while improving readability

6. BONUS CONTENT:
   - Look for "Bonus", "Honors", "Note", or "Did you know" sections
   - Add as bonus object: {"title": "Section Title", "content": "Explanatory text"}

7. ANSWER IDENTIFICATION:
   - Determine the correct answer based on mathematical accuracy
   - Use 0-based indexing (A=0, B=1, C=2, D=3, E=4)
   - If answer key is provided, use it; otherwise, calculate the correct answer

EXAMPLES:

Matrix Question:
Input: "If P = [2 -1; 0 5] and Q = [3 4; -2 1], evaluate 2P + Q."
Output: "If $P = \\begin{bmatrix} 2 & -1 \\\\ 0 & 5 \\end{bmatrix}$ and $Q = \\begin{bmatrix} 3 & 4 \\\\ -2 & 1 \\end{bmatrix}$, evaluate $2P + Q$."

Percentage Question:
Input: "What is 25% of 80?"
Output: "What is $25\\%$ of $80$?"

Angle Question:
Input: "In the diagram below, find angle x."
Output: {"question": "In the diagram below, find the value of angle x.", "diagram": "angles_on_line", ...}

QUALITY CHECKS:
- Verify all mathematical expressions are properly formatted
- Ensure question numbering is sequential
- Confirm all options are clearly stated
- Check that diagram types match question content
- Validate that correct answers are mathematically accurate

Now, parse the following exam text:`;
