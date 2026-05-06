FROM mcr.microsoft.com/playwright:v1.40.0-jammy

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy project files
COPY . .

# Install Playwright browsers
RUN npx playwright install

# Set environment variables
ENV CI=true
ENV HEADLESS=true

# Run tests
CMD ["npm", "test"]
