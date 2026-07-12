export interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  templateText: string;
  fields: { name: string; placeholder: string; default: string }[];
  category: 'outline' | 'quiz' | 'rubric' | 'slides' | 'feedback' | 'polish' | 'analysis' | 'custom';
}

export const WORKBOOK_METRICS = [
  { task: "Course outline / scheme of work", before: "2–3 hours", withAI: "20 mins", ratio: "85% faster" },
  { task: "Quiz + marking rubric", before: "1–2 hours", withAI: "15 mins", ratio: "80% faster" },
  { task: "Student feedback comments", before: "5 mins each", withAI: "1 min each", ratio: "80% faster" },
  { task: "Committee report / minutes cleanup", before: "1 hour", withAI: "10 mins", ratio: "83% faster" },
];

export const TEMPLATES_LIBRARY: PromptTemplate[] = [
  {
    id: "course-outline",
    title: "Course Outline",
    description: "Generate a comprehensive, structural multi-week outline tailored to your student cohort.",
    category: "outline",
    templateText: "Create a [N]-week course outline for [COURSE], a [LEVEL] course at a Ghanaian university college. Students are [PROFILE]. Each week needs: topic, one learning objective, one in-class activity, one assignment idea. Weeks [ASSESSMENT_WEEKS] are assessment weeks. Format as a table. British English.",
    fields: [
      { name: "N", placeholder: "Number of weeks (e.g. 12)", default: "12" },
      { name: "COURSE", placeholder: "Course Name", default: "HND Fashion Design Technology" },
      { name: "LEVEL", placeholder: "Level (e.g. Second Year)", default: "Second Year" },
      { name: "PROFILE", placeholder: "Student profile", default: "about to start group portfolio projects" },
      { name: "ASSESSMENT_WEEKS", placeholder: "Assessment weeks (e.g. 6 and 12)", default: "6 and 12" },
    ],
  },
  {
    id: "quiz",
    title: "Interactive Quiz Generator",
    description: "Create quick formative assessment quizzes with automated, robust answer keys.",
    category: "quiz",
    templateText: "Create a [N]-question quiz on [TOPIC] for [LEVEL] students. Mix of multiple choice and short answer. Include an answer key. Difficulty: [DIFFICULTY]. Format in British English.",
    fields: [
      { name: "N", placeholder: "Number of questions", default: "10" },
      { name: "TOPIC", placeholder: "Topic or Area of Study", default: "sustainable fashion design principles" },
      { name: "LEVEL", placeholder: "Student level", default: "HND Year 2" },
      { name: "DIFFICULTY", placeholder: "Difficulty (EASY/MODERATE/CHALLENGING)", default: "MODERATE" },
    ],
  },
  {
    id: "rubric",
    title: "Marking Rubric",
    description: "Build robust, defensive, transparent evaluation matrix criteria with 4 levels.",
    category: "rubric",
    templateText: "Create a marking rubric for this assignment: [ASSIGNMENT]. Four criteria, four levels each (Excellent / Good / Developing / Poor), with a mark range per level totalling 100. Format as a beautiful markdown table.",
    fields: [
      { name: "ASSIGNMENT", placeholder: "Paste your assignment description", default: "Design a 3-piece collection portfolio inspired by traditional Ghanaian Adinkra symbols. Must include sketch, fabric choices, and cost estimate." },
    ],
  },
  {
    id: "student-feedback",
    title: "Student Feedback Polish",
    description: "Format raw notes into constructive, specific, balanced, and encouraging feedback.",
    category: "feedback",
    templateText: "Rewrite this feedback to be constructive and specific, keeping the same judgement: [PASTE_ROUGH_NOTES]. Structure exactly as: Two sentences of strength, two of improvement, one next step. British English.",
    fields: [
      { name: "PASTE_ROUGH_NOTES", placeholder: "Paste rough student feedback comments", default: "John did okay sketches but skipped the budget list. Nice presentation in class but didn't submit on time." },
    ],
  },
  {
    id: "email-polish",
    title: "Email & Report Professional Polish",
    description: "Enhance professional clarity and conciseness for correspondence without changing intent.",
    category: "polish",
    templateText: "Improve the clarity, professionalism, and conciseness of this draft without changing its meaning or making it longer: [PASTE]. British English.",
    fields: [
      { name: "PASTE", placeholder: "Paste email or report draft", default: "I cannot make the committee meeting on Wednesday because of marking portfolios, can someone please record it or send me notes? Sorry for last minute notification." },
    ],
  },
  {
    id: "multi-step",
    title: "Multi-Step Strategic Analysis",
    description: "Run sequential reasoning for course interventions: failure analysis, resources, prioritization.",
    category: "analysis",
    templateText: "First, list the five most common reasons students fail [COURSE]. Second, for each reason, suggest one intervention I can run within existing resources. Third, rank the interventions by effort vs impact and recommend where I should start.",
    fields: [
      { name: "COURSE", placeholder: "Course Name", default: "HND Fashion Design Portfolio Projects" },
    ],
  },
];
