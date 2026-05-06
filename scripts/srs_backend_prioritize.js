const fs = require('fs');
const path = require('path');

const repoAuditPath = path.join(__dirname, '..', 'repo_audit_full.json');
const outCsv = path.join(__dirname, '..', 'repo_srs_backend_priority.csv');

const keywords = [
  'api','backend','server','database','db','persist','authentication','auth','audit','rest','endpoint','post','get','put','delete','session','upload','download','smtp','email','worker','queue'
];

function scoreText(text){
  if(!text) return 0;
  const lower = text.toLowerCase();
  let score = 0;
  for(const k of keywords){
    const re = new RegExp('\\b'+k+'\\b','g');
    const m = lower.match(re);
    if(m) score += m.length;
  }
  return score;
}

function safeRead(filePath){
  try{ return fs.readFileSync(filePath,'utf8'); }
  catch(e){ return null; }
}

function main(){
  if(!fs.existsSync(repoAuditPath)){
    console.error('Missing repo_audit_full.json'); process.exit(1);
  }
  const data = JSON.parse(fs.readFileSync(repoAuditPath,'utf8'));
  const rows = [];
  for(const e of data){
    if(e.has_SRS === 'Yes' && e.has_backend === 'No'){
      const srsPath = e.SRS_paths;
      const abs = path.join(__dirname, '..', srsPath || '');
      const content = safeRead(abs) || safeRead(path.join(__dirname,'..', srsPath.replace(/\\\\/g,'/'))) || '';
      const score = scoreText(content) + scoreText(e.SRS_paths || '');
      rows.push({project: e.project, srs: e.SRS_paths, score});
    }
  }
  rows.sort((a,b)=>b.score-a.score);
  const out = ['project,srs_path,score',''].concat(rows.map(r=>`${JSON.stringify(r.project)},${JSON.stringify(r.srs)},${r.score}`)).join('\n');
  fs.writeFileSync(outCsv,out,'utf8');
  console.log('Wrote', outCsv);
}

main();
