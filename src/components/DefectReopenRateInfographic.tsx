import React from 'react';

interface DefectReopenRateInfographicProps {
  content: string;
}

const DefectReopenRateInfographic: React.FC<DefectReopenRateInfographicProps> = ({ content }) => {
  // Parse the content to extract key information
  const parseContent = (text: string) => {
    // Extract reopen rate information
    const rateMatch = text.match(/([\d.]+)%/);
    const rate = rateMatch ? parseFloat(rateMatch[1]) : 0;
    
    // Extract reasons for reopen
    const reasonRegex = /-\s*(.*?)(?=\n-|$)/g;
    const reasons: string[] = [];
    
    let match;
    while ((match = reasonRegex.exec(text)) !== null) {
      reasons.push(match[1]);
    }
    
    return { rate, reasons };
  };

  const { rate, reasons } = parseContent(content);
  
  // Color coding for rate
  const getRateColor = (rate: number) => {
    if (rate > 10) return '#f44336'; // Red - High
    if (rate > 5) return '#ff9800'; // Orange - Medium
    return '#4caf50'; // Green - Low
  };
  
  // Get rate level for styling
  const getRateLevel = (rate: number) => {
    if (rate > 10) return 'High';
    if (rate > 5) return 'Medium';
    return 'Low';
  };

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      padding: '24px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      marginBottom: '24px'
    }}>
      <h3 style={{
        color: '#2c3e50',
        borderBottom: '2px solid #3498db',
        paddingBottom: '8px',
        marginBottom: '20px',
        fontSize: '22px'
      }}>
        Defect Reopen Rate
      </h3>
      
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '24px'
      }}>
        <div style={{
          position: 'relative',
          width: '200px',
          height: '200px'
        }}>
          {/* Circular progress bar */}
          <div style={{
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: '12px solid #f0f0f0',
            boxSizing: 'border-box'
          }}></div>
          <div style={{
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: `12px solid ${getRateColor(rate)}`,
            boxSizing: 'border-box',
            clipPath: `inset(0 ${100 - rate}% 0 0)`
          }}></div>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: getRateColor(rate)
            }}>
              {rate}%
            </div>
            <div style={{
              fontSize: '16px',
              color: '#666'
            }}>
              Reopen Rate
            </div>
          </div>
        </div>
      </div>
      
      <div style={{
        textAlign: 'center',
        marginBottom: '24px'
      }}>
        <span style={{
          padding: '6px 16px',
          borderRadius: '20px',
          backgroundColor: `${getRateColor(rate)}20`,
          color: getRateColor(rate),
          fontWeight: 'bold',
          fontSize: '18px'
        }}>
          {getRateLevel(rate)} Reopen Rate
        </span>
      </div>
      
      {reasons.length > 0 ? (
        <>
          <div style={{
            marginBottom: '24px'
          }}>
            <h4 style={{
              color: '#333',
              marginBottom: '16px'
            }}>Top Reasons for Reopen</h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '16px'
            }}>
              {reasons.map((reason, index) => (
                <div key={index} style={{
                  border: '1px solid #eee',
                  borderRadius: '8px',
                  padding: '16px',
                  backgroundColor: '#fafafa',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: getRateColor(rate),
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    marginRight: '12px'
                  }}>
                    {index + 1}
                  </div>
                  <div style={{
                    color: '#555'
                  }}>
                    {reason}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div style={{
            padding: '16px',
            backgroundColor: '#e3f2fd',
            borderRadius: '8px',
            borderLeft: '4px solid #2196f3'
          }}>
            <h4 style={{
              margin: '0 0 10px 0',
              color: '#0d47a1'
            }}>Recommendations</h4>
            <ul style={{
              margin: '0',
              paddingLeft: '20px',
              color: '#333'
            }}>
              <li>Improve communication between development and testing teams</li>
              <li>Implement stricter acceptance criteria for defect fixes</li>
              <li>Conduct root cause analysis for frequently reopened defects</li>
              <li>Provide additional training for complex defect resolutions</li>
            </ul>
          </div>
        </>
      ) : (
        <div style={{
          backgroundColor: '#f8f9fa',
          border: '1px dashed #ddd',
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center',
          color: '#666'
        }}>
          <p>No defect reopen rate data available</p>
          <pre style={{
            textAlign: 'left',
            whiteSpace: 'pre-wrap',
            fontSize: '12px',
            marginTop: '10px',
            backgroundColor: '#fff',
            padding: '10px',
            borderRadius: '4px'
          }}>
            {content}
          </pre>
        </div>
      )}
    </div>
  );
};

export default DefectReopenRateInfographic;
