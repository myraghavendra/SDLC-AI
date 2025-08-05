import React, { useState, useRef } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface AnalysisResult {
  story_score: number;
  story_score_justification: string;
  change_impact_analysis?: string;
  requirement_visualization?: string;
  compliance_security?: string;
  gap_conflict_analysis?: string;
  requirement_classification?: string;
  story_heading?: string; // optional heading if available
}

const RequirementAnalysisResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { storyKey } = useParams<{ storyKey: string }>();

  // The analysisResult is passed via location.state from RequirementAnalyserPage
  const analysisResult = location.state?.analysisResult as AnalysisResult | undefined;

  // Ref for the content to be exported as PDF
  const contentRef = useRef<HTMLDivElement>(null);

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
    requirementClassification: false,
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

  const handleDownloadPDF = () => {
    if (!contentRef.current) return;

    // Save current expanded state
    const prevExpandedSections = { ...expandedSections };

    // Expand all sections
    setExpandedSections({
      storyScore: true,
      requirementClassification: true,
      gapConflictAnalysis: true,
      complianceSecurity: true,
      visualization: true,
      changeImpactAnalysis: true,
    });

    // Wait for state update and DOM re-render
    setTimeout(() => {
      const input = contentRef.current;
      if (!input) return;

      // Add page-break CSS class to content before capture
      if (input) {
        const pageBreakElements = input.querySelectorAll('.page-break');
        pageBreakElements.forEach(el => {
          (el as HTMLElement).style.pageBreakAfter = 'always';
        });
      }

      html2canvas(input, { scale: 3, useCORS: true, scrollY: -window.scrollY }).then(canvas => {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const margin = 10; // 10mm margin
        const headerHeight = 10;
        const footerHeight = 10;
        const contentHeight = pdfHeight - headerHeight - footerHeight;

        const totalPages = Math.ceil(canvas.height / (contentHeight * (canvas.width / pdfWidth)));

        const addHeaderAndFooter = (pageNum: number, totalPages: number) => {
          pdf.setFontSize(12);
          pdf.text('Requirement Analysis Results', margin, 10);
          pdf.text(`Page ${pageNum} of ${totalPages}`, pdfWidth - margin - 30, pdfHeight - 10);
        };

        for (let pageNum = 0; pageNum < totalPages; pageNum++) {
          if (pageNum > 0) {
            pdf.addPage();
          }
          addHeaderAndFooter(pageNum + 1, totalPages);

          const canvasPage = document.createElement('canvas');
          canvasPage.width = canvas.width;
          canvasPage.height = contentHeight * (canvas.width / pdfWidth);

          const ctx = canvasPage.getContext('2d');
          if (ctx) {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvasPage.width, canvasPage.height);
            ctx.drawImage(
              canvas,
              0,
              pageNum * canvasPage.height,
              canvasPage.width,
              canvasPage.height,
              0,
              0,
              canvasPage.width,
              canvasPage.height
            );
          }

          const imgData = canvasPage.toDataURL('image/png');
          pdf.addImage(imgData, 'PNG', margin, headerHeight, pdfWidth - 2 * margin, contentHeight);
        }

        pdf.save(`Requirement_Analysis_Results_${storyKey || 'result'}.pdf`);

        // Restore previous expanded state
        setExpandedSections(prevExpandedSections);
      });
    }, 300); // delay to allow re-render
  };

  if (!analysisResult) {
    return (
      <>
        <Header />
        <div style={{ maxWidth: 900, margin: '0 auto', padding: 24, fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
          <div style={{ 
            backgroundColor: '#ffffff', 
            borderRadius: '12px', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            padding: '32px',
            marginBottom: '24px'
          }}>
            <h2 style={{ 
              color: '#2c3e50', 
              borderBottom: '2px solid #3498db', 
              paddingBottom: '16px',
              marginBottom: '24px'
            }}>
              Requirement Analysis Results
            </h2>
            <div style={{ 
              backgroundColor: '#f8f9fa', 
              border: '1px solid #e9ecef', 
              borderRadius: '8px', 
              padding: '24px', 
              textAlign: 'center' 
            }}>
              <p style={{ 
                fontSize: '18px', 
                color: '#6c757d', 
                marginBottom: '24px' 
              }}>
                No analysis results found for story key: <strong>{storyKey}</strong>
              </p>
              <button 
                onClick={() => navigate(-1)}
                style={{
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#007bff')}
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const { story_score, story_score_justification, change_impact_analysis, requirement_visualization, compliance_security, gap_conflict_analysis, requirement_classification, story_heading } = analysisResult;
  
  // Determine score color based on value
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#28a745'; // Green
    if (score >= 60) return '#ffc107'; // Yellow
    return '#dc3545'; // Red
  };
  
  // Determine score label based on value
  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  return (
    <>
      <Header />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
        <div style={{ 
          backgroundColor: '#ffffff', 
          borderRadius: '12px', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          padding: '32px',
          marginBottom: '24px'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            flexWrap: 'wrap', 
            gap: '16px',
            marginBottom: '24px'
          }}>
            <h2 style={{ 
              color: '#2c3e50', 
              margin: 0,
              fontSize: '28px'
            }}>
              {story_heading ? story_heading : `Requirement Analysis Results for Story: ${storyKey}`}
            </h2>
            <button 
              onClick={handleDownloadPDF}
              style={{
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                transition: 'background-color 0.2s',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#218838')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#28a745')}
            >
              Download PDF
            </button>
          </div>

          {/* Content to be exported as PDF */}
          <div ref={contentRef}>
            {/* Story Score Section */}
            <div style={{ 
              backgroundColor: '#f8f9fa', 
              borderRadius: '8px', 
              padding: '24px', 
              marginBottom: '24px',
              border: '1px solid #e9ecef'
            }}>
              <h3 
                style={{ 
                  margin: '0 0 16px 0', 
                  color: '#2c3e50', 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer' 
                }}
                onClick={() => toggleSection('storyScore')}
              >
                <span style={{ 
                  marginRight: '12px', 
                  fontSize: '18px', 
                  transition: 'transform 0.2s' 
                }}>
                  {expandedSections.storyScore ? '▼' : '▶'}
                </span>
                Story Score (Clarity & Readiness Index)
              </h3>
              {expandedSections.storyScore && (
                <div id="storyScoreContent">
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '24px', 
                    marginBottom: '24px',
                    flexWrap: 'wrap'
                  }}>
                    <div style={{ 
                      width: '100%', 
                      maxWidth: '400px',
                      background: '#e9ecef', 
                      borderRadius: '12px', 
                      overflow: 'hidden',
                      height: '32px'
                    }}>
                      <div
                        style={{
                          width: `${story_score}%`,
                          background: getScoreColor(story_score),
                          height: '100%',
                          transition: 'width 0.5s ease-in-out',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          paddingRight: '12px'
                        }}
                      >
                        <span style={{ 
                          color: 'white', 
                          fontWeight: 'bold', 
                          fontSize: '14px',
                          textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                        }}>
                          {story_score}%
                        </span>
                      </div>
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      minWidth: '100px'
                    }}>
                      <span style={{ 
                        fontWeight: 'bold', 
                        fontSize: '24px', 
                        color: getScoreColor(story_score)
                      }}>
                        {story_score}
                      </span>
                      <span style={{ 
                        fontSize: '14px', 
                        color: '#6c757d' 
                      }}>
                        {getScoreLabel(story_score)}
                      </span>
                    </div>
                  </div>
                  <div style={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e9ecef', 
                    borderRadius: '8px', 
                    padding: '20px',
                    whiteSpace: 'pre-wrap'
                  }}>
                    <h4 style={{ 
                      margin: '0 0 12px 0', 
                      color: '#495057' 
                    }}>
                      Score Justification
                    </h4>
                    <p style={{ 
                      margin: 0, 
                      color: '#495057', 
                      lineHeight: '1.6' 
                    }}>
                      {story_score_justification}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Change Impact Analysis Section */}
            {change_impact_analysis && (
              <div style={{ 
                backgroundColor: '#f8f9fa', 
                borderRadius: '8px', 
                padding: '24px', 
                marginBottom: '24px',
                border: '1px solid #e9ecef'
              }}>
                <h3 
                  style={{ 
                    margin: '0 0 16px 0', 
                    color: '#2c3e50', 
                    display: 'flex', 
                    alignItems: 'center', 
                    cursor: 'pointer' 
                  }}
                  onClick={() => toggleSection('changeImpactAnalysis')}
                >
                  <span style={{ 
                    marginRight: '12px', 
                    fontSize: '18px', 
                    transition: 'transform 0.2s' 
                  }}>
                    {expandedSections.changeImpactAnalysis ? '▼' : '▶'}
                  </span>
                  Change Impact Analysis
                </h3>
                {expandedSections.changeImpactAnalysis && (
                  <div id="changeImpactAnalysisContent" style={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e9ecef', 
                    borderRadius: '8px', 
                    padding: '20px',
                    whiteSpace: 'pre-wrap'
                  }}>
                    <p style={{ 
                      margin: 0, 
                      color: '#495057', 
                      lineHeight: '1.6' 
                    }}>
                      {change_impact_analysis}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Requirement Visualization Section */}
            {requirement_visualization && (
              <div style={{ 
                backgroundColor: '#f8f9fa', 
                borderRadius: '8px', 
                padding: '24px', 
                marginBottom: '24px',
                border: '1px solid #e9ecef'
              }}>
                <h3 
                  style={{ 
                    margin: '0 0 16px 0', 
                    color: '#2c3e50', 
                    display: 'flex', 
                    alignItems: 'center', 
                    cursor: 'pointer' 
                  }}
                  onClick={() => toggleSection('visualization')}
                >
                  <span style={{ 
                    marginRight: '12px', 
                    fontSize: '18px', 
                    transition: 'transform 0.2s' 
                  }}>
                    {expandedSections.visualization ? '▼' : '▶'}
                  </span>
                  Requirement Visualization
                </h3>
                {expandedSections.visualization && (
                  <div id="visualizationContent" style={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e9ecef', 
                    borderRadius: '8px', 
                    padding: '20px',
                    whiteSpace: 'pre-wrap'
                  }}>
                    <p style={{ 
                      margin: 0, 
                      color: '#495057', 
                      lineHeight: '1.6' 
                    }}>
                      {requirement_visualization}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Compliance & Security Checks Section */}
            {compliance_security && (
              <div style={{ 
                backgroundColor: '#f8f9fa', 
                borderRadius: '8px', 
                padding: '24px', 
                marginBottom: '24px',
                border: '1px solid #e9ecef'
              }}>
                <h3 
                  style={{ 
                    margin: '0 0 16px 0', 
                    color: '#2c3e50', 
                    display: 'flex', 
                    alignItems: 'center', 
                    cursor: 'pointer' 
                  }}
                  onClick={() => toggleSection('complianceSecurity')}
                >
                  <span style={{ 
                    marginRight: '12px', 
                    fontSize: '18px', 
                    transition: 'transform 0.2s' 
                  }}>
                    {expandedSections.complianceSecurity ? '▼' : '▶'}
                  </span>
                  Compliance & Security Checks
                </h3>
                {expandedSections.complianceSecurity && (
                  <div id="complianceSecurityContent" style={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e9ecef', 
                    borderRadius: '8px', 
                    padding: '20px',
                    whiteSpace: 'pre-wrap'
                  }}>
                    <p style={{ 
                      margin: 0, 
                      color: '#495057', 
                      lineHeight: '1.6' 
                    }}>
                      {compliance_security}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Gap & Conflict Analysis Section */}
            {gap_conflict_analysis && (
              <div style={{ 
                backgroundColor: '#f8f9fa', 
                borderRadius: '8px', 
                padding: '24px', 
                marginBottom: '24px',
                border: '1px solid #e9ecef'
              }}>
                <h3 
                  style={{ 
                    margin: '0 0 16px 0', 
                    color: '#2c3e50', 
                    display: 'flex', 
                    alignItems: 'center', 
                    cursor: 'pointer' 
                  }}
                  onClick={() => toggleSection('gapConflictAnalysis')}
                >
                  <span style={{ 
                    marginRight: '12px', 
                    fontSize: '18px', 
                    transition: 'transform 0.2s' 
                  }}>
                    {expandedSections.gapConflictAnalysis ? '▼' : '▶'}
                  </span>
                  Gap & Conflict Analysis
                </h3>
                {expandedSections.gapConflictAnalysis && (
                  <div id="gapConflictAnalysisContent" style={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e9ecef', 
                    borderRadius: '8px', 
                    padding: '20px',
                    whiteSpace: 'pre-wrap'
                  }}>
                    <p style={{ 
                      margin: 0, 
                      color: '#495057', 
                      lineHeight: '1.6' 
                    }}>
                      {gap_conflict_analysis}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Requirement Classification & Extraction Section */}
            {requirement_classification && (
              <div style={{ 
                backgroundColor: '#f8f9fa', 
                borderRadius: '8px', 
                padding: '24px', 
                marginBottom: '24px',
                border: '1px solid #e9ecef'
              }}>
                <h3 
                  style={{ 
                    margin: '0 0 16px 0', 
                    color: '#2c3e50', 
                    display: 'flex', 
                    alignItems: 'center', 
                    cursor: 'pointer' 
                  }}
                  onClick={() => toggleSection('requirementClassification')}
                >
                  <span style={{ 
                    marginRight: '12px', 
                    fontSize: '18px', 
                    transition: 'transform 0.2s' 
                  }}>
                    {expandedSections.requirementClassification ? '▼' : '▶'}
                  </span>
                  Requirement Classification & Extraction
                </h3>
                {expandedSections.requirementClassification && (
                  <div id="requirementClassificationContent" style={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e9ecef', 
                    borderRadius: '8px', 
                    padding: '20px',
                    whiteSpace: 'pre-wrap'
                  }}>
                    <p style={{ 
                      margin: 0, 
                      color: '#495057', 
                      lineHeight: '1.6' 
                    }}>
                      {requirement_classification}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            marginTop: '32px' 
          }}>
            <button 
              onClick={() => navigate(-1)}
              style={{
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                transition: 'background-color 0.2s',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#5a6268')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#6c757d')}
            >
              Back to Analysis
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RequirementAnalysisResultsPage;
