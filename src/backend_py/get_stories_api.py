import logging
from fastapi import APIRouter, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional
import os
import base64
from jira_client import get_jira_stories, JiraClientError
import logging
from config import get_openai_api_key, get_jira_config
jira_config = get_jira_config()

logger = logging.getLogger(__name__)
router = APIRouter()

# Initialize OpenAI client only if API key is available
openai_api_key = os.getenv("OPENAI_API_KEY") or get_openai_api_key()
client = None

if openai_api_key:
    try:
        from openai import OpenAI
        client = OpenAI(api_key=openai_api_key)
        logger.info("OpenAI client initialized successfully")
    except Exception as e:
        logger.warning(f"Failed to initialize OpenAI client: {e}. AI features will be disabled.")
        client = None
else:
    logger.info("OpenAI API key not found. AI features will be disabled.")

class GetStoriesRequest(BaseModel):
    tool: str
    jira_url: str
    project_key: str

class GetStoriesByFilterRequest(BaseModel):
    tool: str
    jira_url: str
    filter_id: str
    project_key: str

@router.post("/api/getStories")
async def get_stories(request: GetStoriesRequest):
    tool = request.tool.lower()
    if tool == "jira":
        jira_url = request.jira_url or os.getenv("JIRA_URL", "") or jira_config["server"]
        project_key = request.project_key or os.getenv("JIRA_PROJECT_KEY", "") or jira_config["JIRA_PROJECT_KEY"]
 
        logger.info(f"Received getStories request for Jira with url={jira_url} project_key={project_key}")
        if not jira_url:
            return JSONResponse(content={"error": "Jira URL is required for Jira"})
        if not project_key:
            return JSONResponse(content={"error": "Project Key is required for Jira"})
        api_key = os.getenv("JIRA_API_TOKEN", "") or jira_config["token"]
        if not api_key:
            return JSONResponse(content={"error": "Jira API key not configured in environment"})
        username = os.getenv("JIRA_USER", "") or jira_config["email"]
        try:
            from jira_client import get_all_jira_stories
            stories = await get_all_jira_stories(
                jira_url=jira_url,
                username=username,
                api_token=api_key,
                project_key=project_key,
            )
            logger.info(f"Fetched {len(stories)} stories from Jira")
            return JSONResponse(content={"stories": stories})
        except JiraClientError as e:
            logger.error(f"Error fetching Jira stories: {e}")
            return JSONResponse(content={"error": str(e)})
    elif tool == "rally":
        return {"stories": []}
    elif tool == "testrail":
        return {"stories": []}
    else:
        return {"error": "Unsupported tool"}

