# Deployment & Testing Guide — dmcdAI Platform

**Version:** 1.0.0  
**Framework:** React 19.2.4 / Vite 6.2.0  
**Testing:** Playwright E2E / Vitest Unit

---

## 1. Local Development Setup

To initiate the development environment:

```bash
# 1. Install dependencies (PNPM required)
pnpm install

# 2. Configure Environment
# Create .env.local and add your Institutional API Key
VITE_GEMINI_API_KEY=your_key_here

# 3. Start Development Server
pnpm run dev
```

The application will be available at `http://localhost:5173`.

## 2. Automated Testing Suite

The platform includes a robust **Playwright** E2E suite to ensure 100% compliance with TUC institutional standards.

### Running E2E Tests

```bash
# Start the app and run all tests
npx playwright test

# Open Playwright UI for interactive debugging
npx playwright test --ui
```

**What is tested:**
- **Navigation**: Verification of hash-based routing (`#/admin`).
- **Security**: Brute-force protection and password modal behavior.
- **Accessibility**: ARIA label presence and semantic HTML structure.
- **Themes**: CSS variable injection for Light, Dark, and High-Contrast palettes.

## 3. Production Deployment

### Regular Build
```bash
pnpm run build
```
The static assets will be generated in the `/dist` directory, ready for deployment to an Nginx or Apache server.

### Docker Deployment
The project includes a standard `Dockerfile` and `nginx.conf` for containerized hosting.

```bash
# Build the image
docker build -t dmcdai-platform .

# Run the container
docker run -p 8080:80 dmcdai-platform
```

## 4. Institutional Compliance Checklist

Before finalizing any deployment, verify the following:

- [ ] **Branding**: Logo and title use `#C8A84B` (TUC Gold).
- [ ] **Accessibility**: 100% tooltip/ARIA coverage on all interactive nodes.
- [ ] **Security**: Admin section redirects properly when session is cleared.
- [ ] **Performance**: AI Generation states show `Loader` components with descriptive micro-copy.

---

> [!TIP]
> **Diagnostic Mode**: When testing deployment in restricted environments, use the **AI Simulator** in the Admin panel to verify UI states without needing a valid external network connection.
