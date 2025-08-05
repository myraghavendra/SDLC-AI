import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

interface Story {
  key: string;
  summary: string;
}

const RequirementAnalyserPage: React.FC = () => {
  // Removed debug console.log statement
  // console.log("requirement analyser page");
  const [integrationOptions, setIntegrationOptions] = useState<string[]>([]);
  const [selectedIntegration, setSelectedIntegration] = useState<string>('');
  const [jiraStories, setJiraStories] = useState<Story[]>([]);
  const [jiraStoriesResponse, setJiraStoriesResponse] = useState<any>(null);
  const [manualStoryKey, setManualStoryKey] = useState('');
  const [selectedStoryKey, setSelectedStoryKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [jiraAuthLoading, setJiraAuthLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    classification: string;
    extraction: string[];
    gap_conflict_analysis?: string;
    compliance_security?: string;
    visualization?: string;
    change_impact_analysis?: string;
    story_score: number;
    story_score_justification: string;
    requirement_classification?: string;
  } | null>(null);

  // State for expand/collapse sections
  const [expandedSections, setExpandedSections] = useState<{
    storyScore: boolean;
    requirementClassification: boolean;
    gapConflictAnalysis: boolean;
    complianceSecurity: boolean;
    visualization: boolean;
    changeImpactAnalysis: boolean;
  }>({
    storyScore: true,
    requirementClassification: true,
    gapConflictAnalysis: false,
    complianceSecurity: false,
    visualization: false,
    changeImpactAnalysis: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState('');
  const [jiraUrl, setJiraUrl] = useState<string>('');
  const [projectKey, setProjectKey] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    setIntegrationOptions(["Jira", "Rally", "TestRail"]);
    setLoading(false);
  }, []);

  const handleIntegrationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedIntegration(e.target.value);
    setJiraStories([]);
    setError("");
    setSelectedStoryKey('');
    setManualStoryKey('');
    setAnalysisResult(null);
    setAnalysisError('');
  };

  const handleNextStep = async () => {
    if (!selectedIntegration) return;
    setStep(2);
    if (selectedIntegration === 'Jira') {
      setJiraAuthLoading(true);
      try {
        const res = await fetch('/api/getJiraConfig');
        if (!res.ok) throw new Error('Jira authentication failed');
        setJiraAuthLoading(false);
        setStep(3);
        fetchJiraStories();
      } catch (err: any) {
        setError(err.message || 'Jira authentication failed');
        setJiraAuthLoading(false);
      }
    } else {
      setStep(3); // For Rally/TestRail, skip auth and go to results
    }
  };

  // Add a function to advance to step 4 after analysis or other final step
  const handleAdvanceToFinalStep = () => {
    setStep(4);
  };

  const fetchJiraStories = async () => {
    console.log("fetchstories")
    setError("");
    try {
      // Fetch Jira config first
      const configRes = await fetch('/api/getJiraConfig');
      if (!configRes.ok) throw new Error('Failed to fetch Jira config');
      const config = await configRes.json();
      setJiraUrl(config.jira_url);
      setProjectKey(config.project_key);
      const body = {
        tool: 'jira',
        jira_url: config.jira_url,
        project_key: config.project_key,
      };
      const res = await fetch('/api/getStories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setJiraStoriesResponse(data); // Store the full response
      if (!res.ok) {
        setError(data.error || 'Failed to fetch stories from backend.');
        setJiraStories([]);
        return;
      }
      if (data.error) {
        setError(data.error);
        setJiraStories([]);
        return;
      }
      setJiraStories((data.stories || []).slice(0, 5));
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while fetching stories.');
      setJiraStories([]);
      setJiraStoriesResponse(null);
    }
  };

  const handleStorySelect = (key: string) => {
    setSelectedStoryKey(key);
    setManualStoryKey('');
    setAnalysisResult(null);
    setAnalysisError('');
  };

  const handleManualKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setManualStoryKey(e.target.value);
    setSelectedStoryKey('manual');
    setAnalysisResult(null);
    setAnalysisError('');
  };

  const handleProceed = async () => {
    let storyKey = selectedStoryKey === 'manual' ? manualStoryKey : selectedStoryKey;
    if (!storyKey) return;

    setAnalysisLoading(true);
    setAnalysisError('');
    setAnalysisResult(null);

    // Fetch story text for analysis
    let storyText = '';
    try {
      if (selectedIntegration === 'Jira' && jiraStoriesResponse && jiraStoriesResponse.stories) {
        const found = jiraStoriesResponse.stories.find((s: any) => s.key === storyKey);
        if (found) {
          if (typeof found.fields?.description === 'string') {
            storyText = found.fields.description;
          } else if (found.fields?.description?.content) {
            storyText = found.fields.description.content
              .map((block: any) =>
                block.content ? block.content.map((c: any) => c.text).join('') : ''
              ).join('\n');
          } else {
            storyText = found.summary;
          }
        }
      }
      // Call backend API to analyze requirement
      const res = await fetch('/api/analyzeRequirement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tool: selectedIntegration.toLowerCase(), 
          story_key: storyKey, 
          story_text: storyText,
          prompt: "Evaluate the clarity, testability, completeness, and business alignment of this user story. Give a quality score from 0 to 100 and justify it briefly. If the selected story is changed or delayed, predict the downstream impact on modules, interfaces, or test cases. Provide specific recommendations."
        })
      });
      if (!res.ok) throw new Error('Analysis failed');
      const data = await res.json();
      console.log("Analysis result received:", data);
      setAnalysisResult(data);
      // Advance to step 4 and show progress bar stage 4
      handleAdvanceToFinalStep();
      // Store storyKey for navigation
      setPendingNavigationStoryKey(storyKey);
    } catch (e: any) {
      setAnalysisError(e.message || 'Error analyzing requirement');
    } finally {
      setAnalysisLoading(false);
    }
  };

  // New state to hold storyKey for navigation after step 4
  const [pendingNavigationStoryKey, setPendingNavigationStoryKey] = useState<string | null>(null);

  // Function to navigate to results page from step 4
  const handleNavigateToResults = () => {
    if (!pendingNavigationStoryKey) return;
    navigate(`/requirement-analysis/${pendingNavigationStoryKey}`, {
      state: {
        integration: selectedIntegration.toLowerCase(),
        jiraUrl,
        projectKey,
        analysisResult,  // pass analysisResult to results page
      },
    });
  };

  // Progress bar rendering
  const renderProgressBar = () => {
    const stages = [
      { label: 'Select Tool' },
      { label: 'Authenticate & Fetch Stories' },
      { label: 'Display Results' },
      { label: 'Final Step' }, // Added 4th stage label
    ];
    return (
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32 }}>
        {stages.map((stage, idx) => {
          const active = step === idx + 1;
          const completed = step > idx + 1;
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
              }}>{idx + 1}</div>
              {idx < stages.length - 1 && (
                <div style={{ flex: 1, height: 4, background: completed ? '#4caf50' : '#e0e0e0' }} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  // Render 4 progress bars for clarity, testability, completeness, business alignment
  const renderQualityProgressBars = () => {
    if (!analysisResult) return null;
    // Use combined story_score for all bars as individual scores are not available
    const score = analysisResult.story_score || 0;
    const justification = analysisResult.story_score_justification || '';
    if (score === 0) {
      return (
        <div style={{ marginTop: 32 }}>
          <h3>Story Quality Scores</h3>
          <p>No score available yet. Please ensure the backend returns a valid score.</p>
        </div>
      );
    }
    const bars = [
      { label: 'Clarity', value: score },
      { label: 'Testability', value: score },
      { label: 'Completeness', value: score },
      { label: 'Business Alignment', value: score },
    ];
    return (
      <div style={{ marginTop: 32 }}>
        <h3>Story Quality Scores</h3>
        {bars.map(bar => (
          <div key={bar.label} style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 4 }}>{bar.label}</div>
            <div style={{ width: '100%', background: '#eee', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ width: `${bar.value}%`, background: '#4caf50', height: 20 }} />
            </div>
          </div>
        ))}
        <div style={{ marginTop: 24 }}>
          <h4>Overall Story Score (Clarity & Readiness Index)</h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 200, background: '#eee', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ width: `${score}%`, background: '#4caf50', height: 20 }} />
            </div>
            <span style={{ fontWeight: 'bold' }}>{score}/100</span>
          </div>
          <div style={{ marginTop: 8 }}>{justification}</div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Header />
      <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
        <h2>Requirement Analyser</h2>
        {renderProgressBar()}
        {loading && <div>Loading integration options...</div>}
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {/* Step 1: Select Tool */}
        {step === 1 && !loading && !error && (
          <div>
            <h4>Select Integration:</h4>
            {integrationOptions.map(opt => (
              <label key={opt} style={{ marginRight: 16 }}>
                <input
                  type="radio"
                  name="integration"
                  value={opt}
                  checked={selectedIntegration === opt}
                  onChange={handleIntegrationChange}
                />{' '}
                {opt}
              </label>
            ))}
            <div style={{ marginTop: 24 }}>
              <button onClick={handleNextStep} disabled={!selectedIntegration}>
                Next
              </button>
            </div>
          </div>
        )}
        {/* Step 2: Authenticate Jira (if selected) */}
        {step === 2 && selectedIntegration === 'Jira' && (
          <div style={{ marginTop: 32 }}>
            <h4>Authenticating Jira...</h4>
            {jiraAuthLoading && <div>Authenticating with Jira, please wait...</div>}
            {error && <div style={{ color: 'red' }}>{error}</div>}
          </div>
        )}
        {/* Step 3: Fetch and display stories */}
        {step === 3 && selectedIntegration === 'Jira' && (
          <div style={{ marginTop: 24 }}>
            <div style={{ marginTop: 24 }}>
              <h4>Select a User Story:</h4>
              {jiraStories.length > 0 ? (
                <>
                  {jiraStories.map(story => (
                    <div key={story.key}>
                      <label>
                        <input
                          type="radio"
                          name="story"
                          value={story.key}
                          checked={selectedStoryKey === story.key}
                          onChange={() => handleStorySelect(story.key)}
                        />{' '}
                        {story.key}: {story.summary}
                      </label>
                    </div>
                  ))}
                  <div style={{ marginTop: 8 }}>
                    <label>
                      <input
                        type="radio"
                        name="story"
                        value="manual"
                        checked={selectedStoryKey === 'manual'}
                        onChange={() => setSelectedStoryKey('manual')}
                      />{' '}
                      Enter user story key manually:
                      <input
                        type="text"
                        value={manualStoryKey}
                        onChange={handleManualKeyChange}
                        style={{ marginLeft: 8, width: 120 }}
                        disabled={selectedStoryKey !== 'manual'}
                      />
                    </label>
                  </div>
                  <button style={{ marginTop: 16 }} onClick={handleProceed} disabled={!selectedStoryKey || (selectedStoryKey === 'manual' && !manualStoryKey) || analysisLoading}>
                    {analysisLoading ? 'Analyzing...' : 'Analyse Selected Story'}
                  </button>
                </>
              ) : (
                <div>Loading stories...</div>
              )}
              {/* Removed Full API Response block here */}
            </div>
            {analysisError && <div style={{ color: 'red', marginTop: 16 }}>{analysisError}</div>}

            {/* Story Score Section */}
            {analysisResult && (
              <div style={{ marginTop: 32 }}>
                <h3>
                  <button
                    onClick={() => toggleSection('storyScore')}
                    style={{ marginRight: 8 }}
                    aria-expanded={expandedSections.storyScore}
                    aria-controls="storyScoreContent"
                  >
                    {expandedSections.storyScore ? '▼' : '▶'}
                  </button>
                  Story Score (Clarity & Readiness Index)
                </h3>
                {expandedSections.storyScore && (
                  <div id="storyScoreContent">
                    {renderQualityProgressBars()}
                  </div>
                )}
              </div>
            )}

            {/* Requirement Classification & Extraction Section */}
            {analysisResult && analysisResult.requirement_classification && (
              <div style={{ marginTop: 32 }}>
                <h3>
                  <button
                    onClick={() => toggleSection('requirementClassification')}
                    style={{ marginRight: 8 }}
                    aria-expanded={expandedSections.requirementClassification}
                    aria-controls="requirementClassificationContent"
                  >
                    {expandedSections.requirementClassification ? '▼' : '▶'}
                  </button>
                  Requirement Classification & Extraction
                </h3>
                {expandedSections.requirementClassification && (
                  <pre
                    id="requirementClassificationContent"
                    style={{ background: '#f4f4f4', padding: 12, borderRadius: 4, whiteSpace: 'pre-wrap' }}
                  >
                    {analysisResult.requirement_classification}
                  </pre>
                )}
              </div>
            )}

            {/* Gap & Conflict Analysis Section */}
            {analysisResult && analysisResult.gap_conflict_analysis && (
              <div style={{ marginTop: 32 }}>
                <h3>
                  <button
                    onClick={() => toggleSection('gapConflictAnalysis')}
                    style={{ marginRight: 8 }}
                    aria-expanded={expandedSections.gapConflictAnalysis}
                    aria-controls="gapConflictAnalysisContent"
                  >
                    {expandedSections.gapConflictAnalysis ? '▼' : '▶'}
                  </button>
                  Gap & Conflict Analysis
                </h3>
                {expandedSections.gapConflictAnalysis && (
                  <pre
                    id="gapConflictAnalysisContent"
                    style={{ background: '#f4f4f4', padding: 12, borderRadius: 4, whiteSpace: 'pre-wrap' }}
                  >
                    {analysisResult.gap_conflict_analysis}
                  </pre>
                )}
              </div>
            )}

            {/* Compliance & Security Checks Section */}
            {analysisResult && analysisResult.compliance_security && (
              <div style={{ marginTop: 32 }}>
                <h3>
                  <button
                    onClick={() => toggleSection('complianceSecurity')}
                    style={{ marginRight: 8 }}
                    aria-expanded={expandedSections.complianceSecurity}
                    aria-controls="complianceSecurityContent"
                  >
                    {expandedSections.complianceSecurity ? '▼' : '▶'}
                  </button>
                  Compliance & Security Checks
                </h3>
                {expandedSections.complianceSecurity && (
                  <pre
                    id="complianceSecurityContent"
                    style={{ background: '#f4f4f4', padding: 12, borderRadius: 4, whiteSpace: 'pre-wrap' }}
                  >
                    {analysisResult.compliance_security}
                  </pre>
                )}
              </div>
            )}

            {/* Requirement Visualization Section */}
            {analysisResult && analysisResult.visualization && (
              <div style={{ marginTop: 32 }}>
                <h3>
                  <button
                    onClick={() => toggleSection('visualization')}
                    style={{ marginRight: 8 }}
                    aria-expanded={expandedSections.visualization}
                    aria-controls="visualizationContent"
                  >
                    {expandedSections.visualization ? '▼' : '▶'}
                  </button>
                  Requirement Visualization
                </h3>
                {expandedSections.visualization && (
                  <pre
                    id="visualizationContent"
                    style={{ background: '#f4f4f4', padding: 12, borderRadius: 4, whiteSpace: 'pre-wrap' }}
                  >
                    {analysisResult.visualization}
                  </pre>
                )}
              </div>
            )}

            {/* Change Impact Analysis Section */}
            {analysisResult && analysisResult.change_impact_analysis && (
              <div style={{ marginTop: 32 }}>
                <h3>
                  <button
                    onClick={() => toggleSection('changeImpactAnalysis')}
                    style={{ marginRight: 8 }}
                    aria-expanded={expandedSections.changeImpactAnalysis}
                    aria-controls="changeImpactAnalysisContent"
                  >
                    {expandedSections.changeImpactAnalysis ? '▼' : '▶'}
                  </button>
                  Change Impact Analysis
                </h3>
                {expandedSections.changeImpactAnalysis && (
                  <pre
                    id="changeImpactAnalysisContent"
                    style={{ background: '#f4f4f4', padding: 12, borderRadius: 4, whiteSpace: 'pre-wrap' }}
                  >
                    {analysisResult.change_impact_analysis}
                  </pre>
                )}
              </div>
            )}
          </div>
        )}
        {/* Step 3 for other tools (Rally, TestRail) - Placeholder */}
        {step === 3 && selectedIntegration !== 'Jira' && (
          <div style={{ marginTop: 32 }}>
            <h4>Results for {selectedIntegration}</h4>
            <div>Feature not implemented yet.</div>
          </div>
        )}
        {/* Step 4: Show final progress bar stage and navigate button */}
        {step === 4 && (
          <div style={{ marginTop: 32, textAlign: 'center' }}>
            <h4>Analysis Complete</h4>
            <p>The analysis is complete. You can now proceed to view the detailed results.</p>
            <button onClick={handleNavigateToResults}>View Analysis Results</button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default RequirementAnalyserPage;
