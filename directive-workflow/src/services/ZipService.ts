import JSZip from "jszip";

export const generateProjectZip = async (onProgress: (msg: string) => void) => {
  const zip = new JSZip();
  onProgress("Initializing project structure...");

  const files: Record<string, string> = {
    "package.json": JSON.stringify({
      name: "ai-studio-directives",
      private: true,
      version: "1.0.0",
      type: "module",
      scripts: {
        dev: "vite",
        build: "vite build",
        preview: "vite preview"
      },
      dependencies: {
        react: "19.2.4",
        "react-dom": "19.2.4"
      },
      devDependencies: {
        "@vitejs/plugin-react": "^4.3.4",
        vite: "^6.3.5"
      }
    }, null, 2),
    "vite.config.js": `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})`,
    "index.html": `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AI Studio Directive Workflow</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`,
    ".gitignore": `node_modules\ndist\n.env\n.DS_Store\n*.local`,
    "README.md": `# AI Studio Directive Workflow\n\nComplete production-ready project.`,
    "src/index.css": `body { background: #0b0b1a; color: #e2e8f0; }`,
    "src/main.jsx": `import { StrictMode } from 'react'\nimport { createRoot } from 'react-dom/client'\nimport './index.css'\nimport App from './App.jsx'\n\ncreateRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>)`,
    "src/App.jsx": `export default function App() { return <div>AI Studio Directive Workflow</div> }`
  };

  for (const [path, content] of Object.entries(files)) {
    zip.file(path, content);
  }

  onProgress("Generating ZIP archive...");
  const content = await zip.generateAsync({ type: "blob" });
  
  onProgress("Finalizing download...");
  const link = document.createElement("a");
  link.href = URL.createObjectURL(content);
  link.download = "ai-studio-directive-workflow.zip";
  link.click();
  
  onProgress("Project generated successfully!");
  setTimeout(() => onProgress(""), 3000);
};
