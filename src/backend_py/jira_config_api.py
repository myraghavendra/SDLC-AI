import os
from fastapi import APIRouter
from config import get_jira_config

router = APIRouter()
            
@router.get("/api/getJiraConfig")
async def get_jira_config():
    jira_config = get_jira_config()
    jira_url = os.getenv("JIRA_URL", "") or jira_config["server"]
    project_key = os.getenv("JIRA_PROJECT_KEY", "") or jira_config["JIRA_PROJECT_KEY"]
    return {"jira_url": jira_url, "project_key": project_key}
