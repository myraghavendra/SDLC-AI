import React from 'react';

interface DefectDistributionInfographicProps {
  content: string;
}

const DefectDistributionInfographic: React.FC<DefectDistributionInfographicProps> = ({ content }) => {
  // Parse the content to extract key information
  const parseContent = (text: string) => {
    // Extract assignee/team information
    const assigneeRegex = /(\w+(?:\s+\w+)*):\s*(\d+)\s*defects?/g;
    const assignees: {name: string, count: number}[] = [];
    
    let match;
    while ((match = assigneeRegex.exec(text)) !== null) {
      assignees.push({
        name: match[1],
        count: parseInt(match[2], 10)
      });
    }
    
    return assignees;
  };

  const assignees = parseContent(content);
  
  // Calculate total defects
  const totalDefects = assignees.reduce((sum, assignee) => sum + assignee.count, 0);
  
  // Color palette for assignees
  const assigneeColors: Record<string, string> = {
    'default': '#9e9e9e'
  };
  
  // Generate colors for assignees
  const getAssigneeColor = (index: number) => {
    const colors = [
      '#4caf50', '#2196f3', '#ff9800', '#f44336', '#9c27b0',
      '#00bcd4', '#ff5722', '#795548', '#607d8b', '#cddc39'
    ];
    return colors[index % colors.length];
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
        Defect Distribution by Assignee/Team
      </h3>
      
      {assignees.length > 0 ? (
        <>
          {/* Summary Stats */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            marginBottom: '24px',
            flexWrap: 'wrap'
          }}>
            <div style={{
              textAlign: 'center',
              padding: '16px',
              backgroundColor: '#e3f2fd',
              borderRadius: '8px',
              minWidth: '150px'
            }}>
              <div style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1a237e'
              }}>
                {totalDefects}
              </div>
              <div style={{
                color: '#333'
              }}>
                Total Defects
              </div>
            </div>
            <div style={{
              textAlign: 'center',
              padding: '16px',
              backgroundColor: '#f1f8e9',
              borderRadius: '8px',
              minWidth: '150px'
            }}>
              <div style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#33691e'
              }}>
                {assignees.length}
              </div>
              <div style={{
                color: '#333'
              }}>
                Assignees/Teams
              </div>
            </div>
            <div style={{
              textAlign: 'center',
              padding: '16px',
              backgroundColor: '#fff8e1',
              borderRadius: '8px',
              minWidth: '150px'
            }}>
              <div style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#e65100'
              }}>
                {totalDefects > 0 ? (totalDefects / assignees.length).toFixed(1) : '0'}
              </div>
              <div style={{
                color: '#333'
              }}>
                Avg. per Assignee
              </div>
            </div>
          </div>
          
          {/* Distribution Chart */}
          <div style={{
            marginBottom: '24px'
          }}>
            <h4 style={{
              color: '#333',
              marginBottom: '16px'
            }}>Defect Distribution</h4>
            <div style={{
              display: 'flex',
              height: '40px',
              borderRadius: '8px',
              overflow: 'hidden',
              border: '1px solid #eee'
            }}>
              {assignees.map((assignee, index) => {
                const percentage = (assignee.count / totalDefects) * 100;
                return (
                  <div 
                    key={assignee.name}
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: getAssigneeColor(index),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '12px'
                    }}
                  >
                    {percentage > 10 ? `${assignee.name} (${assignee.count})` : assignee.count}
                  </div>
                );
              })}
            </div>
            
            {/* Legend */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              marginTop: '12px'
            }}>
              {assignees.map((assignee, index) => (
                <div key={assignee.name} style={{
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    backgroundColor: getAssigneeColor(index),
                    borderRadius: '4px',
                    marginRight: '8px'
                  }}></div>
                  <span style={{ fontSize: '14px', color: '#555' }}>
                    {assignee.name}: {assignee.count} ({((assignee.count / totalDefects) * 100).toFixed(1)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Detailed Breakdown */}
          <div>
            <h4 style={{
              color: '#333',
              marginBottom: '16px'
            }}>Detailed Breakdown</h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '16px'
            }}>
              {assignees.map((assignee, index) => (
                <div key={assignee.name} style={{
                  border: '1px solid #eee',
                  borderRadius: '8px',
                  padding: '16px',
                  backgroundColor: '#fafafa'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px'
                  }}>
                    <h5 style={{
                      margin: '0',
                      color: '#333',
                      fontSize: '16px'
                    }}>
                      {assignee.name}
                    </h5>
                    <span style={{
                      backgroundColor: getAssigneeColor(index),
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '12px'
                    }}>
                      {assignee.count} defects
                    </span>
                  </div>
                  
                  {/* Progress bar for this assignee */}
                  <div style={{
                    height: '10px',
                    backgroundColor: '#e0e0e0',
                    borderRadius: '5px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${(assignee.count / Math.max(...assignees.map(a => a.count))) * 100}%`,
                      backgroundColor: getAssigneeColor(index),
                      borderRadius: '5px'
                    }}></div>
                  </div>
                  
                  <div style={{
                    marginTop: '8px',
                    fontSize: '14px',
                    color: '#666'
                  }}>
                    {((assignee.count / totalDefects) * 100).toFixed(1)}% of total defects
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Performance Insights */}
          <div style={{
            marginTop: '24px',
            padding: '16px',
            backgroundColor: '#e8f5e9',
            borderRadius: '8px',
            borderLeft: '4px solid #4caf50'
          }}>
            <h4 style={{
              margin: '0 0 10px 0',
              color: '#1b5e20'
            }}>Performance Insights</h4>
            <ul style={{
              margin: '0',
              paddingLeft: '20px',
              color: '#333'
            }}>
              <li>Assignee with highest load: {assignees.reduce((max, assignee) => assignee.count > max.count ? assignee : max, assignees[0]).name} ({Math.max(...assignees.map(a => a.count))} defects)</li>
              <li>Consider redistributing workload if any assignee has significantly more defects than others</li>
              <li>Review resolution time per assignee to identify performance outliers</li>
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
          <p>No defect distribution data available</p>
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

export default DefectDistributionInfographic;
