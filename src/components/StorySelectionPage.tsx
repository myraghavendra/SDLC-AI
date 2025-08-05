import React, { useState } from 'react';

interface Story {
  key: string;
  summary: string;
  description?: string;
}

interface StorySelectionPageProps {
  selectedTool: string;
  onBack: () => void;
  onNext: (selectedStories: Story[], apiKey: string, jiraUrl?: string, projectKey?: string) => void;
}

const StorySelectionPage: React.FC<StorySelectionPageProps> = ({ selectedTool, onBack, onNext }) => {
  // Removed apiKey state as API token will be read from backend environment
  // const [jiraUrl, setJiraUrl] = useState('');
  // const [projectKey, setProjectKey] = useState('');
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [framework, setFramework] = useState('None');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [acceptanceCriteria, setAcceptanceCriteria] = useState('');
  const [technicalNotes, setTechnicalNotes] = useState('');
  const [testCases, setTestCases] = useState('');
  const [testCode, setTestCode] = useState('');
  const [generating, setGenerating] = useState(false);

  const fetchStories = async () => {
    // Removed debug console.log statements
    // console.log("fetchstories")
    setError('');
    setLoading(true);
    try {
      const body: any = {
        tool: selectedTool,
      };
      if (selectedTool === 'Jira') {
        // Pass Jira URL and Project Key from backend config fetched earlier
        // For now, we can fetch them again or store in state if fetched previously
        // Here, we assume they are fetched and stored in local variables jiraUrl and projectKey
        // Since we removed state, we fetch from backend synchronously here
        const configResponse = await fetch('/api/getJiraConfig');
        // console.log(' fetching Jira config:', configResponse);
        // console.log(' fetching Jira config:', configResponse.ok);
        if (!configResponse.ok) {
          throw new Error('Failed to fetch Jira config');
        }
        const configData = await configResponse.json();
        if (configData.jira_url) {
          body.jira_url = configData.jira_url;
        }
        if (configData.project_key) {
          body.project_key = configData.project_key;
        }
      }
      const response = await fetch('/api/getStories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        
      });
      // console.log("body",body)
      // console.log(' fetching Jira config:', response);
      // console.log("response.ok",response.ok)
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Failed to fetch stories');
      }
      const data = await response.json();
      // console.log(' fetching Jira data:', data);
      setStories(
        (data.stories || []).map((story: any) => ({
          key: story.key,
          summary: story.fields?.summary || '',
          description: typeof story.fields?.description === 'string'
            ? story.fields.description
            : (story.fields?.description?.content
                ? story.fields.description.content.map((block: any) =>
                    block.content ? block.content.map((c: any) => c.text).join('') : ''
                  ).join('\n')
                : ''),
        }))
      );
    } catch (err: any) {
      setError(err.message || 'Error fetching stories');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/api/getJiraConfig');
        if (!response.ok) {
          throw new Error('Failed to fetch Jira config');
        }
        const data = await response.json();
        // Optionally, you can store jira_url and project_key in state if needed
        // For now, no UI input fields for these, so no state update needed
      } catch (error) {
        console.error('Error fetching Jira config:', error);
      }
    };
    fetchConfig();
  }, []);

  const handleStorySelect = (story: Story) => {
    setSelectedStory(story);
    setAcceptanceCriteria('');
    setTechnicalNotes('');
    setTestCases('');
    setTestCode('');
  };

  React.useEffect(() => {
    const generateIfReady = async () => {
      if (selectedStory && framework !== 'None') {
        setGenerating(true);
        setError('');
        setAcceptanceCriteria('');
        setTechnicalNotes('');
        setTestCases('');
        setTestCode('');
        try {
          const body = {
            description: selectedStory.summary,
            context: selectedStory.description || selectedStory.summary,
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
          setTestCases(data.testCases || '');
          setTestCode(data.testCode || '');
        } catch (err: any) {
          setError(err.message || 'Error generating test cases');
        } finally {
          setGenerating(false);
        }
      }
    };
    generateIfReady();
  }, [selectedStory, framework]);

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 20 }}>
      <h2>Select User Stories</h2>
      <button onClick={fetchStories} disabled={loading} style={{ padding: '8px 16px', marginBottom: 20 }}>
        {loading ? 'Fetching...' : 'Fetch Top 5 Stories'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {stories.length > 0 && (
        <div>
          <h3>Top 5 User Stories</h3>
          <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
            {stories.slice(0, 5).map((story, idx) => (
              <li key={story.key} style={{ marginBottom: 8 }}>
                <label>
                  <input
                    type="radio"
                    name="story"
                    checked={selectedStory?.key === story.key}
                    onChange={() => handleStorySelect(story)}
                  />{' '}
                  <strong>{idx + 1}.</strong> <strong>{story.key}</strong>: {story.summary}
                </label>
              </li>
            ))}
            <li style={{ marginBottom: 8 }}>
              <label>
                <input
                  type="radio"
                  name="story"
                  checked={!!(selectedStory && !stories.slice(0, 5).some(s => s.key === selectedStory.key))}
                  onChange={() => setSelectedStory({ key: '', summary: '' })}
                />{' '}
                <strong>Other:</strong>
                <input
                  type="text"
                  placeholder="Enter story key"
                  value={selectedStory && !stories.slice(0, 5).some(s => s.key === selectedStory.key) ? selectedStory.key : ''}
                  onChange={e => setSelectedStory({ key: e.target.value, summary: '' })}
                  style={{ marginLeft: 8, width: 140 }}
                  disabled={stories.length === 0 || !(selectedStory && !stories.slice(0, 5).some(s => s.key === selectedStory.key))}
                />
              </label>
            </li>
          </ul>
        </div>
      )}
      {generating && <p>Generating test cases...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {acceptanceCriteria && (
        <div style={{ marginTop: 20 }}>
          <h3>Acceptance Criteria (Gherkin):</h3>
          <pre style={{ background: '#f4f4f4', padding: 10 }}>{acceptanceCriteria}</pre>
        </div>
      )}
      {technicalNotes && (
        <div style={{ marginTop: 20 }}>
          <h3>Technical Notes:</h3>
          <pre style={{ background: '#f4f4f4', padding: 10 }}>{technicalNotes}</pre>
        </div>
      )}
      {testCases && (
        <div style={{ marginTop: 20 }}>
          <h3>Test Cases:</h3>
          <pre style={{ background: '#f4f4f4', padding: 10 }}>{testCases}</pre>
        </div>
      )}
      <div style={{ marginTop: 20 }}>
        <button onClick={onBack} style={{ marginRight: 12, padding: '8px 16px' }}>
          Back
        </button>
        <button
          style={{ padding: '8px 16px' }}
          disabled={
            !selectedStory ||
            (selectedStory &&
              (!selectedStory.key ||
                (!stories.slice(0, 5).some(s => s.key === selectedStory.key) && selectedStory.key.trim() === ''))
            )
          }
          onClick={() => {
            if (selectedStory) {
              // If selectedStory is from top 5, pass as is
              // If "Other", try to find in all stories, else pass as custom
              const found = stories.find(s => s.key === selectedStory.key);
              if (found) {
                onNext([found], '', undefined, undefined);
              } else if (selectedStory.key) {
                onNext([{ key: selectedStory.key, summary: '' }], '', undefined, undefined);
              }
            }
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default StorySelectionPage;
