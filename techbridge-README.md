# ThesisAI Frontend - Techbridge University College

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?logo=vite)

**AI-Powered Thesis Assessment Platform**

A modern React application for streamlining academic evaluation with intelligent analysis, detailed feedback, and comprehensive assessment tools.

[Features](#features) • [Quick Start](#quick-start) • [Documentation](#documentation) • [Contributing](#contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Development](#development)
- [Testing](#testing)
- [Docker Deployment](#docker-deployment)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [License](#license)

---

## 🎓 Overview

**ThesisAI Frontend** is a modern web application built for **Techbridge University College**. It provides an intuitive interface for AI-powered thesis assessment, helping educators and students streamline the evaluation process with automated analysis and comprehensive feedback.

### Key Capabilities

- **Document Analysis**: Upload and analyze thesis documents with structural and formatting checks
- **AI Evaluation**: Leverage advanced AI to assess content quality, argumentation, and academic rigor
- **Detailed Feedback**: Generate actionable feedback with specific improvement suggestions
- **Progress Tracking**: Monitor thesis development and evaluation progress
- **Multi-format Export**: Export assessments in various formats (PDF, DOCX, JSON)

---

## ✨ Features

### 🔍 Document Analysis
Upload thesis documents and receive comprehensive structural analysis including:
- Chapter organization validation
- Citation and reference checking
- Formatting consistency verification
- Plagiarism detection integration
- Word count and length analysis

### 🤖 AI-Powered Evaluation
Advanced AI assessment capabilities:
- Content quality scoring
- Argument strength analysis
- Research methodology evaluation
- Literature review assessment
- Writing clarity and coherence checks

### 📊 Detailed Feedback
Comprehensive feedback generation:
- Section-by-section comments
- Improvement suggestions with examples
- Grading rubric alignment
- Strengths and weaknesses identification
- Actionable next steps

### 👥 Multi-Role Support
Support for different user types:
- **Students**: Submit theses, view feedback, track progress
- **Supervisors**: Review submissions, provide guidance
- **Examiners**: Conduct evaluations, generate reports
- **Administrators**: Manage users, configure settings

---

## 🛠️ Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| Framework | React | 19.2.0 |
| Language | TypeScript | 5.9.3 |
| Build Tool | Vite | 7.2.4 |
| Styling | Tailwind CSS | 4.1.17 |
| Package Manager | pnpm | 8.15.0 |
| HTTP Client | Axios | 1.13.2 |
| Routing | React Router DOM | 7.9.6 |
| Animations | Framer Motion | 12.23.24 |
| Icons | Lucide React | 0.554.0 |
| Charts | Recharts | 3.5.0 |
| Testing | Vitest | 4.0.13 |
| Testing Library | React Testing Library | 16.3.0 |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js**: 18.x or higher
- **pnpm**: 8.15.0 (required - do not use npm or yarn)
- **Git**: Latest version

### Installation

```bash
# Clone the repository
git clone https://github.com/YourOrg/techbridge-university-college.git
cd techbridge-university-college

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The application will be available at `http://localhost:3000`

---

## 💻 Development

### Available Scripts

```bash
# Start development server (port 3000)
pnpm dev
# or
pnpm start

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with UI
pnpm test:ui

# Generate test coverage report
pnpm test:coverage

# Type checking
pnpm lint
```

### Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow TypeScript strict mode guidelines
   - Use Tailwind CSS for styling
   - Write tests for new features

3. **Test your changes**
   ```bash
   pnpm test
   pnpm build
   ```

4. **Commit and push**
   ```bash
   git add .
   git commit -m "Add feature: description"
   git push origin feature/your-feature-name
   ```

---

## 🧪 Testing

This project maintains **100% test coverage** using Vitest and React Testing Library.

### Running Tests

```bash
# Run all tests
pnpm test

# Run with coverage report
pnpm test:coverage

# Run in watch mode (during development)
pnpm test:watch

# Run with UI
pnpm test:ui
```

### Test Structure

```
src/
├── test/
│   ├── setup.ts           # Test configuration
│   ├── App.test.tsx       # App component tests
│   └── [Component].test.tsx
```

### Writing Tests

```typescript
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import YourComponent from './YourComponent'

describe('YourComponent', () => {
  it('renders correctly', () => {
    render(<YourComponent />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })
})
```

---

## 🐳 Docker Deployment

### Build Docker Image

```bash
docker build -t techbridge-frontend .
```

### Run Container

```bash
# Run on port 80
docker run -p 80:80 techbridge-frontend

# Run on custom port
docker run -p 8080:80 techbridge-frontend
```

### Docker Compose (with backend)

```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "80:80"
    depends_on:
      - backend

  backend:
    image: techbridge-backend:latest
    ports:
      - "8080:8080"
```

### Multi-Stage Build

The Dockerfile uses a multi-stage build:
1. **Build stage**: Node 18 Alpine with pnpm
2. **Serve stage**: Nginx Alpine for production

---

## 📁 Project Structure

```
techbridge-university-college/
├── src/                    # Source code
│   ├── components/        # React components
│   ├── context/          # React context providers
│   ├── lib/              # Utility libraries
│   ├── test/             # Test files
│   ├── App.tsx           # Main App component
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global styles
├── docs/                  # Documentation
│   ├── svg/              # Architecture diagrams
│   ├── presentation/     # Presentation materials
│   └── README.md         # Documentation index
├── dist/                  # Production build output
├── public/               # Static assets
├── .env.local            # Environment variables
├── package.json          # Dependencies and scripts
├── pnpm-lock.yaml        # Lockfile
├── vite.config.ts        # Vite configuration
├── vitest.config.ts      # Vitest configuration
├── tsconfig.json         # TypeScript configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── Dockerfile            # Docker build configuration
└── README.md             # This file
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_NAME=ThesisAI - Techbridge
VITE_MAX_FILE_SIZE=10485760
```

### Vite Configuration

The project uses Vite for:
- Fast HMR (Hot Module Replacement)
- Optimized production builds
- API proxy to backend (port 8080)

### TypeScript Configuration

Strict mode enabled with:
- `noUnusedLocals`
- `noUnusedParameters`
- `noFallthroughCasesInSwitch`

### Tailwind CSS

Custom color palette:
- `techbridge-navy`: #1e3a5f
- `techbridge-blue`: #2563eb
- `techbridge-amber`: #f59e0b
- `techbridge-gold`: #fbbf24
- `techbridge-slate`: #475569

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**
3. **Follow code style guidelines**
4. **Write tests for new features**
5. **Ensure all tests pass**
6. **Submit a pull request**

### Code Style

- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Use functional components with hooks
- Write descriptive commit messages

---

## 📄 License

MIT License - Copyright (c) 2026 Techbridge University College

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## 📞 Contact & Support

- **Website**: https://techbridge.edu
- **Email**: support@techbridge.edu
- **Issues**: https://github.com/YourOrg/techbridge-university-college/issues

---

<div align="center">

**Built with ❤️ by Techbridge University College**

[⬆ Back to Top](#thesisai-frontend---techbridge-university-college)

</div>
