"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
// @ts-ignore
const jszip_1 = __importDefault(require("jszip"));
const TestCaseGenerationPage = ({ selectedTool, selectedStories, apiKey, jiraUrl, projectKey, onBack, }) => {
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)('');
    const [framework, setFramework] = (0, react_1.useState)('None');
    const [acceptanceCriteria, setAcceptanceCriteria] = (0, react_1.useState)('');
    const [technicalNotes, setTechnicalNotes] = (0, react_1.useState)('');
    const [testCode, setTestCode] = (0, react_1.useState)('');
    const generateTestCases = async () => {
        setError('');
        setAcceptanceCriteria('');
        setTechnicalNotes('');
        setTestCode('');
        setLoading(true);
        try {
            const story = selectedStories[0];
            const body = {
                description: story.summary,
                context: story.description,
                framework: framework,
            };
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.detail || 'Failed to generate test cases');
            }
            const data = await response.json();
            setAcceptanceCriteria(data.acceptanceCriteria || '');
            setTechnicalNotes(data.technicalNotes || '');
            setTestCode(data.testCode || '');
        }
        catch (err) {
            setError(err.message || 'Error generating test cases');
        }
        finally {
            setLoading(false);
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { style: { maxWidth: 700, margin: '0 auto', padding: 20 }, children: [(0, jsx_runtime_1.jsx)("h2", { children: "Generate Automation Test Cases" }), (0, jsx_runtime_1.jsxs)("p", { children: ["Selected Tool: ", selectedTool] }), (0, jsx_runtime_1.jsxs)("p", { children: ["Selected Story: ", selectedStories.map((s) => s.key).join(', ')] }), (0, jsx_runtime_1.jsxs)("div", { style: { marginBottom: 16 }, children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "framework-select", style: { marginRight: 8 }, children: "Automation Framework:" }), (0, jsx_runtime_1.jsxs)("select", { id: "framework-select", value: framework, onChange: e => setFramework(e.target.value), style: { padding: '4px 8px', background: '#f4f4f4' }, children: [(0, jsx_runtime_1.jsx)("option", { value: "None", children: "None" }), (0, jsx_runtime_1.jsx)("option", { value: "Cypress", children: "Cypress" }), (0, jsx_runtime_1.jsx)("option", { value: "Selenium", children: "Selenium" }), (0, jsx_runtime_1.jsx)("option", { value: "Playwright", children: "Playwright" })] })] }), (0, jsx_runtime_1.jsx)("button", { onClick: generateTestCases, disabled: loading, style: { padding: '8px 16px', marginBottom: 20 }, children: loading ? 'Generating...' : 'Generate Automation Test Case' }), error && (0, jsx_runtime_1.jsx)("p", { style: { color: 'red' }, children: error }), testCode && ((0, jsx_runtime_1.jsxs)("div", { style: { marginTop: 20 }, children: [(0, jsx_runtime_1.jsxs)("h3", { children: ["Automation Test Code (", framework, "):"] }), (0, jsx_runtime_1.jsx)("pre", { style: { background: '#f4f4f4', padding: 10 }, children: testCode.split('\n').filter(line => !line.trim().startsWith('```')).join('\n') }), (0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', gap: 16, marginTop: 16 }, children: [(0, jsx_runtime_1.jsx)("button", { style: { padding: '8px 16px' }, onClick: async () => {
                                    if (!testCode)
                                        return;
                                    const zip = new jszip_1.default();
                                    let ext = 'txt';
                                    if (framework.toLowerCase() === 'cypress')
                                        ext = 'js';
                                    else if (framework.toLowerCase() === 'selenium')
                                        ext = 'java';
                                    else if (framework.toLowerCase() === 'playwright')
                                        ext = 'ts';
                                    const fileName = `testcase.${ext}`;
                                    const code = testCode.split('\n').filter(line => !line.trim().startsWith('```')).join('\n');
                                    zip.file(fileName, code);
                                    const blob = await zip.generateAsync({ type: 'blob' });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = 'automation-test.zip';
                                    document.body.appendChild(a);
                                    a.click();
                                    setTimeout(() => {
                                        document.body.removeChild(a);
                                        URL.revokeObjectURL(url);
                                    }, 100);
                                }, children: "Download Zip" }), (0, jsx_runtime_1.jsx)("button", { onClick: onBack, style: { padding: '8px 16px' }, children: "Back" })] })] }))] }));
};
exports.default = TestCaseGenerationPage;
