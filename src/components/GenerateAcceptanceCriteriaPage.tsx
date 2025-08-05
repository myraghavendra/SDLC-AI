import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
//import {checkJiraAuthentication} from '../backend/jiraClient';



const GenerateAcceptanceCriteriaPage: React.FC = () => {
  // For displaying acceptance criteria and technical notes
  const [acceptanceCriteria, setAcceptanceCriteria] = useState('');
  const [technicalNotes, setTechnicalNotes] = useState('');
  const [copied, setCopied] = useState(false);
  // Step state: 1 = Prompt, 2 = Generate Story, 3 = Upload to Tool
  const [step, setStep] = useState(1);

  // Step 1: Description and Context input
  const [description, setDescription] = useState('');
  const [context, setContext] = useState('');

  // Step 2: Generated story and tool selection
  const [generatedStory, setGeneratedStory] = useState('');
  const [selectedTool, setSelectedTool] = useState('');

  // Step 3: Upload submission state
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadLogs, setUploadLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle generate story from prompt (Step 1 -> Step 2)
  const handleGenerate = async () => {
    setError('');
    if (!description.trim()) {
      setError('Description is required.');
      return;
    }
    setLoading(true);
    setGeneratedStory('');
    try {
      // If context is empty or whitespace, send a single space
      const contextToSend = context.trim() === '' ? ' ' : context;
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description, context: contextToSend }),
        
      });

    /*   // Debugging logs   
      // Uncomment these lines to see the request and response details in console
      console.log('Sending request to /api/generate with body:', { description, context: contextToSend });
      console.log('Request headers:', { 'Content-Type': 'application/json' });
      console.log('Request body:', JSON.stringify({ description, context: contextToSend }));      
       console.log('Received response from /api/generate:', response);
      console.log('Request body:', { description, context: contextToSend });

      // Check if response is ok (status 200-299)
      // If not, throw an error with the response message     
      console.log('Received response from /api/generate:', response);

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to generate');
      } */
      const data = await response.json();

      // Use acceptanceCriteria and technicalNotes directly from API response
      setGeneratedStory(description); // or set to empty string if preferred
      setAcceptanceCriteria(data.acceptanceCriteria || '');
      setTechnicalNotes(data.technicalNotes || '');
      setStep(2);
    } catch (err: any) {
      setError(err.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Handle submit selected tool and move to upload step (Step 2 -> Step 3)
  const handleSubmitTool = () => {
    setError('');
    if (!selectedTool) {
      setError('Please select a target tool.');
      return;
    }
    setStep(3);
  };

  // Handle upload to tool submission (Step 3)
  const handleUpload = async () => {
    setError('');
    setLoading(true);
    setUploadStatus('');
    try {
      if (selectedTool === 'Jira') {
        // Clean acceptanceCriteria by removing leading ```gherkin and trailing ```
        let cleanedAcceptanceCriteria = acceptanceCriteria.trim();
        if (cleanedAcceptanceCriteria.toLowerCase().startsWith('```gherkin')) {
          cleanedAcceptanceCriteria = cleanedAcceptanceCriteria.substring(10).trim();
        }
        if (cleanedAcceptanceCriteria.endsWith('```')) {
          cleanedAcceptanceCriteria = cleanedAcceptanceCriteria.substring(0, cleanedAcceptanceCriteria.length - 3).trim();
        }

        // Call backend to create Jira story
        const response = await fetch('/api/upload-jira', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            summary: description,
            description: `${generatedStory}\n\nAcceptance Criteria:\n${cleanedAcceptanceCriteria}\n\nTechnical Notes:\n${technicalNotes}`,
          }),
        });
        // Removed debug console.log statements
        // console.log('Received response from /api/upload-jira:', response);
        // console.log('Request body:', {
        //   summary: description,
        //   description: `${generatedStory}\n\nAcceptance Criteria:\n${cleanedAcceptanceCriteria}\n\nTechnical Notes:\n${technicalNotes}`,
        // });
        
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || 'Failed to upload to Jira');
        }
        const data = await response.json();
        setUploadStatus(`Successfully uploaded to Jira. Ticket: ${data.ticketKey}`);
        setUploadLogs(data.logs || []);
      } else {
        // Simulate upload for other tools
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setUploadStatus(`Successfully uploaded to ${selectedTool}`);
      }
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  // Progress bar component
  const ProgressBar = () => {
    const steps = ['Prompt', 'Generate Story', 'Upload to Tool'];
    return (
      <div style={{ marginBottom: 32, padding: '0 12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
          {steps.map((label, index) => {
            const stepIndex = index + 1;
            const isActive = step === stepIndex;
            // Mark all steps as completed if uploadStatus indicates successful upload to Jira
            let isCompleted = step > stepIndex;
            if (uploadStatus && selectedTool === 'Jira' && uploadStatus.includes('Successfully uploaded to Jira')) {
              isCompleted = true;
            }
            let backgroundColor = '#ccc';
            if (isActive) {
              backgroundColor = '#007bff';
            } else if (isCompleted) {
              backgroundColor = '#28a745';
            }
            // Label color green if completed or active
            const labelColor = (isCompleted || isActive) ? '#28a745' : '#222';
            // Set fontWeight to bold for all labels if upload successful
            const labelFontWeight = (uploadStatus && selectedTool === 'Jira' && uploadStatus.includes('Successfully uploaded to Jira')) ? 'bold' : (isActive ? 'bold' : 'normal');
            return (
              <React.Fragment key={label}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                  <div
                    style={{
                      height: 24,
                      width: 24,
                      marginBottom: 8,
                      borderRadius: '50%',
                      backgroundColor,
                      color: 'white',
                      lineHeight: '24px',
                      fontWeight: 'bold',
                      textAlign: 'center',
                    }}
                  >
                    {stepIndex}
                  </div>
                  <div style={{ fontWeight: labelFontWeight, color: labelColor }}>{label}</div>
                </div>
                {/* Draw bar only between steps */}
                {index < steps.length - 1 && (
                  <div
                    style={{
                      height: 4,
                      width: 40,
                      background: (step > stepIndex || (stepIndex === 2 && (step > 2 || uploadStatus))) ? '#28a745' : '#ccc',
                      margin: '0 4px 16px 4px',
                      borderRadius: 2,
                      transition: 'background 0.3s',
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      <Header />
      <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
        <h2>Acceptance Criteria Workflow</h2>
        <ProgressBar />
        {step === 1 && (
          <div>
            <label htmlFor="description" style={{ display: 'block', fontWeight: 'bold', marginBottom: 8 }}>
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              style={{ width: '100%', marginBottom: 12 }}
              required
              placeholder="Enter the story description"
            />
            <label htmlFor="context" style={{ display: 'block', fontWeight: 'bold', marginBottom: 8 }}>
              Context <span style={{ color: '#888', fontWeight: 'normal' }}>(optional)</span>
            </label>
            <textarea
              id="context"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              rows={3}
              style={{ width: '100%', marginBottom: 12 }}
              placeholder="Enter the context (optional)"
            />
            <button onClick={handleGenerate} disabled={loading} style={{ padding: '8px 16px' }}>
              {loading ? 'Generating...' : 'Generate'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </div>
        )}
        {step === 2 && (
          <div>
            <h3>Generated User Story</h3>
            {generatedStory && (
              <pre style={{ backgroundColor: '#f0f0f0', padding: 12, whiteSpace: 'pre-wrap' }}>{generatedStory}</pre>
            )}
            {acceptanceCriteria && (
              <div style={{ marginTop: 20 }}>
                <h4>Acceptance Criteria</h4>
                {/* Format acceptance criteria as Given/When/Then blocks */}
                {acceptanceCriteria.split(/\n|\r/).map((line, idx) => {
                  // Remove lines that start with '```gherkin' (case-insensitive) and '```'
                  if (/^```gherkin/i.test(line.trim()) || line.trim() === '```') {
                    return null;
                  }
                  if (/^Given:/i.test(line)) {
                    return <div key={idx}><strong>Given:</strong> {line.replace(/^Given:/i, '').trim()}</div>;
                  }
                  if (/^When:/i.test(line)) {
                    return <div key={idx}><strong>When:</strong> {line.replace(/^When:/i, '').trim()}</div>;
                  }
                  if (/^Then:/i.test(line)) {
                    return <div key={idx}><strong>Then:</strong> {line.replace(/^Then:/i, '').trim()}</div>;
                  }
                  if (/^Technical Notes:/i.test(line)) {
                    // handled below
                    return null;
                  }
                  return line.trim() ? <div key={idx}>{line}</div> : null;
                })}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(acceptanceCriteria);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1200);
                  }}
                  style={{ marginTop: 8, marginBottom: 8 }}
                >
                  {copied ? 'Copied!' : 'Copy Acceptance Criteria'}
                                      
                    
                </button>
              </div>
            )}
            {technicalNotes && (
              <div style={{ marginTop: 20 }}>
                <h4>Technical Notes</h4>
                {/* Display technical notes as plain lines, no bullets */}
                <div style={{ backgroundColor: '#f4f4f4', padding: 10, whiteSpace: 'pre-wrap' }}>
                  {technicalNotes.split(/\n|\r/).filter(line => line.trim()).map((note, idx) => (
                    <div key={idx}>{note}</div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(technicalNotes);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1200);
                  }}
                  style={{ marginTop: 8, marginBottom: 8 }}
                >
                  {copied ? 'Copied!' : 'Copy Technical Notes'}
                </button>
              </div>
            )}
            <div style={{ marginTop: 20 }}>
              <div style={{ fontWeight: 'bold', marginBottom: 8 }}>Select Target Tool</div>
              <label style={{ marginRight: 12 }}>
                <input
                  type="radio"
                  name="tool"
                  value="Jira"
                  checked={selectedTool === 'Jira'}
                  onChange={() => setSelectedTool('Jira')}
                />{' '}
                Jira
              </label>
              <label style={{ marginRight: 12 }}>
                <input
                  type="radio"
                  name="tool"
                  value="Rally"
                  checked={selectedTool === 'Rally'}
                  onChange={() => setSelectedTool('Rally')}
                />{' '}
                Rally
              </label>
              <label>
                <input
                  type="radio"
                  name="tool"
                  value="TestRail"
                  checked={selectedTool === 'TestRail'}
                  onChange={() => setSelectedTool('TestRail')}
                />{' '}
                TestRail
              </label>
            </div>
            <button onClick={handleSubmitTool} disabled={loading} style={{ marginTop: 16, padding: '8px 16px' }}>
              Submit
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </div>
        )}
        {step === 3 && (
          <div>
            <h3>Upload to Tool</h3>
            <p>Selected Tool: <span>{selectedTool}</span></p>
            <button onClick={handleUpload} disabled={loading} style={{ padding: '8px 16px' }}>
              {loading ? 'Uploading...' : 'Upload'}
            </button>
        {uploadStatus && <p style={{ color: 'green' }}>{uploadStatus}</p>}
        {uploadLogs.length > 0 && (
          <div style={{ backgroundColor: '#f9f9f9', border: '1px solid #ddd', padding: 10, marginTop: 10, maxHeight: 200, overflowY: 'auto', whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: 12 }}>
            {uploadLogs.map((log, idx) => (
              <div key={idx}>{log}</div>
            ))}
          </div>
        )}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default GenerateAcceptanceCriteriaPage;
