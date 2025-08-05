import React, { useState } from 'react';

interface LandingPageProps {
  onNext: (selectedTool: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNext }) => {
  const [selectedTool, setSelectedTool] = useState<string>('');

  const handleNext = () => {
    if (selectedTool) {
      onNext(selectedTool);
    } else {
      alert('Please select a source tool.');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <h2>Select Source Tool</h2>
      <div>
        <label style={{ marginRight: 12 }}>
          <input
            type="radio"
            name="sourceTool"
            value="Jira"
            checked={selectedTool === 'Jira'}
            onChange={() => setSelectedTool('Jira')}
          />{' '}
          Jira
        </label>
        <label style={{ marginRight: 12 }}>
          <input
            type="radio"
            name="sourceTool"
            value="Rally"
            checked={selectedTool === 'Rally'}
            onChange={() => setSelectedTool('Rally')}
          />{' '}
          Rally
        </label>
        <label>
          <input
            type="radio"
            name="sourceTool"
            value="TestRail"
            checked={selectedTool === 'TestRail'}
            onChange={() => setSelectedTool('TestRail')}
          />{' '}
          TestRail
        </label>
      </div>
      <button onClick={handleNext} style={{ marginTop: 20, padding: '8px 16px' }}>
        Next
      </button>
    </div>
  );
};

export default LandingPage;
