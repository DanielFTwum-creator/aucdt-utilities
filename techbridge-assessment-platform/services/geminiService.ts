import { Results } from "../types";

// AI feedback is generated server-side via the WMS Gemini relay (Pattern 11);
// no Gemini key or SDK exists in this bundle. The API base handles both the
// nginx sub-path and bare local dev.
const API_BASE = window.location.pathname.startsWith("/techbridge-assessment-platform")
  ? "/techbridge-assessment-platform/api"
  : "/api";

export const generateFeedback = async (results: Results): Promise<string> => {
  const incorrectAnswers = results.questions
    .map((q, i) => ({ ...q, userAnswer: results.answers[i] }))
    .filter(q => q.userAnswer !== q.answer);

  const prompt = `A student took an assessment titled "${results.assessmentId} - ${results.assessmentTitle}". They scored ${results.score} out of ${results.total}. 
Here are the questions they got wrong and the answers they chose:
${incorrectAnswers.map(q => `- Question: "${q.question}", Their Answer: "${q.userAnswer}", Correct Answer: "${q.answer}"`).join('\n')}

Provide encouraging, personalised feedback in British English. Explain why some of their incorrect answers might have been wrong and offer brief, constructive advice for improvement. Keep it concise and supportive. Start with "Well done on completing the assessment!".`;

  try {
    const response = await fetch(`${API_BASE}/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    if (!response.ok) throw new Error(`Feedback request failed: ${response.status}`);
    const data = (await response.json()) as { text?: string };
    return data.text || "There was an issue generating your feedback. Please try again later. Well done on completing the assessment!";
  } catch (error) {
    console.error("Error fetching AI feedback:", error);
    return "There was an issue generating your feedback. Please try again later. Well done on completing the assessment!";
  }
};
