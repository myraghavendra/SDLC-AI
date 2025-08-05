import React, { useState, useEffect, useRef } from 'react';
import Header from './Header';
import Footer from './Footer';
import StorySelectionPage from './StorySelectionPage';
import DefectSummaryInfographic from './DefectSummaryInfographic';
import DefectDetailedReportInfographic from './DefectDetailedReportInfographic';
import DefectReportStoryInfographic from './DefectReportStoryInfographic';

// Import new infographic components
import RootCauseAnalysisInfographic from './RootCauseAnalysisInfographic';
import DefectDensityReportInfographic from './DefectDensityReportInfographic';
import DefectAgeingReportInfographic from './DefectAgeingReportInfographic';
import DefectDistributionInfographic from './DefectDistributionInfographic';
import DefectReopenRateInfographic from './DefectReopenRateInfographic';

// Import PDF generation libraries
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const DefectSummaryReportPage: React.FC = () => {
  const [jiraIssues, setJiraIssues] = useState<any[]>([]);
  const [defectSummary, setDefectSummary] = useState<string>('');
  const [defectSummaryData, setDefectSummaryData] = useState<any>(null);
  const [loadingIssues, setLoadingIssues] = useState<boolean>(false);
  const [loadingSummary, setLoadingSummary] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [jiraFilterId, setJiraFilterId] = useState<string>('');
  const [analysis, setAnalysis] = useState<string>('');
  const [jira_url, setjira_url] = useState('');
  // New state for detailed reports from backend
  const [detailedReports, setDetailedReports] = useState<{ [key: string]: string }>({});
  const [loadingReports, setLoadingReports] = useState<boolean>(false);

  // New state for project keys dropdown
  const [projectKeys, setProjectKeys] = useState<{ key: string; name: string }[]>([]);
  const [selectedProjectKey, setSelectedProjectKey] = useState<string>('');

  // New state for progress bar and tool selection
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedTools, setSelectedTools] = useState<{ jira: boolean; rally: boolean; testrail: boolean }>({
    jira: false,
    rally: false,
    testrail: false,
  });

  // Refs for PDF generation
  const summaryRef = useRef<HTMLDivElement>(null);
  const rcaRef = useRef<HTMLDivElement>(null);
  const densityRef = useRef<HTMLDivElement>(null);
  const ageingRef = useRef<HTMLDivElement>(null);
  const distributionRef = useRef<HTMLDivElement>(null);
  const reopenRef = useRef<HTMLDivElement>(null);

  const fetchJiraIssues = async () => {
    setLoadingIssues(true);
    setLoadingSummary(true);
    const configResponse = await fetch('/api/getJiraConfig');
    const configData = await configResponse.json();
    const jira_url = configData.jira_url;
    const project_key = configData.project_key;
    // Removed debug console.log statements
    // console.log("jira urls is ", jira_url);
    // console.log("jira project_key is ", project_key);

    setError('');
    try {
      const response = await fetch('/api/getStoriesByFilter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool: 'jira', jira_url: jira_url, filter_id: jiraFilterId, project_key: selectedProjectKey }),
      });
      const data = await response.json();
      console.log('data is ', data);
      console.log('response is ', response);
      if (data.error) {
        setError(data.error);
      } else {
        setJiraIssues(data.issues || []);
        setAnalysis(data.analysis || '');
        
        // Use the detailed reports data from getStoriesByFilter response
        if (data.detailedReports) {
          setDetailedReports(data.detailedReports);
          
          // Set defect summary data from the response
          setDefectSummaryData({
            projectName: selectedProjectKey,
            totalDefects: data.totalDefects || 0,
            statusBreakdown: data.statusBreakdown || {},
            priorityBreakdown: data.priorityBreakdown || {},
            analysis: data.analysis || ''
          });
          
          // Create summary text
          let summary = `Defect Summary Report for ${selectedProjectKey}\n\n`;
          summary += `Total Defects: ${data.totalDefects || 0}\n\n`;
          if (data.statusBreakdown) {
            summary += "Status Breakdown:\n";
            for (const [status, count] of Object.entries(data.statusBreakdown)) {
              summary += `- ${status}: ${count}\n`;
            }
            summary += "\n";
          }
          if (data.priorityBreakdown) {
            summary += "Priority Breakdown:\n";
            for (const [priority, count] of Object.entries(data.priorityBreakdown)) {
              summary += `- ${priority}: ${count}\n`;
            }
            summary += "\n";
          }
          if (data.analysis) {
            summary += "AI Analysis:\n" + data.analysis;
          }
          setDefectSummary(summary);
        } else if (data.issues && data.issues.length > 0) {
          // Fallback to fetching defect summary report if detailedReports is not available
          try {
            setLoadingReports(true);
            const defectResponse = await fetch('/api/defectSummaryReport', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ project_name: selectedProjectKey }),
            });
            const defectData = await defectResponse.json();
            if (defectData.error) {
              setError(defectData.error);
            } else {
              if (defectData.result) {
                // Old format
                setDefectSummary(defectData.result);
                setDefectSummaryData({
                  projectName: selectedProjectKey,
                  totalDefects: 0,
                  statusBreakdown: {},
                  priorityBreakdown: {},
                  analysis: defectData.result
                });
                setDetailedReports({});
              } else {
                setDefectSummaryData({
                  projectName: selectedProjectKey,
                  totalDefects: defectData.totalDefects || 0,
                  statusBreakdown: defectData.statusBreakdown || {},
                  priorityBreakdown: defectData.priorityBreakdown || {},
                  analysis: defectData.analysis || ''
                });
                let summary = `Defect Summary Report for ${selectedProjectKey}\n\n`;
                summary += `Total Defects: ${defectData.totalDefects || 0}\n\n`;
                if (defectData.statusBreakdown) {
                  summary += "Status Breakdown:\n";
                  for (const [status, count] of Object.entries(defectData.statusBreakdown)) {
                    summary += `- ${status}: ${count}\n`;
                  }
                  summary += "\n";
                }
                if (defectData.priorityBreakdown) {
                  summary += "Priority Breakdown:\n";
                  for (const [priority, count] of Object.entries(defectData.priorityBreakdown)) {
                    summary += `- ${priority}: ${count}\n`;
                  }
                  summary += "\n";
                }
                if (defectData.analysis) {
                  summary += "AI Analysis:\n" + defectData.analysis;
                }
                setDefectSummary(summary);
                setDetailedReports(defectData.detailedReports || {});
              }
            }
          } catch (defectErr) {
            setError('Failed to fetch defect summary report');
          } finally {
            setLoadingReports(false);
          }
        }
      }
    } catch (err) {
      setError('Failed to fetch Jira issues');
    } finally {
      setLoadingIssues(false);
      setLoadingSummary(false);
    }
  };

  // Handler for checkbox changes
  const handleToolChange = (tool: 'jira' | 'rally' | 'testrail') => {
    setSelectedTools(prev => ({
      ...prev,
      [tool]: !prev[tool],
    }));
  };

  // Handler for next step button
  const handleNextStep = () => {
    if (currentStep === 1) {
      // Validate at least one tool selected
      if (!selectedTools.jira && !selectedTools.rally && !selectedTools.testrail) {
        setError('Please select at least one tool to proceed.');
        return;
      }
      setError('');
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // If Jira selected, validate Jira Filter ID
      if (selectedTools.jira && !jiraFilterId.trim()) {
        setError('Please enter Jira Filter ID.');
        return;
      }
      setError('');
      setCurrentStep(3);
      // Trigger fetching issues and defect summary for Jira if selected
      if (selectedTools.jira) {
        fetchJiraIssues();
      }
      // For Rally and TestRail, placeholders or future implementation
    }
  };

  // Handler for previous step button
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setError('');
      setCurrentStep(currentStep - 1);
    }
  };

  // Function to generate and download PDF
  const generatePDF = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Add cover page
    pdf.setFontSize(22);
    pdf.text('Defect Summary Report', pdfWidth / 2, 80, { align: 'center' });
    pdf.setFontSize(16);
    pdf.text(selectedProjectKey ? `Project: ${selectedProjectKey}` : 'Project: Not Selected', pdfWidth / 2, 100, { align: 'center' });
    pdf.setFontSize(12);
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pdfWidth / 2, 120, { align: 'center' });
    
    // Add page numbers
    pdf.setFontSize(10);
    pdf.text('Page 1', pdfWidth - 20, pdfHeight - 10);
    
    // Add Defect Summary as infographic image
    if (summaryRef.current) {
      pdf.addPage();
      pdf.setFontSize(18);
      pdf.text('Defect Summary', 10, 15);
      try {
        // Wait a short delay to ensure rendering
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Capture the summary infographic element as canvas
        const canvas = await html2canvas(summaryRef.current, {
          scale: 5,
          useCORS: true,
          logging: true,
          backgroundColor: '#ffffff',
          scrollX: 0,
          scrollY: -window.scrollY,
          windowWidth: document.documentElement.offsetWidth,
          windowHeight: document.documentElement.offsetHeight
        });
        
        // Convert canvas to image
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pdfWidth - 20;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        // Add image to PDF with page breaks if needed
        let position = 25;
        if (imgHeight > pdfHeight - 30) {
          let remainingHeight = imgHeight;
          while (remainingHeight > 0) {
            if (position > 25) {
              pdf.addPage();
            }
            const heightToUse = Math.min(remainingHeight, pdfHeight - 30);
            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, heightToUse);
            remainingHeight -= heightToUse;
            position = 25;
          }
        } else {
          pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        }
      } catch (error) {
        console.error('Error capturing Defect Summary:', error);
        pdf.setFontSize(12);
        pdf.text('Failed to capture Defect Summary infographic', 10, 35);
      }
      
      // Add page number
      let pageCount = pdf.getNumberOfPages();
      pdf.setPage(pageCount);
      pdf.setFontSize(10);
      pdf.text(`Page ${pageCount}`, pdfWidth - 20, pdfHeight - 10);
    }
    
    // Add other infographic sections as images
    const elementsToCapture = [
      { ref: rcaRef, title: 'Root Cause Analysis (RCA)' },
      { ref: densityRef, title: 'Defect Density Report' },
      { ref: ageingRef, title: 'Defect Ageing Report' },
      { ref: distributionRef, title: 'Defect Distribution by Assignee/Team' },
      { ref: reopenRef, title: 'Defect Reopen Rate' }
    ];
    
    for (let i = 0; i < elementsToCapture.length; i++) {
      const { ref, title } = elementsToCapture[i];
      if (ref.current) {
        pdf.addPage();
        pdf.setFontSize(18);
        pdf.text(title, 10, 15);
        
        try {
          // Wait a short delay to ensure rendering
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Capture the element as canvas with improved options
          const canvas = await html2canvas(ref.current, {
            scale: 3,
            useCORS: true,
            logging: true,
            backgroundColor: '#ffffff',
            scrollX: 0,
            scrollY: -window.scrollY,
            windowWidth: document.documentElement.offsetWidth,
            windowHeight: document.documentElement.offsetHeight
          });
          
          // Convert canvas to image
          const imgData = canvas.toDataURL('image/png');
          const imgWidth = pdfWidth - 20;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          
          // Add image to PDF with page breaks if needed
          let position = 25;
          if (imgHeight > pdfHeight - 30) {
            let remainingHeight = imgHeight;
            while (remainingHeight > 0) {
              if (position > 25) {
                pdf.addPage();
              }
              const heightToUse = Math.min(remainingHeight, pdfHeight - 30);
              pdf.addImage(imgData, 'PNG', 10, position, imgWidth, heightToUse);
              remainingHeight -= heightToUse;
              position = 25;
            }
          } else {
            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
          }
        } catch (error) {
          console.error(`Error capturing ${title}:`, error);
          pdf.setFontSize(12);
          pdf.text(`Failed to capture ${title}`, 10, 35);
        }
        
        // Add page number
        const pageCount = pdf.getNumberOfPages();
        pdf.setPage(pageCount);
        pdf.setFontSize(10);
        pdf.text(`Page ${pageCount}`, pdfWidth - 20, pdfHeight - 10);
      }
    }
    
    // Save the PDF
    pdf.save(`DefectSummaryReport_${selectedProjectKey || 'Project'}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  useEffect(() => {
    // Removed automatic call to defectSummaryReport on component mount

    // Fetch Jira projects for project_key dropdown
    const fetchJiraProjects = async () => {
      try {
        const response = await fetch('/api/getJiraProjects');
        const data = await response.json();
        if (data.projects) {
          setProjectKeys(data.projects);
          if (data.projects.length > 0) {
            setSelectedProjectKey(data.projects[0].key);
          }
        } else if (data.error) {
          setError(data.error);
        }
      } catch (err) {
        setError('Failed to fetch Jira projects');
      }
    };

    fetchJiraProjects();
  }, []);

  return (
    <>
      <Header />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: 24, fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Data Analyst Agent</h2>

        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

        {/* Progress Bar */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32 }}>
          {[
            { label: 'Select Tools' },
            { label: 'Configure Filters' },
            { label: 'Analyze Defects' },
          ].map((stage, idx) => {
            const active = currentStep === idx + 1;
            const completed = currentStep > idx + 1;
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
                {idx < 2 && (
                  <div style={{ flex: 1, height: 4, background: completed ? '#4caf50' : '#e0e0e0' }} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Step 1: Tool Selection */}
        {currentStep === 1 && (
          <section>
            <h3>Select Tools</h3>
            <label style={{ display: 'block', marginBottom: 8 }}>
              <input
                type="checkbox"
                checked={selectedTools.jira}
                onChange={() => handleToolChange('jira')}
              />{' '}
              Jira
            </label>
            <label style={{ display: 'block', marginBottom: 8 }}>
              <input
                type="checkbox"
                checked={selectedTools.rally}
                onChange={() => handleToolChange('rally')}
                disabled
              />{' '}
              Rally (Coming Soon)
            </label>
            <label style={{ display: 'block', marginBottom: 8 }}>
              <input
                type="checkbox"
                checked={selectedTools.testrail}
                onChange={() => handleToolChange('testrail')}
                disabled
              />{' '}
              TestRail (Coming Soon)
            </label>
            <button onClick={handleNextStep} style={{ marginTop: 16, padding: '8px 16px' }}>
              Next
            </button>
          </section>
        )}

        {/* Step 2: Configure Filters */}
        {currentStep === 2 && (
          <section>
            <h3>Configure Filters</h3>
            {selectedTools.jira && (
              <>
                <h4>Jira Filter ID</h4>
                <input
                  type="text"
                  value={jiraFilterId}
                  onChange={(e) => setJiraFilterId(e.target.value)}
                  placeholder="Enter Jira Filter ID"
                  style={{ padding: 8, width: '100%', maxWidth: 300, marginBottom: 12 }}
                />
                <h4>Jira Project Key</h4>
                <select
                  value={selectedProjectKey}
                  onChange={(e) => setSelectedProjectKey(e.target.value)}
                  style={{ padding: 8, width: '100%', maxWidth: 300, marginBottom: 12 }}
                >
                  {projectKeys.map((project) => (
                    <option key={project.key} value={project.key}>
                      {project.name} ({project.key})
                    </option>
                  ))}
                </select>
              </>
            )}
            {/* Placeholder for Rally and TestRail filters if needed */}
            <div>
              <button onClick={handlePrevStep} style={{ padding: '8px 16px', marginRight: 8 }}>
                Back
              </button>
              <button onClick={handleNextStep} style={{ padding: '8px 16px' }}>
                Next
              </button>
            </div>
          </section>
        )}

        {/* Step 3: Analyze Defects */}
        {currentStep === 3 && (
          <>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
              <button 
                onClick={generatePDF} 
                style={{ 
                  padding: '10px 20px', 
                  backgroundColor: '#4a90e2', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px', 
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                Download PDF Report
              </button>
            </div>
            <section style={{ marginTop: 32 }}>
              <h3>Defect Reports</h3>
              {loadingSummary || loadingReports ? (
                <p>Loading defect reports...</p>
              ) : (
                <React.Fragment>
                  {/* Defect Summary Infographic */}
                  <div ref={summaryRef}>
                    {defectSummaryData && <DefectSummaryInfographic data={defectSummaryData} />}
                  </div>
                  
                  {/* Enhanced Infographic Reports */}
                  {detailedReports && Object.keys(detailedReports).length > 0 && (
                    <React.Fragment>
                      <div ref={rcaRef}>
                        {detailedReports["Root Cause Analysis (RCA)"] && (
                          <RootCauseAnalysisInfographic 
                            content={detailedReports["Root Cause Analysis (RCA)"]} 
                          />
                        )}
                      </div>
                      <div ref={densityRef}>
                        {detailedReports["Defect Density Report"] && (
                          <DefectDensityReportInfographic 
                            content={detailedReports["Defect Density Report"]} 
                          />
                        )}
                      </div>
                      <div ref={ageingRef}>
                        {detailedReports["Defect Ageing Report"] && (
                          <DefectAgeingReportInfographic 
                            content={detailedReports["Defect Ageing Report"]} 
                          />
                        )}
                      </div>
                      <div ref={distributionRef}>
                        {detailedReports["Defect Distribution by Assignee/Team"] && (
                          <DefectDistributionInfographic 
                            content={detailedReports["Defect Distribution by Assignee/Team"]} 
                          />
                        )}
                      </div>
                      <div ref={reopenRef}>
                        {detailedReports["Defect Reopen Rate"] && (
                          <DefectReopenRateInfographic 
                            content={detailedReports["Defect Reopen Rate"]} 
                          />
                        )}
                      </div>
                    </React.Fragment>
                  )}
                </React.Fragment>
              )}
            </section>
            {/* End of defect reports section */}
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default DefectSummaryReportPage;