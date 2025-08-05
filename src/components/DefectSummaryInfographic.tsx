import React from 'react';

interface DefectSummaryData {
  projectName: string;
  totalDefects: number;
  statusBreakdown: Record<string, number>;
  priorityBreakdown: Record<string, number>;
  analysis: string;
}

const DefectSummaryInfographic: React.FC<{ data: DefectSummaryData }> = ({ data }) => {
  // Color palette for charts
  const statusColors: Record<string, string> = {
    'Open': '#ff6b6b',
    'In Progress': '#4ecdc4',
    'Resolved': '#1a936f',
    'Closed': '#114b5f',
    'To Do': '#f3d250',
    'Done': '#66bb6a',
    'default': '#9e9e9e'
  };

  const priorityColors: Record<string, string> = {
    'High': '#ff5252',
    'Medium': '#ffb74d',
    'Low': '#4caf50',
    'Critical': '#e91e63',
    'default': '#9e9e9e'
  };

  // Function to get color for status
  const getStatusColor = (status: string) => {
    return statusColors[status] || statusColors['default'];
  };

  // Function to get color for priority
  const getPriorityColor = (priority: string) => {
    return priorityColors[priority] || priorityColors['default'];
  };

  // Function to calculate percentage
  const calculatePercentage = (value: number, total: number) => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };

  // Function to sort breakdown entries by count (descending)
  const sortBreakdown = (breakdown: Record<string, number>) => {
    return Object.entries(breakdown)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value as number }), {} as Record<string, number>);
  };

  // Sort the breakdowns
  const sortedStatusBreakdown = sortBreakdown(data.statusBreakdown || {});
  const sortedPriorityBreakdown = sortBreakdown(data.priorityBreakdown || {});

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      padding: '24px',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header Section */}
      <div style={{
        textAlign: 'center',
        marginBottom: '32px',
        paddingBottom: '16px',
        borderBottom: '2px solid #f0f0f0'
      }}>
        <h2 style={{
          color: '#333',
          margin: '0 0 8px 0',
          fontSize: '28px'
        }}>
          Defect Summary Report
        </h2>
        <h3 style={{
          color: '#666',
          margin: '0 0 16px 0',
          fontSize: '20px',
          fontWeight: 'normal'
        }}>
          {data.projectName}
        </h3>
        <div style={{
          backgroundColor: '#4a90e2',
          color: 'white',
          borderRadius: '50%',
          width: '100px',
          height: '100px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto',
          fontSize: '36px',
          fontWeight: 'bold'
        }}>
          {data.totalDefects}
        </div>
        <p style={{
          color: '#666',
          margin: '16px 0 0 0',
          fontSize: '18px'
        }}>
          Total Defects
        </p>
      </div>

      {/* Status Breakdown Section */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{
          color: '#333',
          borderBottom: '1px solid #eee',
          paddingBottom: '8px',
          marginBottom: '16px'
        }}>
          Status Breakdown
        </h3>
        {Object.keys(sortedStatusBreakdown).length > 0 ? (
          <>
            {/* Bar Chart Visualization */}
            <div style={{ marginBottom: '24px' }}>
              {Object.entries(sortedStatusBreakdown).map(([status, count]) => {
                const countNum = count as number;
                const percentage = calculatePercentage(countNum, data.totalDefects);
                return (
                  <div key={status} style={{ marginBottom: '12px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '4px'
                    }}>
                      <span style={{ fontWeight: '500', color: '#555' }}>{status}</span>
                      <span style={{ color: '#777' }}>{countNum} ({percentage}%)</span>
                    </div>
                    <div style={{
                      height: '24px',
                      backgroundColor: '#f0f0f0',
                      borderRadius: '12px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${percentage}%`,
                        backgroundColor: getStatusColor(status),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        paddingRight: '8px',
                        color: 'white',
                        fontWeight: 'bold',
                        minWidth: '40px'
                      }}>
                        {percentage > 15 ? `${percentage}%` : ''}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              marginTop: '16px'
            }}>
              {Object.keys(sortedStatusBreakdown).map(status => (
                <div key={status} style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginRight: '16px'
                }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    backgroundColor: getStatusColor(status),
                    borderRadius: '4px',
                    marginRight: '8px'
                  }}></div>
                  <span style={{ fontSize: '14px', color: '#555' }}>{status}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p style={{ color: '#999', fontStyle: 'italic' }}>No status data available</p>
        )}
      </div>

      {/* Priority Breakdown Section */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{
          color: '#333',
          borderBottom: '1px solid #eee',
          paddingBottom: '8px',
          marginBottom: '16px'
        }}>
          Priority Breakdown
        </h3>
        {Object.keys(sortedPriorityBreakdown).length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
            gap: '16px'
          }}>
            {Object.entries(sortedPriorityBreakdown).map(([priority, count]) => {
              const countNum = count as number;
              const percentage = calculatePercentage(countNum, data.totalDefects);
              return (
                <div key={priority} style={{
                  textAlign: 'center',
                  padding: '16px',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: getPriorityColor(priority),
                    margin: '0 auto 8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '18px'
                  }}>
                    {percentage}%
                  </div>
                  <div style={{ fontWeight: '500', color: '#555' }}>{priority}</div>
                  <div style={{ color: '#777', fontSize: '14px' }}>{countNum} defects</div>
                </div>
              );
            })}
          </div>
        ) : (
          <p style={{ color: '#999', fontStyle: 'italic' }}>No priority data available</p>
        )}
      </div>

      {/* AI Analysis Section */}
      <div>
        <h3 style={{
          color: '#333',
          borderBottom: '1px solid #eee',
          paddingBottom: '8px',
          marginBottom: '16px'
        }}>
          AI Analysis
        </h3>
        <div style={{
          backgroundColor: '#f8f9fa',
          borderLeft: '4px solid #4a90e2',
          padding: '16px',
          borderRadius: '0 8px 8px 0',
          whiteSpace: 'pre-wrap'
        }}>
          {data.analysis || 'No analysis available'}
        </div>
      </div>
    </div>
  );
};

export default DefectSummaryInfographic;
