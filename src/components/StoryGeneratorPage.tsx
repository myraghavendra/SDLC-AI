import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';

const StoryGeneratorPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [storyDescription, setStoryDescription] = useState('');
  const [generatedStory, setGeneratedStory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  const completedSteps: number[] = [];
  if (storyDescription) completedSteps.push(1);
  if (generatedStory) completedSteps.push(2);
  if (step === 3) completedSteps.push(3);

  // Progress bar rendering using style from DefectSummaryReportPage
  const renderProgressBar = () => {
    const stages = [
      { label: 'Enter Description' },
      { label: 'Generate Story' },
      { label: 'Review & Submit' },
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

  const handleStepClick = (stepNumber: number) => {
    if (stepNumber === 1) {
      setCurrentStep(1);
    } else if (stepNumber === 2 && storyDescription) {
      setCurrentStep(2);
    } else if (stepNumber === 3 && generatedStory) {
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
    } catch (err: any) {
      setError(err.message || 'Failed to generate story');
    } finally {
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

  return (
    <>
      <Header />
      <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
        <h2>Story Generator</h2>
        {renderProgressBar()}
        
        {step === 1 && (
          <div>
            <h3>Enter Story Description</h3>
            <textarea
              value={storyDescription}
              onChange={(e) => setStoryDescription(e.target.value)}
              rows={5}
              style={{ width: '100%', marginBottom: 16 }}
              placeholder="Describe the user story you want to generate..."
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button onClick={handleGenerateStory} disabled={loading} style={{ padding: '8px 16px' }}>
              {loading ? 'Generating...' : 'Generate Story'}
            </button>
          </div>
        )}
        
        {step === 2 && (
          <div>
            <h3>Generated Story</h3>
            <div style={{ backgroundColor: '#f0f0f0', padding: 16, marginBottom: 16 }}>
              <pre style={{ whiteSpace: 'pre-wrap' }}>{generatedStory}</pre>
            </div>
            <button onClick={handleSubmitStory} style={{ padding: '8px 16px', marginRight: 8 }}>
              Submit Story
            </button>
            <button onClick={handleReset} style={{ padding: '8px 16px' }}>
              Start Over
            </button>
          </div>
        )}
        
        {step === 3 && (
          <div style={{ textAlign: 'center' }}>
            <h3>Story Submitted Successfully!</h3>
            <p>Your story has been generated and submitted.</p>
            <button onClick={handleReset} style={{ padding: '8px 16px' }}>
              Generate Another Story
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default StoryGeneratorPage;
