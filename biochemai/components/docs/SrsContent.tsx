import React from 'react';
import { 
    SystemArchitectureDiagram,
    TechnologyStackDiagram,
    DataFlowDiagram,
    UmlUseCaseDiagram,
    UmlSequenceDiagram
} from './SystemDiagrams';


const DocsHeader: React.FC<{ children: React.ReactNode; id: string }> = ({ children, id }) => (
    <h2 id={id} className="text-3xl font-bold text-[var(--color-text-primary)] border-b-2 border-[var(--color-accent-primary)] pb-2 mb-4 mt-8 scroll-mt-20">
        {children}
    </h2>
);

const DocsSubHeader: React.FC<{ children: React.ReactNode; id: string }> = ({ children, id }) => (
    <h3 id={id} className="text-2xl font-semibold text-[var(--color-text-primary)] mt-6 mb-3 scroll-mt-20">
        {children}
    </h3>
);

const DocsSection: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="prose prose-lg max-w-none prose-a:text-[var(--color-text-accent)] prose-strong:text-[var(--color-text-primary)] prose-headings:text-[var(--color-text-primary)] prose-p:text-[var(--color-text-secondary)] prose-li:text-[var(--color-text-secondary)]">
        {children}
    </div>
);

export const SrsContent: React.FC = () => (
    <div className="space-y-12">
        <section>
            <DocsHeader id="srs-intro">1. Introduction</DocsHeader>
            <DocsSection>
                <DocsSubHeader id="srs-intro-purpose">1.1 Purpose</DocsSubHeader>
                <p>This Software Requirements Specification (SRS) provides a complete description of the BioChemAI Teaching Aid application. It details the functional and non-functional requirements for the system, which includes a core Chat mode, an interactive Quiz mode, an integrated Documentation view, and a Self-Testing framework. This document is intended for project stakeholders, developers, and quality assurance teams.</p>
                
                <DocsSubHeader id="srs-intro-scope">1.2 Scope</DocsSubHeader>
                <p>BioChemAI is an intelligent web-based teaching assistant designed to provide adaptive biochemistry education. The application leverages the Google Gemini API to deliver personalized explanations, generate interactive quizzes, and provide comprehensive documentation. It supports multiple learning levels from Primary School to Professional. The scope covers:</p>
                <ul>
                    <li>Biochemistry question answering with source citation (Chat Mode).</li>
                    <li>Interactive multiple-choice quiz generation and execution (Quiz Mode).</li>
                    <li>Integrated application documentation viewer (Docs Mode).</li>
                    <li>An interactive self-testing interface to verify core functionality (Test Mode).</li>
                    <li>Adaptive content generation based on selected learning level.</li>
                    <li>Exporting chat content to various formats (JSON, Markdown).</li>
                    <li>A secure, password-protected Admin panel for configuration and audit logging.</li>
                    <li>Five distinct user-selectable visual themes for personalization.</li>
                </ul>

                <DocsSubHeader id="srs-intro-def">1.3 Definitions, Acronyms, and Abbreviations</DocsSubHeader>
                <dl>
                    <dt><strong>AI</strong></dt><dd>Artificial Intelligence.</dd>
                    <dt><strong>API</strong></dt><dd>Application Programming Interface.</dd>
                    <dt><strong>DFD</strong></dt><dd>Data Flow Diagram.</dd>
                    <dt><strong>Gemini</strong></dt><dd>The family of generative AI models developed by Google.</dd>
                    <dt><strong>SPA</strong></dt><dd>Single-Page Application.</dd>
                    <dt><strong>SRS</strong></dt><dd>Software Requirements Specification.</dd>
                    <dt><strong>SVG</strong></dt><dd>Scalable Vector Graphics.</dd>
                    <dt><strong>UI</strong></dt><dd>User Interface.</dd>
                    <dt><strong>UML</strong></dt><dd>Unified Modeling Language.</dd>
                </dl>
                
                <DocsSubHeader id="srs-intro-ref">1.4 References</DocsSubHeader>
                <ul>
                    <li><a href="https://ai.google.dev/docs" target="_blank" rel="noopener noreferrer">Google AI for Developers Documentation</a></li>
                    <li>IEEE Std 830-1998, Recommended Practice for Software Requirements Specifications</li>
                </ul>
            </DocsSection>
        </section>

        <section>
            <DocsHeader id="srs-overall">2. Overall Description</DocsHeader>
            <DocsSection>
                <DocsSubHeader id="srs-overall-perspective">2.1 Product Perspective</DocsSubHeader>
                <p>BioChemAI is a self-contained, client-side single-page application (SPA). It operates entirely within the user's web browser and communicates with the external Google Gemini API for its intelligent features. It does not require a dedicated backend server or database, simplifying deployment and maintenance. State is persisted using the browser's Local Storage.</p>
                
                <DocsSubHeader id="srs-overall-functions">2.2 Product Functions</DocsSubHeader>
                <ul>
                    <li><b>Adaptive Question Answering:</b> Accept and process biochemistry questions in natural language, generating level-appropriate responses with source citations.</li>
                    <li><b>Interactive Quiz Generation:</b> Generate multiple-choice quizzes on a user-specified topic and learning level, providing real-time feedback and a final score.</li>
                    <li><b>In-App Documentation:</b> Display comprehensive system documentation, including this SRS, system diagrams, and operational guides.</li>
                    <li><b>Self-Testing Framework:</b> Provide an interactive interface for running a simulated end-to-end test suite to validate critical user journeys within the application.</li>
                    <li><b>Learning Level Management:</b> Allow users to select a learning level (Primary, Secondary, etc.) that tailors the complexity of content in both Chat and Quiz modes.</li>
                    <li><b>Content Export:</b> Enable users to export chat history (JSON, Markdown).</li>
                    <li><b>Admin Panel:</b> Provide a password-protected area to manage the admin password and view an audit log of administrative actions.</li>
                </ul>

                <DocsSubHeader id="srs-overall-users">2.3 User Characteristics</DocsSubHeader>
                <p>The target users for BioChemAI are individuals seeking to learn or teach biochemistry, including:</p>
                <ul>
                    <li><b>Students:</b> From primary school to post-graduate levels, using the tool for study, revision, and self-assessment.</li>
                    <li><b>Educators:</b> Using the tool to generate teaching materials, explanations, and quizzes.</li>
                    <li><b>Professionals:</b> Individuals in related fields refreshing their knowledge or exploring new topics.</li>
                    <li><b>Administrators:</b> Technical staff responsible for deploying and maintaining the application.</li>
                </ul>
                <p>Users are expected to have basic web literacy but no specialized technical skills.</p>
                
                <DocsSubHeader id="srs-overall-constraints">2.4 Constraints</DocsSubHeader>
                <ul>
                    <li>The application is dependent on a valid and accessible Google Gemini API key.</li>
                    <li>The application must run in modern web browsers that support JavaScript ES6 modules and the Fetch API.</li>
                    <li>All processing is client-side, so performance is dependent on the user's device capabilities.</li>
                    <li>The application relies on the availability and performance of the external Google Gemini API.</li>
                </ul>

                <DocsSubHeader id="srs-overall-diagrams">2.5 System Architecture and Diagrams</DocsSubHeader>
                <p>The following diagrams provide a visual overview of the system's architecture, technology stack, and key interactions.</p>
                
                <h4>High-Level System Architecture</h4>
                <p>This diagram shows the main components and their interactions at a high level. BioChemAI is a client-side application that communicates directly with the Gemini API.</p>
                <SystemArchitectureDiagram />
                
                <h4>Technology Stack</h4>
                <p>This diagram outlines the core technologies used to build, style, and power the BioChemAI application.</p>
                <TechnologyStackDiagram />
                
                <h4>Data Flow Diagram (DFD)</h4>
                <p>This DFD illustrates the flow of data for the primary use case: a user asking a question and receiving an answer from the AI.</p>
                <DataFlowDiagram />

                <h4>UML Use Case Diagram</h4>
                <p>This diagram shows the key interactions available to different types of users (actors) within the system.</p>
                <UmlUseCaseDiagram />

                <h4>UML Sequence Diagram</h4>
                <p>This sequence diagram details the chronological order of operations when a user asks a question in the chat interface.</p>
                <UmlSequenceDiagram />
            </DocsSection>
        </section>

        <section>
            <DocsHeader id="srs-specific">3. Specific Requirements</DocsHeader>
            <DocsSection>
                <DocsSubHeader id="srs-specific-interfaces">3.1 External Interface Requirements</DocsSubHeader>
                <h4>3.1.1 User Interfaces</h4>
                <p>The UI shall be clean, responsive, and intuitive. It will be composed of a main header for navigation, a content area that changes based on the selected mode, and a footer for input in Chat mode. The application shall support five distinct visual themes: Ocean, Golden, Cyberpunk, Minimal, and Cinema.</p>
                <h4>3.1.2 Software Interfaces</h4>
                <p>The application's primary software interface is with the Google Gemini API via the <code>@google/genai</code> client library. All API requests must be authenticated using an API key provided as an environment variable.</p>

                <DocsSubHeader id="srs-specific-functional">3.2 Functional Requirements</DocsSubHeader>
                <h4>FR-UI-001: Mode Selection</h4>
                <p>The system shall provide distinct buttons in the header to switch between 'Chat', 'Quiz', 'Docs', 'Test', and 'Admin' modes. The active mode's button shall be visually highlighted.</p>
                <h4>FR-CHAT-001: Chat Interface</h4>
                <p>The chat interface shall display a chronological list of user and AI messages. User messages will be right-aligned, and AI messages left-aligned.</p>
                <h4>FR-CHAT-002: AI Response Generation</h4>
                <p>Upon submitting a question, the system shall send a request to the Gemini API, including the user's prompt and selected learning level. It shall display a loading indicator while awaiting the response.</p>
                <h4>FR-CHAT-003: Source Citation</h4>
                <p>When the AI response is grounded using Google Search, the system shall parse and display the source URLs with their titles below the AI's content.</p>
                <h4>FR-QUIZ-001: Quiz Generation</h4>
                <p>In Quiz Mode, the user shall be able to input a topic and select a learning level. Upon submission, the system shall request a structured JSON object from the Gemini API containing a set of multiple-choice questions.</p>
                <h4>FR-QUIZ-002: Quiz Interaction</h4>
                <p>The system shall display one question at a time. After the user selects an answer, the UI shall provide immediate visual feedback (e.g., green for correct, red for incorrect) and display an explanation.</p>
                <h4>FR-DOCS-001: Documentation Viewer</h4>
                <p>The Docs mode shall provide a tabbed interface to view the SRS Document, System Diagrams, and Guides.</p>
                <h4>FR-TEST-001: Test Runner</h4>
                <p>The Test mode shall feature a button to start a simulated test suite. The UI shall display the progress and pass/fail status of each test case in real-time.</p>
                <h4>FR-ADMIN-001: Admin Panel</h4>
                <p>The system shall provide a password-protected Admin Panel. The panel must allow an authenticated admin to change the password and view an audit log of administrative actions.</p>
                
                <DocsSubHeader id="srs-specific-nonfunctional">3.3 Non-Functional Requirements</DocsSubHeader>
                <h4>NFR-PERF-001: Performance</h4>
                <p>The UI shall remain responsive during API calls. AI responses in chat should ideally be received and rendered within 5 seconds under normal network conditions.</p>
                <h4>NFR-USAB-001: Usability</h4>
                <p>The application shall be easy to navigate for non-technical users. All interactive elements must have clear labels and feedback (e.g., hover states, disabled states).</p>
                <h4>NFR-RELI-001: Reliability</h4>
                <p>The application shall gracefully handle API errors by displaying a user-friendly error message instead of crashing.</p>
                <h4>NFR-SECU-001: Security</h4>
                <p>The Google Gemini API key must not be exposed in the client-side source code. It must be managed as an environment variable on the hosting platform. The admin panel password must be stored securely (in this case, in Local Storage, with the understanding that this provides basic, not hardened, security).</p>
            </DocsSection>
        </section>
    </div>
);