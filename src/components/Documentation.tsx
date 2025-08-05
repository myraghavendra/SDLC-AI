import React from 'react';
import Header from './Header'; // Adjust import path if needed
import Footer from './Footer'; // Adjust import path if needed

/**
 * Documentation Component
 * Comprehensive explanation of the workspace, project structure, and features.
 */
const Documentation: React.FC = () => (
  <>
    <Header />
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Project Documentation</h1>

      <section>
        <h2>Project Overview</h2>
        <p>
          This workspace is a full-stack SDLC (Software Development Life Cycle) agent dashboard for managing requirements, user stories, test cases, and defect analytics. It uses a modern React + TypeScript frontend and a Node.js/Express backend, with Python microservices for integrations (e.g., Jira).
        </p>
      </section>

      <section>
        <h2>Tech Stack</h2>
        <ul>
          <li><strong>npm:</strong> Manages project dependencies and scripts.</li>
          <li><strong>React:</strong> Builds interactive user interfaces using components.</li>
          <li><strong>TypeScript:</strong> Adds type safety to JavaScript, reducing runtime errors.</li>
          <li><strong>Node.js/Express:</strong> Backend API and server logic.</li>
          <li><strong>Python:</strong> Microservices for integrations (e.g., Jira).</li>
        </ul>
      </section>

      <section>
        <h2>Workspace Structure</h2>
        <ul>
          <li>
            <strong>src/</strong>
            <ul>
              <li><strong>Frontend (React/TypeScript):</strong>
                <ul>
                  <li><code>src/App.tsx</code>: Main entry point.</li>
                  <li><code>components/</code>: Feature pages (e.g., <code>RequirementAnalyserPage.tsx</code>, <code>DefectSummaryReportPage.tsx</code>, <code>IntegratedStory.tsx</code>), infographics, and UI elements.</li>
                  <li><code>backend/</code> and <code>backend_py/</code>: Backend logic and Python integrations.</li>
                </ul>
              </li>
              <li><strong>Backend:</strong>
                <ul>
                  <li><code>server.ts</code> and <code>server.js</code>: Express API, including endpoints for OpenAI-powered story and criteria generation.</li>
                  <li><code>jira_client.py</code>: Async integration with Jira for story creation.</li>
                </ul>
              </li>
            </ul>
          </li>
          <li><strong>Configuration:</strong>
            <ul>
              <li><code>.env</code>: Secrets and environment variables.</li>
              <li><code>tsconfig.json</code>: TypeScript configuration.</li>
              <li><code>vite.config.ts</code>: Vite configuration.</li>
            </ul>
          </li>
          <li><strong>Testing & Coverage:</strong>
            <ul>
              <li><code>.pytest_cache</code>, <code>coverage</code>: Test results and code coverage.</li>
            </ul>
          </li>
          <li><strong>Scripts:</strong>
            <ul>
              <li><code>run-backend.sh</code> and npm scripts in <code>package.json</code>: Starting servers and building the project.</li>
            </ul>
          </li>
        </ul>
      </section>

      <section>
        <h2>Main Features</h2>
        <ul>
          <li>Requirement analysis and gap/conflict detection.</li>
          <li>User story selection and generation.</li>
          <li>Automated test case generation for multiple frameworks.</li>
          <li>Defect analytics: summary, density, ageing, distribution, and root cause.</li>
          <li>Integration with Jira, Rally, TestRail, and Trello (some features are placeholders).</li>
        </ul>
      </section>

      <section>
        <h2>How It Works</h2>
        <ol>
          <li>Users select a tool (e.g., Jira), fetch stories, and analyze requirements.</li>
          <li>AI generates user stories, acceptance criteria, and test cases.</li>
          <li>Defect data is visualized with rich infographics.</li>
          <li>Reports can be exported (PDF, ZIP).</li>
        </ol>
      </section>

      <section>
        <h2>Getting Started</h2>
        <ol>
          <li>Install dependencies: <code>npm install</code></li>
          <li>Start development server: <code>npm start</code></li>
          <li>Edit source files in <code>src/</code> and see changes live.</li>
        </ol>
      </section>

      <section>
        <h2>Why TypeScript?</h2>
        <p>
          TypeScript helps catch bugs early by enforcing types. For example, if you pass the wrong prop type to a component, you'll get a compile-time error.
        </p>
      </section>

      <section>
        <h2>Further Reading</h2>
        <p>
          For more details, see <code>Documentation.tsx</code> and feature pages in <code>src/components</code>.
        </p>
      </section>
    </div>
    <Footer />
  </>
);

export default Documentation;