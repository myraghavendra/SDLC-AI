import React from 'react';
import { FaBook, FaCode, FaChartBar, FaCodeBranch } from 'react-icons/fa';
import './FeaturesGrid.css';
import Header from './Header';
import Footer from './Footer';

const features = [
  {
    icon: <FaBook color="#2a64d6" size={48} />,
    title: "User Story Generator",
    description: (
      <>
        <p>Generate comprehensive user stories for your project in seconds.</p>
        <p>Take the guesswork out of requirements gathering. Our AI-powered User Story Generator helps you instantly create detailed, agile-friendly user stories tailored to your project. Whether you're building a new feature or refining your backlog, generate well-structured stories with acceptance criteria that align with your development goals.</p>
        <h4>Key Features:</h4>
        <ul>
          <li>📌 Auto-generates user stories based on project context</li>
          <li>✅ Includes acceptance criteria and edge cases</li>
          <li>🔁 Supports Agile, Scrum, and Kanban workflows</li>
          <li>🧠 Learns from your project’s domain for better relevance</li>
          <li>📄 Export to Jira, Trello, or other tools</li>
        </ul>
      </>
    ),
  },
  {
    icon: <FaCode color="#3a9d23" size={48} />,
    title: "Integrated Test Designer",
    description: (
      <>
        <p>Design and manage your test cases efficiently — all in one place.</p>
        <p>Simplify your testing process with a powerful, built-in test design tool. The Integrated Test Designer lets you create, organize, and maintain high-quality test cases directly from your project requirements. Collaborate with your team, ensure traceability, and keep your QA process agile and aligned.</p>
        <h4>Key Features:</h4>
        <ul>
          <li>✍️ Intuitive interface for writing and editing test cases</li>
          <li>🔗 Link tests to user stories, epics, or requirements</li>
          <li>🧩 Reuse test steps across multiple scenarios</li>
          <li>📊 Track coverage and test execution status</li>
          <li>🛠️ Seamless integration with Jira, TestRail, Xray &amp; more</li>
        </ul>
      </>
    ),
  },
  {
    icon: <FaChartBar color="#f5a623" size={48} />,
    title: "Requirement Analyser",
    description: (
      <>
        <p>Analyze and validate project requirements with precision.</p>
        <p>Turn vague requirements into clear, actionable insights. The Requirement Analyser helps you identify gaps, ambiguities, and inconsistencies in your project specs — ensuring your team builds exactly what’s needed. Save time, reduce rework, and improve project alignment from the start.</p>
        <h4>Key Features:</h4>
        <ul>
          <li>🔍 Automatic analysis of requirement clarity and completeness</li>
          <li>⚠️ Flags missing, conflicting, or ambiguous details</li>
          <li>💡 Suggests improvements and refinements</li>
          <li>🔗 Links requirements to user stories and test cases</li>
          <li>✅ Supports compliance and traceability</li>
        </ul>
      </>
    ),
  },
  {
    icon: <FaCodeBranch color="#7a2ea0" size={48} />,
    title: "Data Analyst Agent",
    description: (
      <>
        <p>Analyze and visualize your project data effortlessly.</p>
        <p>Unlock powerful insights from your project data with the AI-powered Data Analyst Agent. From sprint velocity to defect trends, this smart assistant helps you make data-driven decisions through interactive analysis and rich visualizations — no manual crunching required.</p>
        <h4>Key Features:</h4>
        <ul>
          <li>📈 Auto-generates charts, graphs, and dashboards</li>
          <li>🧠 Analyzes trends, patterns, and KPIs instantly</li>
          <li>💬 Accepts natural language queries for fast insights</li>
          <li>🔄 Integrates with Jira, TestRail, and CI/CD tools</li>
          <li>📤 Export reports to PDF, Excel, or shared dashboards</li>
        </ul>
      </>
    ),
  },
];

const FeaturesPage: React.FC = () => {
  return (
    <>
      <Header />
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        width: '100%',
        padding: '2rem'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>All Features</h2>
        <section className="features-grid" style={{ 
          width: '100%',
          padding: '1rem',
          boxSizing: 'border-box',
        }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '2rem',
            width: '100%',
          }}>
            {features.map((feature, index) => (
              <div key={index} className="feature-card" style={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                backgroundColor: '#ffffff',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                padding: '1rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                width: '280px',
                height: 'auto',
                flexShrink: 0,
                margin: '0',
              }}>
                <div className="icon" style={{ marginBottom: '0.5rem', alignSelf: 'center' }}>{feature.icon}</div>
                <h3 className="title" style={{ 
                  marginBottom: '0.5rem',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  color: '#333'
                }}>{feature.title}</h3>
                <div className="description" style={{}}>
                  {feature.description}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

export default FeaturesPage;
