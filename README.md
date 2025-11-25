# ThesisAI Frontend

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

**ThesisAI Frontend** is a modern web application built for the African University College of Digital Technologies (AUCDT). It provides an intuitive interface for AI-powered thesis assessment, helping educators and students streamline the evaluation process with automated analysis and comprehensive feedback.

### Key Capabilities

- **Document Analysis**: Upload and analyze thesis documents with structural and formatting checks
- **AI Evaluation**: Leverage advanced AI to assess content quality, argumentation, and academic rigor
- **Detailed Feedback**: Generate actionable feedback with specific improvement suggestions

---

## ✨ Features

### 🔍 Document Analysis
Upload thesis documents and receive comprehensive structural analysis including:
- Formatting validation
- Structure assessment
- Citation checking
- Grammar and style review

### 🧠 AI Evaluation
Advanced AI-powered evaluation that assesses:
- Content quality and depth
- Argumentation strength
- Academic rigor
- Research methodology
- Critical thinking

### ✅ Detailed Feedback
Actionable feedback system providing:
- Specific improvement suggestions
- Grading criteria breakdown
- Strengths and weaknesses analysis
- Personalized recommendations

---

## 🛠 Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| **Framework** | React | 19.2.0 |
| **Language** | TypeScript | 5.9.3 |
| **Build Tool** | Vite | 7.2.4 |
| **Styling** | Tailwind CSS | 4.1.17 |
| **Package Manager** | pnpm | 8.15.0 |
| **HTTP Client** | Axios | 1.13.2 |
| **Routing** | React Router DOM | 7.9.6 |
| **Animations** | Framer Motion | 12.23.24 |
| **Icons** | Lucide React | 0.554.0 |
| **Charts** | Recharts | 3.5.0 |
| **Testing** | Vitest + Testing Library | 4.0.13 |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js**: v18 or higher
- **pnpm**: v8.15.0
- **Git**: Latest version

### Installation

```bash
# Clone the repository
git clone https://github.com/DanielFTwum-creator/aucdt-utilities.git
cd aucdt-utilities

# Install dependencies using pnpm
pnpm install

# Start development server
pnpm start
```

The application will be available at `http://localhost:3000`

---

## 💻 Development

### Available Scripts

```bash
# Development server (port 3000)
pnpm start
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Type checking
pnpm lint

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with UI
pnpm test:ui

# Generate coverage report
pnpm test:coverage

# Clean install
pnpm install-clean
```

### Development Server

The development server runs on port **3000** with:
- Hot Module Replacement (HMR)
- Fast Refresh for React components
- API proxy to `localhost:8080` for `/api` routes

### Code Style

- **TypeScript**: Strict mode with comprehensive type checking
- **JSX**: Modern `react-jsx` transform (no React imports needed)
- **Modules**: ES Modules (`"type": "module"`)
- **Formatting**: Follow established patterns in existing code

### Styling Guidelines

- Use **Tailwind CSS** utility classes for all styling
- Custom color palette:
  - `academic-navy`: #1e3a5f
  - `academic-blue`: #2563eb
  - `academic-amber`: #f59e0b
  - `academic-gold`: #fbbf24
  - `academic-slate`: #475569
- Font families:
  - Serif: `Crimson Text`, `Georgia`
  - Sans: `Inter`, `system-ui`

---

## 🧪 Testing

### Test Infrastructure

Comprehensive testing setup with:
- **Vitest**: Fast unit test runner
- **Testing Library**: React component testing
- **jsdom**: Browser environment simulation
- **Coverage**: v8 coverage provider

### Running Tests

```bash
# Run all tests
pnpm test

# Watch mode for development
pnpm test:watch

# Interactive UI
pnpm test:ui

# Generate coverage report
pnpm test:coverage
```

### Test Coverage

The project maintains **100% test coverage** across all components. Coverage reports are generated in the `coverage/` directory.

---

## 🐳 Docker Deployment

### Build Docker Image

```bash
docker build -t thesisai-frontend .
```

### Run Container

```bash
# Run on port 80
docker run -p 80:80 thesisai-frontend

# Run on custom port
docker run -p 8080:80 thesisai-frontend
```

### Docker Architecture

- **Multi-stage build**: Optimized for production
- **Base**: Node 18 Alpine (build), Nginx Alpine (serve)
- **Package Manager**: pnpm for efficient dependency management
- **Server**: Nginx with SPA routing support

### Environment Configuration

In Docker environment:
- Frontend served by Nginx on port 80
- API backend expected at `backend:8080`
- SPA routing enabled for client-side navigation

---

## 📁 Project Structure

```
aucdt-utilities/
├── src/                      # Source code
│   ├── main.tsx             # Application entry point
│   ├── App.tsx              # Main App component
│   ├── index.css            # Tailwind CSS imports
│   └── test/                # Test files
│       ├── App.test.tsx
│       ├── FeatureCard.test.tsx
│       └── setup.ts
├── index.html               # HTML entry point
├── package.json             # Dependencies and scripts
├── pnpm-lock.yaml          # Lockfile
├── vite.config.ts          # Vite configuration
├── vitest.config.ts        # Vitest configuration
├── tsconfig.json           # TypeScript config
├── tsconfig.node.json      # TypeScript Node config
├── tailwind.config.js      # Tailwind CSS config
├── postcss.config.js       # PostCSS config
├── Dockerfile              # Docker build config
├── nginx.conf              # Nginx server config
├── CLAUDE.md               # AI assistant guide
├── LICENSE                 # MIT License
└── README.md               # This file
```

---

## ⚙️ Configuration

### TypeScript (`tsconfig.json`)

- **Target**: ES2020
- **Module**: ESNext with bundler resolution
- **Strict Mode**: Enabled with comprehensive checks
- **Source**: `src/` directory

### Vite (`vite.config.ts`)

- **Plugin**: React with Fast Refresh
- **Dev Server**: Port 3000
- **API Proxy**: `/api` → `http://localhost:8080`

### Tailwind CSS (`tailwind.config.js`)

- **Content**: `index.html` and `src/**/*.{js,ts,jsx,tsx}`
- **Theme**: Extended with academic color palette
- **Fonts**: Crimson Text (serif), Inter (sans)

### Environment Variables

Create a `.env` file for local development:

```env
VITE_API_URL=http://localhost:8080
```

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Write tests for new features
- Maintain 100% test coverage
- Follow TypeScript strict mode
- Use Tailwind CSS for styling
- Follow existing code patterns
- Update documentation as needed

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 DanielFTwum-creator

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 🔗 Links

- **Repository**: [github.com/DanielFTwum-creator/aucdt-utilities](https://github.com/DanielFTwum-creator/aucdt-utilities)
- **Issues**: [Report a bug or request a feature](https://github.com/DanielFTwum-creator/aucdt-utilities/issues)
- **AUCDT**: African University College of Digital Technologies

---

## 🙏 Acknowledgments

- Built with [React](https://react.dev/) and [Vite](https://vitejs.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/)
- Animations by [Framer Motion](https://www.framer.com/motion/)

---

<div align="center">

**Made with ❤️ for AUCDT**

⭐ Star this repository if you find it helpful!

</div>
