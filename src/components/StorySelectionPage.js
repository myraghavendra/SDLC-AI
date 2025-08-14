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
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const StorySelectionPage = ({ selectedTool, onBack, onNext }) => {
    // Removed apiKey state as API token will be read from backend environment
    // const [jiraUrl, setJiraUrl] = useState('');
    // const [projectKey, setProjectKey] = useState('');
    const [stories, setStories] = (0, react_1.useState)([]);
    const [selectedStory, setSelectedStory] = (0, react_1.useState)(null);
    const [framework, setFramework] = (0, react_1.useState)('None');
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)('');
    const [acceptanceCriteria, setAcceptanceCriteria] = (0, react_1.useState)('');
    const [technicalNotes, setTechnicalNotes] = (0, react_1.useState)('');
    const [testCases, setTestCases] = (0, react_1.useState)('');
    const [testCode, setTestCode] = (0, react_1.useState)('');
    const [generating, setGenerating] = (0, react_1.useState)(false);
    const fetchStories = async () => {
        // Removed debug console.log statements
        // console.log("fetchstories")
        setError('');
        setLoading(true);
        try {
            const body = {
                tool: selectedTool,
            };
            if (selectedTool === 'Jira') {
                // Pass Jira URL and Project Key from backend config fetched earlier
                // For now, we can fetch them again or store in state if fetched previously
                // Here, we assume they are fetched and stored in local variables jiraUrl and projectKey
                // Since we removed state, we fetch from backend synchronously here
                const configResponse = await fetch('/api/getJiraConfig');
                // console.log(' fetching Jira config:', configResponse);
                // console.log(' fetching Jira config:', configResponse.ok);
                if (!configResponse.ok) {
                    throw new Error('Failed to fetch Jira config');
                }
                const configData = await configResponse.json();
                if (configData.jira_url) {
                    body.jira_url = configData.jira_url;
                }
                if (configData.project_key) {
                    body.project_key = configData.project_key;
                }
            }
            const response = await fetch('/api/getStories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            // console.log("body",body)
            // console.log(' fetching Jira config:', response);
            // console.log("response.ok",response.ok)
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.detail || 'Failed to fetch stories');
            }
            const data = await response.json();
            // console.log(' fetching Jira data:', data);
            setStories((data.stories || []).map((story) => ({
                key: story.key,
                summary: story.fields?.summary || '',
                description: typeof story.fields?.description === 'string'
                    ? story.fields.description
                    : (story.fields?.description?.content
                        ? story.fields.description.content.map((block) => block.content ? block.content.map((c) => c.text).join('') : '').join('\n')
                        : ''),
            })));
        }
        catch (err) {
            setError(err.message || 'Error fetching stories');
        }
        finally {
            setLoading(false);
        }
    };
    react_1.default.useEffect(() => {
        const fetchConfig = async () => {
            try {
                const response = await fetch('/api/getJiraConfig');
                if (!response.ok) {
                    throw new Error('Failed to fetch Jira config');
                }
                const data = await response.json();
                // Optionally, you can store jira_url and project_key in state if needed
                // For now, no UI input fields for these, so no state update needed
            }
            catch (error) {
                console.error('Error fetching Jira config:', error);
            }
        };
        fetchConfig();
    }, []);
    const handleStorySelect = (story) => {
        setSelectedStory(story);
        setAcceptanceCriteria('');
        setTechnicalNotes('');
        setTestCases('');
        setTestCode('');
    };
    react_1.default.useEffect(() => {
        const generateIfReady = async () => {
            if (selectedStory && framework !== 'None') {
                setGenerating(true);
                setError('');
                setAcceptanceCriteria('');
                setTechnicalNotes('');
                setTestCases('');
                setTestCode('');
                try {
                    const body = {
                        description: selectedStory.summary,
                        context: selectedStory.description || selectedStory.summary,
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
                    setTestCases(data.testCases || '');
                    setTestCode(data.testCode || '');
                }
                catch (err) {
                    setError(err.message || 'Error generating test cases');
                }
                finally {
                    setGenerating(false);
                }
            }
        };
        generateIfReady();
    }, [selectedStory, framework]);
    return ((0, jsx_runtime_1.jsxs)("div", { style: { maxWidth: 700, margin: '0 auto', padding: 20 }, children: [(0, jsx_runtime_1.jsx)("h2", { children: "Select User Stories" }), (0, jsx_runtime_1.jsx)("button", { onClick: fetchStories, disabled: loading, style: { padding: '8px 16px', marginBottom: 20 }, children: loading ? 'Fetching...' : 'Fetch Top 5 Stories' }), error && (0, jsx_runtime_1.jsx)("p", { style: { color: 'red' }, children: error }), stories.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { children: "Top 5 User Stories" }), (0, jsx_runtime_1.jsxs)("ul", { style: { listStyle: 'none', paddingLeft: 0 }, children: [stories.slice(0, 5).map((story, idx) => ((0, jsx_runtime_1.jsx)("li", { style: { marginBottom: 8 }, children: (0, jsx_runtime_1.jsxs)("label", { children: [(0, jsx_runtime_1.jsx)("input", { type: "radio", name: "story", checked: selectedStory?.key === story.key, onChange: () => handleStorySelect(story) }), ' ', (0, jsx_runtime_1.jsxs)("strong", { children: [idx + 1, "."] }), " ", (0, jsx_runtime_1.jsx)("strong", { children: story.key }), ": ", story.summary] }) }, story.key))), (0, jsx_runtime_1.jsx)("li", { style: { marginBottom: 8 }, children: (0, jsx_runtime_1.jsxs)("label", { children: [(0, jsx_runtime_1.jsx)("input", { type: "radio", name: "story", checked: !!(selectedStory && !stories.slice(0, 5).some(s => s.key === selectedStory.key)), onChange: () => setSelectedStory({ key: '', summary: '' }) }), ' ', (0, jsx_runtime_1.jsx)("strong", { children: "Other:" }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Enter story key", value: selectedStory && !stories.slice(0, 5).some(s => s.key === selectedStory.key) ? selectedStory.key : '', onChange: e => setSelectedStory({ key: e.target.value, summary: '' }), style: { marginLeft: 8, width: 140 }, disabled: stories.length === 0 || !(selectedStory && !stories.slice(0, 5).some(s => s.key === selectedStory.key)) })] }) })] })] })), generating && (0, jsx_runtime_1.jsx)("p", { children: "Generating test cases..." }), error && (0, jsx_runtime_1.jsx)("p", { style: { color: 'red' }, children: error }), acceptanceCriteria && ((0, jsx_runtime_1.jsxs)("div", { style: { marginTop: 20 }, children: [(0, jsx_runtime_1.jsx)("h3", { children: "Acceptance Criteria (Gherkin):" }), (0, jsx_runtime_1.jsx)("pre", { style: { background: '#f4f4f4', padding: 10 }, children: acceptanceCriteria })] })), technicalNotes && ((0, jsx_runtime_1.jsxs)("div", { style: { marginTop: 20 }, children: [(0, jsx_runtime_1.jsx)("h3", { children: "Technical Notes:" }), (0, jsx_runtime_1.jsx)("pre", { style: { background: '#f4f4f4', padding: 10 }, children: technicalNotes })] })), testCases && ((0, jsx_runtime_1.jsxs)("div", { style: { marginTop: 20 }, children: [(0, jsx_runtime_1.jsx)("h3", { children: "Test Cases:" }), (0, jsx_runtime_1.jsx)("pre", { style: { background: '#f4f4f4', padding: 10 }, children: testCases })] })), (0, jsx_runtime_1.jsxs)("div", { style: { marginTop: 20 }, children: [(0, jsx_runtime_1.jsx)("button", { onClick: onBack, style: { marginRight: 12, padding: '8px 16px' }, children: "Back" }), (0, jsx_runtime_1.jsx)("button", { style: { padding: '8px 16px' }, disabled: !selectedStory ||
                            (selectedStory &&
                                (!selectedStory.key ||
                                    (!stories.slice(0, 5).some(s => s.key === selectedStory.key) && selectedStory.key.trim() === ''))), onClick: () => {
                            if (selectedStory) {
                                // If selectedStory is from top 5, pass as is
                                // If "Other", try to find in all stories, else pass as custom
                                const found = stories.find(s => s.key === selectedStory.key);
                                if (found) {
                                    onNext([found], '', undefined, undefined);
                                }
                                else if (selectedStory.key) {
                                    onNext([{ key: selectedStory.key, summary: '' }], '', undefined, undefined);
                                }
                            }
                        }, children: "Next" })] })] }));
};
exports.default = StorySelectionPage;
