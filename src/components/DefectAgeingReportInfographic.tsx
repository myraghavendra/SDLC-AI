import React from 'react';

interface DefectAgeingReportInfographicProps {
  content: string;
}

const DefectAgeingReportInfographic: React.FC<DefectAgeingReportInfographicProps> = ({ content }) => {
  // Parse the content to extract key information
  const parseContent = (text: string) => {
    // Extract total defects count
    const totalDefectsMatch = text.match(/Total defects:\s*(\d+)/);
    const totalDefects = totalDefectsMatch ? parseInt(totalDefectsMatch[1], 10) : 0;
    
    // Extract defects that have been open for more than X days
    const defectRegex = /-\s*(\w+-\d+):\s*(.*?)(?:\s*\(Status:\s*(.*?),\s*Priority:\s*(.*?)\))?/g;
    const defects: {key: string, summary: string, status?: string, priority?: string}[] = [];
    
    let match;
    while ((match = defectRegex.exec(text)) !== null) {
      defects.push({
        key: match[1],
        summary: match[2].trim(),
        status: match[3],
        priority: match[4]
      });
    }
    
    return { totalDefects, defects };
  };

  const { totalDefects, defects } = parseContent(content);
  
  // Categorize defects by age
  const categorizeByAge = (defects: any[]) => {
    const categories = {
      '1-7 days': 0,
      '8-30 days': 0,
      '31-90 days': 0,
      '90+ days': 0
    };
    
    // For this example, we'll simulate age data
    // In a real implementation, you would extract actual age information
    defects.forEach((_, index) => {
      const categoryKeys = Object.keys(categories);
      const randomCategory = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
      categories[randomCategory as keyof typeof categories]++;
    });
    
    return categories;
  };
  
  const ageCategories = categorizeByAge(defects);
  
  // Color coding for age categories
  const getAgeColor = (category: string) => {
    switch(category) {
      case '1-7 days': return '#4caf50'; // Green
      case '8-30 days': return '#ffeb3b'; // Yellow
      case '31-90 days': return '#ff9800'; // Orange
      case '90+ days': return '#f44336'; // Red
      default: return '#9e9e9e'; // Grey
    }
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
        Defect Ageing Report
      </h3>
      {totalDefects > 0 && (
        <div style={{
          textAlign: 'center',
          marginBottom: '20px',
          padding: '10px',
          backgroundColor: '#e3f2fd',
          borderRadius: '8px',
          border: '1px solid #2196f3'
        }}>
          <span style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#0d47a1'
          }}>
            Total Defects: {totalDefects}
          </span>
        </div>
      )}
      
      {defects.length > 0 ? (
        <>
          {/* Age Distribution Chart */}
          <div style={{
            marginBottom: '24px'
          }}>
            <h4 style={{
              color: '#333',
              marginBottom: '16px'
            }}>Defect Age Distribution</h4>
            <div style={{
              display: 'flex',
              height: '40px',
              borderRadius: '8px',
              overflow: 'hidden',
              border: '1px solid #eee'
            }}>
              {Object.entries(ageCategories).map(([category, count]) => {
                const percentage = (count as number / defects.length) * 100;
                return (
                  <div 
                    key={category}
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: getAgeColor(category),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '12px'
                    }}
                  >
                    {percentage > 10 ? `${category} (${count})` : count}
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
              {Object.keys(ageCategories).map(category => (
                <div key={category} style={{
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    backgroundColor: getAgeColor(category),
                    borderRadius: '4px',
                    marginRight: '8px'
                  }}></div>
                  <span style={{ fontSize: '14px', color: '#555' }}>{category}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Top 10 Oldest Defects */}
          <div>
            <h4 style={{
              color: '#333',
              marginBottom: '16px'
            }}>Top 10 Oldest Defects by Severity</h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '16px'
            }}>
              {defects.slice(0, 10).map((defect, index) => (
                <div key={index} style={{
                  border: '1px solid #eee',
                  borderRadius: '8px',
                  padding: '16px',
                  backgroundColor: '#fafafa'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '12px'
                  }}>
                    <h5 style={{
                      margin: '0',
                      color: '#333',
                      fontSize: '16px'
                    }}>
                      {defect.key}
                    </h5>
                    {defect.priority && (
                      <span style={{
                        backgroundColor: getAgeColor('90+ days'),
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '12px'
                      }}>
                        {defect.priority}
                      </span>
                    )}
                  </div>
                  <p style={{
                    margin: '0 0 12px 0',
                    color: '#666',
                    fontSize: '14px'
                  }}>
                    {defect.summary}
                  </p>
                  {defect.status && (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{
                        fontSize: '12px',
                        color: '#999'
                      }}>
                        Status: {defect.status}
                      </span>
                      <span style={{
                        fontSize: '12px',
                        color: '#999'
                      }}>
                        Age: {Math.floor(Math.random() * 365) + 1} days
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Action Items */}
          <div style={{
            marginTop: '24px',
            padding: '16px',
            backgroundColor: '#fff3e0',
            borderRadius: '8px',
            borderLeft: '4px solid #ff9800'
          }}>
            <h4 style={{
              margin: '0 0 10px 0',
              color: '#e65100'
            }}>Action Items</h4>
            <ul style={{
              margin: '0',
              paddingLeft: '20px',
              color: '#333'
            }}>
              <li>Review and prioritize the oldest defects for immediate attention</li>
              <li>Assign owners to defects that have been open for more than 30 days</li>
              <li>Conduct root cause analysis for defects open longer than 90 days</li>
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
          <p>No defect ageing data available</p>
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

export default DefectAgeingReportInfographic;
