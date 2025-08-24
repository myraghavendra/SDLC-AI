import logging
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
from src.backend_py.jira_client import create_jira_story, JiraClientError
from src.backend_py.config import get_jira_config

logger = logging.getLogger(__name__)
router = APIRouter()

class UploadJiraRequest(BaseModel):
    summary: str
    description: str

@router.post("/api/upload-jira")
async def upload_jira(request: UploadJiraRequest):
    jira_config = get_jira_config()
    jira_url = jira_config["server"]
    username = jira_config["email"]
    api_token = jira_config["token"]
    project_key = jira_config["project_key"]

    if not all([jira_url, username, api_token, project_key]):
        raise HTTPException(
            status_code=500, 
            detail="JIRA configuration is missing. Please configure the following environment variables:\n"
                   "- JIRA_URL: Your JIRA instance URL (e.g., https://your-domain.atlassian.net)\n"
                   "- JIRA_USER: Your JIRA username/email\n"
                   "- JIRA_API_TOKEN: Your JIRA API token\n"
                   "- JIRA_PROJECT_KEY: Your JIRA project key (e.g., PROJ)\n\n"
                   "Get your API token from: https://id.atlassian.com/manage-profile/security/api-tokens"
        )

    if not request.summary or not request.description:
        raise HTTPException(status_code=400, detail="Summary and description are required")

    try:
        ticket_key = await create_jira_story(
            jira_url=jira_url,
            username=username,
            api_token=api_token,
            project_key=project_key,
            summary=request.summary,
            description=request.description,
        )
        return {"ticketKey": ticket_key}
    except JiraClientError as e:
        logger.error(f"Error creating Jira story: {e}")
        raise HTTPException(status_code=500, detail=str(e))
