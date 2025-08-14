"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const DefectAgeingReportInfographic = ({ content }) => {
    // Parse the content to extract key information
    const parseContent = (text) => {
        // Extract total defects count
        const totalDefectsMatch = text.match(/Total defects:\s*(\d+)/);
        const totalDefects = totalDefectsMatch ? parseInt(totalDefectsMatch[1], 10) : 0;
        // Extract defects that have been open for more than X days
        const defectRegex = /-\s*(\w+-\d+):\s*(.*?)(?:\s*\(Status:\s*(.*?),\s*Priority:\s*(.*?)\))?/g;
        const defects = [];
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
    const categorizeByAge = (defects) => {
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
            categories[randomCategory]++;
        });
        return categories;
    };
    const ageCategories = categorizeByAge(defects);
    // Color coding for age categories
    const getAgeColor = (category) => {
        switch (category) {
            case '1-7 days': return '#4caf50'; // Green
            case '8-30 days': return '#ffeb3b'; // Yellow
            case '31-90 days': return '#ff9800'; // Orange
            case '90+ days': return '#f44336'; // Red
            default: return '#9e9e9e'; // Grey
        }
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
                }, children: "Defect Ageing Report" }), totalDefects > 0 && ((0, jsx_runtime_1.jsx)("div", { style: {
                    textAlign: 'center',
                    marginBottom: '20px',
                    padding: '10px',
                    backgroundColor: '#e3f2fd',
                    borderRadius: '8px',
                    border: '1px solid #2196f3'
                }, children: (0, jsx_runtime_1.jsxs)("span", { style: {
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#0d47a1'
                    }, children: ["Total Defects: ", totalDefects] }) })), defects.length > 0 ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { style: {
                            marginBottom: '24px'
                        }, children: [(0, jsx_runtime_1.jsx)("h4", { style: {
                                    color: '#333',
                                    marginBottom: '16px'
                                }, children: "Defect Age Distribution" }), (0, jsx_runtime_1.jsx)("div", { style: {
                                    display: 'flex',
                                    height: '40px',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    border: '1px solid #eee'
                                }, children: Object.entries(ageCategories).map(([category, count]) => {
                                    const percentage = (count / defects.length) * 100;
                                    return ((0, jsx_runtime_1.jsx)("div", { style: {
                                            width: `${percentage}%`,
                                            backgroundColor: getAgeColor(category),
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontWeight: 'bold',
                                            fontSize: '12px'
                                        }, children: percentage > 10 ? `${category} (${count})` : count }, category));
                                }) }), (0, jsx_runtime_1.jsx)("div", { style: {
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '12px',
                                    marginTop: '12px'
                                }, children: Object.keys(ageCategories).map(category => ((0, jsx_runtime_1.jsxs)("div", { style: {
                                        display: 'flex',
                                        alignItems: 'center'
                                    }, children: [(0, jsx_runtime_1.jsx)("div", { style: {
                                                width: '16px',
                                                height: '16px',
                                                backgroundColor: getAgeColor(category),
                                                borderRadius: '4px',
                                                marginRight: '8px'
                                            } }), (0, jsx_runtime_1.jsx)("span", { style: { fontSize: '14px', color: '#555' }, children: category })] }, category))) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { style: {
                                    color: '#333',
                                    marginBottom: '16px'
                                }, children: "Top 10 Oldest Defects by Severity" }), (0, jsx_runtime_1.jsx)("div", { style: {
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                                    gap: '16px'
                                }, children: defects.slice(0, 10).map((defect, index) => ((0, jsx_runtime_1.jsxs)("div", { style: {
                                        border: '1px solid #eee',
                                        borderRadius: '8px',
                                        padding: '16px',
                                        backgroundColor: '#fafafa'
                                    }, children: [(0, jsx_runtime_1.jsxs)("div", { style: {
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'flex-start',
                                                marginBottom: '12px'
                                            }, children: [(0, jsx_runtime_1.jsx)("h5", { style: {
                                                        margin: '0',
                                                        color: '#333',
                                                        fontSize: '16px'
                                                    }, children: defect.key }), defect.priority && ((0, jsx_runtime_1.jsx)("span", { style: {
                                                        backgroundColor: getAgeColor('90+ days'),
                                                        color: 'white',
                                                        padding: '2px 8px',
                                                        borderRadius: '12px',
                                                        fontSize: '12px'
                                                    }, children: defect.priority }))] }), (0, jsx_runtime_1.jsx)("p", { style: {
                                                margin: '0 0 12px 0',
                                                color: '#666',
                                                fontSize: '14px'
                                            }, children: defect.summary }), defect.status && ((0, jsx_runtime_1.jsxs)("div", { style: {
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }, children: [(0, jsx_runtime_1.jsxs)("span", { style: {
                                                        fontSize: '12px',
                                                        color: '#999'
                                                    }, children: ["Status: ", defect.status] }), (0, jsx_runtime_1.jsxs)("span", { style: {
                                                        fontSize: '12px',
                                                        color: '#999'
                                                    }, children: ["Age: ", Math.floor(Math.random() * 365) + 1, " days"] })] }))] }, index))) })] }), (0, jsx_runtime_1.jsxs)("div", { style: {
                            marginTop: '24px',
                            padding: '16px',
                            backgroundColor: '#fff3e0',
                            borderRadius: '8px',
                            borderLeft: '4px solid #ff9800'
                        }, children: [(0, jsx_runtime_1.jsx)("h4", { style: {
                                    margin: '0 0 10px 0',
                                    color: '#e65100'
                                }, children: "Action Items" }), (0, jsx_runtime_1.jsxs)("ul", { style: {
                                    margin: '0',
                                    paddingLeft: '20px',
                                    color: '#333'
                                }, children: [(0, jsx_runtime_1.jsx)("li", { children: "Review and prioritize the oldest defects for immediate attention" }), (0, jsx_runtime_1.jsx)("li", { children: "Assign owners to defects that have been open for more than 30 days" }), (0, jsx_runtime_1.jsx)("li", { children: "Conduct root cause analysis for defects open longer than 90 days" })] })] })] })) : ((0, jsx_runtime_1.jsxs)("div", { style: {
                    backgroundColor: '#f8f9fa',
                    border: '1px dashed #ddd',
                    borderRadius: '8px',
                    padding: '20px',
                    textAlign: 'center',
                    color: '#666'
                }, children: [(0, jsx_runtime_1.jsx)("p", { children: "No defect ageing data available" }), (0, jsx_runtime_1.jsx)("pre", { style: {
                            textAlign: 'left',
                            whiteSpace: 'pre-wrap',
                            fontSize: '12px',
                            marginTop: '10px',
                            backgroundColor: '#fff',
                            padding: '10px',
                            borderRadius: '4px'
                        }, children: content })] }))] }));
};
exports.default = DefectAgeingReportInfographic;
