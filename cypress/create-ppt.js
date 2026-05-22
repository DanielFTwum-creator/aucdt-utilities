const PptxGenJs = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

const prs = new PptxGenJs();

const COLORS = {
  primary: '065A82',
  accent: '00A896',
  dark: '021223',
  light: 'FFFFFF',
  gray: 'F2F2F2',
  fail: 'E74C3C'
};

// Get all screenshots
const screenshotDir = './cypress/screenshots/admissions.cy.ts';
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
slide.addText(`Total Tests Run: ${screenshots.length}`, {
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
  slide.addText(`• ${cat}: ${count} test(s)`, {
    x: 1.5, y: yPos, w: 7.5, h: 0.35,
    fontSize: 14, color: COLORS.dark
  });
  yPos += 0.4;
});

// Add screenshot slides
screenshots.forEach((filename, idx) => {
  const filepath = path.resolve(screenshotDir, filename);
  const testName = filename.replace('.png', '').replace(/ \(failed\)/, '');
  
  slide = prs.addSlide();
  slide.background = { color: COLORS.light };
  
  slide.addText(testName, {
    x: 0.3, y: 0.15, w: 9.4, h: 0.5,
    fontSize: 14, bold: true, color: COLORS.dark,
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
    slide.addText('Screenshot not available', {
      x: 0.3, y: 2.2, w: 9.4, h: 1,
      fontSize: 16, color: '#999', align: 'center'
    });
  }
  
  slide.addText(`${idx + 3} / ${screenshots.length + 2}`, {
    x: 9, y: 5.35, w: 0.7, h: 0.2,
    fontSize: 10, color: '#999', align: 'right'
  });
});

prs.writeFile({ fileName: './admissions-test-screenshots.pptx' });
console.log('✓ Created admissions-test-screenshots.pptx');
console.log(`  - ${screenshots.length} screenshot slides`);
console.log(`  - ${Object.keys(categories).length} test categories`);
