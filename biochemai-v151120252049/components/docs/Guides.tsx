import React from 'react';

const DocsHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] border-b-2 border-[var(--color-accent-primary)] pb-2 mb-4 mt-8">
        {children}
    </h2>
);

const DocsSection: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="prose max-w-none prose-a:text-[var(--color-text-accent)] prose-strong:text-[var(--color-text-primary)] prose-headings:text-[var(--color-text-primary)] prose-p:text-[var(--color-text-secondary)] prose-li:text-[var(--color-text-secondary)]">
        {children}
    </div>
);

export const Guides: React.FC = () => {
    return (
        <div className="space-y-12">
            <section>
                <DocsHeader>Administrator Guide</DocsHeader>
                <DocsSection>
                   <h4>Overview</h4>
                   <p>The BioChemAI application includes a simple, secure administrative panel for configuration and monitoring. Administrative tasks are primarily focused on API key management (handled at the deployment level) and in-app password management.</p>
                   
                   <h4>API Key Management</h4>
                   <p>The application requires a valid Google Gemini API key to function. This key is the sole authentication mechanism for accessing the AI model.</p>
                   <ul>
                    <li><strong>Storage:</strong> The API key must be stored as an environment variable named <code>process.env.API_KEY</code>.</li>
                    <li><strong>Security:</strong> Never expose the API key in the client-side code. The environment variable should be injected during the build process or via the hosting platform's configuration.</li>
                    <li><strong>Rotation:</strong> It is recommended to rotate the API key periodically as a security best practice.</li>
                   </ul>

                   <h4>Admin Panel Access</h4>
                   <p>The Admin Panel is accessed by clicking the Admin (shield) icon in the application header. Access is protected by a password.</p>
                   <ul>
                        <li><strong>Login:</strong> Click the Admin button in the header. A modal will prompt for the password.</li>
                        <li><strong>Default Password:</strong> The initial default password is <code>password123</code>. It is strongly recommended to change this immediately.</li>
                   </ul>

                   <h4>Password Management</h4>
                   <p>The admin password can be changed from within the Admin Panel.</p>
                   <ol>
                        <li>Log in to the Admin Panel.</li>
                        <li>In the "Change Admin Password" section, enter the current password.</li>
                        <li>Enter a new password (must be at least 8 characters) and confirm it.</li>
                        <li>Click "Update Password". A confirmation message will be displayed.</li>
                   </ol>
                   
                   <h4>Audit Log</h4>
                   <p>The Admin Panel includes an audit log that records significant administrative actions to provide a trail of activity. The log displays the last 100 actions.</p>
                   <p>Actions logged include:</p>
                   <ul>
                        <li>System Initialized</li>
                        <li>Successful Admin Login</li>
                        <li>Failed Admin Login Attempt</li>
                        <li>Password Change Attempt (and its outcome)</li>
                        <li>Password Changed Successfully</li>
                   </ul>
                </DocsSection>
            </section>
            
            <section>
                <DocsHeader>Deployment Guide</DocsHeader>
                <DocsSection>
                    <p>Deploying BioChemAI is straightforward as it is a static web application. It can be hosted on any platform that supports serving static files (HTML, CSS, JavaScript).</p>
                    <h4>Step-by-step Deployment:</h4>
                    <ol>
                        <li><strong>Build the Application:</strong> This application uses modern tooling (like Vite) that transpiles TSX/React. Run your build command (e.g., <code>npm run build</code>) to generate static files in a <code>dist</code> directory.</li>
                        <li><strong>Choose a Hosting Provider:</strong> Select a static hosting provider such as Vercel, Netlify, GitHub Pages, or AWS S3.</li>
                        <li><strong>Configure Environment Variable:</strong> In your hosting provider's settings, add an environment variable named <code>API_KEY</code> and set its value to your Google Gemini API key. This is the most critical step.</li>
                        <li><strong>Deploy Files:</strong> Upload the contents of the build directory (e.g., <code>dist</code>) to your hosting provider.</li>
                        <li><strong>Enable HTTPS:</strong> Ensure your hosting provider has configured a valid SSL certificate for your domain. HTTPS is required for the Gemini API to function correctly.</li>
                    </ol>
                </DocsSection>
            </section>
            
            <section>
                <DocsHeader>Testing Guide</DocsHeader>
                <DocsSection>
                   <p>Ensuring the quality and reliability of BioChemAI involves manual testing and using the integrated self-test framework.</p>
                   
                   <h4>Interactive Self-Test Framework</h4>
                   <p>The application includes an interactive test runner to quickly verify core functionality. This provides a first line of defense against regressions.</p>
                   <ol>
                    <li>Navigate to the <strong>"Test"</strong> tab in the application header.</li>
                    <li>Click the <strong>"Run Full Test Suite"</strong> button to begin.</li>
                    <li>Observe the real-time results as the test runner executes each step.</li>
                    <li>Review the final results, including the mock "screenshots" that provide a visual representation of the UI at each test step.</li>
                   </ol>
                   
                   <h4>Manual Testing</h4>
                   <p>Manual testing should cover user journeys to ensure they function as expected across different browsers and devices, especially after any code changes.</p>
                   <h5>Key User Journeys:</h5>
                   <ul>
                        <li><strong>Chat Mode:</strong>
                            <ul>
                                <li>Send a question and verify a response is received.</li>
                                <li>Change the learning level and confirm the response style changes.</li>
                                <li>Check if sources are displayed and links are clickable.</li>
                                <li>Verify the loading indicator appears during API calls.</li>
                                <li>Test all content export functions (JSON, Markdown).</li>
                            </ul>
                        </li>
                        <li><strong>Quiz Mode:</strong>
                            <ul>
                                <li>Start a quiz with a specific topic and level.</li>
                                <li>Answer questions and check for immediate feedback (correct/incorrect styling).</li>
                                <li>Navigate through all questions to the results screen.</li>
                                <li>Verify the final score is calculated correctly.</li>
                                <li>Use the "Take Another Quiz" button to return to the setup screen.</li>
                            </ul>
                        </li>
                        <li><strong>Admin Panel Functionality:</strong>
                            <ul>
                                <li>Attempt login with an incorrect password and verify failure.</li>
                                <li>Login successfully with the correct password.</li>
                                <li>Attempt to change the password with an incorrect "current password" and verify failure.</li>
                                <li>Successfully change the password.</li>
                                <li>Log out (by refreshing) and log back in with the new password.</li>
                                <li>Check the audit log to confirm all actions were recorded.</li>
                            </ul>
                        </li>
                         <li><strong>Theme Switching:</strong>
                            <ul>
                                <li>Click each theme icon (Ocean, Golden, Cyberpunk, Minimal, Cinema).</li>
                                <li>Verify that the UI colors update correctly for each theme.</li>
                                <li>Refresh the page and confirm the selected theme persists.</li>
                            </ul>
                        </li>
                        <li><strong>Responsiveness:</strong>
                          <ul>
                            <li>Resize the browser window to test mobile, tablet, and desktop layouts.</li>
                            <li>Ensure all UI elements are usable and readable at all sizes.</li>
                          </ul>
                        </li>
                   </ul>
                </DocsSection>
            </section>
        </div>
    );
};