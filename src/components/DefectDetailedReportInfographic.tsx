import React from 'react';

interface DefectDetailedReportInfographicProps {
  title: string;
  content: string;
}

const DefectDetailedReportInfographic: React.FC<DefectDetailedReportInfographicProps> = ({ title, content }) => {
  // Basic styling and structure for rich UI look
  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #ccc',
      borderRadius: 10,
      padding: 20,
      marginBottom: 20,
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    }}>
      <h3 style={{ borderBottom: '2px solid #4caf50', paddingBottom: 8, marginBottom: 16, color: '#2e7d32' }}>
        {title}
      </h3>
      <pre style={{
        whiteSpace: 'pre-wrap',
        fontFamily: 'monospace',
        fontSize: 14,
        color: '#444',
        lineHeight: 1.5,
        maxHeight: 300,
        overflowY: 'auto',
        backgroundColor: '#f9f9f9',
        padding: 12,
        borderRadius: 6,
        border: '1px solid #ddd',
      }}>
        {content}
      </pre>
    </div>
  );
};

export default DefectDetailedReportInfographic;
