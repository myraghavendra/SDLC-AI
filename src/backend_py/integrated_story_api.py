import logging
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import os
from openai import OpenAI
from src.backend_py.config import get_openai_api_key

logger = logging.getLogger(__name__)
router = APIRouter()

class IntegratedStoryRequest(BaseModel):
    tool: str
    stories: List[Dict[str, Any]]
    framework: Optional[str] = "Cypress"
    context: Optional[str] = None

class IntegratedStoryResponse(BaseModel):
    acceptanceCriteria: str
    technicalNotes: str
    testCode: str
    summary: str

def get_openai_client():
    """Get OpenAI client with proper API key handling"""
    api_key = get_openai_api_key()
    
    if not api_key:
        raise HTTPException(
            status_code=503, 
            detail="OpenAI API key not configured. Please set OPENAI_API_KEY environment variable in Vercel dashboard."
        )
    
    return OpenAI(api_key=api_key)

@router.post("/api/integrated-story")
async def process_integrated_story(request: IntegratedStoryRequest):
    """Process integrated story workflow"""
    try:
        if not request.stories:
            raise HTTPException(status_code=400, detail="Stories are required")
        
        if not request.tool:
            raise HTTPException(status_code=400, detail="Tool selection is required")

        client = get_openai_client()
        
        # Build context from stories
        stories_context = "\n".join([
            f"Story {i+1}: {story.get('title', 'Untitled')} - {story.get('description', 'No description')}"
            for i, story in enumerate(request.stories)
        ])
        
        framework = request.framework or "Cypress"
        framework_language = "JavaScript" if framework.lower() == "cypress" else (
            "Java" if framework.lower() == "selenium" else "TypeScript"
        )
        
        prompt = f"""
You are a software development expert. Given the following user stories and tool selection, generate a comprehensive integrated analysis:

Tool Selected: {request.tool}
Framework: {framework}
Additional Context: {request.context or 'None'}

User Stories:
{stories_context}

Please provide:

1. **Integrated Acceptance Criteria**: Create comprehensive acceptance criteria that cover all the stories together, ensuring they work cohesively as a complete feature.

2. **Technical Implementation Notes**: Provide detailed technical notes for implementing these stories as an integrated solution, including:
   - Architecture considerations
   - Data flow between stories
   - Integration points
   - Testing strategy

3. **End-to-End Test Code**: Generate complete end-to-end test code in {framework} using {framework_language} that tests the entire integrated workflow across all stories.

4. **Implementation Summary**: Provide a brief summary of the key implementation steps and considerations.

Format your response clearly with each section labeled.
"""

        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a software development expert specializing in integrated story analysis and test automation."},
                {"role": "user", "content": prompt},
            ],
            max_tokens=2000,
            temperature=0.7,
        )
        
        response = completion.choices[0].message.content.strip()
        
        # Parse response into sections
        sections = {
            "acceptanceCriteria": "",
            "technicalNotes": "",
            "testCode": "",
            "summary": ""
        }
        
        lines = response.split('\n')
        current_section = ""
        
        for line in lines:
            line = line.strip()
            if "Integrated Acceptance Criteria" in line:
                current_section = "acceptanceCriteria"
            elif "Technical Implementation Notes" in line:
                current_section = "technicalNotes"
            elif "End-to-End Test Code" in line:
                current_section = "testCode"
            elif "Implementation Summary" in line:
                current_section = "summary"
            elif current_section and line:
                sections[current_section] += line + "\n"
        
        return IntegratedStoryResponse(
            acceptanceCriteria=sections["acceptanceCriteria"].strip(),
            technicalNotes=sections["technicalNotes"].strip(),
            testCode=sections["testCode"].strip(),
            summary=sections["summary"].strip()
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing integrated story: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/integrated-story/health")
async def integrated_story_health():
    """Health check for integrated story endpoint"""
    return {"status": "healthy", "service": "integrated-story"}
