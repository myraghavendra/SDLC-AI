"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const DefectDensityReportInfographic = ({ content }) => {
    // Parse the content to extract key information
    const parseContent = (text) => {
        // Extract modules and their defect counts
        const lines = text.split('\n');
        const modules = [];
        // Find the section with component counts
        let inComponentSection = false;
        for (const line of lines) {
            // Check if we've reached the component section
            if (line.includes('Defects by component/module:')) {
                inComponentSection = true;
                continue;
            }
            // If we're in the component section, look for component lines
            if (inComponentSection) {
                // Match lines that look like "- Component: count"
                const componentMatch = line.match(/-\s*([^:]+?):\s*(\d+)/);
                if (componentMatch) {
                    const name = componentMatch[1].trim();
                    const count = parseInt(componentMatch[2]);
                    if (!isNaN(count)) {
                        modules.push({ name, count });
                    }
                }
                // If we hit a blank line or a new section, stop parsing
                else if (line.trim() === '' || (line.trim().startsWith('-') === false && line.includes(':'))) {
                    // Continue parsing, as we might have more component lines
                }
            }
        }
        return modules;
    };
    const modules = parseContent(content);
    // Find max count for scaling
    const maxCount = modules.length > 0 ? Math.max(...modules.map(m => m.count)) : 1;
    // Color coding for defect counts
    const getCountColor = (count, max) => {
        const ratio = max > 0 ? count / max : 0;
        if (ratio > 0.7)
            return '#e53935'; // High - Red
        if (ratio > 0.4)
            return '#ffb300'; // Medium - Amber
        return '#43a047'; // Low - Green
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
                }, children: "Defect Density Report" }), modules.length > 0 ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { style: {
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: '20px',
                            marginBottom: '24px'
                        }, children: modules.map((module, index) => ((0, jsx_runtime_1.jsxs)("div", { style: {
                                border: '1px solid #eee',
                                borderRadius: '8px',
                                padding: '16px',
                                backgroundColor: '#fafafa'
                            }, children: [(0, jsx_runtime_1.jsxs)("div", { style: {
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '12px'
                                    }, children: [(0, jsx_runtime_1.jsx)("h4", { style: {
                                                margin: '0',
                                                color: '#333',
                                                fontSize: '18px'
                                            }, children: module.name }), (0, jsx_runtime_1.jsx)("span", { style: {
                                                backgroundColor: getCountColor(module.count, maxCount),
                                                color: 'white',
                                                padding: '4px 12px',
                                                borderRadius: '20px',
                                                fontWeight: 'bold'
                                            }, children: module.count })] }), (0, jsx_runtime_1.jsx)("div", { style: {
                                        height: '20px',
                                        backgroundColor: '#e0e0e0',
                                        borderRadius: '10px',
                                        overflow: 'hidden'
                                    }, children: (0, jsx_runtime_1.jsx)("div", { style: {
                                            height: '100%',
                                            width: `${(module.count / maxCount) * 100}%`,
                                            backgroundColor: getCountColor(module.count, maxCount),
                                            borderRadius: '10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'flex-end',
                                            paddingRight: '8px'
                                        }, children: (0, jsx_runtime_1.jsx)("span", { style: {
                                                color: 'white',
                                                fontSize: '10px',
                                                fontWeight: 'bold'
                                            }, children: module.count }) }) }), (0, jsx_runtime_1.jsx)("div", { style: {
                                        marginTop: '8px',
                                        fontSize: '14px',
                                        color: '#666'
                                    }, children: "Defect Count" })] }, index))) }), (0, jsx_runtime_1.jsxs)("div", { style: {
                            backgroundColor: '#fff8e1',
                            borderLeft: '4px solid #ffc107',
                            padding: '16px',
                            borderRadius: '0 8px 8px 0',
                            marginBottom: '20px'
                        }, children: [(0, jsx_runtime_1.jsx)("h4", { style: {
                                    margin: '0 0 10px 0',
                                    color: '#e65100'
                                }, children: "Risk Assessment" }), (0, jsx_runtime_1.jsxs)("div", { style: {
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '12px'
                                }, children: [(0, jsx_runtime_1.jsxs)("div", { style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            backgroundColor: '#ffebee',
                                            padding: '6px 12px',
                                            borderRadius: '16px'
                                        }, children: [(0, jsx_runtime_1.jsx)("span", { style: {
                                                    width: '12px',
                                                    height: '12px',
                                                    backgroundColor: '#e53935',
                                                    borderRadius: '50%',
                                                    marginRight: '8px'
                                                } }), (0, jsx_runtime_1.jsx)("span", { children: "High Risk (&gt;70% of max)" })] }), (0, jsx_runtime_1.jsxs)("div", { style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            backgroundColor: '#fff8e1',
                                            padding: '6px 12px',
                                            borderRadius: '16px'
                                        }, children: [(0, jsx_runtime_1.jsx)("span", { style: {
                                                    width: '12px',
                                                    height: '12px',
                                                    backgroundColor: '#ffb300',
                                                    borderRadius: '50%',
                                                    marginRight: '8px'
                                                } }), (0, jsx_runtime_1.jsx)("span", { children: "Medium Risk (40-70% of max)" })] }), (0, jsx_runtime_1.jsxs)("div", { style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            backgroundColor: '#e8f5e9',
                                            padding: '6px 12px',
                                            borderRadius: '16px'
                                        }, children: [(0, jsx_runtime_1.jsx)("span", { style: {
                                                    width: '12px',
                                                    height: '12px',
                                                    backgroundColor: '#43a047',
                                                    borderRadius: '50%',
                                                    marginRight: '8px'
                                                } }), (0, jsx_runtime_1.jsx)("span", { children: "Low Risk (&lt;40% of max)" })] })] })] })] })) : ((0, jsx_runtime_1.jsxs)("div", { style: {
                    backgroundColor: '#f8f9fa',
                    border: '1px dashed #ddd',
                    borderRadius: '8px',
                    padding: '20px',
                    textAlign: 'center',
                    color: '#666'
                }, children: [(0, jsx_runtime_1.jsx)("p", { children: "No defect density data available" }), (0, jsx_runtime_1.jsx)("pre", { style: {
                            textAlign: 'left',
                            whiteSpace: 'pre-wrap',
                            fontSize: '12px',
                            marginTop: '10px',
                            backgroundColor: '#fff',
                            padding: '10px',
                            borderRadius: '4px'
                        }, children: content })] })), (0, jsx_runtime_1.jsxs)("div", { style: {
                    padding: '16px',
                    backgroundColor: '#e3f2fd',
                    borderRadius: '8px',
                    borderLeft: '4px solid #2196f3'
                }, children: [(0, jsx_runtime_1.jsx)("h4", { style: {
                            margin: '0 0 10px 0',
                            color: '#0d47a1'
                        }, children: "Recommendations" }), (0, jsx_runtime_1.jsxs)("ul", { style: {
                            margin: '0',
                            paddingLeft: '20px',
                            color: '#333'
                        }, children: [(0, jsx_runtime_1.jsx)("li", { children: "Components with high defect counts should be prioritized for refactoring" }), (0, jsx_runtime_1.jsx)("li", { children: "Consider additional testing coverage for components with medium defect counts" }), (0, jsx_runtime_1.jsx)("li", { children: "Review coding standards and practices in high-count components" })] })] })] }));
};
exports.default = DefectDensityReportInfographic;
