"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const Header_1 = __importDefault(require("./components/Header"));
const Documentation_1 = __importDefault(require("./components/Documentation"));
const FeaturesGrid_1 = __importDefault(require("./components/FeaturesGrid"));
const Footer_1 = __importDefault(require("./components/Footer"));
require("./App.css");
const react_router_dom_1 = require("react-router-dom");
const FeaturesPage_1 = __importDefault(require("./components/FeaturesPage"));
//import StoryGeneratorPage from './components/StoryGeneratorPage';
const PublishStoryPage_1 = __importDefault(require("./components/PublishStoryPage"));
const GenerateAcceptanceCriteriaPage_1 = __importDefault(require("./components/GenerateAcceptanceCriteriaPage"));
const IntegratedStory_1 = __importDefault(require("./components/IntegratedStory"));
const RequirementAnalyserPage_1 = __importDefault(require("./components/RequirementAnalyserPage"));
const RequirementAnalysisResultsPage_1 = __importDefault(require("./components/RequirementAnalysisResultsPage"));
const DefectSummaryReportPage_1 = __importDefault(require("./components/DefectSummaryReportPage"));
const Home = () => {
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Header_1.default, {}), (0, jsx_runtime_1.jsxs)("main", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "main-title", children: "SDLC Agent Dashboard" }), (0, jsx_runtime_1.jsx)(FeaturesGrid_1.default, {})] }), (0, jsx_runtime_1.jsx)(Footer_1.default, {})] }));
};
const App = () => {
    return ((0, jsx_runtime_1.jsxs)(react_router_dom_1.Routes, { children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/", element: (0, jsx_runtime_1.jsx)(Home, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/features", element: (0, jsx_runtime_1.jsx)(FeaturesPage_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/story-generator", element: (0, jsx_runtime_1.jsx)(GenerateAcceptanceCriteriaPage_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/integrated-story", element: (0, jsx_runtime_1.jsx)(IntegratedStory_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/publish-story", element: (0, jsx_runtime_1.jsx)(PublishStoryPage_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/generate-acceptance-criteria", element: (0, jsx_runtime_1.jsx)(GenerateAcceptanceCriteriaPage_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/requirement-analyser", element: (0, jsx_runtime_1.jsx)(RequirementAnalyserPage_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/requirement-analysis/:storyKey", element: (0, jsx_runtime_1.jsx)(RequirementAnalysisResultsPage_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/defect-summary-report", element: (0, jsx_runtime_1.jsx)(DefectSummaryReportPage_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/documentation", element: (0, jsx_runtime_1.jsx)(Documentation_1.default, {}) })] }));
};
exports.default = App;
