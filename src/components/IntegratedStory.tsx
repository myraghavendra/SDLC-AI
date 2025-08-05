import React, { useState } from 'react';
import LandingPage from './LandingPage';
import StorySelectionPage from './StorySelectionPage';
import TestCaseGenerationPage from './TestCaseGenerationPage';
import Header from './Header';
import Footer from './Footer';


const IntegratedStory: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTool, setSelectedTool] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [jiraUrl, setJiraUrl] = useState('');
  const [projectKey, setProjectKey] = useState('');
  const [selectedStories, setSelectedStories] = useState<any[]>([]);

   const completedSteps: number[] = [];
  if (selectedTool) completedSteps.push(1);
  if (selectedStories.length > 0) completedSteps.push(2);
  if (currentStep === 3) completedSteps.push(3);
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
    return (
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32 }}>
        {stages.map((stage, idx) => {
          const stepNumber = idx + 1;
          const active = currentStep === stepNumber;
          const completed = completedSteps.includes(stepNumber);
          return (
            <React.Fragment key={stage.label}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: completed ? '#4caf50' : active ? '#2196f3' : '#e0e0e0',
                color: completed || active ? '#fff' : '#888',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 'bold', fontSize: 18,
                border: active ? '2px solid #1976d2' : '2px solid #e0e0e0',
                transition: 'background 0.2s',
              }}>{stepNumber}</div>
              {idx < stages.length - 1 && (
                <div style={{ flex: 1, height: 4, background: completed ? '#4caf50' : '#e0e0e0' }} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  const handleStepClick = (step: number) => {
    if (step === 1) {
      setCurrentStep(1);
    } else if (step === 2 && selectedTool) {
      setCurrentStep(2);
    } else if (step === 3 && selectedStories.length > 0) {
      setCurrentStep(3);
    }
  };

  const handleNextFromLanding = (tool: string) => {
    setSelectedTool(tool);
    setCurrentStep(2);
  };

  const handleNextFromStorySelection = (stories: any[], _key: string, jiraUrlInput?: string, projectKeyInput?: string) => {
    setSelectedStories(stories);
    if (jiraUrlInput) setJiraUrl(jiraUrlInput);
    if (projectKeyInput) setProjectKey(projectKeyInput);
    setCurrentStep(3);
  };

  const handleBackFromStorySelection = () => {
    setCurrentStep(1);
  };

  const handleBackFromTestCaseGeneration = () => {
    setCurrentStep(2);
  };

  return (
    <>
      <Header />
      <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
        <h2>Integrated Story Processing</h2>
        {renderProgressBar()}
        {currentStep === 1 && <LandingPage onNext={handleNextFromLanding} />}
        {currentStep === 2 && (
          <StorySelectionPage
            selectedTool={selectedTool}
            onBack={handleBackFromStorySelection}
            onNext={handleNextFromStorySelection}
          />
        )}
        {currentStep === 3 && (
          <TestCaseGenerationPage
            selectedTool={selectedTool}
            selectedStories={selectedStories}
            apiKey={apiKey}
            jiraUrl={jiraUrl}
            projectKey={projectKey}
            onBack={handleBackFromTestCaseGeneration}
          />
        )}
      </div>
      <Footer />
    </>
  );
};

export default IntegratedStory;
