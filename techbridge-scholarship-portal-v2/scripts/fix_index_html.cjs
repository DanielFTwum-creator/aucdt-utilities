const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../../academic-integrity-detector/index.html');
const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Academic Integrity Detector</title>
    <script type="module" src="./src/main.tsx"></script>
</head>
<body>
    <div id="root"></div>
</body>
</html>`;

fs.writeFileSync(filePath, html, 'utf8');
console.log('Successfully wrote index.html with src/main.tsx entry');
