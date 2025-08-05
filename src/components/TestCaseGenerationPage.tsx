import React, { useState } from 'react';
// @ts-ignore
import JSZip from 'jszip';

interface Story {
  key: string;
  summary: string;
  description: string;
}

interface TestCaseGenerationPageProps {
  selectedTool: string;
  selectedStories: Story[];
  apiKey: string;
  jiraUrl?: string;
  projectKey?: string;
  onBack: () => void;       
}

const TestCaseGenerationPage: React.FC<TestCaseGenerationPageProps> = ({
  selectedTool,
  selectedStories,
  apiKey,
  jiraUrl,
  projectKey,
  onBack,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [framework, setFramework] = useState('None');
  const [acceptanceCriteria, setAcceptanceCriteria] = useState('');
  const [technicalNotes, setTechnicalNotes] = useState('');
  const [testCode, setTestCode] = useState('');

  const generateTestCases = async () => {
    setError('');
    setAcceptanceCriteria('');
    setTechnicalNotes('');
    setTestCode('');
    setLoading(true);
    try {
      const story = selectedStories[0];
      const body = {
        description: story.summary,
        context: story.description, 
        framework: framework,
      };
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Failed to generate test cases');
      }
      const data = await response.json();
      setAcceptanceCriteria(data.acceptanceCriteria || '');
      setTechnicalNotes(data.technicalNotes || '');
      setTestCode(data.testCode || '');
    } catch (err: any) {
      setError(err.message || 'Error generating test cases');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 20 }}>
      <h2>Generate Automation Test Cases</h2>
      <p>Selected Tool: {selectedTool}</p>
      <p>Selected Story: {selectedStories.map((s) => s.key).join(', ')}</p>
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="framework-select" style={{ marginRight: 8 }}>Automation Framework:</label>
        <select
          id="framework-select"
          value={framework}
          onChange={e => setFramework(e.target.value)}
          style={{ padding: '4px 8px', background: '#f4f4f4' }}
        >
          <option value="None">None</option>
          <option value="Cypress">Cypress</option>
          <option value="Selenium">Selenium</option>
          <option value="Playwright">Playwright</option>
        </select>
      </div>
      <button onClick={generateTestCases} disabled={loading} style={{ padding: '8px 16px', marginBottom: 20 }}>
        {loading ? 'Generating...' : 'Generate Automation Test Case'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {testCode && (
        <div style={{ marginTop: 20 }}>
          <h3>Automation Test Code ({framework}):</h3>
          <pre style={{ background: '#f4f4f4', padding: 10 }}>{testCode.split('\n').filter(line => !line.trim().startsWith('```')).join('\n')}</pre>
          <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
            <button
              style={{ padding: '8px 16px' }}
              onClick={async () => {
                if (!testCode) return;
                const zip = new JSZip();
                let ext = 'txt';
                if (framework.toLowerCase() === 'cypress') ext = 'js';
                else if (framework.toLowerCase() === 'selenium') ext = 'java';
                else if (framework.toLowerCase() === 'playwright') ext = 'ts';
                const fileName = `testcase.${ext}`;
                const code = testCode.split('\n').filter(line => !line.trim().startsWith('```')).join('\n');
                zip.file(fileName, code);
                const blob = await zip.generateAsync({ type: 'blob' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'automation-test.zip';
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }, 100);
              }}
            >
              Download Zip
            </button>
            <button onClick={onBack} style={{ padding: '8px 16px' }}>
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestCaseGenerationPage;
