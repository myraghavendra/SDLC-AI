"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fa_1 = require("react-icons/fa");
require("./FeaturesGrid.css");
const Header_1 = __importDefault(require("./Header"));
const Footer_1 = __importDefault(require("./Footer"));
const features = [
    {
        icon: (0, jsx_runtime_1.jsx)(fa_1.FaBook, { color: "#2a64d6", size: 48 }),
        title: "User Story Generator",
        description: ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("p", { children: "Generate comprehensive user stories for your project in seconds." }), (0, jsx_runtime_1.jsx)("p", { children: "Take the guesswork out of requirements gathering. Our AI-powered User Story Generator helps you instantly create detailed, agile-friendly user stories tailored to your project. Whether you're building a new feature or refining your backlog, generate well-structured stories with acceptance criteria that align with your development goals." }), (0, jsx_runtime_1.jsx)("h4", { children: "Key Features:" }), (0, jsx_runtime_1.jsxs)("ul", { children: [(0, jsx_runtime_1.jsx)("li", { children: "\uD83D\uDCCC Auto-generates user stories based on project context" }), (0, jsx_runtime_1.jsx)("li", { children: "\u2705 Includes acceptance criteria and edge cases" }), (0, jsx_runtime_1.jsx)("li", { children: "\uD83D\uDD01 Supports Agile, Scrum, and Kanban workflows" }), (0, jsx_runtime_1.jsx)("li", { children: "\uD83E\uDDE0 Learns from your project\u2019s domain for better relevance" }), (0, jsx_runtime_1.jsx)("li", { children: "\uD83D\uDCC4 Export to Jira, Trello, or other tools" })] })] })),
    },
    {
        icon: (0, jsx_runtime_1.jsx)(fa_1.FaCode, { color: "#3a9d23", size: 48 }),
        title: "Integrated Test Designer",
        description: ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("p", { children: "Design and manage your test cases efficiently \u2014 all in one place." }), (0, jsx_runtime_1.jsx)("p", { children: "Simplify your testing process with a powerful, built-in test design tool. The Integrated Test Designer lets you create, organize, and maintain high-quality test cases directly from your project requirements. Collaborate with your team, ensure traceability, and keep your QA process agile and aligned." }), (0, jsx_runtime_1.jsx)("h4", { children: "Key Features:" }), (0, jsx_runtime_1.jsxs)("ul", { children: [(0, jsx_runtime_1.jsx)("li", { children: "\u270D\uFE0F Intuitive interface for writing and editing test cases" }), (0, jsx_runtime_1.jsx)("li", { children: "\uD83D\uDD17 Link tests to user stories, epics, or requirements" }), (0, jsx_runtime_1.jsx)("li", { children: "\uD83E\uDDE9 Reuse test steps across multiple scenarios" }), (0, jsx_runtime_1.jsx)("li", { children: "\uD83D\uDCCA Track coverage and test execution status" }), (0, jsx_runtime_1.jsx)("li", { children: "\uD83D\uDEE0\uFE0F Seamless integration with Jira, TestRail, Xray & more" })] })] })),
    },
    {
        icon: (0, jsx_runtime_1.jsx)(fa_1.FaChartBar, { color: "#f5a623", size: 48 }),
        title: "Requirement Analyser",
        description: ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("p", { children: "Analyze and validate project requirements with precision." }), (0, jsx_runtime_1.jsx)("p", { children: "Turn vague requirements into clear, actionable insights. The Requirement Analyser helps you identify gaps, ambiguities, and inconsistencies in your project specs \u2014 ensuring your team builds exactly what\u2019s needed. Save time, reduce rework, and improve project alignment from the start." }), (0, jsx_runtime_1.jsx)("h4", { children: "Key Features:" }), (0, jsx_runtime_1.jsxs)("ul", { children: [(0, jsx_runtime_1.jsx)("li", { children: "\uD83D\uDD0D Automatic analysis of requirement clarity and completeness" }), (0, jsx_runtime_1.jsx)("li", { children: "\u26A0\uFE0F Flags missing, conflicting, or ambiguous details" }), (0, jsx_runtime_1.jsx)("li", { children: "\uD83D\uDCA1 Suggests improvements and refinements" }), (0, jsx_runtime_1.jsx)("li", { children: "\uD83D\uDD17 Links requirements to user stories and test cases" }), (0, jsx_runtime_1.jsx)("li", { children: "\u2705 Supports compliance and traceability" })] })] })),
    },
    {
        icon: (0, jsx_runtime_1.jsx)(fa_1.FaCodeBranch, { color: "#7a2ea0", size: 48 }),
        title: "Data Analyst Agent",
        description: ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("p", { children: "Analyze and visualize your project data effortlessly." }), (0, jsx_runtime_1.jsx)("p", { children: "Unlock powerful insights from your project data with the AI-powered Data Analyst Agent. From sprint velocity to defect trends, this smart assistant helps you make data-driven decisions through interactive analysis and rich visualizations \u2014 no manual crunching required." }), (0, jsx_runtime_1.jsx)("h4", { children: "Key Features:" }), (0, jsx_runtime_1.jsxs)("ul", { children: [(0, jsx_runtime_1.jsx)("li", { children: "\uD83D\uDCC8 Auto-generates charts, graphs, and dashboards" }), (0, jsx_runtime_1.jsx)("li", { children: "\uD83E\uDDE0 Analyzes trends, patterns, and KPIs instantly" }), (0, jsx_runtime_1.jsx)("li", { children: "\uD83D\uDCAC Accepts natural language queries for fast insights" }), (0, jsx_runtime_1.jsx)("li", { children: "\uD83D\uDD04 Integrates with Jira, TestRail, and CI/CD tools" }), (0, jsx_runtime_1.jsx)("li", { children: "\uD83D\uDCE4 Export reports to PDF, Excel, or shared dashboards" })] })] })),
    },
];
const FeaturesPage = () => {
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Header_1.default, {}), (0, jsx_runtime_1.jsxs)("div", { style: {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    padding: '2rem'
                }, children: [(0, jsx_runtime_1.jsx)("h2", { style: { textAlign: 'center', marginBottom: '2rem' }, children: "All Features" }), (0, jsx_runtime_1.jsx)("section", { className: "features-grid", style: {
                            width: '100%',
                            padding: '1rem',
                            boxSizing: 'border-box',
                        }, children: (0, jsx_runtime_1.jsx)("div", { style: {
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'center',
                                gap: '2rem',
                                width: '100%',
                            }, children: features.map((feature, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "feature-card", style: {
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
                                }, children: [(0, jsx_runtime_1.jsx)("div", { className: "icon", style: { marginBottom: '0.5rem', alignSelf: 'center' }, children: feature.icon }), (0, jsx_runtime_1.jsx)("h3", { className: "title", style: {
                                            marginBottom: '0.5rem',
                                            fontSize: '1.1rem',
                                            fontWeight: 'bold',
                                            color: '#333'
                                        }, children: feature.title }), (0, jsx_runtime_1.jsx)("div", { className: "description", style: {}, children: feature.description })] }, index))) }) })] }), (0, jsx_runtime_1.jsx)(Footer_1.default, {})] }));
};
exports.default = FeaturesPage;