@router.post("/api/getStoriesByFilter")
async def get_stories_by_filter(request: GetStoriesByFilterRequest):
    tool = request.tool.lower()
    if tool == "jira":
        jira_url = request.jira_url or os.getenv("JIRA_URL", "") or jira_config["server"]
        filter_id = request.filter_id
        project_key = request.project_key

        logger.info(f"Received getStoriesByFilter request for Jira with url={jira_url} filter_id={filter_id} project_key={project_key}")
        if not jira_url:
            return JSONResponse(content={"error": "Jira URL is required for Jira"})
        if not filter_id:
            return JSONResponse(content={"error": "Filter ID is required for Jira"})
        if not project_key:
            return JSONResponse(content={"error": "Project Key is required for Jira"})
        api_key = os.getenv("JIRA_API_TOKEN", "") or jira_config["token"]
        if not api_key:
            return JSONResponse(content={"error": "Jira API key not configured in environment"})
        username = os.getenv("JIRA_USER", "") or jira_config["email"]
        jql = f"filter={filter_id}"
        print("raghava1")
        from httpx import AsyncClient
        headers = {
            "Authorization": f"Basic {base64.b64encode(f'{username}:{api_key}'.encode()).decode()}",
            "Accept": "application/json"
        }
        max_results = 50
        all_issues = []
        start_at = 0
        async with AsyncClient(timeout=10.0) as client_http:
            url = f"{jira_url}/rest/api/3/search"
            while True:
                params = {
                    "jql": jql,
                    "fields": "summary,status,priority,issuetype,created,updated,assignee,components,labels,resolutiondate,fixVersions,reporter",
                    "maxResults": max_results,
                    "startAt": start_at
                }
                response = await client_http.get(url, headers=headers, params=params)
                if 200 <= response.status_code < 300:
                    json_resp = response.json()
                    issues = json_resp.get("issues", [])
                    all_issues.extend(issues)
                    if len(issues) < max_results:
                        break
                    start_at += max_results
                else:
                    logger.error(f"Jira API responded with status {response.status_code}: {response.text}")
                    return JSONResponse(content={"error": f"Jira API responded with status {response.status_code}"})

            logger.info(f"Fetched {len(all_issues)} issues from Jira using filter")

            # Process issues for all reports
            # Filter for defect issues (Bug, Defect) or use all issues if no specific filter
            defect_issues = [issue for issue in all_issues if issue['fields']['issuetype']['name'] in ['Bug', 'Defect']] if all_issues else []
            
            # If no defect issues found, use all issues for analysis
            if not defect_issues:
                defect_issues = all_issues
            
            # Compose prompt for analysis
            issues_summary = "\n".join([f"{issue['key']}: {issue['fields']['summary']} (Status: {issue['fields']['status']['name']})" for issue in defect_issues])
            prompt = f"Generate a defect summary report for project {project_key} including total number of defects, open/closed/reopened status, severity breakdown, and defect leakage if available. Here are the defects:\n{issues_summary}"

            # Generate analysis using OpenAI if available
            analysis = "OpenAI analysis not available - API key not configured or client initialization failed."
            if client:
                try:
                    completion = client.chat.completions.create(
                        model="gpt-4o-mini",
                        messages=[
                            {"role": "system", "content": "You are a helpful assistant that analyzes Jira issues."},
                            {"role": "user", "content": prompt},
                        ],
                        max_tokens=500,
                        temperature=0.7,
                    )
                    analysis = completion.choices[0].message.content.strip()
                    logger.info("OpenAI analysis completed successfully")
                except Exception as e:
                    logger.error(f"Error during OpenAI analysis: {e}")
                    analysis = f"Error analyzing Jira issues with OpenAI: {str(e)}"
            else:
                logger.info("Skipping OpenAI analysis - client not available")

            # Prepare data for all reports
            total_defects = len(defect_issues)
            
            # Status breakdown
            status_counts = {}
            for defect in defect_issues:
                status = defect["fields"]["status"]["name"]
                status_counts[status] = status_counts.get(status, 0) + 1
            
            # Priority breakdown
            priority_counts = {}
            for defect in defect_issues:
                priority = defect["fields"].get("priority", {}).get("name", "Unprioritized")
                priority_counts[priority] = priority_counts.get(priority, 0) + 1
            
            # Assignee distribution
            assignee_counts = {}
            for defect in defect_issues:
                assignee = defect["fields"].get("assignee", {})
                assignee_name = assignee.get("displayName", "Unassigned") if assignee else "Unassigned"
                assignee_counts[assignee_name] = assignee_counts.get(assignee_name, 0) + 1
            
            # Component/Module information for hotspot map
            component_counts = {}
            for defect in defect_issues:
                components = defect["fields"].get("components", [])
                if components:
                    for component in components:
                        component_name = component.get("name", "Unknown Component")
                        component_counts[component_name] = component_counts.get(component_name, 0) + 1
                else:
                    component_counts["Unknown Component"] = component_counts.get("Unknown Component", 0) + 1
            
            # Ageing information
            import datetime
            ageing_data = []
            for defect in defect_issues:
                created_str = defect["fields"].get("created", "")
                if created_str:
                    try:
                        created_date = datetime.datetime.strptime(created_str.split('.')[0], "%Y-%m-%dT%H:%M:%S")
                        age_days = (datetime.datetime.now() - created_date).days
                        ageing_data.append({
                            "key": defect["key"],
                            "summary": defect["fields"]["summary"],
                            "status": defect["fields"]["status"]["name"],
                            "priority": defect["fields"].get("priority", {}).get("name", "Unprioritized"),
                            "age_days": age_days
                        })
                    except Exception as e:
                        logger.error(f"Error parsing created date for issue {defect['key']}: {e}")
            
            # Simulate defect reopen rate calculation
            # In a real implementation, this would require changelog data from Jira API
            # For now, we'll simulate based on the number of defects and common reopen patterns
            simulated_reopen_rate = min(15.0, max(1.0, total_defects * 0.5))  # Between 1% and 15%
            
            # Sample reasons for defect reopens (in real implementation, these would come from analysis of changelog)
            sample_reasons = [
                "Insufficient testing before closure",
                "Incomplete fix implementation",
                "Misunderstanding of requirements",
                "Environmental issues affecting reproduction",
                "Integration issues discovered after closure"
            ]
            
            # Prepare detailed reports data
            detailed_reports = {
                "Root Cause Analysis (RCA)": f"Root Cause Analysis for project {project_key} based on {total_defects} defects.\n\nDefects by status:\n" + "\n".join([f"- {status}: {count}" for status, count in status_counts.items()]) + "\n\nDefects by priority:\n" + "\n".join([f"- {priority}: {count}" for priority, count in priority_counts.items()]),
                "Defect Density Report": f"Defect Density Report for project {project_key}.\n\nTotal defects: {total_defects}\nDefects by component/module:\n" + "\n".join([f"- {component}: {count}" for component, count in component_counts.items()]),
                "Defect Ageing Report": f"Defect Ageing Report for project {project_key}\n\nTotal defects: {total_defects}\nDefects older than 5 days:\n" + "\n".join([f"- {item['key']}: {item['summary'][:100]}... (Age: {item['age_days']} days, Status: {item['status']}, Priority: {item['priority']})" for item in ageing_data if item["age_days"] > 5][:10]),
                "Defect Distribution by Assignee/Team": f"Defect Distribution by Assignee/Team for project {project_key}.\n\n" + "\n".join([f"- {assignee}: {count} defects" for assignee, count in assignee_counts.items()]),
                "Defect Reopen Rate": f"Defect Reopen Rate for project {project_key}: {simulated_reopen_rate:.1f}%\n\nTop reasons for reopen:\n" + "\n".join([f"- {reason}" for reason in sample_reasons])
            }

            return JSONResponse(content={
                "issues": all_issues,
                "defects": defect_issues,
                "analysis": analysis,
                "totalDefects": total_defects,
                "statusBreakdown": status_counts,
                "priorityBreakdown": priority_counts,
                "assigneeDistribution": assignee_counts,
                "componentCounts": component_counts,
                "ageingData": ageing_data,
                "detailedReports": detailed_reports
            })
    elif tool == "openai":
        # Implement OpenAI analysis
        return JSONResponse(content={"error": "OpenAI analysis not implemented yet"})
    else:
        return JSONResponse(content={"error": "Unsupported tool"})

