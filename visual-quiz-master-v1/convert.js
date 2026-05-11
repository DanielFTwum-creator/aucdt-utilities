import fs from 'fs';

const content = fs.readFileSync('c:/Users/DELL/OneDrive/Documents/Downloads/Development/aucdt-utilities/ai-utilities/visual-quiz-master-v1/constants.ts', 'utf8');

// Extract the array content
const match = content.match(/export const sampleQuestions: Question\[\] = (\[[\s\S]*\]);/);
if (match) {
    let arrayContent = match[1];
    
    // Clean up for JSON parsing
    // 1. Replace single quotes with double quotes (basic attempt)
    // This is tricky because of SVG content.
    // Better approach: eval the content in a safe way or use a real TS parser.
    // Since I'm an AI, I can just "see" the data and write the JSON directly.
}
