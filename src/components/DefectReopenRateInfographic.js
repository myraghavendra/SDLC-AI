"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const DefectReopenRateInfographic = ({ content }) => {
    // Parse the content to extract key information
    const parseContent = (text) => {
        // Extract reopen rate information
        const rateMatch = text.match(/([\d.]+)%/);
        const rate = rateMatch ? parseFloat(rateMatch[1]) : 0;
        // Extract reasons for reopen
        const reasonRegex = /-\s*(.*?)(?=\n-|$)/g;
        const reasons = [];
        let match;
        while ((match = reasonRegex.exec(text)) !== null) {
            reasons.push(match[1]);
        }
        return { rate, reasons };
    };
    const { rate, reasons } = parseContent(content);
    // Color coding for rate
    const getRateColor = (rate) => {
        if (rate > 10)
            return '#f44336'; // Red - High
        if (rate > 5)
            return '#ff9800'; // Orange - Medium
        return '#4caf50'; // Green - Low
    };
    // Get rate level for styling
    const getRateLevel = (rate) => {
        if (rate > 10)
            return 'High';
        if (rate > 5)
            return 'Medium';
        return 'Low';
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
                }, children: "Defect Reopen Rate" }), (0, jsx_runtime_1.jsx)("div", { style: {
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '24px'
                }, children: (0, jsx_runtime_1.jsxs)("div", { style: {
                        position: 'relative',
                        width: '200px',
                        height: '200px'
                    }, children: [(0, jsx_runtime_1.jsx)("div", { style: {
                                position: 'absolute',
                                top: '0',
                                left: '0',
                                width: '100%',
                                height: '100%',
                                borderRadius: '50%',
                                border: '12px solid #f0f0f0',
                                boxSizing: 'border-box'
                            } }), (0, jsx_runtime_1.jsx)("div", { style: {
                                position: 'absolute',
                                top: '0',
                                left: '0',
                                width: '100%',
                                height: '100%',
                                borderRadius: '50%',
                                border: `12px solid ${getRateColor(rate)}`,
                                boxSizing: 'border-box',
                                clipPath: `inset(0 ${100 - rate}% 0 0)`
                            } }), (0, jsx_runtime_1.jsxs)("div", { style: {
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                textAlign: 'center'
                            }, children: [(0, jsx_runtime_1.jsxs)("div", { style: {
                                        fontSize: '32px',
                                        fontWeight: 'bold',
                                        color: getRateColor(rate)
                                    }, children: [rate, "%"] }), (0, jsx_runtime_1.jsx)("div", { style: {
                                        fontSize: '16px',
                                        color: '#666'
                                    }, children: "Reopen Rate" })] })] }) }), (0, jsx_runtime_1.jsx)("div", { style: {
                    textAlign: 'center',
                    marginBottom: '24px'
                }, children: (0, jsx_runtime_1.jsxs)("span", { style: {
                        padding: '6px 16px',
                        borderRadius: '20px',
                        backgroundColor: `${getRateColor(rate)}20`,
                        color: getRateColor(rate),
                        fontWeight: 'bold',
                        fontSize: '18px'
                    }, children: [getRateLevel(rate), " Reopen Rate"] }) }), reasons.length > 0 ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { style: {
                            marginBottom: '24px'
                        }, children: [(0, jsx_runtime_1.jsx)("h4", { style: {
                                    color: '#333',
                                    marginBottom: '16px'
                                }, children: "Top Reasons for Reopen" }), (0, jsx_runtime_1.jsx)("div", { style: {
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                    gap: '16px'
                                }, children: reasons.map((reason, index) => ((0, jsx_runtime_1.jsxs)("div", { style: {
                                        border: '1px solid #eee',
                                        borderRadius: '8px',
                                        padding: '16px',
                                        backgroundColor: '#fafafa',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }, children: [(0, jsx_runtime_1.jsx)("div", { style: {
                                                width: '30px',
                                                height: '30px',
                                                borderRadius: '50%',
                                                backgroundColor: getRateColor(rate),
                                                color: 'white',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: 'bold',
                                                marginRight: '12px'
                                            }, children: index + 1 }), (0, jsx_runtime_1.jsx)("div", { style: {
                                                color: '#555'
                                            }, children: reason })] }, index))) })] }), (0, jsx_runtime_1.jsxs)("div", { style: {
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
                                }, children: [(0, jsx_runtime_1.jsx)("li", { children: "Improve communication between development and testing teams" }), (0, jsx_runtime_1.jsx)("li", { children: "Implement stricter acceptance criteria for defect fixes" }), (0, jsx_runtime_1.jsx)("li", { children: "Conduct root cause analysis for frequently reopened defects" }), (0, jsx_runtime_1.jsx)("li", { children: "Provide additional training for complex defect resolutions" })] })] })] })) : ((0, jsx_runtime_1.jsxs)("div", { style: {
                    backgroundColor: '#f8f9fa',
                    border: '1px dashed #ddd',
                    borderRadius: '8px',
                    padding: '20px',
                    textAlign: 'center',
                    color: '#666'
                }, children: [(0, jsx_runtime_1.jsx)("p", { children: "No defect reopen rate data available" }), (0, jsx_runtime_1.jsx)("pre", { style: {
                            textAlign: 'left',
                            whiteSpace: 'pre-wrap',
                            fontSize: '12px',
                            marginTop: '10px',
                            backgroundColor: '#fff',
                            padding: '10px',
                            borderRadius: '4px'
                        }, children: content })] }))] }));
};
exports.default = DefectReopenRateInfographic;
