const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..');
const list = fs.readdirSync(baseDir);

let scrubbedCount = 0;

list.forEach(folder => {
    const appDir = path.join(baseDir, folder);
    const agentPath = path.join(appDir, 'AGENT.md');
    
    if (fs.existsSync(agentPath)) {
        let content = fs.readFileSync(agentPath, 'utf-8');
        let originalContent = content;
        
        // Redact generic environment variables containing secrets/keys
        content = content.replace(/([A-Z0-9_]*(?:API_KEY|SECRET|CLIENT_ID|PASSWORD|TOKEN)[A-Z0-9_]*\s*=\s*)([^\n\r]+)/gi, '$1[REDACTED_CREDENTIAL]');
        
        // Catch the specific literal strings that GitHub flagged just to be absolutely sure
        content = content.replace(/537671076222-q0ovngh3m2m560kdcrsn2hk0cae5rudg\.apps\.googleusercontent\.com/g, '[REDACTED_GOOGLE_CLIENT_ID]');
        content = content.replace(/<REDACTED_OLD_CLIENT_SECRET_2>/g, '[REDACTED_GOOGLE_CLIENT_SECRET]');
        content = content.replace(/<REDACTED_GEMINI_KEY>/g, '[REDACTED_GEMINI_KEY]');
        content = content.replace(/<REDACTED_OLD_GEMINI_KEY>/g, '[REDACTED_GEMINI_KEY]');
        
        if (content !== originalContent) {
            fs.writeFileSync(agentPath, content);
            console.log(`Deep scrubbed secrets from ${folder}/AGENT.md`);
            scrubbedCount++;
        }
    }
});

console.log(`\nSuccessfully scrubbed secrets from ${scrubbedCount} blueprints.`);
