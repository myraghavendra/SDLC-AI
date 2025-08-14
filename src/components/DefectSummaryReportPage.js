"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const Header_1 = __importDefault(require("./Header"));
const Footer_1 = __importDefault(require("./Footer"));
const DefectSummaryInfographic_1 = __importDefault(require("./DefectSummaryInfographic"));
// Import new infographic components
const RootCauseAnalysisInfographic_1 = __importDefault(require("./RootCauseAnalysisInfographic"));
const DefectDensityReportInfographic_1 = __importDefault(require("./DefectDensityReportInfographic"));
const DefectAgeingReportInfographic_1 = __importDefault(require("./DefectAgeingReportInfographic"));
const DefectDistributionInfographic_1 = __importDefault(require("./DefectDistributionInfographic"));
const DefectReopenRateInfographic_1 = __importDefault(require("./DefectReopenRateInfographic"));
// Import PDF generation libraries
const html2canvas_1 = __importDefault(require("html2canvas"));
const jspdf_1 = __importDefault(require("jspdf"));
const DefectSummaryReportPage = () => {
    const [jiraIssues, setJiraIssues] = (0, react_1.useState)([]);
    const [defectSummary, setDefectSummary] = (0, react_1.useState)('');
    const [defectSummaryData, setDefectSummaryData] = (0, react_1.useState)(null);
    const [loadingIssues, setLoadingIssues] = (0, react_1.useState)(false);
    const [loadingSummary, setLoadingSummary] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)('');
    const [jiraFilterId, setJiraFilterId] = (0, react_1.useState)('');
    const [analysis, setAnalysis] = (0, react_1.useState)('');
    const [jira_url, setjira_url] = (0, react_1.useState)('');
    // New state for detailed reports from backend
    const [detailedReports, setDetailedReports] = (0, react_1.useState)({});
    const [loadingReports, setLoadingReports] = (0, react_1.useState)(false);
    // New state for project keys dropdown
    const [projectKeys, setProjectKeys] = (0, react_1.useState)([]);
    const [selectedProjectKey, setSelectedProjectKey] = (0, react_1.useState)('');
    // New state for progress bar and tool selection
    const [currentStep, setCurrentStep] = (0, react_1.useState)(1);
    const [selectedTools, setSelectedTools] = (0, react_1.useState)({
        jira: false,
        rally: false,
        testrail: false,
    });
    // Refs for PDF generation
    const summaryRef = (0, react_1.useRef)(null);
    const rcaRef = (0, react_1.useRef)(null);
    const densityRef = (0, react_1.useRef)(null);
    const ageingRef = (0, react_1.useRef)(null);
    const distributionRef = (0, react_1.useRef)(null);
    const reopenRef = (0, react_1.useRef)(null);
    const fetchJiraIssues = async () => {
        setLoadingIssues(true);
        setLoadingSummary(true);
        const configResponse = await fetch('/api/getJiraConfig');
        const configData = await configResponse.json();
        const jira_url = configData.jira_url;
        const project_key = configData.project_key;
        // Removed debug console.log statements
        // console.log("jira urls is ", jira_url);
        // console.log("jira project_key is ", project_key);
        setError('');
        try {
            const response = await fetch('/api/getStoriesByFilter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tool: 'jira', jira_url: jira_url, filter_id: jiraFilterId, project_key: selectedProjectKey }),
            });
            const data = await response.json();
            console.log('data is ', data);
            console.log('response is ', response);
            if (data.error) {
                setError(data.error);
            }
            else {
                setJiraIssues(data.issues || []);
                setAnalysis(data.analysis || '');
                // Use the detailed reports data from getStoriesByFilter response
                if (data.detailedReports) {
                    setDetailedReports(data.detailedReports);
                    // Set defect summary data from the response
                    setDefectSummaryData({
                        projectName: selectedProjectKey,
                        totalDefects: data.totalDefects || 0,
                        statusBreakdown: data.statusBreakdown || {},
                        priorityBreakdown: data.priorityBreakdown || {},
                        analysis: data.analysis || ''
                    });
                    // Create summary text
                    let summary = `Defect Summary Report for ${selectedProjectKey}\n\n`;
                    summary += `Total Defects: ${data.totalDefects || 0}\n\n`;
                    if (data.statusBreakdown) {
                        summary += "Status Breakdown:\n";
                        for (const [status, count] of Object.entries(data.statusBreakdown)) {
                            summary += `- ${status}: ${count}\n`;
                        }
                        summary += "\n";
                    }
                    if (data.priorityBreakdown) {
                        summary += "Priority Breakdown:\n";
                        for (const [priority, count] of Object.entries(data.priorityBreakdown)) {
                            summary += `- ${priority}: ${count}\n`;
                        }
                        summary += "\n";
                    }
                    if (data.analysis) {
                        summary += "AI Analysis:\n" + data.analysis;
                    }
                    setDefectSummary(summary);
                }
                else if (data.issues && data.issues.length > 0) {
                    // Fallback to fetching defect summary report if detailedReports is not available
                    try {
                        setLoadingReports(true);
                        const defectResponse = await fetch('/api/defectSummaryReport', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ project_name: selectedProjectKey }),
                        });
                        const defectData = await defectResponse.json();
                        if (defectData.error) {
                            setError(defectData.error);
                        }
                        else {
                            if (defectData.result) {
                                // Old format
                                setDefectSummary(defectData.result);
                                setDefectSummaryData({
                                    projectName: selectedProjectKey,
                                    totalDefects: 0,
                                    statusBreakdown: {},
                                    priorityBreakdown: {},
                                    analysis: defectData.result
                                });
                                setDetailedReports({});
                            }
                            else {
                                setDefectSummaryData({
                                    projectName: selectedProjectKey,
                                    totalDefects: defectData.totalDefects || 0,
                                    statusBreakdown: defectData.statusBreakdown || {},
                                    priorityBreakdown: defectData.priorityBreakdown || {},
                                    analysis: defectData.analysis || ''
                                });
                                let summary = `Defect Summary Report for ${selectedProjectKey}\n\n`;
                                summary += `Total Defects: ${defectData.totalDefects || 0}\n\n`;
                                if (defectData.statusBreakdown) {
                                    summary += "Status Breakdown:\n";
                                    for (const [status, count] of Object.entries(defectData.statusBreakdown)) {
                                        summary += `- ${status}: ${count}\n`;
                                    }
                                    summary += "\n";
                                }
                                if (defectData.priorityBreakdown) {
                                    summary += "Priority Breakdown:\n";
                                    for (const [priority, count] of Object.entries(defectData.priorityBreakdown)) {
                                        summary += `- ${priority}: ${count}\n`;
                                    }
                                    summary += "\n";
                                }
                                if (defectData.analysis) {
                                    summary += "AI Analysis:\n" + defectData.analysis;
                                }
                                setDefectSummary(summary);
                                setDetailedReports(defectData.detailedReports || {});
                            }
                        }
                    }
                    catch (defectErr) {
                        setError('Failed to fetch defect summary report');
                    }
                    finally {
                        setLoadingReports(false);
                    }
                }
            }
        }
        catch (err) {
            setError('Failed to fetch Jira issues');
        }
        finally {
            setLoadingIssues(false);
            setLoadingSummary(false);
        }
    };
    // Handler for checkbox changes
    const handleToolChange = (tool) => {
        setSelectedTools(prev => ({
            ...prev,
            [tool]: !prev[tool],
        }));
    };
    // Handler for next step button
    const handleNextStep = () => {
        if (currentStep === 1) {
            // Validate at least one tool selected
            if (!selectedTools.jira && !selectedTools.rally && !selectedTools.testrail) {
                setError('Please select at least one tool to proceed.');
                return;
            }
            setError('');
            setCurrentStep(2);
        }
        else if (currentStep === 2) {
            // If Jira selected, validate Jira Filter ID
            if (selectedTools.jira && !jiraFilterId.trim()) {
                setError('Please enter Jira Filter ID.');
                return;
            }
            setError('');
            setCurrentStep(3);
            // Trigger fetching issues and defect summary for Jira if selected
            if (selectedTools.jira) {
                fetchJiraIssues();
            }
            // For Rally and TestRail, placeholders or future implementation
        }
    };
    // Handler for previous step button
    const handlePrevStep = () => {
        if (currentStep > 1) {
            setError('');
            setCurrentStep(currentStep - 1);
        }
    };
    // Function to generate and download PDF
    const generatePDF = async () => {
        const pdf = new jspdf_1.default('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        // Add cover page
        pdf.setFontSize(22);
        pdf.text('Defect Summary Report', pdfWidth / 2, 80, { align: 'center' });
        pdf.setFontSize(16);
        pdf.text(selectedProjectKey ? `Project: ${selectedProjectKey}` : 'Project: Not Selected', pdfWidth / 2, 100, { align: 'center' });
        pdf.setFontSize(12);
        pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pdfWidth / 2, 120, { align: 'center' });
        // Add page numbers
        pdf.setFontSize(10);
        pdf.text('Page 1', pdfWidth - 20, pdfHeight - 10);
        // Add Defect Summary as infographic image
        if (summaryRef.current) {
            pdf.addPage();
            pdf.setFontSize(18);
            pdf.text('Defect Summary', 10, 15);
            try {
                // Wait a short delay to ensure rendering
                await new Promise(resolve => setTimeout(resolve, 500));
                // Capture the summary infographic element as canvas
                const canvas = await (0, html2canvas_1.default)(summaryRef.current, {
                    scale: 5,
                    useCORS: true,
                    logging: true,
                    backgroundColor: '#ffffff',
                    scrollX: 0,
                    scrollY: -window.scrollY,
                    windowWidth: document.documentElement.offsetWidth,
                    windowHeight: document.documentElement.offsetHeight
                });
                // Convert canvas to image
                const imgData = canvas.toDataURL('image/png');
                const imgWidth = pdfWidth - 20;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                // Add image to PDF with page breaks if needed
                let position = 25;
                if (imgHeight > pdfHeight - 30) {
                    let remainingHeight = imgHeight;
                    while (remainingHeight > 0) {
                        if (position > 25) {
                            pdf.addPage();
                        }
                        const heightToUse = Math.min(remainingHeight, pdfHeight - 30);
                        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, heightToUse);
                        remainingHeight -= heightToUse;
                        position = 25;
                    }
                }
                else {
                    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                }
            }
            catch (error) {
                console.error('Error capturing Defect Summary:', error);
                pdf.setFontSize(12);
                pdf.text('Failed to capture Defect Summary infographic', 10, 35);
            }
            // Add page number
            let pageCount = pdf.getNumberOfPages();
            pdf.setPage(pageCount);
            pdf.setFontSize(10);
            pdf.text(`Page ${pageCount}`, pdfWidth - 20, pdfHeight - 10);
        }
        // Add other infographic sections as images
        const elementsToCapture = [
            { ref: rcaRef, title: 'Root Cause Analysis (RCA)' },
            { ref: densityRef, title: 'Defect Density Report' },
            { ref: ageingRef, title: 'Defect Ageing Report' },
            { ref: distributionRef, title: 'Defect Distribution by Assignee/Team' },
            { ref: reopenRef, title: 'Defect Reopen Rate' }
        ];
        for (let i = 0; i < elementsToCapture.length; i++) {
            const { ref, title } = elementsToCapture[i];
            if (ref.current) {
                pdf.addPage();
                pdf.setFontSize(18);
                pdf.text(title, 10, 15);
                try {
                    // Wait a short delay to ensure rendering
                    await new Promise(resolve => setTimeout(resolve, 500));
                    // Capture the element as canvas with improved options
                    const canvas = await (0, html2canvas_1.default)(ref.current, {
                        scale: 3,
                        useCORS: true,
                        logging: true,
                        backgroundColor: '#ffffff',
                        scrollX: 0,
                        scrollY: -window.scrollY,
                        windowWidth: document.documentElement.offsetWidth,
                        windowHeight: document.documentElement.offsetHeight
                    });
                    // Convert canvas to image
                    const imgData = canvas.toDataURL('image/png');
                    const imgWidth = pdfWidth - 20;
                    const imgHeight = (canvas.height * imgWidth) / canvas.width;
                    // Add image to PDF with page breaks if needed
                    let position = 25;
                    if (imgHeight > pdfHeight - 30) {
                        let remainingHeight = imgHeight;
                        while (remainingHeight > 0) {
                            if (position > 25) {
                                pdf.addPage();
                            }
                            const heightToUse = Math.min(remainingHeight, pdfHeight - 30);
                            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, heightToUse);
                            remainingHeight -= heightToUse;
                            position = 25;
                        }
                    }
                    else {
                        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                    }
                }
                catch (error) {
                    console.error(`Error capturing ${title}:`, error);
                    pdf.setFontSize(12);
                    pdf.text(`Failed to capture ${title}`, 10, 35);
                }
                // Add page number
                const pageCount = pdf.getNumberOfPages();
                pdf.setPage(pageCount);
                pdf.setFontSize(10);
                pdf.text(`Page ${pageCount}`, pdfWidth - 20, pdfHeight - 10);
            }
        }
        // Save the PDF
        pdf.save(`DefectSummaryReport_${selectedProjectKey || 'Project'}_${new Date().toISOString().split('T')[0]}.pdf`);
    };
    (0, react_1.useEffect)(() => {
        // Removed automatic call to defectSummaryReport on component mount
        // Fetch Jira projects for project_key dropdown
        const fetchJiraProjects = async () => {
            try {
                const response = await fetch('/api/getJiraProjects');
                const data = await response.json();
                if (data.projects) {
                    setProjectKeys(data.projects);
                    if (data.projects.length > 0) {
                        setSelectedProjectKey(data.projects[0].key);
                    }
                }
                else if (data.error) {
                    setError(data.error);
                }
            }
            catch (err) {
                setError('Failed to fetch Jira projects');
            }
        };
        fetchJiraProjects();
    }, []);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Header_1.default, {}), (0, jsx_runtime_1.jsxs)("div", { style: { maxWidth: 900, margin: '0 auto', padding: 24, fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }, children: [(0, jsx_runtime_1.jsx)("h2", { style: { textAlign: 'center', marginBottom: 24 }, children: "Data Analyst Agent" }), error && (0, jsx_runtime_1.jsx)("p", { style: { color: 'red', textAlign: 'center' }, children: error }), (0, jsx_runtime_1.jsx)("div", { style: { display: 'flex', alignItems: 'center', marginBottom: 32 }, children: [
                            { label: 'Select Tools' },
                            { label: 'Configure Filters' },
                            { label: 'Analyze Defects' },
                        ].map((stage, idx) => {
                            const active = currentStep === idx + 1;
                            const completed = currentStep > idx + 1;
                            return ((0, jsx_runtime_1.jsxs)(react_1.default.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { style: {
                                            width: 36, height: 36, borderRadius: '50%',
                                            background: completed ? '#4caf50' : active ? '#2196f3' : '#e0e0e0',
                                            color: completed || active ? '#fff' : '#888',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontWeight: 'bold', fontSize: 18,
                                            border: active ? '2px solid #1976d2' : '2px solid #e0e0e0',
                                            transition: 'background 0.2s',
                                        }, children: idx + 1 }), idx < 2 && ((0, jsx_runtime_1.jsx)("div", { style: { flex: 1, height: 4, background: completed ? '#4caf50' : '#e0e0e0' } }))] }, stage.label));
                        }) }), currentStep === 1 && ((0, jsx_runtime_1.jsxs)("section", { children: [(0, jsx_runtime_1.jsx)("h3", { children: "Select Tools" }), (0, jsx_runtime_1.jsxs)("label", { style: { display: 'block', marginBottom: 8 }, children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: selectedTools.jira, onChange: () => handleToolChange('jira') }), ' ', "Jira"] }), (0, jsx_runtime_1.jsxs)("label", { style: { display: 'block', marginBottom: 8 }, children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: selectedTools.rally, onChange: () => handleToolChange('rally'), disabled: true }), ' ', "Rally (Coming Soon)"] }), (0, jsx_runtime_1.jsxs)("label", { style: { display: 'block', marginBottom: 8 }, children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: selectedTools.testrail, onChange: () => handleToolChange('testrail'), disabled: true }), ' ', "TestRail (Coming Soon)"] }), (0, jsx_runtime_1.jsx)("button", { onClick: handleNextStep, style: { marginTop: 16, padding: '8px 16px' }, children: "Next" })] })), currentStep === 2 && ((0, jsx_runtime_1.jsxs)("section", { children: [(0, jsx_runtime_1.jsx)("h3", { children: "Configure Filters" }), selectedTools.jira && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("h4", { children: "Jira Filter ID" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: jiraFilterId, onChange: (e) => setJiraFilterId(e.target.value), placeholder: "Enter Jira Filter ID", style: { padding: 8, width: '100%', maxWidth: 300, marginBottom: 12 } }), (0, jsx_runtime_1.jsx)("h4", { children: "Jira Project Key" }), (0, jsx_runtime_1.jsx)("select", { value: selectedProjectKey, onChange: (e) => setSelectedProjectKey(e.target.value), style: { padding: 8, width: '100%', maxWidth: 300, marginBottom: 12 }, children: projectKeys.map((project) => ((0, jsx_runtime_1.jsxs)("option", { value: project.key, children: [project.name, " (", project.key, ")"] }, project.key))) })] })), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("button", { onClick: handlePrevStep, style: { padding: '8px 16px', marginRight: 8 }, children: "Back" }), (0, jsx_runtime_1.jsx)("button", { onClick: handleNextStep, style: { padding: '8px 16px' }, children: "Next" })] })] })), currentStep === 3 && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { style: { display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }, children: (0, jsx_runtime_1.jsx)("button", { onClick: generatePDF, style: {
                                        padding: '10px 20px',
                                        backgroundColor: '#4a90e2',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '16px'
                                    }, children: "Download PDF Report" }) }), (0, jsx_runtime_1.jsxs)("section", { style: { marginTop: 32 }, children: [(0, jsx_runtime_1.jsx)("h3", { children: "Defect Reports" }), loadingSummary || loadingReports ? ((0, jsx_runtime_1.jsx)("p", { children: "Loading defect reports..." })) : ((0, jsx_runtime_1.jsxs)(react_1.default.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { ref: summaryRef, children: defectSummaryData && (0, jsx_runtime_1.jsx)(DefectSummaryInfographic_1.default, { data: defectSummaryData }) }), detailedReports && Object.keys(detailedReports).length > 0 && ((0, jsx_runtime_1.jsxs)(react_1.default.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { ref: rcaRef, children: detailedReports["Root Cause Analysis (RCA)"] && ((0, jsx_runtime_1.jsx)(RootCauseAnalysisInfographic_1.default, { content: detailedReports["Root Cause Analysis (RCA)"] })) }), (0, jsx_runtime_1.jsx)("div", { ref: densityRef, children: detailedReports["Defect Density Report"] && ((0, jsx_runtime_1.jsx)(DefectDensityReportInfographic_1.default, { content: detailedReports["Defect Density Report"] })) }), (0, jsx_runtime_1.jsx)("div", { ref: ageingRef, children: detailedReports["Defect Ageing Report"] && ((0, jsx_runtime_1.jsx)(DefectAgeingReportInfographic_1.default, { content: detailedReports["Defect Ageing Report"] })) }), (0, jsx_runtime_1.jsx)("div", { ref: distributionRef, children: detailedReports["Defect Distribution by Assignee/Team"] && ((0, jsx_runtime_1.jsx)(DefectDistributionInfographic_1.default, { content: detailedReports["Defect Distribution by Assignee/Team"] })) }), (0, jsx_runtime_1.jsx)("div", { ref: reopenRef, children: detailedReports["Defect Reopen Rate"] && ((0, jsx_runtime_1.jsx)(DefectReopenRateInfographic_1.default, { content: detailedReports["Defect Reopen Rate"] })) })] }))] }))] })] }))] }), (0, jsx_runtime_1.jsx)(Footer_1.default, {})] }));
};
exports.default = DefectSummaryReportPage;
