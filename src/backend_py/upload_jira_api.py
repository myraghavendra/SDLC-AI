import logging
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
from jira_client import create_jira_story, JiraClientError
from config import get_jira_config

logger = logging.getLogger(__name__)
router = APIRouter()

class UploadJiraRequest(BaseModel):
    summary: str
    description: str

@router.post("/api/upload-jira")
async def upload_jira(request: UploadJiraRequest):
    jira_config = get_jira_config()

    jira_url = os.getenv("JIRA_URL") or jira_config.get("server")
    username = os.getenv("JIRA_USER") or jira_config.get("email")
    api_token = os.getenv("JIRA_API_TOKEN") or jira_config.get("token")
    project_key = os.getenv("JIRA_PROJECT_KEY") or jira_config.get("project_key")

    if not all([jira_url, username, api_token, project_key]):
        raise HTTPException(status_code=500, detail="Missing Jira configuration")

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
