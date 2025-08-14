"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const Header_1 = __importDefault(require("./Header"));
const Footer_1 = __importDefault(require("./Footer"));
const jspdf_1 = __importDefault(require("jspdf"));
const html2canvas_1 = __importDefault(require("html2canvas"));
const RequirementAnalysisResultsPage = () => {
    const location = (0, react_router_dom_1.useLocation)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const { storyKey } = (0, react_router_dom_1.useParams)();
    // The analysisResult is passed via location.state from RequirementAnalyserPage
    const analysisResult = location.state?.analysisResult;
    // Ref for the content to be exported as PDF
    const contentRef = (0, react_1.useRef)(null);
    // State for expand/collapse sections
    const [expandedSections, setExpandedSections] = (0, react_1.useState)({
        storyScore: true,
        requirementClassification: false,
        gapConflictAnalysis: false,
        complianceSecurity: false,
        visualization: false,
        changeImpactAnalysis: false,
    });
    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section],
        }));
    };
    const handleDownloadPDF = () => {
        if (!contentRef.current)
            return;
        // Save current expanded state
        const prevExpandedSections = { ...expandedSections };
        // Expand all sections
        setExpandedSections({
            storyScore: true,
            requirementClassification: true,
            gapConflictAnalysis: true,
            complianceSecurity: true,
            visualization: true,
            changeImpactAnalysis: true,
        });
        // Wait for state update and DOM re-render
        setTimeout(() => {
            const input = contentRef.current;
            if (!input)
                return;
            // Add page-break CSS class to content before capture
            if (input) {
                const pageBreakElements = input.querySelectorAll('.page-break');
                pageBreakElements.forEach(el => {
                    el.style.pageBreakAfter = 'always';
                });
            }
            (0, html2canvas_1.default)(input, { scale: 3, useCORS: true, scrollY: -window.scrollY }).then(canvas => {
                const pdf = new jspdf_1.default('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                const margin = 10; // 10mm margin
                const headerHeight = 10;
                const footerHeight = 10;
                const contentHeight = pdfHeight - headerHeight - footerHeight;
                const totalPages = Math.ceil(canvas.height / (contentHeight * (canvas.width / pdfWidth)));
                const addHeaderAndFooter = (pageNum, totalPages) => {
                    pdf.setFontSize(12);
                    pdf.text('Requirement Analysis Results', margin, 10);
                    pdf.text(`Page ${pageNum} of ${totalPages}`, pdfWidth - margin - 30, pdfHeight - 10);
                };
                for (let pageNum = 0; pageNum < totalPages; pageNum++) {
                    if (pageNum > 0) {
                        pdf.addPage();
                    }
                    addHeaderAndFooter(pageNum + 1, totalPages);
                    const canvasPage = document.createElement('canvas');
                    canvasPage.width = canvas.width;
                    canvasPage.height = contentHeight * (canvas.width / pdfWidth);
                    const ctx = canvasPage.getContext('2d');
                    if (ctx) {
                        ctx.fillStyle = 'white';
                        ctx.fillRect(0, 0, canvasPage.width, canvasPage.height);
                        ctx.drawImage(canvas, 0, pageNum * canvasPage.height, canvasPage.width, canvasPage.height, 0, 0, canvasPage.width, canvasPage.height);
                    }
                    const imgData = canvasPage.toDataURL('image/png');
                    pdf.addImage(imgData, 'PNG', margin, headerHeight, pdfWidth - 2 * margin, contentHeight);
                }
                pdf.save(`Requirement_Analysis_Results_${storyKey || 'result'}.pdf`);
                // Restore previous expanded state
                setExpandedSections(prevExpandedSections);
            });
        }, 300); // delay to allow re-render
    };
    if (!analysisResult) {
        return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Header_1.default, {}), (0, jsx_runtime_1.jsx)("div", { style: { maxWidth: 900, margin: '0 auto', padding: 24, fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }, children: (0, jsx_runtime_1.jsxs)("div", { style: {
                            backgroundColor: '#ffffff',
                            borderRadius: '12px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            padding: '32px',
                            marginBottom: '24px'
                        }, children: [(0, jsx_runtime_1.jsx)("h2", { style: {
                                    color: '#2c3e50',
                                    borderBottom: '2px solid #3498db',
                                    paddingBottom: '16px',
                                    marginBottom: '24px'
                                }, children: "Requirement Analysis Results" }), (0, jsx_runtime_1.jsxs)("div", { style: {
                                    backgroundColor: '#f8f9fa',
                                    border: '1px solid #e9ecef',
                                    borderRadius: '8px',
                                    padding: '24px',
                                    textAlign: 'center'
                                }, children: [(0, jsx_runtime_1.jsxs)("p", { style: {
                                            fontSize: '18px',
                                            color: '#6c757d',
                                            marginBottom: '24px'
                                        }, children: ["No analysis results found for story key: ", (0, jsx_runtime_1.jsx)("strong", { children: storyKey })] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => navigate(-1), style: {
                                            backgroundColor: '#007bff',
                                            color: 'white',
                                            border: 'none',
                                            padding: '12px 24px',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontSize: '16px',
                                            fontWeight: '600',
                                            transition: 'background-color 0.2s'
                                        }, onMouseOver: (e) => (e.currentTarget.style.backgroundColor = '#0056b3'), onMouseOut: (e) => (e.currentTarget.style.backgroundColor = '#007bff'), children: "Go Back" })] })] }) }), (0, jsx_runtime_1.jsx)(Footer_1.default, {})] }));
    }
    const { story_score, story_score_justification, change_impact_analysis, requirement_visualization, compliance_security, gap_conflict_analysis, requirement_classification, story_heading } = analysisResult;
    // Determine score color based on value
    const getScoreColor = (score) => {
        if (score >= 80)
            return '#28a745'; // Green
        if (score >= 60)
            return '#ffc107'; // Yellow
        return '#dc3545'; // Red
    };
    // Determine score label based on value
    const getScoreLabel = (score) => {
        if (score >= 80)
            return 'Excellent';
        if (score >= 60)
            return 'Good';
        if (score >= 40)
            return 'Fair';
        return 'Poor';
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Header_1.default, {}), (0, jsx_runtime_1.jsx)("div", { style: { maxWidth: 900, margin: '0 auto', padding: '24px', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }, children: (0, jsx_runtime_1.jsxs)("div", { style: {
                        backgroundColor: '#ffffff',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        padding: '32px',
                        marginBottom: '24px'
                    }, children: [(0, jsx_runtime_1.jsxs)("div", { style: {
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: '16px',
                                marginBottom: '24px'
                            }, children: [(0, jsx_runtime_1.jsx)("h2", { style: {
                                        color: '#2c3e50',
                                        margin: 0,
                                        fontSize: '28px'
                                    }, children: story_heading ? story_heading : `Requirement Analysis Results for Story: ${storyKey}` }), (0, jsx_runtime_1.jsx)("button", { onClick: handleDownloadPDF, style: {
                                        backgroundColor: '#28a745',
                                        color: 'white',
                                        border: 'none',
                                        padding: '12px 24px',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        transition: 'background-color 0.2s',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                    }, onMouseOver: (e) => (e.currentTarget.style.backgroundColor = '#218838'), onMouseOut: (e) => (e.currentTarget.style.backgroundColor = '#28a745'), children: "Download PDF" })] }), (0, jsx_runtime_1.jsxs)("div", { ref: contentRef, children: [(0, jsx_runtime_1.jsxs)("div", { style: {
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '8px',
                                        padding: '24px',
                                        marginBottom: '24px',
                                        border: '1px solid #e9ecef'
                                    }, children: [(0, jsx_runtime_1.jsxs)("h3", { style: {
                                                margin: '0 0 16px 0',
                                                color: '#2c3e50',
                                                display: 'flex',
                                                alignItems: 'center',
                                                cursor: 'pointer'
                                            }, onClick: () => toggleSection('storyScore'), children: [(0, jsx_runtime_1.jsx)("span", { style: {
                                                        marginRight: '12px',
                                                        fontSize: '18px',
                                                        transition: 'transform 0.2s'
                                                    }, children: expandedSections.storyScore ? '▼' : '▶' }), "Story Score (Clarity & Readiness Index)"] }), expandedSections.storyScore && ((0, jsx_runtime_1.jsxs)("div", { id: "storyScoreContent", children: [(0, jsx_runtime_1.jsxs)("div", { style: {
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '24px',
                                                        marginBottom: '24px',
                                                        flexWrap: 'wrap'
                                                    }, children: [(0, jsx_runtime_1.jsx)("div", { style: {
                                                                width: '100%',
                                                                maxWidth: '400px',
                                                                background: '#e9ecef',
                                                                borderRadius: '12px',
                                                                overflow: 'hidden',
                                                                height: '32px'
                                                            }, children: (0, jsx_runtime_1.jsx)("div", { style: {
                                                                    width: `${story_score}%`,
                                                                    background: getScoreColor(story_score),
                                                                    height: '100%',
                                                                    transition: 'width 0.5s ease-in-out',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'flex-end',
                                                                    paddingRight: '12px'
                                                                }, children: (0, jsx_runtime_1.jsxs)("span", { style: {
                                                                        color: 'white',
                                                                        fontWeight: 'bold',
                                                                        fontSize: '14px',
                                                                        textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                                                                    }, children: [story_score, "%"] }) }) }), (0, jsx_runtime_1.jsxs)("div", { style: {
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                alignItems: 'center',
                                                                minWidth: '100px'
                                                            }, children: [(0, jsx_runtime_1.jsx)("span", { style: {
                                                                        fontWeight: 'bold',
                                                                        fontSize: '24px',
                                                                        color: getScoreColor(story_score)
                                                                    }, children: story_score }), (0, jsx_runtime_1.jsx)("span", { style: {
                                                                        fontSize: '14px',
                                                                        color: '#6c757d'
                                                                    }, children: getScoreLabel(story_score) })] })] }), (0, jsx_runtime_1.jsxs)("div", { style: {
                                                        backgroundColor: '#ffffff',
                                                        border: '1px solid #e9ecef',
                                                        borderRadius: '8px',
                                                        padding: '20px',
                                                        whiteSpace: 'pre-wrap'
                                                    }, children: [(0, jsx_runtime_1.jsx)("h4", { style: {
                                                                margin: '0 0 12px 0',
                                                                color: '#495057'
                                                            }, children: "Score Justification" }), (0, jsx_runtime_1.jsx)("p", { style: {
                                                                margin: 0,
                                                                color: '#495057',
                                                                lineHeight: '1.6'
                                                            }, children: story_score_justification })] })] }))] }), change_impact_analysis && ((0, jsx_runtime_1.jsxs)("div", { style: {
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '8px',
                                        padding: '24px',
                                        marginBottom: '24px',
                                        border: '1px solid #e9ecef'
                                    }, children: [(0, jsx_runtime_1.jsxs)("h3", { style: {
                                                margin: '0 0 16px 0',
                                                color: '#2c3e50',
                                                display: 'flex',
                                                alignItems: 'center',
                                                cursor: 'pointer'
                                            }, onClick: () => toggleSection('changeImpactAnalysis'), children: [(0, jsx_runtime_1.jsx)("span", { style: {
                                                        marginRight: '12px',
                                                        fontSize: '18px',
                                                        transition: 'transform 0.2s'
                                                    }, children: expandedSections.changeImpactAnalysis ? '▼' : '▶' }), "Change Impact Analysis"] }), expandedSections.changeImpactAnalysis && ((0, jsx_runtime_1.jsx)("div", { id: "changeImpactAnalysisContent", style: {
                                                backgroundColor: '#ffffff',
                                                border: '1px solid #e9ecef',
                                                borderRadius: '8px',
                                                padding: '20px',
                                                whiteSpace: 'pre-wrap'
                                            }, children: (0, jsx_runtime_1.jsx)("p", { style: {
                                                    margin: 0,
                                                    color: '#495057',
                                                    lineHeight: '1.6'
                                                }, children: change_impact_analysis }) }))] })), requirement_visualization && ((0, jsx_runtime_1.jsxs)("div", { style: {
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '8px',
                                        padding: '24px',
                                        marginBottom: '24px',
                                        border: '1px solid #e9ecef'
                                    }, children: [(0, jsx_runtime_1.jsxs)("h3", { style: {
                                                margin: '0 0 16px 0',
                                                color: '#2c3e50',
                                                display: 'flex',
                                                alignItems: 'center',
                                                cursor: 'pointer'
                                            }, onClick: () => toggleSection('visualization'), children: [(0, jsx_runtime_1.jsx)("span", { style: {
                                                        marginRight: '12px',
                                                        fontSize: '18px',
                                                        transition: 'transform 0.2s'
                                                    }, children: expandedSections.visualization ? '▼' : '▶' }), "Requirement Visualization"] }), expandedSections.visualization && ((0, jsx_runtime_1.jsx)("div", { id: "visualizationContent", style: {
                                                backgroundColor: '#ffffff',
                                                border: '1px solid #e9ecef',
                                                borderRadius: '8px',
                                                padding: '20px',
                                                whiteSpace: 'pre-wrap'
                                            }, children: (0, jsx_runtime_1.jsx)("p", { style: {
                                                    margin: 0,
                                                    color: '#495057',
                                                    lineHeight: '1.6'
                                                }, children: requirement_visualization }) }))] })), compliance_security && ((0, jsx_runtime_1.jsxs)("div", { style: {
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '8px',
                                        padding: '24px',
                                        marginBottom: '24px',
                                        border: '1px solid #e9ecef'
                                    }, children: [(0, jsx_runtime_1.jsxs)("h3", { style: {
                                                margin: '0 0 16px 0',
                                                color: '#2c3e50',
                                                display: 'flex',
                                                alignItems: 'center',
                                                cursor: 'pointer'
                                            }, onClick: () => toggleSection('complianceSecurity'), children: [(0, jsx_runtime_1.jsx)("span", { style: {
                                                        marginRight: '12px',
                                                        fontSize: '18px',
                                                        transition: 'transform 0.2s'
                                                    }, children: expandedSections.complianceSecurity ? '▼' : '▶' }), "Compliance & Security Checks"] }), expandedSections.complianceSecurity && ((0, jsx_runtime_1.jsx)("div", { id: "complianceSecurityContent", style: {
                                                backgroundColor: '#ffffff',
                                                border: '1px solid #e9ecef',
                                                borderRadius: '8px',
                                                padding: '20px',
                                                whiteSpace: 'pre-wrap'
                                            }, children: (0, jsx_runtime_1.jsx)("p", { style: {
                                                    margin: 0,
                                                    color: '#495057',
                                                    lineHeight: '1.6'
                                                }, children: compliance_security }) }))] })), gap_conflict_analysis && ((0, jsx_runtime_1.jsxs)("div", { style: {
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '8px',
                                        padding: '24px',
                                        marginBottom: '24px',
                                        border: '1px solid #e9ecef'
                                    }, children: [(0, jsx_runtime_1.jsxs)("h3", { style: {
                                                margin: '0 0 16px 0',
                                                color: '#2c3e50',
                                                display: 'flex',
                                                alignItems: 'center',
                                                cursor: 'pointer'
                                            }, onClick: () => toggleSection('gapConflictAnalysis'), children: [(0, jsx_runtime_1.jsx)("span", { style: {
                                                        marginRight: '12px',
                                                        fontSize: '18px',
                                                        transition: 'transform 0.2s'
                                                    }, children: expandedSections.gapConflictAnalysis ? '▼' : '▶' }), "Gap & Conflict Analysis"] }), expandedSections.gapConflictAnalysis && ((0, jsx_runtime_1.jsx)("div", { id: "gapConflictAnalysisContent", style: {
                                                backgroundColor: '#ffffff',
                                                border: '1px solid #e9ecef',
                                                borderRadius: '8px',
                                                padding: '20px',
                                                whiteSpace: 'pre-wrap'
                                            }, children: (0, jsx_runtime_1.jsx)("p", { style: {
                                                    margin: 0,
                                                    color: '#495057',
                                                    lineHeight: '1.6'
                                                }, children: gap_conflict_analysis }) }))] })), requirement_classification && ((0, jsx_runtime_1.jsxs)("div", { style: {
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '8px',
                                        padding: '24px',
                                        marginBottom: '24px',
                                        border: '1px solid #e9ecef'
                                    }, children: [(0, jsx_runtime_1.jsxs)("h3", { style: {
                                                margin: '0 0 16px 0',
                                                color: '#2c3e50',
                                                display: 'flex',
                                                alignItems: 'center',
                                                cursor: 'pointer'
                                            }, onClick: () => toggleSection('requirementClassification'), children: [(0, jsx_runtime_1.jsx)("span", { style: {
                                                        marginRight: '12px',
                                                        fontSize: '18px',
                                                        transition: 'transform 0.2s'
                                                    }, children: expandedSections.requirementClassification ? '▼' : '▶' }), "Requirement Classification & Extraction"] }), expandedSections.requirementClassification && ((0, jsx_runtime_1.jsx)("div", { id: "requirementClassificationContent", style: {
                                                backgroundColor: '#ffffff',
                                                border: '1px solid #e9ecef',
                                                borderRadius: '8px',
                                                padding: '20px',
                                                whiteSpace: 'pre-wrap'
                                            }, children: (0, jsx_runtime_1.jsx)("p", { style: {
                                                    margin: 0,
                                                    color: '#495057',
                                                    lineHeight: '1.6'
                                                }, children: requirement_classification }) }))] }))] }), (0, jsx_runtime_1.jsx)("div", { style: {
                                display: 'flex',
                                justifyContent: 'center',
                                marginTop: '32px'
                            }, children: (0, jsx_runtime_1.jsx)("button", { onClick: () => navigate(-1), style: {
                                    backgroundColor: '#6c757d',
                                    color: 'white',
                                    border: 'none',
                                    padding: '12px 24px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    transition: 'background-color 0.2s',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }, onMouseOver: (e) => (e.currentTarget.style.backgroundColor = '#5a6268'), onMouseOut: (e) => (e.currentTarget.style.backgroundColor = '#6c757d'), children: "Back to Analysis" }) })] }) }), (0, jsx_runtime_1.jsx)(Footer_1.default, {})] }));
};
exports.default = RequirementAnalysisResultsPage;
