"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });

import { jsxs, jsx } from "react/jsx-runtime";
const FeatureCard_1 = __importDefault(require("./FeatureCard"));
import { FaBook, FaCode, FaChartBar, FaCodeBranch } from "react-icons/fa";
import "./FeaturesGrid.css";
const FeaturesGrid = () => {
    return ((0, jsxs)("section", { className: "features-grid", children: [(0, jsx)(FeatureCard_1.default, { icon: (0, jsx)(FaBook, { color: "#2a64d6", size: 48 }), title: "User Story Generator", description: "Generate comprehensive user stories for your project ", to: "/story-generator" }), (0, jsx)(FeatureCard_1.default, { icon: (0, jsx)(FaCode, { color: "#3a9d23", size: 48 }), title: "Integrated Test Designer", description: "Design and manage your test cases efficiently", to: "/integrated-story" }), (0, jsx)(FeatureCard_1.default, { icon: (0, jsx)(FaChartBar, { color: "#f5a623", size: 48 }), title: "Requirement Analyser", description: "Analyze and validate project requirements", to: "/requirement-analyser" }), (0, jsx)(FeatureCard_1.default, { icon: (0, jsx)(FaCodeBranch, { color: "#7a2ea0", size: 48 }), title: "Data Analyst Agent", description: "Analyze and visualize your project data", to: "/defect-summary-report" })] }));
};
const _default = FeaturesGrid;
export { _default as default };