
# Technology Stack Documentation
## 6R Design Workshop Portal

### 1. Core Frameworks & Libraries
- **React 19.0.0**: Utilized for UI component architecture using Functional Components and Hooks.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development and brand skinning.
- **Google GenAI SDK (@google/genai)**: Direct integration with `gemini-3-flash-preview` for high-performance AI coaching.

### 2. PWA & Offline Capabilities
- **Service Workers (sw.js)**: Custom implementation for background sync and push notifications.
- **Web App Manifest**: Configured for "standalone" display mode and brand-specific theming.
- **LocalStorage API**: Used for persisting user progress, module states, and (upcoming) audit logs.

### 3. Fonts & Assets
- **Headings**: Montserrat (Google Fonts)
- **Body**: Inter (Google Fonts)
- **Icons**: SVG-based system (ICONS constant)
- **Logo**: TechBridge University College Official PNG

### 4. Project Architecture
- **State Management**: React `useState` and `useEffect` for local and lift-up state management.
- **Module System**: ES6 Modules imported via `esm.sh` to avoid heavy build steps and maintain high-speed iteration.
- **Deployment Strategy**: Static site hosting with Service Worker proxy.
