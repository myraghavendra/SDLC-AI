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
const StoryGeneratorPage = () => {
    const [step, setStep] = (0, react_1.useState)(1);
    const [storyDescription, setStoryDescription] = (0, react_1.useState)('');
    const [generatedStory, setGeneratedStory] = (0, react_1.useState)('');
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)('');
    const [currentStep, setCurrentStep] = (0, react_1.useState)(1);
    const completedSteps = [];
    if (storyDescription)
        completedSteps.push(1);
    if (generatedStory)
        completedSteps.push(2);
    if (step === 3)
        completedSteps.push(3);
    // Progress bar rendering using style from DefectSummaryReportPage
    const renderProgressBar = () => {
        const stages = [
            { label: 'Enter Description' },
            { label: 'Generate Story' },
            { label: 'Review & Submit' },
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
    const handleStepClick = (stepNumber) => {
        if (stepNumber === 1) {
            setCurrentStep(1);
        }
        else if (stepNumber === 2 && storyDescription) {
            setCurrentStep(2);
        }
        else if (stepNumber === 3 && generatedStory) {
            setCurrentStep(3);
        }
    };
    const handleGenerateStory = async () => {
        if (!storyDescription.trim()) {
            setError('Please enter a story description.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            // Simulate API call to generate story
            await new Promise(resolve => setTimeout(resolve, 1500));
            setGeneratedStory(`Generated story based on: ${storyDescription}`);
            setCurrentStep(2);
        }
        catch (err) {
            setError(err.message || 'Failed to generate story');
        }
        finally {
            setLoading(false);
        }
    };
    const handleSubmitStory = () => {
        // Simulate story submission
        setCurrentStep(3);
    };
    const handleReset = () => {
        setCurrentStep(1);
        setStoryDescription('');
        setGeneratedStory('');
        setError('');
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Header_1.default, {}), (0, jsx_runtime_1.jsxs)("div", { style: { maxWidth: 800, margin: '0 auto', padding: 24 }, children: [(0, jsx_runtime_1.jsx)("h2", { children: "Story Generator" }), renderProgressBar(), step === 1 && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { children: "Enter Story Description" }), (0, jsx_runtime_1.jsx)("textarea", { value: storyDescription, onChange: (e) => setStoryDescription(e.target.value), rows: 5, style: { width: '100%', marginBottom: 16 }, placeholder: "Describe the user story you want to generate..." }), error && (0, jsx_runtime_1.jsx)("p", { style: { color: 'red' }, children: error }), (0, jsx_runtime_1.jsx)("button", { onClick: handleGenerateStory, disabled: loading, style: { padding: '8px 16px' }, children: loading ? 'Generating...' : 'Generate Story' })] })), step === 2 && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { children: "Generated Story" }), (0, jsx_runtime_1.jsx)("div", { style: { backgroundColor: '#f0f0f0', padding: 16, marginBottom: 16 }, children: (0, jsx_runtime_1.jsx)("pre", { style: { whiteSpace: 'pre-wrap' }, children: generatedStory }) }), (0, jsx_runtime_1.jsx)("button", { onClick: handleSubmitStory, style: { padding: '8px 16px', marginRight: 8 }, children: "Submit Story" }), (0, jsx_runtime_1.jsx)("button", { onClick: handleReset, style: { padding: '8px 16px' }, children: "Start Over" })] })), step === 3 && ((0, jsx_runtime_1.jsxs)("div", { style: { textAlign: 'center' }, children: [(0, jsx_runtime_1.jsx)("h3", { children: "Story Submitted Successfully!" }), (0, jsx_runtime_1.jsx)("p", { children: "Your story has been generated and submitted." }), (0, jsx_runtime_1.jsx)("button", { onClick: handleReset, style: { padding: '8px 16px' }, children: "Generate Another Story" })] }))] }), (0, jsx_runtime_1.jsx)(Footer_1.default, {})] }));
};
exports.default = StoryGeneratorPage;
