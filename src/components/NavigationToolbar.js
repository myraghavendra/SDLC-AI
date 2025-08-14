"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const steps = [
    { id: 1, label: 'Select Source' },
    { id: 2, label: 'Select User Story' },
    { id: 3, label: 'Generate Test Case' },
];
const NavigationToolbar = ({ currentStep, onStepClick, completedSteps }) => {
    return ((0, jsx_runtime_1.jsx)("div", { style: { display: 'flex', justifyContent: 'center', marginBottom: 20 }, children: steps.map((step) => {
            const isActive = currentStep === step.id;
            const isCompleted = completedSteps.includes(step.id);
            const backgroundColor = isCompleted ? '#28a745' : isActive ? '#007bff' : '#ccc';
            const color = isCompleted || isActive ? 'white' : '#333';
            return ((0, jsx_runtime_1.jsxs)("div", { onClick: () => onStepClick(step.id), style: {
                    cursor: 'pointer',
                    padding: '8px 16px',
                    margin: '0 8px',
                    borderRadius: 4,
                    backgroundColor,
                    color,
                    fontWeight: isActive || isCompleted ? 'bold' : 'normal',
                    display: 'flex',
                    alignItems: 'center',
                }, children: [step.label, " ", isCompleted && (0, jsx_runtime_1.jsx)("span", { style: { marginLeft: 6 }, children: "\u2705" })] }, step.id));
        }) }));
};
exports.default = NavigationToolbar;
