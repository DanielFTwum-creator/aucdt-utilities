const fs = require('fs');
const path = require('path');

const ROOT = path.resolve('C:/Development/aucdt-utilities');

const NGINX_CONF = `server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /health {
        access_log off;
        return 200 'healthy';
        add_header Content-Type text/plain;
    }

    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;
}
`;

const DOCKERFILE = `FROM node:24-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile 2>/dev/null || pnpm install
COPY . .
RUN pnpm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \\
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1
CMD ["nginx", "-g", "daemon off;"]
`;

const dirs = fs.readdirSync(ROOT).filter(d => {
  const full = path.join(ROOT, d);
  try {
    return fs.statSync(full).isDirectory() &&
      (fs.existsSync(path.join(full, 'vite.config.ts')) || fs.existsSync(path.join(full, 'vite.config.js')));
  } catch(e) { return false; }
});

let nginxAdded = 0, dockerAdded = 0;

for (const dir of dirs) {
  const full = path.join(ROOT, dir);

  if (!fs.existsSync(path.join(full, 'nginx.conf'))) {
    fs.writeFileSync(path.join(full, 'nginx.conf'), NGINX_CONF);
    nginxAdded++;
  }

  if (!fs.existsSync(path.join(full, 'Dockerfile'))) {
    fs.writeFileSync(path.join(full, 'Dockerfile'), DOCKERFILE);
    dockerAdded++;
  }
}

console.log(`nginx.conf added: ${nginxAdded}`);
console.log(`Dockerfile added: ${dockerAdded}`);
