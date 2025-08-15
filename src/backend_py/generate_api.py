import logging
import os
import re
import traceback
from typing import Optional

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from openai import OpenAI

from src.backend_py.config import get_openai_api_key, is_openai_configured

logger = logging.getLogger(__name__)
router = APIRouter()

# Get OpenAI API key
openai_api_key = get_openai_api_key()

class GenerateRequest(BaseModel):
    description: str = Field(..., description="User story description")
    context: Optional[str] = Field(None, description="Optional context")
    framework: Optional[str] = Field(None, description="Test framework (Cypress, Selenium, Playwright)")

class GenerateResponse(BaseModel):
    acceptanceCriteria: str
    technicalNotes: str
    testCode: str
    framework: str

@router.get("/api/health")
async def health_check():
    """Health check endpoint to verify API is running"""
    openai_status = "configured" if is_openai_configured() else "not configured"
    return {
        "status": "healthy", 
        "endpoint": "/api/generate", 
        "method": "POST",
        "openai_configured": openai_status
    }

@router.post("/api/generate")
async def generate(request: GenerateRequest):
    logger.info(f"Received POST request to /api/generate with body: {request.dict()}")
    
    # Validate OpenAI configuration
    if not is_openai_configured():
        logger.error("OpenAI API key not configured")
        raise HTTPException(
            status_code=503, 
            detail="OpenAI API key not configured. Please set OPENAI_API_KEY environment variable."
        )
    
    if not request.description or not request.description.strip():
        logger.warning("Missing or empty description in request")
        raise HTTPException(status_code=400, detail="Description is required and cannot be empty")

    framework = request.framework or "None"
    framework = framework.strip()
    
    # Determine language for framework
    framework_language = "JavaScript" if framework.lower() == "cypress" else \
                        ("Java" if framework.lower() == "selenium" else \
                        ("TypeScript" if framework.lower() == "playwright" else ""))

    prompt = f"""
You are a software development assistant.

Given the following user story description and optional context, generate:
 
1. Acceptance Criteria in Gherkin syntax (Given, When, Then)
2. Technical Notes detailing recommended technology stack for development
3. Automation Test Code in the selected framework: {framework} using {framework_language} (if 'None', skip this step)

User Story Description:
{request.description}

Context:
{request.context or 'None'}

Output format:
Acceptance Criteria:
<gherkin syntax>

Technical Notes:
<technology stack recommendations>

Automation Test Code:
<test code in {framework} using {framework_language}>
"""

    try:
        client = OpenAI(api_key=openai_api_key)
        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt},
            ],
            max_tokens=500,
            temperature=0.7,
        )
        output = completion.choices[0].message.content.strip()

        # Parse the response
        acceptance_criteria_match = re.search(r"Acceptance Criteria:(.*?)(Technical Notes:|$)", output, re.DOTALL)
        technical_notes_match = re.search(r"Technical Notes:(.*?)(Automation Test Code:|$)", output, re.DOTALL)
        test_code_match = re.search(r"Automation Test Code:(.*)", output, re.DOTALL)

        acceptance_criteria = acceptance_criteria_match.group(1).strip() if acceptance_criteria_match else ""
        technical_notes = technical_notes_match.group(1).strip() if technical_notes_match else ""
        test_code = test_code_match.group(1).strip() if test_code_match else ""

        logger.info("Successfully generated response")
        return {
            "acceptanceCriteria": acceptance_criteria,
            "technicalNotes": technical_notes,
            "testCode": test_code,
            "framework": framework
        }
    except Exception as e:
        error_msg = str(e)
        tb = traceback.format_exc()
        logger.error(f"Error in /api/generate: {error_msg}\nTraceback:\n{tb}")
        
        # Provide more specific error messages
        if "insufficient_quota" in error_msg.lower():
            raise HTTPException(
                status_code=429, 
                detail="OpenAI API quota exceeded. Please check your billing details."
            )
        elif "invalid_api_key" in error_msg.lower():
            raise HTTPException(
                status_code=401, 
                detail="Invalid OpenAI API key. Please check your configuration."
            )
        else:
            raise HTTPException(
                status_code=500, 
                detail=f"Internal server error: {error_msg}"
            )

class DefectSummaryRequest(BaseModel):
    project_name: str
    



