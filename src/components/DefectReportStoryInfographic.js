"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const DefectReportStoryInfographic = ({ projectName, totalDefects, statusBreakdown, priorityBreakdown, analysis, detailedReports, }) => {
    return ((0, jsx_runtime_1.jsxs)("div", { style: {
            backgroundColor: '#fefefe',
            borderRadius: 12,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            padding: 24,
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            maxWidth: 900,
            margin: '0 auto',
        }, children: [(0, jsx_runtime_1.jsxs)("h2", { style: { textAlign: 'center', color: '#2c3e50' }, children: ["Defect Report Story for ", projectName] }), (0, jsx_runtime_1.jsxs)("section", { style: { marginTop: 24 }, children: [(0, jsx_runtime_1.jsx)("h3", { style: { borderBottom: '2px solid #3498db', paddingBottom: 8, color: '#2980b9' }, children: "Overview" }), (0, jsx_runtime_1.jsxs)("p", { style: { fontSize: 18, color: '#34495e' }, children: ["Total Defects: ", (0, jsx_runtime_1.jsx)("strong", { children: totalDefects })] })] }), (0, jsx_runtime_1.jsxs)("section", { style: { marginTop: 24 }, children: [(0, jsx_runtime_1.jsx)("h3", { style: { borderBottom: '2px solid #3498db', paddingBottom: 8, color: '#2980b9' }, children: "Status Breakdown" }), (0, jsx_runtime_1.jsx)("ul", { style: { listStyleType: 'none', paddingLeft: 0 }, children: Object.entries(statusBreakdown).map(([status, count]) => ((0, jsx_runtime_1.jsxs)("li", { style: { marginBottom: 6, fontSize: 16, color: '#34495e' }, children: [(0, jsx_runtime_1.jsxs)("strong", { children: [status, ":"] }), " ", count] }, status))) })] }), (0, jsx_runtime_1.jsxs)("section", { style: { marginTop: 24 }, children: [(0, jsx_runtime_1.jsx)("h3", { style: { borderBottom: '2px solid #3498db', paddingBottom: 8, color: '#2980b9' }, children: "Priority Breakdown" }), (0, jsx_runtime_1.jsx)("ul", { style: { listStyleType: 'none', paddingLeft: 0 }, children: Object.entries(priorityBreakdown).map(([priority, count]) => ((0, jsx_runtime_1.jsxs)("li", { style: { marginBottom: 6, fontSize: 16, color: '#34495e' }, children: [(0, jsx_runtime_1.jsxs)("strong", { children: [priority, ":"] }), " ", count] }, priority))) })] }), (0, jsx_runtime_1.jsxs)("section", { style: { marginTop: 24 }, children: [(0, jsx_runtime_1.jsx)("h3", { style: { borderBottom: '2px solid #3498db', paddingBottom: 8, color: '#2980b9' }, children: "AI Analysis Summary" }), (0, jsx_runtime_1.jsx)("p", { style: { fontSize: 16, color: '#2c3e50', whiteSpace: 'pre-wrap' }, children: analysis || 'No AI analysis available.' })] }), (0, jsx_runtime_1.jsxs)("section", { style: { marginTop: 24 }, children: [(0, jsx_runtime_1.jsx)("h3", { style: { borderBottom: '2px solid #3498db', paddingBottom: 8, color: '#2980b9' }, children: "Detailed Defect Reports Story" }), Object.entries(detailedReports).map(([title, content]) => ((0, jsx_runtime_1.jsxs)("article", { style: {
                            backgroundColor: '#ecf0f1',
                            borderRadius: 8,
                            padding: 16,
                            marginBottom: 16,
                            boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                        }, children: [(0, jsx_runtime_1.jsx)("h4", { style: { color: '#34495e', marginBottom: 8 }, children: title }), (0, jsx_runtime_1.jsx)("p", { style: { whiteSpace: 'pre-wrap', color: '#2c3e50', fontSize: 14 }, children: content })] }, title)))] })] }));
};
exports.default = DefectReportStoryInfographic;
