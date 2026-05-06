import { FORM_SECTIONS, MAX_TOTAL_SCORE } from '@/constants';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface SubmissionPayload {
  applicantId: string;
  fullName: string;
  message: string;
  receiverEmailId: string;
  senderEmailId: string;
  subject: string;
}

type ScoreMap = Record<string, Record<string, number>>;

export type SubmissionStatus = 'idle' | 'loading' | 'success' | 'error';

export interface SubmissionResult {
  status: SubmissionStatus;
  data?: unknown;
  error?: string;
}

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

const RECEIVER_EMAIL = import.meta.env.VITE_EVALUATION_RECEIVER_EMAIL ?? 'media@techbridge.edu.gh';
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 1000;

/** HTTP status codes that are safe to retry (transient failures). */
const RETRYABLE_STATUSES = new Set([408, 429, 502, 503, 504]);

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

/**
 * Calculates the total score across all evaluation sections.
 */
const calcTotalScore = (scores: ScoreMap): number =>
  Object.values(scores).reduce(
    (acc, section) => acc + Object.values(section).reduce((s, v) => s + v, 0),
    0
  );

/**
 * Returns a delay promise for retry back-off.
 * Uses exponential back-off: attempt 1 → 1s, 2 → 2s, 3 → 4s.
 */
const delay = (attempt: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS * 2 ** (attempt - 1)));

/**
 * Maps an HTTP status code to a human-readable error string.
 */
const mapStatusToMessage = (status: number, statusText: string): string => {
  const map: Record<number, string> = {
    400: 'INVALID DATA: The server rejected the submission. Check inputs.',
    401: 'UNAUTHORIZED: Access denied to the submission system.',
    403: 'UNAUTHORIZED: Access denied to the submission system.',
    404: 'ENDPOINT NOT FOUND: The submission URL is incorrect.',
    408: 'REQUEST TIMEOUT: The server took too long to respond.',
    413: 'PAYLOAD TOO LARGE: The submission data is too big.',
    429: 'RATE LIMITED: Too many submissions. Please wait.',
    500: 'SERVER ERROR: The remote system crashed.',
    502: 'SERVICE UNAVAILABLE: The server is unreachable or down.',
    503: 'SERVICE UNAVAILABLE: The server is unreachable or down.',
    504: 'SERVICE UNAVAILABLE: The server is unreachable or down.',
  };
  return map[status] ?? `API ERROR: ${statusText} [${status}]`;
};

// ─────────────────────────────────────────────
// HTML Report Builder
// ─────────────────────────────────────────────

/**
 * Assembles the full HTML email report from evaluation data.
 * All styles are inline — Gmail strips <style> blocks entirely.
 */
