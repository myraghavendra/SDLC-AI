"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const FeatureCard_1 = __importDefault(require("./FeatureCard"));
const fa_1 = require("react-icons/fa");
require("./FeaturesGrid.css");
const FeaturesGrid = () => {
    return ((0, jsx_runtime_1.jsxs)("section", { className: "features-grid", children: [(0, jsx_runtime_1.jsx)(FeatureCard_1.default, { icon: (0, jsx_runtime_1.jsx)(fa_1.FaBook, { color: "#2a64d6", size: 48 }), title: "User Story Generator", description: "Generate comprehensive user stories for your project ", to: "/story-generator" }), (0, jsx_runtime_1.jsx)(FeatureCard_1.default, { icon: (0, jsx_runtime_1.jsx)(fa_1.FaCode, { color: "#3a9d23", size: 48 }), title: "Integrated Test Designer", description: "Design and manage your test cases efficiently", to: "/integrated-story" }), (0, jsx_runtime_1.jsx)(FeatureCard_1.default, { icon: (0, jsx_runtime_1.jsx)(fa_1.FaChartBar, { color: "#f5a623", size: 48 }), title: "Requirement Analyser", description: "Analyze and validate project requirements", to: "/requirement-analyser" }), (0, jsx_runtime_1.jsx)(FeatureCard_1.default, { icon: (0, jsx_runtime_1.jsx)(fa_1.FaCodeBranch, { color: "#7a2ea0", size: 48 }), title: "Data Analyst Agent", description: "Analyze and visualize your project data", to: "/defect-summary-report" })] }));
};
exports.default = FeaturesGrid;
