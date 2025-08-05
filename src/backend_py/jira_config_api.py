import os
from fastapi import APIRouter

router = APIRouter()
            
@router.get("/api/getJiraConfig")
async def get_jira_config():
    jira_url = os.getenv("JIRA_URL", "")
    project_key = os.getenv("JIRA_PROJECT_KEY", "")
    return {"jira_url": jira_url, "project_key": project_key}
