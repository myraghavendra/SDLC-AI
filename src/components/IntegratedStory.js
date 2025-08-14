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
const LandingPage_1 = __importDefault(require("./LandingPage"));
const StorySelectionPage_1 = __importDefault(require("./StorySelectionPage"));
const TestCaseGenerationPage_1 = __importDefault(require("./TestCaseGenerationPage"));
const Header_1 = __importDefault(require("./Header"));
const Footer_1 = __importDefault(require("./Footer"));
const IntegratedStory = () => {
    const [currentStep, setCurrentStep] = (0, react_1.useState)(1);
    const [selectedTool, setSelectedTool] = (0, react_1.useState)('');
    const [apiKey, setApiKey] = (0, react_1.useState)('');
    const [jiraUrl, setJiraUrl] = (0, react_1.useState)('');
    const [projectKey, setProjectKey] = (0, react_1.useState)('');
    const [selectedStories, setSelectedStories] = (0, react_1.useState)([]);
    const completedSteps = [];
    if (selectedTool)
        completedSteps.push(1);
    if (selectedStories.length > 0)
        completedSteps.push(2);
    if (currentStep === 3)
        completedSteps.push(3);
    //console.log("apikey",apiKey)
    // Removed debug console.log statement
    // console.log("jiraUrl",jiraUrl)
    // Progress bar rendering
    const renderProgressBar = () => {
        const stages = [
            { label: 'Select Source' },
            { label: 'Select User Story' },
            { label: 'Generate Test Case' },
        ];
        return ((0, jsx_runtime_1.jsx)("div", { style: { display: 'flex', alignItems: 'center', marginBottom: 32 }, children: stages.map((stage, idx) => {
                const stepNumber = idx + 1;
                const active = currentStep === stepNumber;
                const completed = completedSteps.includes(stepNumber);
                return ((0, jsx_runtime_1.jsxs)(react_1.default.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { style: {
                                width: 36, height: 36, borderRadius: '50%',
                                background: completed ? '#4caf50' : active ? '#2196f3' : '#e0e0e0',
                                color: completed || active ? '#fff' : '#888',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 'bold', fontSize: 18,
                                border: active ? '2px solid #1976d2' : '2px solid #e0e0e0',
                                transition: 'background 0.2s',
                            }, children: stepNumber }), idx < stages.length - 1 && ((0, jsx_runtime_1.jsx)("div", { style: { flex: 1, height: 4, background: completed ? '#4caf50' : '#e0e0e0' } }))] }, stage.label));
            }) }));
    };
    const handleStepClick = (step) => {
        if (step === 1) {
            setCurrentStep(1);
        }
        else if (step === 2 && selectedTool) {
            setCurrentStep(2);
        }
        else if (step === 3 && selectedStories.length > 0) {
            setCurrentStep(3);
        }
    };
    const handleNextFromLanding = (tool) => {
        setSelectedTool(tool);
        setCurrentStep(2);
    };
    const handleNextFromStorySelection = (stories, _key, jiraUrlInput, projectKeyInput) => {
        setSelectedStories(stories);
        if (jiraUrlInput)
            setJiraUrl(jiraUrlInput);
        if (projectKeyInput)
            setProjectKey(projectKeyInput);
        setCurrentStep(3);
    };
    const handleBackFromStorySelection = () => {
        setCurrentStep(1);
    };
    const handleBackFromTestCaseGeneration = () => {
        setCurrentStep(2);
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Header_1.default, {}), (0, jsx_runtime_1.jsxs)("div", { style: { maxWidth: 600, margin: '0 auto', padding: 24 }, children: [(0, jsx_runtime_1.jsx)("h2", { children: "Integrated Story Processing" }), renderProgressBar(), currentStep === 1 && (0, jsx_runtime_1.jsx)(LandingPage_1.default, { onNext: handleNextFromLanding }), currentStep === 2 && ((0, jsx_runtime_1.jsx)(StorySelectionPage_1.default, { selectedTool: selectedTool, onBack: handleBackFromStorySelection, onNext: handleNextFromStorySelection })), currentStep === 3 && ((0, jsx_runtime_1.jsx)(TestCaseGenerationPage_1.default, { selectedTool: selectedTool, selectedStories: selectedStories, apiKey: apiKey, jiraUrl: jiraUrl, projectKey: projectKey, onBack: handleBackFromTestCaseGeneration }))] }), (0, jsx_runtime_1.jsx)(Footer_1.default, {})] }));
};
exports.default = IntegratedStory;
