// Curriculum extraction via the WMS Gemini relay (FR-SSO-011).
// The SPA never holds a Gemini key — /api/gemini/generate authenticates the
// caller's WMS JWT and proxies the raw generateContent body to Google.

import { wmsBase, getAccessToken, refreshToken } from './wmsAuth';

const MODEL = 'gemini-2.5-flash';

const extractSchema = {
  type: 'OBJECT',
  properties: {
    lecturers: {
      type: 'ARRAY',
      description: 'A list of lecturer names found in the document.',
      items: {
        type: 'OBJECT',
        properties: {
          name: { type: 'STRING', description: 'The full name of the lecturer.' },
        },
      },
    },
    courses: {
      type: 'ARRAY',
      description: 'A list of courses or subjects mentioned in the document.',
      items: {
        type: 'OBJECT',
        properties: {
          name: { type: 'STRING', description: 'The full name of the course or subject.' },
          year: { type: 'INTEGER', description: 'The academic year the course is taught in (e.g., 1, 2, 3).' },
          semester: { type: 'INTEGER', description: 'The semester the course is taught in (e.g., 1 or 2).' },
        },
      },
    },
  },
};

async function callRelay(body) {
  const post = (token) =>
    fetch(`${wmsBase}/api/gemini/generate?model=${MODEL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      credentials: 'include',
      body: JSON.stringify(body),
    });

  let res = await post(getAccessToken());
  if (res.status === 401) {
    const token = await refreshToken();
    if (token) res = await post(token);
  }
  if (!res.ok) {
    let msg = `Gemini relay error (HTTP ${res.status})`;
    try { msg = (await res.json()).error || msg; } catch { /* keep */ }
    throw new Error(msg);
  }
  return res.json();
}

/** Extract lecturers and courses for a programme from PDF text. */
export async function extractCurriculum(text, programmeName) {
  const prompt = `
    From the following text, which is extracted from a university programme document, please identify all lecturers and all courses associated with the "${programmeName}" programme.

    Rules:
    1. Extract the full names of all lecturers.
    2. Extract the full names of all courses/subjects.
    3. For each course, identify the academic year and semester it belongs to. If not specified, make a reasonable guess.
    4. Return the data in the specified JSON format.

    Document Text:
    ---
    ${text}
    ---
  `;

  const response = await callRelay({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: extractSchema,
    },
  });

  const jsonString = response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!jsonString) throw new Error('The AI returned an empty response.');

  const parsed = JSON.parse(jsonString);
  if (!parsed.lecturers || !parsed.courses) {
    throw new Error('The extracted data is missing required fields (lecturers or courses).');
  }
  return parsed;
}

/** Read all text out of a PDF File using pdf.js (lazy-loaded). */
export async function readPdfText(file) {
  const pdfjs = await import('pdfjs-dist');
  const workerUrl = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

  const pdf = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    fullText += content.items.map((item) => item.str).join(' ') + '\n';
  }
  return fullText;
}
