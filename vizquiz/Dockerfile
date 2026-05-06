FROM nginx:alpine

COPY index.html /usr/share/nginx/html/
COPY docs/ /usr/share/nginx/html/docs/

RUN echo 'server { \
    listen 80; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    add_header X-Frame-Options "SAMEORIGIN" always; \
    add_header X-Content-Type-Options "nosniff" always; \
    location / { try_files $uri $uri/ /index.html; } \
    location /health { access_log off; return 200 "healthy"; add_header Content-Type text/plain; } \
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ { expires 1y; add_header Cache-Control "public, immutable"; } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