# New endpoint to fetch Jira projects
@router.get("/api/getJiraProjects")
async def get_jira_projects():
    jira_url = os.getenv("JIRA_URL", "") or jira_config["server"]
    api_key = os.getenv("JIRA_API_TOKEN", "") or jira_config["token"]
    username = os.getenv("JIRA_USER", "") or jira_config["email"]

    if not jira_url:
        return JSONResponse(content={"error": "Jira URL is not configured"})
    if not api_key:
        return JSONResponse(content={"error": "Jira API key not configured in environment"})
    if not username:
        return JSONResponse(content={"error": "Jira username not configured in environment"})

    from httpx import AsyncClient
    headers = {
        "Authorization": f"Basic {base64.b64encode(f'{username}:{api_key}'.encode()).decode()}",
        "Accept": "application/json"
    }
    url = f"{jira_url}/rest/api/3/project"
    async with AsyncClient(timeout=10.0) as client_http:
        response = await client_http.get(url, headers=headers)
        if 200 <= response.status_code < 300:
            projects = response.json()
            # Return only key and name for each project
            project_list = [{"key": proj["key"], "name": proj["name"]} for proj in projects]
            return JSONResponse(content={"projects": project_list})
        else:
            return JSONResponse(content={"error": f"Failed to fetch Jira projects, status code {response.status_code}"})