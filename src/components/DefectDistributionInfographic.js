"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const DefectDistributionInfographic = ({ content }) => {
    // Parse the content to extract key information
    const parseContent = (text) => {
        // Extract assignee/team information
        const assigneeRegex = /(\w+(?:\s+\w+)*):\s*(\d+)\s*defects?/g;
        const assignees = [];
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
    const assigneeColors = {
        'default': '#9e9e9e'
    };
    // Generate colors for assignees
    const getAssigneeColor = (index) => {
        const colors = [
            '#4caf50', '#2196f3', '#ff9800', '#f44336', '#9c27b0',
            '#00bcd4', '#ff5722', '#795548', '#607d8b', '#cddc39'
        ];
        return colors[index % colors.length];
    };
    return ((0, jsx_runtime_1.jsxs)("div", { style: {
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            padding: '24px',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            marginBottom: '24px'
        }, children: [(0, jsx_runtime_1.jsx)("h3", { style: {
                    color: '#2c3e50',
                    borderBottom: '2px solid #3498db',
                    paddingBottom: '8px',
                    marginBottom: '20px',
                    fontSize: '22px'
                }, children: "Defect Distribution by Assignee/Team" }), assignees.length > 0 ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { style: {
                            display: 'flex',
                            justifyContent: 'space-around',
                            marginBottom: '24px',
                            flexWrap: 'wrap'
                        }, children: [(0, jsx_runtime_1.jsxs)("div", { style: {
                                    textAlign: 'center',
                                    padding: '16px',
                                    backgroundColor: '#e3f2fd',
                                    borderRadius: '8px',
                                    minWidth: '150px'
                                }, children: [(0, jsx_runtime_1.jsx)("div", { style: {
                                            fontSize: '24px',
                                            fontWeight: 'bold',
                                            color: '#1a237e'
                                        }, children: totalDefects }), (0, jsx_runtime_1.jsx)("div", { style: {
                                            color: '#333'
                                        }, children: "Total Defects" })] }), (0, jsx_runtime_1.jsxs)("div", { style: {
                                    textAlign: 'center',
                                    padding: '16px',
                                    backgroundColor: '#f1f8e9',
                                    borderRadius: '8px',
                                    minWidth: '150px'
                                }, children: [(0, jsx_runtime_1.jsx)("div", { style: {
                                            fontSize: '24px',
                                            fontWeight: 'bold',
                                            color: '#33691e'
                                        }, children: assignees.length }), (0, jsx_runtime_1.jsx)("div", { style: {
                                            color: '#333'
                                        }, children: "Assignees/Teams" })] }), (0, jsx_runtime_1.jsxs)("div", { style: {
                                    textAlign: 'center',
                                    padding: '16px',
                                    backgroundColor: '#fff8e1',
                                    borderRadius: '8px',
                                    minWidth: '150px'
                                }, children: [(0, jsx_runtime_1.jsx)("div", { style: {
                                            fontSize: '24px',
                                            fontWeight: 'bold',
                                            color: '#e65100'
                                        }, children: totalDefects > 0 ? (totalDefects / assignees.length).toFixed(1) : '0' }), (0, jsx_runtime_1.jsx)("div", { style: {
                                            color: '#333'
                                        }, children: "Avg. per Assignee" })] })] }), (0, jsx_runtime_1.jsxs)("div", { style: {
                            marginBottom: '24px'
                        }, children: [(0, jsx_runtime_1.jsx)("h4", { style: {
                                    color: '#333',
                                    marginBottom: '16px'
                                }, children: "Defect Distribution" }), (0, jsx_runtime_1.jsx)("div", { style: {
                                    display: 'flex',
                                    height: '40px',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    border: '1px solid #eee'
                                }, children: assignees.map((assignee, index) => {
                                    const percentage = (assignee.count / totalDefects) * 100;
                                    return ((0, jsx_runtime_1.jsx)("div", { style: {
                                            width: `${percentage}%`,
                                            backgroundColor: getAssigneeColor(index),
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontWeight: 'bold',
                                            fontSize: '12px'
                                        }, children: percentage > 10 ? `${assignee.name} (${assignee.count})` : assignee.count }, assignee.name));
                                }) }), (0, jsx_runtime_1.jsx)("div", { style: {
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '12px',
                                    marginTop: '12px'
                                }, children: assignees.map((assignee, index) => ((0, jsx_runtime_1.jsxs)("div", { style: {
                                        display: 'flex',
                                        alignItems: 'center'
                                    }, children: [(0, jsx_runtime_1.jsx)("div", { style: {
                                                width: '16px',
                                                height: '16px',
                                                backgroundColor: getAssigneeColor(index),
                                                borderRadius: '4px',
                                                marginRight: '8px'
                                            } }), (0, jsx_runtime_1.jsxs)("span", { style: { fontSize: '14px', color: '#555' }, children: [assignee.name, ": ", assignee.count, " (", ((assignee.count / totalDefects) * 100).toFixed(1), "%)"] })] }, assignee.name))) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { style: {
                                    color: '#333',
                                    marginBottom: '16px'
                                }, children: "Detailed Breakdown" }), (0, jsx_runtime_1.jsx)("div", { style: {
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                    gap: '16px'
                                }, children: assignees.map((assignee, index) => ((0, jsx_runtime_1.jsxs)("div", { style: {
                                        border: '1px solid #eee',
                                        borderRadius: '8px',
                                        padding: '16px',
                                        backgroundColor: '#fafafa'
                                    }, children: [(0, jsx_runtime_1.jsxs)("div", { style: {
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                marginBottom: '12px'
                                            }, children: [(0, jsx_runtime_1.jsx)("h5", { style: {
                                                        margin: '0',
                                                        color: '#333',
                                                        fontSize: '16px'
                                                    }, children: assignee.name }), (0, jsx_runtime_1.jsxs)("span", { style: {
                                                        backgroundColor: getAssigneeColor(index),
                                                        color: 'white',
                                                        padding: '2px 8px',
                                                        borderRadius: '12px',
                                                        fontSize: '12px'
                                                    }, children: [assignee.count, " defects"] })] }), (0, jsx_runtime_1.jsx)("div", { style: {
                                                height: '10px',
                                                backgroundColor: '#e0e0e0',
                                                borderRadius: '5px',
                                                overflow: 'hidden'
                                            }, children: (0, jsx_runtime_1.jsx)("div", { style: {
                                                    height: '100%',
                                                    width: `${(assignee.count / Math.max(...assignees.map(a => a.count))) * 100}%`,
                                                    backgroundColor: getAssigneeColor(index),
                                                    borderRadius: '5px'
                                                } }) }), (0, jsx_runtime_1.jsxs)("div", { style: {
                                                marginTop: '8px',
                                                fontSize: '14px',
                                                color: '#666'
                                            }, children: [((assignee.count / totalDefects) * 100).toFixed(1), "% of total defects"] })] }, assignee.name))) })] }), (0, jsx_runtime_1.jsxs)("div", { style: {
                            marginTop: '24px',
                            padding: '16px',
                            backgroundColor: '#e8f5e9',
                            borderRadius: '8px',
                            borderLeft: '4px solid #4caf50'
                        }, children: [(0, jsx_runtime_1.jsx)("h4", { style: {
                                    margin: '0 0 10px 0',
                                    color: '#1b5e20'
                                }, children: "Performance Insights" }), (0, jsx_runtime_1.jsxs)("ul", { style: {
                                    margin: '0',
                                    paddingLeft: '20px',
                                    color: '#333'
                                }, children: [(0, jsx_runtime_1.jsxs)("li", { children: ["Assignee with highest load: ", assignees.reduce((max, assignee) => assignee.count > max.count ? assignee : max, assignees[0]).name, " (", Math.max(...assignees.map(a => a.count)), " defects)"] }), (0, jsx_runtime_1.jsx)("li", { children: "Consider redistributing workload if any assignee has significantly more defects than others" }), (0, jsx_runtime_1.jsx)("li", { children: "Review resolution time per assignee to identify performance outliers" })] })] })] })) : ((0, jsx_runtime_1.jsxs)("div", { style: {
                    backgroundColor: '#f8f9fa',
                    border: '1px dashed #ddd',
                    borderRadius: '8px',
                    padding: '20px',
                    textAlign: 'center',
                    color: '#666'
                }, children: [(0, jsx_runtime_1.jsx)("p", { children: "No defect distribution data available" }), (0, jsx_runtime_1.jsx)("pre", { style: {
                            textAlign: 'left',
                            whiteSpace: 'pre-wrap',
                            fontSize: '12px',
                            marginTop: '10px',
                            backgroundColor: '#fff',
                            padding: '10px',
                            borderRadius: '4px'
                        }, children: content })] }))] }));
};
exports.default = DefectDistributionInfographic;
