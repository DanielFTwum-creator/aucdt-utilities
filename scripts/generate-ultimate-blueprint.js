const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..');

const ignoreDirs = ['node_modules', 'dist', 'build', '.git', 'ios', 'android', 'public', '.claude', 'venv', '.venv', '.next', 'coverage'];
const validExts = ['.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.css', '.html', '.ps1', '.conf', ''];

function readDirRecursive(dir) {
    let results = [];
    try {
        const list = fs.readdirSync(dir);
        list.forEach(file => {
            const fullPath = path.join(dir, file);
            const stat = fs.lstatSync(fullPath); // Use lstatSync to detect symlinks
            const basename = path.basename(fullPath);
            
            if (stat.isSymbolicLink()) {
                return; // Skip symlinks to prevent infinite loops
            }
            
            if (stat.isDirectory()) {
                if (!ignoreDirs.includes(basename) && !basename.startsWith('.')) { // Skip hidden directories
                    results = results.concat(readDirRecursive(fullPath));
                }
            } else {
                const ext = path.extname(fullPath);
                if (validExts.includes(ext) || basename === 'Dockerfile' || basename.startsWith('.env')) {
                    if (basename !== 'AGENT.md') { 
                        results.push(fullPath);
                    }
                }
            }
        });
    } catch (err) {
        console.error(`Error reading ${dir}: ${err.message}`);
    }
    return results;
}

const list = fs.readdirSync(baseDir);
let appsProcessed = 0;

console.log('Starting global AGENT.md injection...');

list.forEach(folder => {
    const appDir = path.join(baseDir, folder);
    try {
        const stat = fs.lstatSync(appDir);
        if (stat.isDirectory() && !stat.isSymbolicLink() && !ignoreDirs.includes(folder) && !folder.startsWith('.')) {
            const packageJsonPath = path.join(appDir, 'package.json');
            if (fs.existsSync(packageJsonPath)) {
                console.log(`Processing app: ${folder}...`);
                
                const files = readDirRecursive(appDir);
                if (files.length === 0) return;
                
                let markdown = `# ${folder} - Ultimate Self-Replicating Blueprint (AGENT.md)\n\n`;
                markdown += `> [!IMPORTANT]\n> This is an auto-generated monolithic blueprint containing the source code for ${folder}.\n\n`;
                
                files.forEach(file => {
                    const relPath = path.relative(appDir, file).replace(/\\/g, '/');
                    if (relPath.includes('package-lock.json') || relPath.includes('pnpm-lock.yaml') || relPath.includes('npm-shrinkwrap.json')) return;
                    
                    try {
                        const content = fs.readFileSync(file, 'utf-8');
                        if (content.length > 500000) return; // Skip files > 500KB
                        
                        let ext = path.extname(file).substring(1);
                        if (ext === '') ext = 'text';
                        if (ext === 'ts' || ext === 'tsx') ext = 'typescript';
                        if (ext === 'js' || ext === 'jsx') ext = 'javascript';
                        if (path.basename(file).startsWith('.env')) ext = 'text';
                        
                        markdown += `### FILE: ${relPath}\n`;
                        markdown += '```' + ext + '\n';
                        markdown += content + '\n';
                        markdown += '```\n\n';
                    } catch (e) {
                        // ignore unreadable files
                    }
                });
                
                const outputFile = path.join(appDir, 'AGENT.md');
                fs.writeFileSync(outputFile, markdown);
                appsProcessed++;
            }
        }
    } catch (err) {
        // console.error(`Error processing folder ${folder}: ${err.message}`);
    }
});

console.log(`\nSuccessfully injected AGENT.md into ${appsProcessed} applications.`);
