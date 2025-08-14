"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const LandingPage = ({ onNext }) => {
    const [selectedTool, setSelectedTool] = (0, react_1.useState)('');
    const handleNext = () => {
        if (selectedTool) {
            onNext(selectedTool);
        }
        else {
            alert('Please select a source tool.');
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { style: { maxWidth: 600, margin: '0 auto', padding: 20 }, children: [(0, jsx_runtime_1.jsx)("h2", { children: "Select Source Tool" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("label", { style: { marginRight: 12 }, children: [(0, jsx_runtime_1.jsx)("input", { type: "radio", name: "sourceTool", value: "Jira", checked: selectedTool === 'Jira', onChange: () => setSelectedTool('Jira') }), ' ', "Jira"] }), (0, jsx_runtime_1.jsxs)("label", { style: { marginRight: 12 }, children: [(0, jsx_runtime_1.jsx)("input", { type: "radio", name: "sourceTool", value: "Rally", checked: selectedTool === 'Rally', onChange: () => setSelectedTool('Rally') }), ' ', "Rally"] }), (0, jsx_runtime_1.jsxs)("label", { children: [(0, jsx_runtime_1.jsx)("input", { type: "radio", name: "sourceTool", value: "TestRail", checked: selectedTool === 'TestRail', onChange: () => setSelectedTool('TestRail') }), ' ', "TestRail"] })] }), (0, jsx_runtime_1.jsx)("button", { onClick: handleNext, style: { marginTop: 20, padding: '8px 16px' }, children: "Next" })] }));
};
exports.default = LandingPage;
