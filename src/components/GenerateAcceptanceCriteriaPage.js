"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const Header_1 = __importDefault(require("./Header"));
const Footer_1 = __importDefault(require("./Footer"));
//import {checkJiraAuthentication} from '../backend/jiraClient';
const GenerateAcceptanceCriteriaPage = () => {
    // For displaying acceptance criteria and technical notes
    const [acceptanceCriteria, setAcceptanceCriteria] = (0, react_1.useState)('');
    const [technicalNotes, setTechnicalNotes] = (0, react_1.useState)('');
    const [copied, setCopied] = (0, react_1.useState)(false);
    // Step state: 1 = Prompt, 2 = Generate Story, 3 = Upload to Tool
    const [step, setStep] = (0, react_1.useState)(1);
    // Step 1: Description and Context input
    const [description, setDescription] = (0, react_1.useState)('');
    const [context, setContext] = (0, react_1.useState)('');
    // Step 2: Generated story and tool selection
    const [generatedStory, setGeneratedStory] = (0, react_1.useState)('');
    const [selectedTool, setSelectedTool] = (0, react_1.useState)('');
    // Step 3: Upload submission state
    const [uploadStatus, setUploadStatus] = (0, react_1.useState)('');
    const [uploadLogs, setUploadLogs] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)('');
    // Handle generate story from prompt (Step 1 -> Step 2)
    const handleGenerate = async () => {
        setError('');
        if (!description.trim()) {
            setError('Description is required.');
            return;
        }
        setLoading(true);
        setGeneratedStory('');
        try {
            // If context is empty or whitespace, send a single space
            const contextToSend = context.trim() === '' ? ' ' : context;
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ description, context: contextToSend }),
            });
            /*   // Debugging logs
              // Uncomment these lines to see the request and response details in console
              console.log('Sending request to /api/generate with body:', { description, context: contextToSend });
              console.log('Request headers:', { 'Content-Type': 'application/json' });
              console.log('Request body:', JSON.stringify({ description, context: contextToSend }));
               console.log('Received response from /api/generate:', response);
              console.log('Request body:', { description, context: contextToSend });
        
              // Check if response is ok (status 200-299)
              // If not, throw an error with the response message
              console.log('Received response from /api/generate:', response);
        
              if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Failed to generate');
              } */
            const data = await response.json();
            // Use acceptanceCriteria and technicalNotes directly from API response
            setGeneratedStory(description); // or set to empty string if preferred
            setAcceptanceCriteria(data.acceptanceCriteria || '');
            setTechnicalNotes(data.technicalNotes || '');
            setStep(2);
        }
        catch (err) {
            setError(err.message || 'Error occurred');
        }
        finally {
            setLoading(false);
        }
    };
    // Handle submit selected tool and move to upload step (Step 2 -> Step 3)
    const handleSubmitTool = () => {
        setError('');
        if (!selectedTool) {
            setError('Please select a target tool.');
            return;
        }
        setStep(3);
    };
    // Handle upload to tool submission (Step 3)
    const handleUpload = async () => {
        setError('');
        setLoading(true);
        setUploadStatus('');
        try {
            if (selectedTool === 'Jira') {
                // Clean acceptanceCriteria by removing leading ```gherkin and trailing ```
                let cleanedAcceptanceCriteria = acceptanceCriteria.trim();
                if (cleanedAcceptanceCriteria.toLowerCase().startsWith('```gherkin')) {
                    cleanedAcceptanceCriteria = cleanedAcceptanceCriteria.substring(10).trim();
                }
                if (cleanedAcceptanceCriteria.endsWith('```')) {
                    cleanedAcceptanceCriteria = cleanedAcceptanceCriteria.substring(0, cleanedAcceptanceCriteria.length - 3).trim();
                }
                // Call backend to create Jira story
                const response = await fetch('/api/upload-jira', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        summary: description,
                        description: `${generatedStory}\n\nAcceptance Criteria:\n${cleanedAcceptanceCriteria}\n\nTechnical Notes:\n${technicalNotes}`,
                    }),
                });
                // Removed debug console.log statements
                // console.log('Received response from /api/upload-jira:', response);
                // console.log('Request body:', {
                //   summary: description,
                //   description: `${generatedStory}\n\nAcceptance Criteria:\n${cleanedAcceptanceCriteria}\n\nTechnical Notes:\n${technicalNotes}`,
                // });
                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.error || 'Failed to upload to Jira');
                }
                const data = await response.json();
                setUploadStatus(`Successfully uploaded to Jira. Ticket: ${data.ticketKey}`);
                setUploadLogs(data.logs || []);
            }
            else {
                // Simulate upload for other tools
                await new Promise((resolve) => setTimeout(resolve, 1500));
                setUploadStatus(`Successfully uploaded to ${selectedTool}`);
            }
        }
        catch (err) {
            setError(err.message || 'Upload failed');
        }
        finally {
            setLoading(false);
        }
    };
    // Progress bar component
    const ProgressBar = () => {
        const steps = ['Prompt', 'Generate Story', 'Upload to Tool'];
        return ((0, jsx_runtime_1.jsx)("div", { style: { marginBottom: 32, padding: '0 12px' }, children: (0, jsx_runtime_1.jsx)("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }, children: steps.map((label, index) => {
                    const stepIndex = index + 1;
                    const isActive = step === stepIndex;
                    // Mark all steps as completed if uploadStatus indicates successful upload to Jira
                    let isCompleted = step > stepIndex;
                    if (uploadStatus && selectedTool === 'Jira' && uploadStatus.includes('Successfully uploaded to Jira')) {
                        isCompleted = true;
                    }
                    let backgroundColor = '#ccc';
                    if (isActive) {
                        backgroundColor = '#007bff';
                    }
                    else if (isCompleted) {
                        backgroundColor = '#28a745';
                    }
                    // Label color green if completed or active
                    const labelColor = (isCompleted || isActive) ? '#28a745' : '#222';
                    // Set fontWeight to bold for all labels if upload successful
                    const labelFontWeight = (uploadStatus && selectedTool === 'Jira' && uploadStatus.includes('Successfully uploaded to Jira')) ? 'bold' : (isActive ? 'bold' : 'normal');
                    return ((0, jsx_runtime_1.jsxs)(react_1.default.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }, children: [(0, jsx_runtime_1.jsx)("div", { style: {
                                            height: 24,
                                            width: 24,
                                            marginBottom: 8,
                                            borderRadius: '50%',
                                            backgroundColor,
                                            color: 'white',
                                            lineHeight: '24px',
                                            fontWeight: 'bold',
                                            textAlign: 'center',
                                        }, children: stepIndex }), (0, jsx_runtime_1.jsx)("div", { style: { fontWeight: labelFontWeight, color: labelColor }, children: label })] }), index < steps.length - 1 && ((0, jsx_runtime_1.jsx)("div", { style: {
                                    height: 4,
                                    width: 40,
                                    background: (step > stepIndex || (stepIndex === 2 && (step > 2 || uploadStatus))) ? '#28a745' : '#ccc',
                                    margin: '0 4px 16px 4px',
                                    borderRadius: 2,
                                    transition: 'background 0.3s',
                                } }))] }, label));
                }) }) }));
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Header_1.default, {}), (0, jsx_runtime_1.jsxs)("div", { style: { maxWidth: 800, margin: '0 auto', padding: 20 }, children: [(0, jsx_runtime_1.jsx)("h2", { children: "Acceptance Criteria Workflow" }), (0, jsx_runtime_1.jsx)(ProgressBar, {}), step === 1 && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "description", style: { display: 'block', fontWeight: 'bold', marginBottom: 8 }, children: "Description" }), (0, jsx_runtime_1.jsx)("textarea", { id: "description", value: description, onChange: (e) => setDescription(e.target.value), rows: 3, style: { width: '100%', marginBottom: 12 }, required: true, placeholder: "Enter the story description" }), (0, jsx_runtime_1.jsxs)("label", { htmlFor: "context", style: { display: 'block', fontWeight: 'bold', marginBottom: 8 }, children: ["Context ", (0, jsx_runtime_1.jsx)("span", { style: { color: '#888', fontWeight: 'normal' }, children: "(optional)" })] }), (0, jsx_runtime_1.jsx)("textarea", { id: "context", value: context, onChange: (e) => setContext(e.target.value), rows: 3, style: { width: '100%', marginBottom: 12 }, placeholder: "Enter the context (optional)" }), (0, jsx_runtime_1.jsx)("button", { onClick: handleGenerate, disabled: loading, style: { padding: '8px 16px' }, children: loading ? 'Generating...' : 'Generate' }), error && (0, jsx_runtime_1.jsx)("p", { style: { color: 'red' }, children: error })] })), step === 2 && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { children: "Generated User Story" }), generatedStory && ((0, jsx_runtime_1.jsx)("pre", { style: { backgroundColor: '#f0f0f0', padding: 12, whiteSpace: 'pre-wrap' }, children: generatedStory })), acceptanceCriteria && ((0, jsx_runtime_1.jsxs)("div", { style: { marginTop: 20 }, children: [(0, jsx_runtime_1.jsx)("h4", { children: "Acceptance Criteria" }), acceptanceCriteria.split(/\n|\r/).map((line, idx) => {
                                        // Remove lines that start with '```gherkin' (case-insensitive) and '```'
                                        if (/^```gherkin/i.test(line.trim()) || line.trim() === '```') {
                                            return null;
                                        }
                                        if (/^Given:/i.test(line)) {
                                            return (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Given:" }), " ", line.replace(/^Given:/i, '').trim()] }, idx);
                                        }
                                        if (/^When:/i.test(line)) {
                                            return (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "When:" }), " ", line.replace(/^When:/i, '').trim()] }, idx);
                                        }
                                        if (/^Then:/i.test(line)) {
                                            return (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Then:" }), " ", line.replace(/^Then:/i, '').trim()] }, idx);
                                        }
                                        if (/^Technical Notes:/i.test(line)) {
                                            // handled below
                                            return null;
                                        }
                                        return line.trim() ? (0, jsx_runtime_1.jsx)("div", { children: line }, idx) : null;
                                    }), (0, jsx_runtime_1.jsx)("button", { onClick: () => {
                                            navigator.clipboard.writeText(acceptanceCriteria);
                                            setCopied(true);
                                            setTimeout(() => setCopied(false), 1200);
                                        }, style: { marginTop: 8, marginBottom: 8 }, children: copied ? 'Copied!' : 'Copy Acceptance Criteria' })] })), technicalNotes && ((0, jsx_runtime_1.jsxs)("div", { style: { marginTop: 20 }, children: [(0, jsx_runtime_1.jsx)("h4", { children: "Technical Notes" }), (0, jsx_runtime_1.jsx)("div", { style: { backgroundColor: '#f4f4f4', padding: 10, whiteSpace: 'pre-wrap' }, children: technicalNotes.split(/\n|\r/).filter(line => line.trim()).map((note, idx) => ((0, jsx_runtime_1.jsx)("div", { children: note }, idx))) }), (0, jsx_runtime_1.jsx)("button", { onClick: () => {
                                            navigator.clipboard.writeText(technicalNotes);
                                            setCopied(true);
                                            setTimeout(() => setCopied(false), 1200);
                                        }, style: { marginTop: 8, marginBottom: 8 }, children: copied ? 'Copied!' : 'Copy Technical Notes' })] })), (0, jsx_runtime_1.jsxs)("div", { style: { marginTop: 20 }, children: [(0, jsx_runtime_1.jsx)("div", { style: { fontWeight: 'bold', marginBottom: 8 }, children: "Select Target Tool" }), (0, jsx_runtime_1.jsxs)("label", { style: { marginRight: 12 }, children: [(0, jsx_runtime_1.jsx)("input", { type: "radio", name: "tool", value: "Jira", checked: selectedTool === 'Jira', onChange: () => setSelectedTool('Jira') }), ' ', "Jira"] }), (0, jsx_runtime_1.jsxs)("label", { style: { marginRight: 12 }, children: [(0, jsx_runtime_1.jsx)("input", { type: "radio", name: "tool", value: "Rally", checked: selectedTool === 'Rally', onChange: () => setSelectedTool('Rally') }), ' ', "Rally"] }), (0, jsx_runtime_1.jsxs)("label", { children: [(0, jsx_runtime_1.jsx)("input", { type: "radio", name: "tool", value: "TestRail", checked: selectedTool === 'TestRail', onChange: () => setSelectedTool('TestRail') }), ' ', "TestRail"] })] }), (0, jsx_runtime_1.jsx)("button", { onClick: handleSubmitTool, disabled: loading, style: { marginTop: 16, padding: '8px 16px' }, children: "Submit" }), error && (0, jsx_runtime_1.jsx)("p", { style: { color: 'red' }, children: error })] })), step === 3 && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { children: "Upload to Tool" }), (0, jsx_runtime_1.jsxs)("p", { children: ["Selected Tool: ", (0, jsx_runtime_1.jsx)("span", { children: selectedTool })] }), (0, jsx_runtime_1.jsx)("button", { onClick: handleUpload, disabled: loading, style: { padding: '8px 16px' }, children: loading ? 'Uploading...' : 'Upload' }), uploadStatus && (0, jsx_runtime_1.jsx)("p", { style: { color: 'green' }, children: uploadStatus }), uploadLogs.length > 0 && ((0, jsx_runtime_1.jsx)("div", { style: { backgroundColor: '#f9f9f9', border: '1px solid #ddd', padding: 10, marginTop: 10, maxHeight: 200, overflowY: 'auto', whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: 12 }, children: uploadLogs.map((log, idx) => ((0, jsx_runtime_1.jsx)("div", { children: log }, idx))) })), error && (0, jsx_runtime_1.jsx)("p", { style: { color: 'red' }, children: error })] }))] }), (0, jsx_runtime_1.jsx)(Footer_1.default, {})] }));
};
exports.default = GenerateAcceptanceCriteriaPage;
