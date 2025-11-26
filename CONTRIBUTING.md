# Contributing to ThesisAI Frontend

First off, thank you for considering contributing to ThesisAI! It's people like you that make this project a great tool for the academic community.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Requirements](#testing-requirements)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)

---

## 🤝 Code of Conduct

This project and everyone participating in it is governed by our commitment to foster an open and welcoming environment. By participating, you are expected to uphold this code. Please be respectful, considerate, and constructive in all interactions.

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18 or higher
- **pnpm**: v8.15.0 (required, not npm or yarn)
- **Git**: Latest version
- A code editor (VS Code recommended)

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:

```bash
git clone https://github.com/YOUR-USERNAME/aucdt-utilities.git
cd aucdt-utilities
```

3. Add the upstream repository:

```bash
git remote add upstream https://github.com/DanielFTwum-creator/aucdt-utilities.git
```

4. Install dependencies:

```bash
pnpm install
```

5. Create a new branch for your feature:

```bash
git checkout -b feature/your-feature-name
```

---

## 💻 Development Workflow

### 1. Start Development Server

```bash
pnpm start
```

The app will be available at `http://localhost:3000` with hot module replacement enabled.

### 2. Make Your Changes

- Write clean, maintainable code
- Follow the existing code style
- Add comments for complex logic
- Keep changes focused and atomic

### 3. Test Your Changes

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Check test coverage
pnpm test:coverage
```

**Important**: All tests must pass and coverage must remain at 100%.

### 4. Type Check

```bash
pnpm lint
```

Ensure there are no TypeScript errors before committing.

### 5. Build Verification

```bash
pnpm build
```

Verify that the production build completes successfully.

---

## 📏 Coding Standards

### TypeScript

- Use TypeScript for all new code
- Enable strict mode compliance
- Avoid `any` types - use proper typing
- Define interfaces for props and complex objects
- Use type inference where appropriate

**Example:**

```typescript
// Good
interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  // Implementation
}

// Bad
function FeatureCard(props: any) {
  // Implementation
}
```

### React Components

- Use functional components with hooks
- No class components
- Keep components focused and single-purpose
- Extract reusable logic into custom hooks
- Use meaningful component names

**Example:**

```typescript
// Good
function DocumentAnalyzer() {
  const [document, setDocument] = useState<Document | null>(null)
  // Implementation
}

// Bad
function Comp() {
  const [data, setData] = useState(null)
  // Implementation
}
```

### Styling

- Use **Tailwind CSS** utility classes exclusively
- Use the custom academic color palette:
  - `academic-navy`, `academic-blue`, `academic-amber`, `academic-gold`, `academic-slate`
- Avoid inline styles
- Use Tailwind's responsive modifiers (`sm:`, `md:`, `lg:`, etc.)

**Example:**

```tsx
// Good
<button className="bg-academic-gold hover:bg-academic-amber text-academic-navy px-4 py-2 rounded-lg">
  Click Me
</button>

// Bad
<button style={{ backgroundColor: '#fbbf24', padding: '8px 16px' }}>
  Click Me
</button>
```

### File Organization

- Place components in `src/` directory
- Place tests in `src/test/` directory
- Name test files: `ComponentName.test.tsx`
- One component per file (except small helper components)

### Imports

- Group imports logically
- External libraries first, then internal modules
- Use named exports

**Example:**

```typescript
// External libraries
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { FileText, Brain } from 'lucide-react'

// Internal modules
import { api } from './services/api'
import { FeatureCard } from './components/FeatureCard'
```

---

## 🧪 Testing Requirements

### Coverage Requirements

- **Minimum coverage**: 100% across all metrics
- Test all new components
- Test all new functions and utilities
- Test edge cases and error scenarios

### Writing Tests

Use Vitest and React Testing Library:

```typescript
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { FeatureCard } from '../components/FeatureCard'

