import logging
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
from jira_client import create_jira_story, JiraClientError

logger = logging.getLogger(__name__)
router = APIRouter()

class UploadJiraRequest(BaseModel):
    summary: str
    description: str

@router.post("/api/upload-jira")
async def upload_jira(request: UploadJiraRequest):
    jira_url = os.getenv("JIRA_URL")
    username = os.getenv("JIRA_USER")
    api_token = os.getenv("JIRA_API_TOKEN")
    project_key = os.getenv("JIRA_PROJECT_KEY")

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
