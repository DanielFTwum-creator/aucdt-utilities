const fs = require('fs');
const path = require('path');

const dirs = fs.readdirSync('.', { withFileTypes: true });
const locations = [];
const appList = [];

function sanitizeHost(name) {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

dirs.forEach(dir => {
  if (!dir.isDirectory()) return;
  const packagePath = path.join(dir.name, 'package.json');
  if (fs.existsSync(packagePath)) {
    const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
    if (packageData.devDependencies?.vite || packageData.dependencies?.react) {
        const host = sanitizeHost(dir.name);
        const displayName = packageData.description || packageData.name || dir.name;
        
        // Proxy location
        locations.push(`    location /${dir.name}/ {
        set $upstream http://${host}:80;
        rewrite ^/${dir.name}/(.*) /$1 break;
        proxy_pass $upstream;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Handle trailing slash issues
        proxy_redirect off;
    }`);

        // App list for HTML
        appList.push({
            name: dir.name,
            displayName: displayName
        });
    }
  }
});

// Generate Nginx Config
const nginxTemplate = `events {
    worker_connections 1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    keepalive_timeout  65;

    server {
        listen 80;
        server_name localhost;

        resolver 127.0.0.11 valid=30s;
        resolver_timeout 5s;

        location / {
            root /usr/share/nginx/html;
            index index.html;
        }

        location /catalogue/ {
            alias /var/www/catalogue/;
            autoindex on;
        }

        location /health {
            access_log off;
            return 200 OK;
        }

${locations.join('\n')}
    }
}`;

fs.writeFileSync('docker/nginx/nginx-all-apps.conf', nginxTemplate);

// Generate HTML Index
const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TUC Utilities - App Dashboard</title>
    <style>
        body { font-family: sans-serif; background: #0F0C07; color: #F2EBD9; padding: 40px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
        .card { background: #141210; border: 1px solid #C8A84B; padding: 20px; border-radius: 8px; transition: 0.3s; }
        .card:hover { transform: translateY(-5px); box-shadow: 0 5px 15px rgba(200,168,75,0.2); }
        .title { color: #C8A84B; font-size: 1.2em; font-weight: bold; margin-bottom: 10px; }
        .link { display: inline-block; background: #C8A84B; color: #0F0C07; padding: 8px 16px; text-decoration: none; border-radius: 4px; margin-top: 10px; font-weight: bold; }
        .search { width: 100%; padding: 15px; margin-bottom: 30px; background: #141210; border: 1px solid #C8A84B; color: white; border-radius: 8px; font-size: 1.1em; }
        h1 { border-bottom: 2px solid #C8A84B; padding-bottom: 10px; margin-bottom: 30px; }
    </style>
</head>
<body>
    <h1>🎓 Techbridge University College - Utilities Suite</h1>
    <input type="text" class="search" id="search" placeholder="🔍 Search among ${appList.length} applications...">
    <div class="grid" id="grid">
        ${appList.map(app => `
            <div class="card" data-name="${app.name} ${app.displayName}">
                <div class="title">${app.displayName}</div>
                <div>Directory: ${app.name}</div>
                <a href="/${app.name}/" class="link">Launch App →</a>
            </div>
        `).join('')}
    </div>
    <script>
        document.getElementById('search').addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            document.querySelectorAll('.card').forEach(card => {
                const name = card.getAttribute('data-name').toLowerCase();
                card.style.display = name.includes(term) ? 'block' : 'none';
            });
        });
    </script>
</body>
</html>`;

fs.writeFileSync('docker/nginx/html/index.html', htmlTemplate);

console.log(`Generated Nginx config and HTML index for ${appList.length} apps.`);
