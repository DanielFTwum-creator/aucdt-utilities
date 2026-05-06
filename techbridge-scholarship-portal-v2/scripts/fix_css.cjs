const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../../academic-integrity-detector/src/index.css');
const css = `@import "tailwindcss";

@theme {
  --color-tuc-maroon: #630f12;
  --color-tuc-gold: #ffcb05;
  --color-tuc-beige: #f5f5dc;
  --color-tuc-green: #3db54a;
  --font-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

body {
  margin: 0;
  -webkit-font-smoothing: antialiased;
}

/* Institutional Compliance Utility Classes */
.tuc-btn-primary {
  background-color: #C8A84B;
  color: #0F0C07;
  padding: 12px 24px;
  font-family: serif;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: bold;
  border: none;
  cursor: pointer;
}
`;

fs.writeFileSync(filePath, css, 'utf8');
console.log('Successfully cleaned index.css via Node');
