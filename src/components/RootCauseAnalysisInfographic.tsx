import React from 'react';

interface RootCauseAnalysisInfographicProps {
  content: string;
}

const RootCauseAnalysisInfographic: React.FC<RootCauseAnalysisInfographicProps> = ({ content }) => {
  // Parse the content to extract key information
  // This is a simplified parser - in a real implementation, you might want to
  // enhance the backend to return structured data
  const parseContent = (text: string) => {
    // If no content, return empty array
    if (!text || text.trim().length === 0) {
      return [];
    }
    
    // For now, we'll create a simple single category with the content
    // In a real implementation, you would want to parse the actual content
    return [{
      name: "Root Cause Analysis",
      causes: text.split('\n').filter(line => line.trim().length > 0)
    }];
  };

  const categories = parseContent(content);

  // Color palette for categories
  const categoryColors: Record<string, string> = {
    'Root Cause Analysis': '#FF6B6B',
    'Requirement Gap': '#FF6B6B',
    'Coding Issue': '#4ECDC4',
    'Test Miss': '#FFD166',
    'Environment Issue': '#6A0572',
    'Design Flaw': '#1A936F',
    'Communication Gap': '#114B5F',
    'default': '#9E9E9E'
  };

  const getCategoryColor = (category: string) => {
    return categoryColors[category] || categoryColors['default'];
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
        Root Cause Analysis (RCA)
      </h3>
      
      {content && content.trim().length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          {categories.map((category, index) => (
            <div key={index} style={{
              border: `2px solid ${getCategoryColor(category.name)}`,
              borderRadius: '8px',
              padding: '16px',
              backgroundColor: `${getCategoryColor(category.name)}10`
            }}>
              <h4 style={{
                color: getCategoryColor(category.name),
                marginBottom: '12px',
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center'
              }}>
                <span style={{
                  backgroundColor: getCategoryColor(category.name),
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  marginRight: '8px',
                  display: 'inline-block'
                }}></span>
                {category.name}
              </h4>
              <ul style={{
                paddingLeft: '20px',
                margin: '0'
              }}>
                {category.causes.map((cause, causeIndex) => (
                  <li key={causeIndex} style={{
                    marginBottom: '8px',
                    color: '#555'
                  }}>
                    {cause}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          backgroundColor: '#f8f9fa',
          border: '1px dashed #ddd',
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center',
          color: '#666'
        }}>
          <p>No root cause analysis data available</p>
          <pre style={{
            textAlign: 'left',
            whiteSpace: 'pre-wrap',
            fontSize: '12px',
            marginTop: '10px',
            backgroundColor: '#fff',
            padding: '10px',
            borderRadius: '4px'
          }}>
            {content || "No content provided"}
          </pre>
        </div>
      )}
      
      <div style={{
        marginTop: '20px',
        padding: '16px',
        backgroundColor: '#e3f2fd',
        borderRadius: '8px',
        borderLeft: '4px solid #2196f3'
      }}>
        <h4 style={{
          margin: '0 0 10px 0',
          color: '#0d47a1'
        }}>Recommendations</h4>
        <p style={{ margin: '0', color: '#333' }}>
          Based on this analysis, consider implementing process improvements针对性 to each identified root cause category.
        </p>
      </div>
    </div>
  );
};

export default RootCauseAnalysisInfographic;
