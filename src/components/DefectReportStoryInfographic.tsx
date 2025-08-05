import React from 'react';

interface DefectReportStoryInfographicProps {
  projectName: string;
  totalDefects: number;
  statusBreakdown: Record<string, number>;
  priorityBreakdown: Record<string, number>;
  analysis: string;
  detailedReports: { [key: string]: string };
}

const DefectReportStoryInfographic: React.FC<DefectReportStoryInfographicProps> = ({
  projectName,
  totalDefects,
  statusBreakdown,
  priorityBreakdown,
  analysis,
  detailedReports,
}) => {
  return (
    <div style={{
      backgroundColor: '#fefefe',
      borderRadius: 12,
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      padding: 24,
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      maxWidth: 900,
      margin: '0 auto',
    }}>
      <h2 style={{ textAlign: 'center', color: '#2c3e50' }}>
        Defect Report Story for {projectName}
      </h2>

      <section style={{ marginTop: 24 }}>
        <h3 style={{ borderBottom: '2px solid #3498db', paddingBottom: 8, color: '#2980b9' }}>
          Overview
        </h3>
        <p style={{ fontSize: 18, color: '#34495e' }}>
          Total Defects: <strong>{totalDefects}</strong>
        </p>
      </section>

      <section style={{ marginTop: 24 }}>
        <h3 style={{ borderBottom: '2px solid #3498db', paddingBottom: 8, color: '#2980b9' }}>
          Status Breakdown
        </h3>
        <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
          {Object.entries(statusBreakdown).map(([status, count]) => (
            <li key={status} style={{ marginBottom: 6, fontSize: 16, color: '#34495e' }}>
              <strong>{status}:</strong> {count}
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginTop: 24 }}>
        <h3 style={{ borderBottom: '2px solid #3498db', paddingBottom: 8, color: '#2980b9' }}>
          Priority Breakdown
        </h3>
        <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
          {Object.entries(priorityBreakdown).map(([priority, count]) => (
            <li key={priority} style={{ marginBottom: 6, fontSize: 16, color: '#34495e' }}>
              <strong>{priority}:</strong> {count}
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginTop: 24 }}>
        <h3 style={{ borderBottom: '2px solid #3498db', paddingBottom: 8, color: '#2980b9' }}>
          AI Analysis Summary
        </h3>
        <p style={{ fontSize: 16, color: '#2c3e50', whiteSpace: 'pre-wrap' }}>
          {analysis || 'No AI analysis available.'}
        </p>
      </section>

      <section style={{ marginTop: 24 }}>
        <h3 style={{ borderBottom: '2px solid #3498db', paddingBottom: 8, color: '#2980b9' }}>
          Detailed Defect Reports Story
        </h3>
        {Object.entries(detailedReports).map(([title, content]) => (
          <article key={title} style={{
            backgroundColor: '#ecf0f1',
            borderRadius: 8,
            padding: 16,
            marginBottom: 16,
            boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
          }}>
            <h4 style={{ color: '#34495e', marginBottom: 8 }}>{title}</h4>
            <p style={{ whiteSpace: 'pre-wrap', color: '#2c3e50', fontSize: 14 }}>
              {content}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
};

export default DefectReportStoryInfographic;
