import React from 'react';
import FeatureCard from './FeatureCard';
import { FaBook, FaCode, FaChartBar, FaCodeBranch } from 'react-icons/fa';
import './FeaturesGrid.css';

const FeaturesGrid: React.FC = () => {
  return (
    <section className="features-grid">
      <FeatureCard
        icon={<FaBook color="#2a64d6" size={48} />}
        title="User Story Generator"
        description="Generate comprehensive user stories for your project "
        to="/story-generator"
      />
      <FeatureCard
        icon={<FaCode color="#3a9d23" size={48} />}
        title="Integrated Test Designer"
        description="Design and manage your test cases efficiently"
        to="/integrated-story"
      />
      <FeatureCard
        icon={<FaChartBar color="#f5a623" size={48} />}
        title="Requirement Analyser"
        description="Analyze and validate project requirements"
        to="/requirement-analyser"
      />
      <FeatureCard
        icon={<FaCodeBranch color="#7a2ea0" size={48} />}
        title="Data Analyst Agent"
        description="Analyze and visualize your project data"
        to="/defect-summary-report"
      />
    </section>
  );
};

export default FeaturesGrid;
