"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const RootCauseAnalysisInfographic = ({ content }) => {
    // Parse the content to extract key information
    // This is a simplified parser - in a real implementation, you might want to
    // enhance the backend to return structured data
    const parseContent = (text) => {
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
    const categoryColors = {
        'Root Cause Analysis': '#FF6B6B',
        'Requirement Gap': '#FF6B6B',
        'Coding Issue': '#4ECDC4',
        'Test Miss': '#FFD166',
        'Environment Issue': '#6A0572',
        'Design Flaw': '#1A936F',
        'Communication Gap': '#114B5F',
        'default': '#9E9E9E'
    };
    const getCategoryColor = (category) => {
        return categoryColors[category] || categoryColors['default'];
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
                }, children: "Root Cause Analysis (RCA)" }), content && content.trim().length > 0 ? ((0, jsx_runtime_1.jsx)("div", { style: {
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '20px'
                }, children: categories.map((category, index) => ((0, jsx_runtime_1.jsxs)("div", { style: {
                        border: `2px solid ${getCategoryColor(category.name)}`,
                        borderRadius: '8px',
                        padding: '16px',
                        backgroundColor: `${getCategoryColor(category.name)}10`
                    }, children: [(0, jsx_runtime_1.jsxs)("h4", { style: {
                                color: getCategoryColor(category.name),
                                marginBottom: '12px',
                                fontSize: '18px',
                                display: 'flex',
                                alignItems: 'center'
                            }, children: [(0, jsx_runtime_1.jsx)("span", { style: {
                                        backgroundColor: getCategoryColor(category.name),
                                        width: '12px',
                                        height: '12px',
                                        borderRadius: '50%',
                                        marginRight: '8px',
                                        display: 'inline-block'
                                    } }), category.name] }), (0, jsx_runtime_1.jsx)("ul", { style: {
                                paddingLeft: '20px',
                                margin: '0'
                            }, children: category.causes.map((cause, causeIndex) => ((0, jsx_runtime_1.jsx)("li", { style: {
                                    marginBottom: '8px',
                                    color: '#555'
                                }, children: cause }, causeIndex))) })] }, index))) })) : ((0, jsx_runtime_1.jsxs)("div", { style: {
                    backgroundColor: '#f8f9fa',
                    border: '1px dashed #ddd',
                    borderRadius: '8px',
                    padding: '20px',
                    textAlign: 'center',
                    color: '#666'
                }, children: [(0, jsx_runtime_1.jsx)("p", { children: "No root cause analysis data available" }), (0, jsx_runtime_1.jsx)("pre", { style: {
                            textAlign: 'left',
                            whiteSpace: 'pre-wrap',
                            fontSize: '12px',
                            marginTop: '10px',
                            backgroundColor: '#fff',
                            padding: '10px',
                            borderRadius: '4px'
                        }, children: content || "No content provided" })] })), (0, jsx_runtime_1.jsxs)("div", { style: {
                    marginTop: '20px',
                    padding: '16px',
                    backgroundColor: '#e3f2fd',
                    borderRadius: '8px',
                    borderLeft: '4px solid #2196f3'
                }, children: [(0, jsx_runtime_1.jsx)("h4", { style: {
                            margin: '0 0 10px 0',
                            color: '#0d47a1'
                        }, children: "Recommendations" }), (0, jsx_runtime_1.jsx)("p", { style: { margin: '0', color: '#333' }, children: "Based on this analysis, consider implementing process improvements\u9488\u5BF9\u6027 to each identified root cause category." })] })] }));
};
exports.default = RootCauseAnalysisInfographic;
