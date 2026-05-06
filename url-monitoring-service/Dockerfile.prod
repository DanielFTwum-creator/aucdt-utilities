FROM node:24-alpine
WORKDIR /app
COPY package.json .
RUN npm install --omit=dev
COPY src ./src
EXPOSE 4035
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 CMD node -e "require('http').get('http://localhost:4035/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"
CMD ["node", "src/index.js"]
