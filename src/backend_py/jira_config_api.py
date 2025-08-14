import os
from fastapi import APIRouter
from src.backend_py.config import get_jira_config

router = APIRouter()
            
@router.get("/api/getJiraConfig")
async def get_jira_config():
    jira_config = get_jira_config()
    return {
        "jira_url": jira_config["server"],
        "project_key": jira_config["project_key"]
    }
