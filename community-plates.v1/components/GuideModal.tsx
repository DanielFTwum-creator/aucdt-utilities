
import React from 'react';
import { XIcon, BookOpenIcon } from './icons';

interface GuideModalProps {
  onClose: () => void;
}

const GuideSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-teal-500 pb-2 mb-3">{title}</h3>
    <div className="prose prose-sm max-w-none text-gray-600">
      {children}
    </div>
  </div>
);

export const GuideModal: React.FC<GuideModalProps> = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center p-4 z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="guide-title"
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b">
          <h2 id="guide-title" className="text-2xl font-bold text-gray-800 flex items-center">
            <BookOpenIcon className="h-6 w-6 mr-3 text-teal-600" />
            Application Guide
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
            aria-label="Close guide"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </header>

        <main className="p-6 overflow-y-auto flex-grow">
          <GuideSection title="User Guide">
            <p>Welcome to Community Plates! This guide helps you use the app effectively.</p>
            <ol>
              <li><strong>Search:</strong> On the "Search & Connect" tab, enter a city or zip code. Click "Find Restaurants" or "Find Food Pantries" to see results in the lists below.</li>
              <li><strong>Select Items:</strong> In the search results, click the "Select" button on one restaurant and one food pantry you wish to connect. The selected items will be highlighted.</li>
              <li><strong>Map a Connection:</strong> Once one of each type is selected, a "Map Them" button will appear. Click it to create a connection.</li>
              <li><strong>View Dashboard:</strong> Navigate to the "Dashboard" tab to see all your mapped connections.</li>
              <li><strong>Generate Email:</strong> In the dashboard, click the mail icon on any connection to open a pre-filled, customizable email template to request a donation.</li>
              <li><strong>Import/Export Data:</strong> On both tabs, use the "Import" buttons to upload your own lists from a JSON file, and the "Export" buttons to download data as JSON or a printable PDF.</li>
            </ol>
          </GuideSection>

          <GuideSection title="Technical Description">
            <p>Community Plates is a single-page application (SPA) built with a modern frontend stack designed for performance, maintainability, and a great user experience.</p>
            <ul>
                <li><strong>Core Framework:</strong> React 18 with TypeScript for robust, type-safe component-based UI development.</li>
                <li><strong>Styling:</strong> Tailwind CSS for a utility-first styling workflow, enabling rapid and consistent UI design.</li>
                <li><strong>AI Integration:</strong> The Google Gemini API (`gemini-2.5-flash` model) is used to dynamically fetch location-based data for restaurants and pantries based on user queries. It uses JSON mode with a defined schema for reliable, structured data retrieval.</li>
                <li><strong>State Management:</strong> Component-level state is managed using React Hooks (`useState`, `useCallback`, `useRef`) for simplicity and efficiency.</li>
                <li><strong>Modularity:</strong> The codebase is organized into logical directories: `components` for reusable UI elements, `services` for API calls and business logic (like exports), and `types` for shared data structures.</li>
            </ul>
          </GuideSection>

          <GuideSection title="Technical Guide">
            <p>The application follows a standard React project structure. Key files include:</p>
            <ul>
                <li><code>index.html</code>: The main entry point that loads the React application.</li>
                <li><code>index.tsx</code>: Mounts the main `App` component to the DOM.</li>
                <li><code>App.tsx</code>: The root component that manages the overall application state, routing between tabs, and orchestrates the child components.</li>
                <li><code>services/geminiService.ts</code>: Handles all communication with the Google GenAI API. It constructs the prompts, defines the response JSON schema, and processes the results.</li>
                <li><code>services/exportService.ts</code>: Contains functions to convert application data (search results, mappings) into JSON or PDF files for download, using `jsPDF` for PDF generation.</li>
                <li><code>components/</code>: This directory holds all reusable React components, such as modals, icons, and list renderers.</li>
                <li><code>types.ts</code>: Defines TypeScript interfaces for core data models like `Restaurant`, `Pantry`, and `Mapping`, ensuring data consistency across the app.</li>
            </ul>
          </GuideSection>

          <GuideSection title="Deployment Procedures for Local Verification">
            <p>To run this application on your local machine for verification or development, please follow these steps:</p>
            <ol>
              <li><strong>Prerequisites:</strong> Ensure you have Node.js (v18 or higher) and npm installed.</li>
              <li><strong>Clone Repository:</strong> Obtain the source code by cloning the repository to your local machine.</li>
              <li>
                <strong>Set API Key:</strong> The application requires a Google Gemini API key. You must create a file named <code>.env</code> in the root of the project directory and add the following line, replacing `YOUR_API_KEY_HERE` with your actual key:
                <br />
                <code className="bg-gray-200 p-1 rounded text-sm block my-2">REACT_APP_API_KEY=YOUR_API_KEY_HERE</code>
                <br />
                <em>Note: In a production environment, this key would be managed securely on the server side.</em>
              </li>
              <li><strong>Install Dependencies:</strong> Open a terminal in the project root and run the command:
                <br />
                <code className="bg-gray-200 p-1 rounded text-sm block my-2">npm install</code>
              </li>
              <li><strong>Start the Server:</strong> After installation, start the local development server with:
                <br />
                <code className="bg-gray-200 p-1 rounded text-sm block my-2">npm start</code>
              </li>
              <li><strong>Access the App:</strong> The application should now be running. Open your web browser and navigate to <a href="http://localhost:3000" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">http://localhost:3000</a>.</li>
            </ol>
          </GuideSection>
        </main>
      </div>
    </div>
  );
};
