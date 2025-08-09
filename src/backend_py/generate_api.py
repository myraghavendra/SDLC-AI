import logging
from fastapi import FastAPI, HTTPException, Request, Response, APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional
import os
import openai
from config import get_openai_api_key, is_openai_configured, get_jira_config
from openai import OpenAI
from jira_client import get_jira_stories, get_all_jira_stories

logger = logging.getLogger(__name__)
router = APIRouter()

# Initialize OpenAI API key from environment for consistency
openai_api_key = os.getenv("OPENAI_API_KEY") or get_openai_api_key()
if not openai_api_key or 'your_act' in openai_api_key or 'sk-' not in openai_api_key:
    logger.warning("OpenAI API key not found or invalid. AI features will be disabled.")

class GenerateRequest(BaseModel):
    description: str
    context: Optional[str] = None
    framework: Optional[str] = None  # e.g., "Cypress", "Selenium", etc.

@router.post("/api/generate")
async def generate(request: GenerateRequest):
    if not request.description:
        raise HTTPException(status_code=400, detail="Description is required")

    # Check if OpenAI is configured
    if not is_openai_configured() or not openai_api_key or 'your_act' in openai_api_key or 'sk-' not in openai_api_key:
        return JSONResponse(
            status_code=503,
            content={
                "error": "OpenAI API key not configured or invalid",
                "message": "Please set a valid OPENAI_API_KEY environment variable to use AI features. You can find your API key at https://platform.openai.com/account/api-keys.",
                "acceptanceCriteria": "Manual creation required - OpenAI not configured",
                "technicalNotes": "Configure a valid OPENAI_API_KEY environment variable to enable AI features",
                "testCode": "# Manual test creation required - AI features disabled",
                "framework": request.framework or "None"
            }
        )

    framework = request.framework or "None"
    # Determine language for framework
    framework_language = "JavaScript" if framework.lower() == "cypress" else ("Java" if framework.lower() == "selenium" else ("TypeScript" if framework.lower() == "playwright" else ""))
    
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
        try:
            completion = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": prompt},
                ],
                max_tokens=500,
                temperature=0.7,
            )
        except Exception as e:
            logger.error(f"OpenAI API error: {e}")
            return JSONResponse(
                status_code=401,
                content={
                    "error": "OpenAI API authentication failed. Please check your API key.",
                    "message": str(e),
                    "framework": framework
                }
            )
        output = completion.choices[0].message.content.strip()

        acceptance_criteria_match = None
        technical_notes_match = None
        test_code_match = None

        import re
        acceptance_criteria_match = re.search(r"Acceptance Criteria:(.*?)(Technical Notes:|$)", output, re.DOTALL)
        technical_notes_match = re.search(r"Technical Notes:(.*?)(Automation Test Code:|$)", output, re.DOTALL)
        test_code_match = re.search(r"Automation Test Code:(.*)", output, re.DOTALL)

        acceptance_criteria = acceptance_criteria_match.group(1).strip() if acceptance_criteria_match else ""
        technical_notes = technical_notes_match.group(1).strip() if technical_notes_match else ""
        test_code = test_code_match.group(1).strip() if test_code_match else ""

        return {
            "acceptanceCriteria": acceptance_criteria,
            "technicalNotes": technical_notes,
            "testCode": test_code,
            "framework": framework
        }
    except Exception as e:
        import traceback
        tb = traceback.format_exc()
        logger.error(f"Error in /api/generate: {e}\nTraceback:\n{tb}")
        raise HTTPException(status_code=500, detail=str(e))

class DefectSummaryRequest(BaseModel):
    project_name: str

@router.post("/api/defectSummaryReport")
async def defect_summary_report(request: Request):
    import asyncio
    data = await request.json()
    project_name = data.get("project_name", "")
    x_value = data.get("x_value", "5")
    modules = data.get("modules", ["Module A", "Module B", "Module C"])
    
    if not project_name:
        return JSONResponse(content={"error": "Project name is required"})

    # Get JIRA configuration from environment variables
    jira_config = get_jira_config()
    jira_url = os.getenv("JIRA_URL", "") or jira_config["server"]
    api_token = os.getenv("JIRA_API_TOKEN", "") or jira_config["token"]
    username = os.getenv("JIRA_USER", "") or jira_config["email"]

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

        if not is_openai_configured():
            return JSONResponse(content={
                "totalDefects": total_defects,
                "statusBreakdown": status_counts,
                "priorityBreakdown": priority_counts,
                "defects": defects[:20],
                "error": "OpenAI API key not configured. AI analysis features disabled."
            })

        client = OpenAI(api_key=openai_api_key)

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
        logger.error(f"Error in /api/defectSummaryReport: {e}\nTraceback:\n{tb}")
        return JSONResponse(content={"error": str(e)})