describe('FeatureCard', () => {
  it('renders with provided props', () => {
    render(
      <FeatureCard
        icon={<span>Icon</span>}
        title="Test Title"
        description="Test Description"
      />
    )

    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
  })
})
```

### Running Tests

```bash
# Run all tests
pnpm test

# Watch mode (recommended during development)
pnpm test:watch

# Coverage report
pnpm test:coverage
```

---

## 📝 Commit Guidelines

### Commit Message Format

Follow the conventional commits specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
# Feature
git commit -m "feat(analysis): add document structure validation"

# Bug fix
git commit -m "fix(ui): correct button alignment in header"

# Documentation
git commit -m "docs: update installation instructions"

# Test
git commit -m "test(components): add tests for FeatureCard component"
```

### Detailed Commit Message

For complex changes, include a body:

```
feat(evaluation): add AI-powered content assessment

- Implement OpenAI API integration
- Add scoring algorithm for academic rigor
- Create feedback generation system
- Update UI to display assessment results

Closes #42
```

---

## 🔄 Pull Request Process

### Before Submitting

1. ✅ All tests pass (`pnpm test`)
2. ✅ Type checking passes (`pnpm lint`)
3. ✅ Production build succeeds (`pnpm build`)
4. ✅ Code follows style guidelines
5. ✅ Tests maintain 100% coverage
6. ✅ Commits follow commit guidelines
7. ✅ Branch is up to date with main

### Submitting

1. Push your branch to your fork:

```bash
git push origin feature/your-feature-name
```

2. Open a pull request on GitHub
3. Fill out the PR template completely
4. Link any related issues

### PR Title Format

Use conventional commit format:

```
feat(scope): Brief description of changes
fix(scope): Brief description of bug fix
docs: Brief description of documentation updates
```

### PR Description

Include:

- **Summary**: What does this PR do?
- **Motivation**: Why is this change needed?
- **Changes**: List of specific changes made
- **Testing**: How was this tested?
- **Screenshots**: If UI changes, include before/after screenshots
- **Breaking Changes**: List any breaking changes
- **Related Issues**: Reference related issues (e.g., "Closes #123")

### Review Process

- At least one maintainer must approve
- All CI checks must pass
- Address all review comments
- Keep the PR focused and reasonably sized
- Be responsive to feedback

---

## 🐛 Reporting Bugs

### Before Reporting

1. Check existing issues to avoid duplicates
2. Test with the latest version
3. Verify it's not a local environment issue

### Bug Report Template

When creating a bug report, include:

- **Description**: Clear description of the bug
- **Steps to Reproduce**: Numbered steps to reproduce
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Environment**:
  - OS and version
  - Node.js version
  - pnpm version
  - Browser (if applicable)
- **Screenshots**: If applicable
- **Additional Context**: Any other relevant information

---

## 💡 Suggesting Enhancements

### Enhancement Request Template

When suggesting enhancements, include:

- **Feature Description**: Clear description of the feature
- **Use Case**: Why is this feature valuable?
- **Proposed Solution**: How should it work?
- **Alternatives Considered**: Other approaches you've thought about
- **Additional Context**: Mockups, examples, references

---

## 📚 Additional Resources

- [Project README](README.md)
- [CLAUDE.md](CLAUDE.md) - AI assistant guide
- [React 19 Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vitest Documentation](https://vitest.dev/)

---

## 🎯 Quick Checklist

Before submitting your PR, verify:

- [ ] Code follows project style guidelines
- [ ] All tests pass with 100% coverage
- [ ] TypeScript type checking passes
- [ ] Production build succeeds
- [ ] Commit messages follow conventions
- [ ] PR description is complete
- [ ] Documentation is updated if needed
- [ ] No console errors or warnings
- [ ] Branch is up to date with main

---

## 🙏 Thank You!

Your contributions make ThesisAI better for everyone. We appreciate your time and effort in improving this project!

**Questions?** Feel free to open an issue for discussion.

---

<div align="center">

**Happy Contributing! 🚀**

</div>