@router.post("/api/defectSummaryReport")
async def defect_summary_report(request: Request):
    import asyncio
    data = await request.json()
    project_name = data.get("project_name", "")
    # Optional parameters for prompts
    x_value = data.get("x_value", "5")  # default 5 sprints/weeks/days
    modules = data.get("modules", ["Module A", "Module B", "Module C"])
    # Removed debug print statements
    # print("project name", project_name)
    # print("data", data)
    if not project_name:
        return JSONResponse(content={"error": "Project name is required"})

    # Get JIRA configuration from environment variables
    jira_url = os.getenv("JIRA_URL", "")
    api_token = os.getenv("JIRA_API_TOKEN", "")
    username = os.getenv("JIRA_USER", "")

    if not jira_url or not api_token or not username:
        return JSONResponse(content={"error": "JIRA configuration is missing"})

    try:
        from src.backend_py.jira_client import get_all_jira_defects

        defects = await get_all_jira_defects(
            jira_url=jira_url,
            username=username,
            api_token=api_token,
            project_key=project_name
        )

        if not defects:
            return JSONResponse(content={"result": "No defects found for this project."})

        total_defects = len(defects)

        status_counts = {}
        for defect in defects:
            status = defect["fields"]["status"]["name"]
            status_counts[status] = status_counts.get(status, 0) + 1

        priority_counts = {}
        for defect in defects:
            priority = defect["fields"].get("priority", {}).get("name", "Unprioritized")
            priority_counts[priority] = priority_counts.get(priority, 0) + 1

        defect_summary = f"""
Project: {project_name}
Total Defects: {total_defects}

Status Breakdown:
{chr(10).join([f"- {status}: {count}" for status, count in status_counts.items()])}

Severity/Priority Breakdown:
{chr(10).join([f"- {priority}: {count}" for priority, count in priority_counts.items()])}

Sample Defects:
{chr(10).join([f"- {defect['key']}: {defect['fields']['summary'][:100]}... (Status: {defect['fields']['status']['name']}, Priority: {defect['fields'].get('priority', {}).get('name', 'N/A')})" for defect in defects[:10]])}
"""

        client = OpenAI(api_key=openai_api_key)

        # Define all prompts with placeholders filled
        prompts = {
            "Defect Trend Analysis": f"""
Create a defect trend analysis for the past {x_value} sprints/weeks for project {project_name}. Show number of new defects per sprint, open vs resolved trends, and escalation patterns.
""",
            "Root Cause Analysis (RCA)": f"""
Perform a root cause analysis on defects from project {project_name}. Categorize them by cause (e.g., requirement gap, coding issue, test miss, environment issue) and suggest corrective actions per category.
""",
            "Defect Density Report": f"""
Generate a defect density report for modules {', '.join(modules)} of project {project_name}. Show defects per 1,000 lines of code and suggest which modules need more testing or refactoring.
""",
            "Defect Ageing Report": f"""
List defects in project {project_name} that have been open for more than {x_value} days. Highlight the top 10 oldest defects by severity and suggest action items or owners for follow-up.
""",
            "Defect Distribution by Assignee/Team": f"""
Provide a breakdown of defects by assignee/team in {project_name}. Include number of defects assigned, average resolution time per assignee, and any performance outliers.
""",
            "Defect Reopen Rate": f"""
Analyze reopened defects in project {project_name} from the last {x_value} releases/sprints. Identify top reasons for reopen and suggest process or communication improvements.
"""
        }

        async def get_analysis(prompt_name, prompt_text):
            try:
                completion = client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[
                        {"role": "system", "content": "You are a software quality assurance expert providing defect analysis."},
                        {"role": "user", "content": prompt_text},
                    ],
                    max_tokens=1000,
                    temperature=0.7,
                )
                return prompt_name, completion.choices[0].message.content.strip()
            except Exception as e:
                logger.error(f"Error in prompt {prompt_name}: {e}")
                return prompt_name, f"Error generating analysis: {str(e)}"

        # Run all prompt analyses in parallel
        tasks = [get_analysis(name, text) for name, text in prompts.items()]
        results = await asyncio.gather(*tasks)

        detailed_reports = {name: result for name, result in results}

        return JSONResponse(content={
            "totalDefects": total_defects,
            "statusBreakdown": status_counts,
            "priorityBreakdown": priority_counts,
            "defects": defects[:20],
            "detailedReports": detailed_reports
        })

    except Exception as e:
        import traceback
        tb = traceback.format_exc()
        logger.error(f"Error in /api/defectSummaryReport: {e}\\nTraceback:\\n{tb}")
        return JSONResponse(content={"error": str(e)})
