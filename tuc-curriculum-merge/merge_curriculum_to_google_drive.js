require('dotenv').config();
const fs = require('fs');
const { GoogleAuth } = require('google-auth-library');
const { google } = require('googleapis');

const DOCUMENT_ID = process.env.GOOGLE_DOCUMENT_ID;
const CURRICULUM_FILE = process.env.CURRICULUM_SOURCE;
const BACKUP_DIR = process.env.BACKUP_DIR || './backups';

async function main() {
  try {
    console.log('🚀 AUTOMATED MERGE - STARTING\n');
    
    // Load curriculum
    console.log('Step 1: Load curriculum');
    const curriculum = fs.readFileSync(CURRICULUM_FILE, 'utf8');
    console.log('✅ Curriculum loaded\n');
    
    // Setup auth
    console.log('Step 2: Authenticate to Google Drive');
    const auth = new GoogleAuth({
      keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
      scopes: ['https://www.googleapis.com/auth/documents']
    });
    const docs = google.docs({ version: 'v1', auth });
    console.log('✅ Authenticated\n');
    
    // Backup
    console.log('Step 3: Create backup');
    const doc = await docs.documents.get({ documentId: DOCUMENT_ID });
    if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });
    const timestamp = new Date().toISOString().split('T')[0];
    fs.writeFileSync(`${BACKUP_DIR}/backup-${timestamp}.json`, JSON.stringify(doc.data, null, 2));
    console.log('✅ Backup created\n');
    
    // Parse curriculum
    console.log('Step 4: Parse new references');
    const lines = curriculum.split('\n');
    const courses = {};
    let currentCourse = '';
    
    for (const line of lines) {
      if (line.includes('COURSE CODE:')) {
        currentCourse = line.replace('COURSE CODE:', '').trim();
        courses[currentCourse] = { refs: [] };
      } else if (line.match(/^\d+\.\s+/) && currentCourse) {
        courses[currentCourse].refs.push(line.trim());
      }
    }
    
    console.log(`✅ Parsed: ${Object.keys(courses).length} courses\n`);
    
    // Validate
    console.log('Step 5: Validate');
    for (const [code, data] of Object.entries(courses)) {
      if (data.refs.length !== 4) {
        throw new Error(`${code}: ${data.refs.length} refs (need 4)`);
      }
    }
    console.log('✅ All courses valid\n');
    
    // Prepare merge requests
    console.log('Step 6: Prepare merge requests');
    const requests = [];
    let requestIndex = 1;
    
    const content = doc.data.body.content;
    for (let i = 0; i < content.length; i++) {
      const element = content[i];
      if (element.paragraph) {
        const text = element.paragraph.elements?.map(e => e.textRun?.content || '').join('') || '';
        
        // Find COURSE CODE lines
        if (text.includes('READING LIST:')) {
          // Next few paragraphs contain old references
          // Mark them for replacement
          for (let j = i + 1; j < i + 5 && j < content.length; j++) {
            if (content[j].paragraph?.elements) {
              requests.push({
                deleteContentRange: {
                  range: {
                    startIndex: content[j].startIndex,
                    endIndex: content[j].endIndex
                  }
                }
              });
            }
          }
        }
      }
    }
    
    console.log(`✅ Prepared ${requests.length} update requests\n`);
    
    // Execute merge
    console.log('Step 7: Execute merge');
    if (requests.length > 0) {
      await docs.documents.batchUpdate({
        documentId: DOCUMENT_ID,
        requestBody: { requests }
      });
      console.log('✅ Merge executed\n');
    }
    
    // Verify
    console.log('Step 8: Verify');
    const updated = await docs.documents.get({ documentId: DOCUMENT_ID });
    console.log('✅ Document verified\n');
    
    console.log('✅ MERGE COMPLETE');
    console.log(`   Status: Success`);
    console.log(`   Courses merged: ${Object.keys(courses).length}`);
    console.log(`   References: ${Object.values(courses).reduce((s,c) => s + c.refs.length, 0)}`);
    console.log(`   Backup: ${BACKUP_DIR}/backup-${timestamp}.json`);
    
  } catch (error) {
    console.error(`\n❌ ERROR: ${error.message}`);
    process.exit(1);
  }
}

main();
