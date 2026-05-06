import { AIResponse, QuestSubmission, BadgeLevel, SubmissionStatus } from '../types';
import { AI_MOCK_FEEDBACK, BADGE_THRESHOLDS } from '../constants';

const QUEST_SUBMISSIONS_STORAGE_KEY = 'questSubmissions';

function getMockQuestSubmissions(): QuestSubmission[] {
  const submissions = localStorage.getItem(QUEST_SUBMISSIONS_STORAGE_KEY);
  return submissions ? JSON.parse(submissions) : [];
}

function saveMockQuestSubmissions(submissions: QuestSubmission[]) {
  localStorage.setItem(QUEST_SUBMISSIONS_STORAGE_KEY, JSON.stringify(submissions));
}

function calculateScoreAndBadge(criteriaScores: { completeness: number; quality: number; prioritization: number }): { score: number; badgeLevel: BadgeLevel } {
  const averageScore = (criteriaScores.completeness + criteriaScores.quality + criteriaScores.prioritization) / 3;
  const score = Math.round(averageScore * 100);

  if (score >= BADGE_THRESHOLDS.gold) return { score, badgeLevel: 'gold' };
  if (score >= BADGE_THRESHOLDS.silver) return { score, badgeLevel: 'silver' };
  if (score >= BADGE_THRESHOLDS.bronze) return { score, badgeLevel: 'bronze' };
  return { score, badgeLevel: 'none' };
}

// Simulate AI feedback generation
export async function generateAIFeedback(
  submissionData: any,
  questType: string,
  attemptNumber: number = 1
): Promise<AIResponse> {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, Math.random() * 3000 + 3000)); // 3-6 seconds

  // Mock scoring based on some random logic or predefined scenarios
  let completenessScore = Math.random(); // 0-1
  let qualityScore = Math.random();     // 0-1
  let prioritizationScore = Math.random(); // 0-1

  // Enhance feedback for higher attempt numbers (simulates user improvement)
  if (attemptNumber > 1) {
    completenessScore = Math.min(1, completenessScore * (1 + attemptNumber * 0.1));
    qualityScore = Math.min(1, qualityScore * (1 + attemptNumber * 0.1));
    prioritizationScore = Math.min(1, prioritizationScore * (1 + attemptNumber * 0.1));
  }

  const getFeedbackMessage = (score: number, messages: { good: string; average: string; poor: string }) => {
    if (score > 0.75) return messages.good;
    if (score > 0.4) return messages.average;
    return messages.poor;
  };

  const completenessFeedback = getFeedbackMessage(completenessScore, AI_MOCK_FEEDBACK.completeness);
  const qualityFeedback = getFeedbackMessage(qualityScore, AI_MOCK_FEEDBACK.quality);
  const prioritizationFeedback = getFeedbackMessage(prioritizationScore, AI_MOCK_FEEDBACK.prioritization);

  const observations = [
    `Observation 1: ${completenessFeedback}`,
    `Observation 2: ${qualityFeedback}`,
    `Observation 3: ${prioritizationFeedback}`,
  ];

  const { score, badgeLevel } = calculateScoreAndBadge({
    completeness: completenessScore,
    quality: qualityScore,
    prioritization: prioritizationScore,
  });

  return {
    score,
    badgeLevel,
    feedback: {
      completeness: completenessFeedback,
      quality: qualityFeedback,
      prioritization: prioritizationFeedback,
      observations: observations,
      nextSteps: AI_MOCK_FEEDBACK.nextSteps.sort(() => 0.5 - Math.random()).slice(0, 2), // Pick 2 random next steps
      tone: AI_MOCK_FEEDBACK.encouragingPhrases[Math.floor(Math.random() * AI_MOCK_FEEDBACK.encouragingPhrases.length)],
    },
  };
}

// Simulate submitting a quest
export async function submitQuest(
  userId: string,
  moduleId: string,
  questId: string,
  submissionData: any,
  fileUrls?: string[]
): Promise<QuestSubmission> {
  const submissions = getMockQuestSubmissions();
  const existingSubmission = submissions.find(s => s.userId === userId && s.questId === questId);

  const attemptNumber = existingSubmission ? existingSubmission.attemptNumber + 1 : 1;

  // Generate AI feedback immediately for this mock
  const aiResult = await generateAIFeedback(submissionData, 'design-audit', attemptNumber); // Assuming design-audit for now

  const newSubmission: QuestSubmission = {
    id: `submission-${Date.now()}`,
    userId,
    questId,
    moduleNumber: moduleId,
    submissionData,
    fileUrls,
    aiFeedback: aiResult,
    score: aiResult.score,
    badgeLevel: aiResult.badgeLevel,
    attemptNumber,
    status: 'reviewed', // Directly reviewed in mock
    submittedAt: new Date(),
    reviewedAt: new Date(),
  };

  if (existingSubmission) {
    // Replace old submission with new attempt
    saveMockQuestSubmissions(submissions.map(s => (s.id === existingSubmission.id ? newSubmission : s)));
  } else {
    submissions.push(newSubmission);
    saveMockQuestSubmissions(submissions);
  }

  return newSubmission;
}

// Simulate fetching a user's quest submission
export async function fetchQuestSubmission(userId: string, questId: string): Promise<QuestSubmission | undefined> {
  const submissions = getMockQuestSubmissions();
  return submissions.find(s => s.userId === userId && s.questId === questId);
}