const buildReportHtml = (
  applicantId: string,
  judgeName: string,
  judgeEmail: string,
  scores: ScoreMap,
  feedback: string,
  totalScore: number
): string => {
  // Shared inline style tokens
  const S = {
    sectionHeader: `background-color:#111111;color:#FFFFFF;padding:5px 10px;border-left:4px solid #CC0000;font-family:'Courier New',monospace;font-size:14px;text-transform:uppercase;margin-bottom:15px;`,
    labelCell:     `padding:10px 0;border-bottom:1px solid #CCCCCC;font-family:Arial,sans-serif;font-size:10px;letter-spacing:2px;color:#888888;text-transform:uppercase;width:30%;`,
    valueCell:     `padding:10px 0;border-bottom:1px solid #CCCCCC;font-family:'Courier New',monospace;font-size:16px;color:#000000;`,
    criteriaLabel: `font-family:Arial,sans-serif;font-size:10px;letter-spacing:2px;color:#888888;text-transform:uppercase;`,
  };

  const sections = FORM_SECTIONS.map((section, i) => `
    <div style="margin-bottom:30px;">
      <div style="${S.sectionHeader}">
        INT. ${section.title.toUpperCase()} — DAY
        <span style="float:right;color:#CC0000;font-weight:bold;">SC. ${String(i + 2).padStart(2, '0')}</span>
      </div>
      <table style="width:100%;border-collapse:collapse;">
        ${section.criteria.map(c => {
          const score = scores[section.id]?.[c.id] ?? 0;
          return `
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #DDDDDD;">
                <div style="${S.criteriaLabel}">${c.label}</div>
              </td>
              <td style="padding:8px 0;border-bottom:1px solid #DDDDDD;text-align:right;">
                <span style="font-family:Arial,sans-serif;font-size:18px;font-weight:bold;color:#000000;">${score}</span>
                <span style="font-family:Arial,sans-serif;font-size:10px;color:#888888;"> / ${c.maxScore}</span>
              </td>
            </tr>`;
        }).join('')}
      </table>
    </div>`
  ).join('');

  const feedbackScene = String(FORM_SECTIONS.length + 2).padStart(2, '0');
  const safeHtml = (s: string) => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#000000;font-family:'Courier New',monospace;color:#000000;">
  <div style="max-width:600px;margin:0 auto;background-color:#F5F0E8;padding:40px;">

    <!-- MASTHEAD -->
    <div style="border-bottom:3px double #333333;padding-bottom:20px;margin-bottom:40px;text-align:center;">
      <img src="https://techbridge.edu.gh/static/TUC_LOGO_1.png" alt="TECHBRIDGE Logo" style="height:64px;margin-bottom:10px;display:inline-block;" />
      <h1 style="margin:0;font-family:Georgia,serif;font-size:48px;line-height:1;text-transform:uppercase;letter-spacing:-1px;">
        <span style="color:#000000;">DOCU</span><span style="color:#CC0000;">JUDGE</span>
      </h1>
      <div style="margin-top:10px;border-top:1px solid #333333;padding-top:5px;font-family:Arial,sans-serif;font-size:10px;letter-spacing:3px;color:#888888;text-transform:uppercase;">
        VOL. 2026 ✦ CONFIDENTIAL REPORT ✦ EDITION ▸▸▸▸
      </div>
    </div>

    <!-- PROJECT DETAILS -->
    <div style="margin-bottom:40px;">
      <div style="${S.sectionHeader}">INT. PROJECT DETAILS — DAY <span style="float:right;color:#CC0000;font-weight:bold;">SC. 01</span></div>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="${S.labelCell}">Applicant ID</td><td style="${S.valueCell}">${safeHtml(applicantId)}</td></tr>
        <tr><td style="${S.labelCell}">Judge Name</td><td style="${S.valueCell}">${safeHtml(judgeName)}</td></tr>
        <tr><td style="${S.labelCell}">Judge Email</td><td style="${S.valueCell}">${safeHtml(judgeEmail)}</td></tr>
      </table>
    </div>

    <!-- EVALUATION SECTIONS -->
    ${sections}

    <!-- FEEDBACK -->
    <div style="margin-bottom:40px;">
      <div style="${S.sectionHeader}">EXT. FINAL NOTES — DUSK <span style="float:right;color:#CC0000;font-weight:bold;">SC. ${feedbackScene}</span></div>
      <div style="font-family:'Courier New',monospace;font-size:14px;line-height:1.6;color:#000000;border-bottom:1px solid #CCCCCC;padding-bottom:20px;">
        ${feedback ? safeHtml(feedback).replace(/\n/g, '<br>') : 'NO ADDITIONAL NOTES RECORDED.'}
      </div>
    </div>

    <!-- VERDICT -->
    <div style="background-color:#111111;padding:30px;border:1px solid #333333;">
      <div style="background-color:#CC0000;color:#FFFFFF;padding:5px 10px;font-family:Arial,sans-serif;font-size:12px;letter-spacing:3px;text-transform:uppercase;font-weight:bold;margin-bottom:20px;display:inline-block;">
        THE VERDICT
      </div>
      <div style="color:#FFFFFF;font-family:Georgia,serif;font-size:64px;font-weight:900;line-height:1;">
        ${totalScore} <span style="font-size:24px;color:#CC0000;">/ ${MAX_TOTAL_SCORE}</span>
      </div>
      <div style="margin-top:20px;font-family:Arial,sans-serif;font-size:10px;letter-spacing:2px;color:#666666;text-transform:uppercase;">
        OFFICIAL EVALUATION RECORD
      </div>
    </div>

    <div style="margin-top:40px;text-align:center;font-family:'Courier New',monospace;font-size:10px;color:#666666;">
      GENERATED BY DOCUJUDGE SYSTEM v2.0
    </div>
  </div>
</body>
</html>`;
};

// ─────────────────────────────────────────────
// Core Fetch with Retry
// ─────────────────────────────────────────────

/**
 * Sends the evaluation payload to the proxy API route.
 * Automatically retries on transient failures (408, 429, 5xx) with
 * exponential back-off up to MAX_RETRY_ATTEMPTS times.
 *
 * @throws {Error} with a human-readable message on final failure.
 */
const fetchWithRetry = async (
  payload: SubmissionPayload,
  attempt = 1
): Promise<unknown> => {
  const response = await fetch('/api/submit-evaluation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const isRetryable = RETRYABLE_STATUSES.has(response.status);

    if (isRetryable && attempt < MAX_RETRY_ATTEMPTS) {
      console.warn(`[submissionService] Attempt ${attempt} failed (${response.status}). Retrying…`);
      await delay(attempt);
      return fetchWithRetry(payload, attempt + 1);
    }

    const userMessage = mapStatusToMessage(response.status, response.statusText);
    throw new Error(`${userMessage} [${response.status}]`);
  }

  return response.json();
};

// ─────────────────────────────────────────────
// Public Service
// ─────────────────────────────────────────────

export const submissionService = {
  /**
   * Submits a completed judge evaluation.
   *
   * Assembles an HTML report from the provided scores and feedback,
   * then POSTs it via the local proxy API route to trigger a
   * transactional email to the configured receiver.
   *
   * @param applicantId - The unique identifier of the applicant being evaluated.
   * @param judgeName   - Full name of the submitting judge.
   * @param judgeEmail  - Email address of the submitting judge (used as sender).
   * @param scores      - Nested map of section → criterion → numeric score.
   * @param feedback    - Free-text feedback from the judge.
   * @returns           A {@link SubmissionResult} with status and data or error.
   */
  submitEvaluation: async (
    applicantId: string,
    judgeName: string,
    judgeEmail: string,
    scores: ScoreMap,
    feedback: string
  ): Promise<SubmissionResult> => {

    const totalScore = calcTotalScore(scores);

    const reportHtml = buildReportHtml(
      applicantId, judgeName, judgeEmail,
      scores, feedback, totalScore
    );

    const payload: SubmissionPayload = {
      applicantId,
      fullName:        judgeName,
      message:         reportHtml,
      receiverEmailId: RECEIVER_EMAIL,
      senderEmailId:   judgeEmail,
      subject:         `Evaluation Report for ${applicantId}`,
    };

    try {
      const data = await fetchWithRetry(payload);
      return { status: 'success', data };

    } catch (error: unknown) {
      const isNetworkError =
        error instanceof TypeError ||
        (error instanceof Error && (
          error.message.includes('Failed to fetch') ||
          error.message.includes('NetworkError')
        ));

      const message = isNetworkError
        ? 'Network Error: Unable to connect to the submission server. Please check your internet connection.'
        : error instanceof Error
          ? error.message
          : 'An unexpected error occurred during submission.';

      console.error('[submissionService] Submission failed:', message);
      return { status: 'error', error: message };
    }
  },
};