import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Documentation from './components/Documentation';
import FeaturesGrid from './components/FeaturesGrid';
import Footer from './components/Footer';
import FeaturesPage from './components/FeaturesPage';
import PublishStoryPage from './components/PublishStoryPage';
import GenerateAcceptanceCriteriaPage from './components/GenerateAcceptanceCriteriaPage';
import IntegratedStory from './components/IntegratedStory';
import RequirementAnalyserPage from './components/RequirementAnalyserPage';
import RequirementAnalysisResultsPage from './components/RequirementAnalysisResultsPage';
import DefectSummaryReportPage from './components/DefectSummaryReportPage';
import './App.css';
const Home = () => {
    return (_jsxs(_Fragment, { children: [_jsx(Header, {}), _jsxs("main", { children: [_jsx("h1", { className: "main-title", children: "SDLC Agent Dashboard" }), _jsx(FeaturesGrid, {})] }), _jsx(Footer, {})] }));
};
const App = () => {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Home, {}) }), _jsx(Route, { path: "/features", element: _jsx(FeaturesPage, {}) }), _jsx(Route, { path: "/story-generator", element: _jsx(GenerateAcceptanceCriteriaPage, {}) }), _jsx(Route, { path: "/integrated-story", element: _jsx(IntegratedStory, {}) }), _jsx(Route, { path: "/publish-story", element: _jsx(PublishStoryPage, {}) }), _jsx(Route, { path: "/generate-acceptance-criteria", element: _jsx(GenerateAcceptanceCriteriaPage, {}) }), _jsx(Route, { path: "/requirement-analyser", element: _jsx(RequirementAnalyserPage, {}) }), _jsx(Route, { path: "/requirement-analysis/:storyKey", element: _jsx(RequirementAnalysisResultsPage, {}) }), _jsx(Route, { path: "/defect-summary-report", element: _jsx(DefectSummaryReportPage, {}) }), _jsx(Route, { path: "/documentation", element: _jsx(Documentation, {}) })] }));
};
export default App;
