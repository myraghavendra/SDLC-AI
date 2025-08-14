"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const DefectSummaryInfographic = ({ data }) => {
    // Color palette for charts
    const statusColors = {
        'Open': '#ff6b6b',
        'In Progress': '#4ecdc4',
        'Resolved': '#1a936f',
        'Closed': '#114b5f',
        'To Do': '#f3d250',
        'Done': '#66bb6a',
        'default': '#9e9e9e'
    };
    const priorityColors = {
        'High': '#ff5252',
        'Medium': '#ffb74d',
        'Low': '#4caf50',
        'Critical': '#e91e63',
        'default': '#9e9e9e'
    };
    // Function to get color for status
    const getStatusColor = (status) => {
        return statusColors[status] || statusColors['default'];
    };
    // Function to get color for priority
    const getPriorityColor = (priority) => {
        return priorityColors[priority] || priorityColors['default'];
    };
    // Function to calculate percentage
    const calculatePercentage = (value, total) => {
        return total > 0 ? Math.round((value / total) * 100) : 0;
    };
    // Function to sort breakdown entries by count (descending)
    const sortBreakdown = (breakdown) => {
        return Object.entries(breakdown)
            .sort(([, a], [, b]) => b - a)
            .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
    };
    // Sort the breakdowns
    const sortedStatusBreakdown = sortBreakdown(data.statusBreakdown || {});
    const sortedPriorityBreakdown = sortBreakdown(data.priorityBreakdown || {});
    return ((0, jsx_runtime_1.jsxs)("div", { style: {
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            padding: '24px',
            fontFamily: 'Arial, sans-serif'
        }, children: [(0, jsx_runtime_1.jsxs)("div", { style: {
                    textAlign: 'center',
                    marginBottom: '32px',
                    paddingBottom: '16px',
                    borderBottom: '2px solid #f0f0f0'
                }, children: [(0, jsx_runtime_1.jsx)("h2", { style: {
                            color: '#333',
                            margin: '0 0 8px 0',
                            fontSize: '28px'
                        }, children: "Defect Summary Report" }), (0, jsx_runtime_1.jsx)("h3", { style: {
                            color: '#666',
                            margin: '0 0 16px 0',
                            fontSize: '20px',
                            fontWeight: 'normal'
                        }, children: data.projectName }), (0, jsx_runtime_1.jsx)("div", { style: {
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
                        }, children: data.totalDefects }), (0, jsx_runtime_1.jsx)("p", { style: {
                            color: '#666',
                            margin: '16px 0 0 0',
                            fontSize: '18px'
                        }, children: "Total Defects" })] }), (0, jsx_runtime_1.jsxs)("div", { style: { marginBottom: '32px' }, children: [(0, jsx_runtime_1.jsx)("h3", { style: {
                            color: '#333',
                            borderBottom: '1px solid #eee',
                            paddingBottom: '8px',
                            marginBottom: '16px'
                        }, children: "Status Breakdown" }), Object.keys(sortedStatusBreakdown).length > 0 ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { style: { marginBottom: '24px' }, children: Object.entries(sortedStatusBreakdown).map(([status, count]) => {
                                    const countNum = count;
                                    const percentage = calculatePercentage(countNum, data.totalDefects);
                                    return ((0, jsx_runtime_1.jsxs)("div", { style: { marginBottom: '12px' }, children: [(0, jsx_runtime_1.jsxs)("div", { style: {
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    marginBottom: '4px'
                                                }, children: [(0, jsx_runtime_1.jsx)("span", { style: { fontWeight: '500', color: '#555' }, children: status }), (0, jsx_runtime_1.jsxs)("span", { style: { color: '#777' }, children: [countNum, " (", percentage, "%)"] })] }), (0, jsx_runtime_1.jsx)("div", { style: {
                                                    height: '24px',
                                                    backgroundColor: '#f0f0f0',
                                                    borderRadius: '12px',
                                                    overflow: 'hidden'
                                                }, children: (0, jsx_runtime_1.jsx)("div", { style: {
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
                                                    }, children: percentage > 15 ? `${percentage}%` : '' }) })] }, status));
                                }) }), (0, jsx_runtime_1.jsx)("div", { style: {
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '12px',
                                    marginTop: '16px'
                                }, children: Object.keys(sortedStatusBreakdown).map(status => ((0, jsx_runtime_1.jsxs)("div", { style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        marginRight: '16px'
                                    }, children: [(0, jsx_runtime_1.jsx)("div", { style: {
                                                width: '16px',
                                                height: '16px',
                                                backgroundColor: getStatusColor(status),
                                                borderRadius: '4px',
                                                marginRight: '8px'
                                            } }), (0, jsx_runtime_1.jsx)("span", { style: { fontSize: '14px', color: '#555' }, children: status })] }, status))) })] })) : ((0, jsx_runtime_1.jsx)("p", { style: { color: '#999', fontStyle: 'italic' }, children: "No status data available" }))] }), (0, jsx_runtime_1.jsxs)("div", { style: { marginBottom: '32px' }, children: [(0, jsx_runtime_1.jsx)("h3", { style: {
                            color: '#333',
                            borderBottom: '1px solid #eee',
                            paddingBottom: '8px',
                            marginBottom: '16px'
                        }, children: "Priority Breakdown" }), Object.keys(sortedPriorityBreakdown).length > 0 ? ((0, jsx_runtime_1.jsx)("div", { style: {
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                            gap: '16px'
                        }, children: Object.entries(sortedPriorityBreakdown).map(([priority, count]) => {
                            const countNum = count;
                            const percentage = calculatePercentage(countNum, data.totalDefects);
                            return ((0, jsx_runtime_1.jsxs)("div", { style: {
                                    textAlign: 'center',
                                    padding: '16px',
                                    backgroundColor: '#f9f9f9',
                                    borderRadius: '8px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                }, children: [(0, jsx_runtime_1.jsxs)("div", { style: {
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
                                        }, children: [percentage, "%"] }), (0, jsx_runtime_1.jsx)("div", { style: { fontWeight: '500', color: '#555' }, children: priority }), (0, jsx_runtime_1.jsxs)("div", { style: { color: '#777', fontSize: '14px' }, children: [countNum, " defects"] })] }, priority));
                        }) })) : ((0, jsx_runtime_1.jsx)("p", { style: { color: '#999', fontStyle: 'italic' }, children: "No priority data available" }))] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { style: {
                            color: '#333',
                            borderBottom: '1px solid #eee',
                            paddingBottom: '8px',
                            marginBottom: '16px'
                        }, children: "AI Analysis" }), (0, jsx_runtime_1.jsx)("div", { style: {
                            backgroundColor: '#f8f9fa',
                            borderLeft: '4px solid #4a90e2',
                            padding: '16px',
                            borderRadius: '0 8px 8px 0',
                            whiteSpace: 'pre-wrap'
                        }, children: data.analysis || 'No analysis available' })] })] }));
};
exports.default = DefectSummaryInfographic;
