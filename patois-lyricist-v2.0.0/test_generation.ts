import { generateLyrics } from './services/geminiService.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runTest() {
  try {
    console.log("Starting generation test...");
    const theme = "The struggles of building a nation and the power of education.";
    const rhymeScheme = "AABB";
    const djPersona = "Roots Dub Poet";
    const songStructure = ['Intro', 'Verse', 'Chorus', 'Verse', 'Chorus', 'Outro'];
    const songDescription = "A deep, intellectual reflection on TechBridge University College's motto 'Design and Build a Nation'.";

    const result = await generateLyrics(
      theme,
      rhymeScheme,
      djPersona,
      songStructure,
      songDescription
    );

    const mdContent = `# ${result.title || 'Untitled Riddim'}

**Theme:** ${theme}
**Persona:** ${djPersona}
**Structure:** ${songStructure.join(' → ')}

---

${result.lyrics}
`;

    const outputPath = join(__dirname, 'test_output.md');
    fs.writeFileSync(outputPath, mdContent, 'utf-8');
    console.log("Test completed successfully. Output written to test_output.md");
  } catch (error) {
    console.error("Test failed:", error);
  }
}

runTest();
