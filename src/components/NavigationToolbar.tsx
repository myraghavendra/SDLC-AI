import React from 'react';

interface NavigationToolbarProps {
  currentStep: number;
  onStepClick: (step: number) => void;
  completedSteps: number[];
}

const steps = [
  { id: 1, label: 'Select Source' },
  { id: 2, label: 'Select User Story' },
  { id: 3, label: 'Generate Test Case' },
];

const NavigationToolbar: React.FC<NavigationToolbarProps> = ({ currentStep, onStepClick, completedSteps }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
      {steps.map((step) => {
        const isActive = currentStep === step.id;
        const isCompleted = completedSteps.includes(step.id);
        const backgroundColor = isCompleted ? '#28a745' : isActive ? '#007bff' : '#ccc';
        const color = isCompleted || isActive ? 'white' : '#333';
        return (
          <div
            key={step.id}
            onClick={() => onStepClick(step.id)}
            style={{
              cursor: 'pointer',
              padding: '8px 16px',
              margin: '0 8px',
              borderRadius: 4,
              backgroundColor,
              color,
              fontWeight: isActive || isCompleted ? 'bold' : 'normal',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {step.label} {isCompleted && <span style={{ marginLeft: 6 }}>✅</span>}
          </div>
        );
      })}
    </div>
  );
};

export default NavigationToolbar;
