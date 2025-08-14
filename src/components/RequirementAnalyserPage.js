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
const react_router_dom_1 = require("react-router-dom");
const Header_1 = __importDefault(require("./Header"));
const Footer_1 = __importDefault(require("./Footer"));
const RequirementAnalyserPage = () => {
    // Removed debug console.log statement
    // console.log("requirement analyser page");
    const [integrationOptions, setIntegrationOptions] = (0, react_1.useState)([]);
    const [selectedIntegration, setSelectedIntegration] = (0, react_1.useState)('');
    const [jiraStories, setJiraStories] = (0, react_1.useState)([]);
    const [jiraStoriesResponse, setJiraStoriesResponse] = (0, react_1.useState)(null);
    const [manualStoryKey, setManualStoryKey] = (0, react_1.useState)('');
    const [selectedStoryKey, setSelectedStoryKey] = (0, react_1.useState)('');
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)('');
    const [step, setStep] = (0, react_1.useState)(1);
    const [jiraAuthLoading, setJiraAuthLoading] = (0, react_1.useState)(false);
    const [analysisResult, setAnalysisResult] = (0, react_1.useState)(null);
    // State for expand/collapse sections
    const [expandedSections, setExpandedSections] = (0, react_1.useState)({
        storyScore: true,
        requirementClassification: true,
        gapConflictAnalysis: false,
        complianceSecurity: false,
        visualization: false,
        changeImpactAnalysis: false,
    });
    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section],
        }));
    };
    const [analysisLoading, setAnalysisLoading] = (0, react_1.useState)(false);
    const [analysisError, setAnalysisError] = (0, react_1.useState)('');
    const [jiraUrl, setJiraUrl] = (0, react_1.useState)('');
    const [projectKey, setProjectKey] = (0, react_1.useState)('');
    const navigate = (0, react_router_dom_1.useNavigate)();
    (0, react_1.useEffect)(() => {
        setIntegrationOptions(["Jira", "Rally", "TestRail"]);
        setLoading(false);
    }, []);
    const handleIntegrationChange = (e) => {
        setSelectedIntegration(e.target.value);
        setJiraStories([]);
        setError("");
        setSelectedStoryKey('');
        setManualStoryKey('');
        setAnalysisResult(null);
        setAnalysisError('');
    };
    const handleNextStep = async () => {
        if (!selectedIntegration)
            return;
        setStep(2);
        if (selectedIntegration === 'Jira') {
            setJiraAuthLoading(true);
            try {
                const res = await fetch('/api/getJiraConfig');
                if (!res.ok)
                    throw new Error('Jira authentication failed');
                setJiraAuthLoading(false);
                setStep(3);
                fetchJiraStories();
            }
            catch (err) {
                setError(err.message || 'Jira authentication failed');
                setJiraAuthLoading(false);
            }
        }
        else {
            setStep(3); // For Rally/TestRail, skip auth and go to results
        }
    };
    // Add a function to advance to step 4 after analysis or other final step
    const handleAdvanceToFinalStep = () => {
        setStep(4);
    };
    const fetchJiraStories = async () => {
        console.log("fetchstories");
        setError("");
        try {
            // Fetch Jira config first
            const configRes = await fetch('/api/getJiraConfig');
            if (!configRes.ok)
                throw new Error('Failed to fetch Jira config');
            const config = await configRes.json();
            setJiraUrl(config.jira_url);
            setProjectKey(config.project_key);
            const body = {
                tool: 'jira',
                jira_url: config.jira_url,
                project_key: config.project_key,
            };
            const res = await fetch('/api/getStories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const data = await res.json();
            setJiraStoriesResponse(data); // Store the full response
            if (!res.ok) {
                setError(data.error || 'Failed to fetch stories from backend.');
                setJiraStories([]);
                return;
            }
            if (data.error) {
                setError(data.error);
                setJiraStories([]);
                return;
            }
            setJiraStories((data.stories || []).slice(0, 5));
        }
        catch (err) {
            setError(err.message || 'An unexpected error occurred while fetching stories.');
            setJiraStories([]);
            setJiraStoriesResponse(null);
        }
    };
    const handleStorySelect = (key) => {
        setSelectedStoryKey(key);
        setManualStoryKey('');
        setAnalysisResult(null);
        setAnalysisError('');
    };
    const handleManualKeyChange = (e) => {
        setManualStoryKey(e.target.value);
        setSelectedStoryKey('manual');
        setAnalysisResult(null);
        setAnalysisError('');
    };
    const handleProceed = async () => {
        let storyKey = selectedStoryKey === 'manual' ? manualStoryKey : selectedStoryKey;
        if (!storyKey)
            return;
        setAnalysisLoading(true);
        setAnalysisError('');
        setAnalysisResult(null);
        // Fetch story text for analysis
        let storyText = '';
        try {
            if (selectedIntegration === 'Jira' && jiraStoriesResponse && jiraStoriesResponse.stories) {
                const found = jiraStoriesResponse.stories.find((s) => s.key === storyKey);
                if (found) {
                    if (typeof found.fields?.description === 'string') {
                        storyText = found.fields.description;
                    }
                    else if (found.fields?.description?.content) {
                        storyText = found.fields.description.content
                            .map((block) => block.content ? block.content.map((c) => c.text).join('') : '').join('\n');
                    }
                    else {
                        storyText = found.summary;
                    }
                }
            }
            // Call backend API to analyze requirement
            const res = await fetch('/api/analyzeRequirement', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tool: selectedIntegration.toLowerCase(),
                    story_key: storyKey,
                    story_text: storyText,
                    prompt: "Evaluate the clarity, testability, completeness, and business alignment of this user story. Give a quality score from 0 to 100 and justify it briefly. If the selected story is changed or delayed, predict the downstream impact on modules, interfaces, or test cases. Provide specific recommendations."
                })
            });
            if (!res.ok)
                throw new Error('Analysis failed');
            const data = await res.json();
            console.log("Analysis result received:", data);
            setAnalysisResult(data);
            // Advance to step 4 and show progress bar stage 4
            handleAdvanceToFinalStep();
            // Store storyKey for navigation
            setPendingNavigationStoryKey(storyKey);
        }
        catch (e) {
            setAnalysisError(e.message || 'Error analyzing requirement');
        }
        finally {
            setAnalysisLoading(false);
        }
    };
    // New state to hold storyKey for navigation after step 4
    const [pendingNavigationStoryKey, setPendingNavigationStoryKey] = (0, react_1.useState)(null);
    // Function to navigate to results page from step 4
    const handleNavigateToResults = () => {
        if (!pendingNavigationStoryKey)
            return;
        navigate(`/requirement-analysis/${pendingNavigationStoryKey}`, {
            state: {
                integration: selectedIntegration.toLowerCase(),
                jiraUrl,
                projectKey,
                analysisResult, // pass analysisResult to results page
            },
        });
    };
    // Progress bar rendering
    const renderProgressBar = () => {
        const stages = [
            { label: 'Select Tool' },
            { label: 'Authenticate & Fetch Stories' },
            { label: 'Display Results' },
            { label: 'Final Step' }, // Added 4th stage label
        ];
        return ((0, jsx_runtime_1.jsx)("div", { style: { display: 'flex', alignItems: 'center', marginBottom: 32 }, children: stages.map((stage, idx) => {
                const active = step === idx + 1;
                const completed = step > idx + 1;
                return ((0, jsx_runtime_1.jsxs)(react_1.default.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { style: {
                                width: 36, height: 36, borderRadius: '50%',
                                background: completed ? '#4caf50' : active ? '#2196f3' : '#e0e0e0',
                                color: completed || active ? '#fff' : '#888',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 'bold', fontSize: 18,
                                border: active ? '2px solid #1976d2' : '2px solid #e0e0e0',
                                transition: 'background 0.2s',
                            }, children: idx + 1 }), idx < stages.length - 1 && ((0, jsx_runtime_1.jsx)("div", { style: { flex: 1, height: 4, background: completed ? '#4caf50' : '#e0e0e0' } }))] }, stage.label));
            }) }));
    };
    // Render 4 progress bars for clarity, testability, completeness, business alignment
    const renderQualityProgressBars = () => {
        if (!analysisResult)
            return null;
        // Use combined story_score for all bars as individual scores are not available
        const score = analysisResult.story_score || 0;
        const justification = analysisResult.story_score_justification || '';
        if (score === 0) {
            return ((0, jsx_runtime_1.jsxs)("div", { style: { marginTop: 32 }, children: [(0, jsx_runtime_1.jsx)("h3", { children: "Story Quality Scores" }), (0, jsx_runtime_1.jsx)("p", { children: "No score available yet. Please ensure the backend returns a valid score." })] }));
        }
        const bars = [
            { label: 'Clarity', value: score },
            { label: 'Testability', value: score },
            { label: 'Completeness', value: score },
            { label: 'Business Alignment', value: score },
        ];
        return ((0, jsx_runtime_1.jsxs)("div", { style: { marginTop: 32 }, children: [(0, jsx_runtime_1.jsx)("h3", { children: "Story Quality Scores" }), bars.map(bar => ((0, jsx_runtime_1.jsxs)("div", { style: { marginBottom: 16 }, children: [(0, jsx_runtime_1.jsx)("div", { style: { marginBottom: 4 }, children: bar.label }), (0, jsx_runtime_1.jsx)("div", { style: { width: '100%', background: '#eee', borderRadius: 8, overflow: 'hidden' }, children: (0, jsx_runtime_1.jsx)("div", { style: { width: `${bar.value}%`, background: '#4caf50', height: 20 } }) })] }, bar.label))), (0, jsx_runtime_1.jsxs)("div", { style: { marginTop: 24 }, children: [(0, jsx_runtime_1.jsx)("h4", { children: "Overall Story Score (Clarity & Readiness Index)" }), (0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', alignItems: 'center', gap: 16 }, children: [(0, jsx_runtime_1.jsx)("div", { style: { width: 200, background: '#eee', borderRadius: 8, overflow: 'hidden' }, children: (0, jsx_runtime_1.jsx)("div", { style: { width: `${score}%`, background: '#4caf50', height: 20 } }) }), (0, jsx_runtime_1.jsxs)("span", { style: { fontWeight: 'bold' }, children: [score, "/100"] })] }), (0, jsx_runtime_1.jsx)("div", { style: { marginTop: 8 }, children: justification })] })] }));
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Header_1.default, {}), (0, jsx_runtime_1.jsxs)("div", { style: { maxWidth: 600, margin: '0 auto', padding: 24 }, children: [(0, jsx_runtime_1.jsx)("h2", { children: "Requirement Analyser" }), renderProgressBar(), loading && (0, jsx_runtime_1.jsx)("div", { children: "Loading integration options..." }), error && (0, jsx_runtime_1.jsx)("div", { style: { color: 'red' }, children: error }), step === 1 && !loading && !error && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { children: "Select Integration:" }), integrationOptions.map(opt => ((0, jsx_runtime_1.jsxs)("label", { style: { marginRight: 16 }, children: [(0, jsx_runtime_1.jsx)("input", { type: "radio", name: "integration", value: opt, checked: selectedIntegration === opt, onChange: handleIntegrationChange }), ' ', opt] }, opt))), (0, jsx_runtime_1.jsx)("div", { style: { marginTop: 24 }, children: (0, jsx_runtime_1.jsx)("button", { onClick: handleNextStep, disabled: !selectedIntegration, children: "Next" }) })] })), step === 2 && selectedIntegration === 'Jira' && ((0, jsx_runtime_1.jsxs)("div", { style: { marginTop: 32 }, children: [(0, jsx_runtime_1.jsx)("h4", { children: "Authenticating Jira..." }), jiraAuthLoading && (0, jsx_runtime_1.jsx)("div", { children: "Authenticating with Jira, please wait..." }), error && (0, jsx_runtime_1.jsx)("div", { style: { color: 'red' }, children: error })] })), step === 3 && selectedIntegration === 'Jira' && ((0, jsx_runtime_1.jsxs)("div", { style: { marginTop: 24 }, children: [(0, jsx_runtime_1.jsxs)("div", { style: { marginTop: 24 }, children: [(0, jsx_runtime_1.jsx)("h4", { children: "Select a User Story:" }), jiraStories.length > 0 ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [jiraStories.map(story => ((0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)("label", { children: [(0, jsx_runtime_1.jsx)("input", { type: "radio", name: "story", value: story.key, checked: selectedStoryKey === story.key, onChange: () => handleStorySelect(story.key) }), ' ', story.key, ": ", story.summary] }) }, story.key))), (0, jsx_runtime_1.jsx)("div", { style: { marginTop: 8 }, children: (0, jsx_runtime_1.jsxs)("label", { children: [(0, jsx_runtime_1.jsx)("input", { type: "radio", name: "story", value: "manual", checked: selectedStoryKey === 'manual', onChange: () => setSelectedStoryKey('manual') }), ' ', "Enter user story key manually:", (0, jsx_runtime_1.jsx)("input", { type: "text", value: manualStoryKey, onChange: handleManualKeyChange, style: { marginLeft: 8, width: 120 }, disabled: selectedStoryKey !== 'manual' })] }) }), (0, jsx_runtime_1.jsx)("button", { style: { marginTop: 16 }, onClick: handleProceed, disabled: !selectedStoryKey || (selectedStoryKey === 'manual' && !manualStoryKey) || analysisLoading, children: analysisLoading ? 'Analyzing...' : 'Analyse Selected Story' })] })) : ((0, jsx_runtime_1.jsx)("div", { children: "Loading stories..." }))] }), analysisError && (0, jsx_runtime_1.jsx)("div", { style: { color: 'red', marginTop: 16 }, children: analysisError }), analysisResult && ((0, jsx_runtime_1.jsxs)("div", { style: { marginTop: 32 }, children: [(0, jsx_runtime_1.jsxs)("h3", { children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => toggleSection('storyScore'), style: { marginRight: 8 }, "aria-expanded": expandedSections.storyScore, "aria-controls": "storyScoreContent", children: expandedSections.storyScore ? '▼' : '▶' }), "Story Score (Clarity & Readiness Index)"] }), expandedSections.storyScore && ((0, jsx_runtime_1.jsx)("div", { id: "storyScoreContent", children: renderQualityProgressBars() }))] })), analysisResult && analysisResult.requirement_classification && ((0, jsx_runtime_1.jsxs)("div", { style: { marginTop: 32 }, children: [(0, jsx_runtime_1.jsxs)("h3", { children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => toggleSection('requirementClassification'), style: { marginRight: 8 }, "aria-expanded": expandedSections.requirementClassification, "aria-controls": "requirementClassificationContent", children: expandedSections.requirementClassification ? '▼' : '▶' }), "Requirement Classification & Extraction"] }), expandedSections.requirementClassification && ((0, jsx_runtime_1.jsx)("pre", { id: "requirementClassificationContent", style: { background: '#f4f4f4', padding: 12, borderRadius: 4, whiteSpace: 'pre-wrap' }, children: analysisResult.requirement_classification }))] })), analysisResult && analysisResult.gap_conflict_analysis && ((0, jsx_runtime_1.jsxs)("div", { style: { marginTop: 32 }, children: [(0, jsx_runtime_1.jsxs)("h3", { children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => toggleSection('gapConflictAnalysis'), style: { marginRight: 8 }, "aria-expanded": expandedSections.gapConflictAnalysis, "aria-controls": "gapConflictAnalysisContent", children: expandedSections.gapConflictAnalysis ? '▼' : '▶' }), "Gap & Conflict Analysis"] }), expandedSections.gapConflictAnalysis && ((0, jsx_runtime_1.jsx)("pre", { id: "gapConflictAnalysisContent", style: { background: '#f4f4f4', padding: 12, borderRadius: 4, whiteSpace: 'pre-wrap' }, children: analysisResult.gap_conflict_analysis }))] })), analysisResult && analysisResult.compliance_security && ((0, jsx_runtime_1.jsxs)("div", { style: { marginTop: 32 }, children: [(0, jsx_runtime_1.jsxs)("h3", { children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => toggleSection('complianceSecurity'), style: { marginRight: 8 }, "aria-expanded": expandedSections.complianceSecurity, "aria-controls": "complianceSecurityContent", children: expandedSections.complianceSecurity ? '▼' : '▶' }), "Compliance & Security Checks"] }), expandedSections.complianceSecurity && ((0, jsx_runtime_1.jsx)("pre", { id: "complianceSecurityContent", style: { background: '#f4f4f4', padding: 12, borderRadius: 4, whiteSpace: 'pre-wrap' }, children: analysisResult.compliance_security }))] })), analysisResult && analysisResult.visualization && ((0, jsx_runtime_1.jsxs)("div", { style: { marginTop: 32 }, children: [(0, jsx_runtime_1.jsxs)("h3", { children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => toggleSection('visualization'), style: { marginRight: 8 }, "aria-expanded": expandedSections.visualization, "aria-controls": "visualizationContent", children: expandedSections.visualization ? '▼' : '▶' }), "Requirement Visualization"] }), expandedSections.visualization && ((0, jsx_runtime_1.jsx)("pre", { id: "visualizationContent", style: { background: '#f4f4f4', padding: 12, borderRadius: 4, whiteSpace: 'pre-wrap' }, children: analysisResult.visualization }))] })), analysisResult && analysisResult.change_impact_analysis && ((0, jsx_runtime_1.jsxs)("div", { style: { marginTop: 32 }, children: [(0, jsx_runtime_1.jsxs)("h3", { children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => toggleSection('changeImpactAnalysis'), style: { marginRight: 8 }, "aria-expanded": expandedSections.changeImpactAnalysis, "aria-controls": "changeImpactAnalysisContent", children: expandedSections.changeImpactAnalysis ? '▼' : '▶' }), "Change Impact Analysis"] }), expandedSections.changeImpactAnalysis && ((0, jsx_runtime_1.jsx)("pre", { id: "changeImpactAnalysisContent", style: { background: '#f4f4f4', padding: 12, borderRadius: 4, whiteSpace: 'pre-wrap' }, children: analysisResult.change_impact_analysis }))] }))] })), step === 3 && selectedIntegration !== 'Jira' && ((0, jsx_runtime_1.jsxs)("div", { style: { marginTop: 32 }, children: [(0, jsx_runtime_1.jsxs)("h4", { children: ["Results for ", selectedIntegration] }), (0, jsx_runtime_1.jsx)("div", { children: "Feature not implemented yet." })] })), step === 4 && ((0, jsx_runtime_1.jsxs)("div", { style: { marginTop: 32, textAlign: 'center' }, children: [(0, jsx_runtime_1.jsx)("h4", { children: "Analysis Complete" }), (0, jsx_runtime_1.jsx)("p", { children: "The analysis is complete. You can now proceed to view the detailed results." }), (0, jsx_runtime_1.jsx)("button", { onClick: handleNavigateToResults, children: "View Analysis Results" })] }))] }), (0, jsx_runtime_1.jsx)(Footer_1.default, {})] }));
};
exports.default = RequirementAnalyserPage;
