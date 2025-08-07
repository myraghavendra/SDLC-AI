import React from 'react';
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

const Home: React.FC = () => {
  return (
    <>
      <Header />
      <main>
        <h1 className="main-title">SDLC Agent Dashboard</h1>
        <FeaturesGrid />
      </main>
      <Footer />
    </>
  );
};

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/features" element={<FeaturesPage />} />
      <Route path="/story-generator" element={<GenerateAcceptanceCriteriaPage />} />
      <Route path="/integrated-story" element={<IntegratedStory />} />
      <Route path="/publish-story" element={<PublishStoryPage />} />
      <Route path="/generate-acceptance-criteria" element={<GenerateAcceptanceCriteriaPage />} />
      <Route path="/requirement-analyser" element={<RequirementAnalyserPage />} />
      <Route path="/requirement-analysis/:storyKey" element={<RequirementAnalysisResultsPage />} />
      <Route path="/defect-summary-report" element={<DefectSummaryReportPage />} />
      <Route path="/documentation" element={<Documentation />} />
    </Routes>
  );
};

    export default App;
