# Deployment Guide
## Shortcut Master Application

### 1. Requirements
- **Node.js**: Version 18 or higher.
- **Framework**: React 19.2.4 (Strict requirement).
- **Environment Variables**:
  - `GEMINI_API_KEY`: Required for the AI Assistant.
  - `APP_URL`: Required for the Playwright self-testing suite.

### 2. Installation
1. Clone the repository.
2. Run `npm install` to install all dependencies, including Playwright and Express.
3. Create a `.env` file based on `.env.example`.

### 3. Development
Run the development server using:
```bash
npm run dev
```
This starts the Express server with Vite middleware on port 3000.

### 4. Production Build
1. Build the client-side assets:
   ```bash
   npm run build
   ```
2. Start the production server:
   ```bash
   npm start
   ```

### 5. Security Notes
- Ensure the Admin password is changed in `AdminContext.tsx` for production use.
- The application uses `SameSite: 'none'` and `Secure: true` for cookie handling in iframe environments.
