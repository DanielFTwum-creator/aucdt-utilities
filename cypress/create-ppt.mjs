import PptxGenJs from 'pptxgenjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const prs = new PptxGenJs();

const COLORS = {
  primary: '065A82',
  accent: '00A896',
  dark: '021223',
  light: 'FFFFFF',
  gray: 'F2F2F2'
};

const screenshotDir = path.join(__dirname, 'cypress/screenshots/admissions.cy.ts');
const screenshots = fs.readdirSync(screenshotDir)
  .filter(f => f.endsWith('.png'))
  .sort();

// Title Slide
let slide = prs.addSlide();
slide.background = { color: COLORS.primary };
slide.addText('Cypress E2E Test Report', {
  x: 0.5, y: 1.5, w: 9, h: 1,
  fontSize: 54, bold: true, color: COLORS.light,
  align: 'center'
});
slide.addText('Techbridge Admissions Portal', {
  x: 0.5, y: 2.7, w: 9, h: 0.6,
  fontSize: 28, color: COLORS.accent,
  align: 'center'
});
slide.addText(`${screenshots.length} Test Screenshots`, {
  x: 0.5, y: 3.8, w: 9, h: 0.5,
  fontSize: 18, color: COLORS.gray,
  align: 'center'
});

// Summary Slide
slide = prs.addSlide();
slide.background = { color: COLORS.light };
slide.addText('Test Execution Summary', {
  x: 0.5, y: 0.3, w: 9, h: 0.6,
  fontSize: 40, bold: true, color: COLORS.primary
});

let yPos = 1.2;
slide.addText(`Total Tests: ${screenshots.length} screenshots captured`, {
  x: 1, y: yPos, w: 8, h: 0.4,
  fontSize: 16, bold: true, color: COLORS.dark
});
yPos += 0.6;

const categories = {};
screenshots.forEach(f => {
  const catMatch = f.match(/^\d+\.\s+(.+?)\s+--/);
  if (catMatch) {
    const cat = catMatch[1];
    categories[cat] = (categories[cat] || 0) + 1;
  }
});

Object.entries(categories).forEach(([cat, count]) => {
  slide.addText(`• ${cat}: ${count}`, {
    x: 1.5, y: yPos, w: 7.5, h: 0.35,
    fontSize: 14, color: COLORS.dark
  });
  yPos += 0.4;
});

// Add screenshot slides (limit to first 20 for performance)
const screenshotsToAdd = screenshots.slice(0, 20);
screenshotsToAdd.forEach((filename, idx) => {
  const filepath = path.join(screenshotDir, filename);
  const testName = filename.replace('.png', '').replace(/ \(failed\)/, '');
  
  slide = prs.addSlide();
  slide.background = { color: COLORS.light };
  
  slide.addText(testName, {
    x: 0.3, y: 0.15, w: 9.4, h: 0.5,
    fontSize: 12, bold: true, color: COLORS.dark,
    wrap: true
  });
  
  slide.addShape(prs.ShapeType.rect, {
    x: 0.3, y: 0.7, w: 9.4, h: 0.02,
    fill: { color: COLORS.accent },
    line: { type: 'none' }
  });
  
  try {
    slide.addImage({
      path: filepath,
      x: 0.3, y: 0.85, w: 9.4, h: 4.55
    });
  } catch (e) {
    console.error(`Failed to add ${filename}:`, e.message);
  }
});

prs.writeFile({ fileName: './admissions-test-screenshots.pptx' });
console.log('✓ Created admissions-test-screenshots.pptx');
console.log(`  - ${screenshotsToAdd.length} screenshot slides`);
console.log(`  - ${Object.keys(categories).length} test categories`);
