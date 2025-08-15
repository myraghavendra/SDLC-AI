import logging
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import os
from openai import OpenAI
from src.backend_py.config import get_openai_api_key
import openai
import asyncio
import re

router = APIRouter()
logger = logging.getLogger(__name__)

def get_openai_client():
    """Get OpenAI client with proper API key handling"""
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        try:
            api_key = get_openai_api_key()
            if api_key:
                os.environ["OPENAI_API_KEY"] = api_key
        except Exception as e:
            logger.error(f"Failed to get OpenAI API key from config: {e}")
    
    if not api_key:
        raise HTTPException(status_code=503, detail="OpenAI API key not configured - API key should read from Vercel environment variable")
    
    return OpenAI(api_key=api_key)

class AnalyzeRequirementRequest(BaseModel):
    tool: str
    story_key: str
    story_text: str
    prompt: str

@router.post("/api/analyzeRequirement")
async def analyze_requirement(request: AnalyzeRequirementRequest):
    try:
        # Get OpenAI client with proper error handling
        client = get_openai_client()

        # Compose the full prompt for quality evaluation
        quality_prompt = f"{request.prompt}\n\nUser Story:\n{request.story_text}"

        # Compose the prompt for change impact analysis
        impact_prompt = "If the selected story is changed or delayed, predict the downstream impact on modules, interfaces, or test cases. Provide specific recommendations.\n\nUser Story:\n" + request.story_text

        # Compose the prompt for requirement visualization
        visualization_prompt = "Based on this user story, generate a description for a visual diagram (e.g., flowchart, sequence diagram) that shows component interactions or user flow.\n\nUser Story:\n" + request.story_text

        # Compose the prompt for compliance & security checks
        compliance_prompt = "Identify whether this requirement involves personal data, GDPR compliance, encryption needs, or secure access control. Mention security red flags if any.\n\nUser Story:\n" + request.story_text

        # Compose the prompt for gap & conflict analysis
        gap_conflict_prompt = "Analyze the following requirement(s) for contradictions, unclear parts, missing edge cases, or dependency gaps. Highlight any areas needing clarification.\n\nUser Story:\n" + request.story_text

        # Compose the prompt for requirement classification & extraction
        classification_prompt = "Given the following story text, extract and classify all requirements as Functional, Non-functional, Business, or Technical. Summarize each in a concise bullet point.\n\nUser Story:\n" + request.story_text

        async def call_quality():
            try:
                logger.info("Starting OpenAI call for quality evaluation")
                response = client.chat.completions.create(
                    model="gpt-4",
                    messages=[
                        {"role": "system", "content": "You are a helpful assistant that evaluates user stories."},
                        {"role": "user", "content": quality_prompt}
                    ],
                    max_tokens=500,
                    temperature=0.7,
                )
                logger.info("Completed OpenAI call for quality evaluation")
                return response.choices[0].message.content.strip()
            except Exception as e:
                logger.error(f"Error during quality evaluation: {e}")
                return "Error retrieving quality evaluation."

        async def call_impact():
            try:
                logger.info("Starting OpenAI call for change impact analysis")
                response = client.chat.completions.create(
                    model="gpt-4",
                    messages=[
                        {"role": "system", "content": "You are a helpful assistant that predicts change impact."},
                        {"role": "user", "content": impact_prompt}
                    ],
                    max_tokens=500,
                    temperature=0.7,
                )
                logger.info("Completed OpenAI call for change impact analysis")
                return response.choices[0].message.content.strip()
            except Exception as e:
                logger.error(f"Error during change impact analysis: {e}")
                return "Error retrieving change impact analysis."

        async def call_visualization():
            try:
                logger.info("Starting OpenAI call forimport logging
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import os
from openai import OpenAI
from src.backend_py.config import get_openai_api_key
import openai
import asyncio
import re

router = APIRouter()
logger = logging.getLogger(__name__)

def get_openai_client():
    """Get OpenAI client with proper API key handling"""
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        try:
            api_key = get_openai_api_key()
            if api_key:
                os.environ["OPENAI_API_KEY"] = api_key
        except Exception as e:
            logger.error(f"Failed to get OpenAI API key from config: {e}")
    
    if not api_key:
        raise HTTPException(status_code=503, detail="OpenAI API key not configured - API key should read from Vercel environment variable")
    
    return OpenAI(api_key=api_key)

class AnalyzeRequirementRequest(BaseModel):
    tool: str
    story_key: str
    story_text: str
    prompt: str

@router.post("/api/analyzeRequirement")
async def analyze_requirement(request: AnalyzeRequirementRequest):
    try:
        # Get OpenAI client with proper error handling
        client = get_openai_client()

        # Compose the full prompt for quality evaluation
        quality_prompt = f"{request.prompt}\n\nUser Story:\n{request.story_text}"

        # Compose the prompt for change impact analysis
        impact_prompt = "If the selected story is changed or delayed, predict the downstream impact on modules, interfaces, or test cases. Provide specific recommendations.\n\nUser Story:\n" + request.story_text

        # Compose the prompt for requirement visualization
        visualization_prompt = "Based on this user story, generate a description for a visual diagram (e.g., flowchart, sequence diagram) that shows component interactions or user flow.\n\nUser Story:\n" + request.story_text

        # Compose the prompt for compliance & security checks
        compliance_prompt = "Identify whether this requirement involves personal data, GDPR compliance, encryption needs, or secure access control. Mention security red flags if any.\n\nUser Story:\n" + request.story_text

        # Compose the prompt for gap & conflict analysis
        gap_conflict_prompt = "Analyze the following requirement(s) for contradictions, unclear parts, missing edge cases, or dependency gaps. Highlight any areas needing clarification.\n\nUser Story:\n" + request.story_text

        # Compose the prompt for requirement classification & extraction
        classification_prompt = "Given the following story text, extract and classify all requirements as Functional, Non-functional, Business, or Technical. Summarize each in a concise bullet point.\n\nUser Story:\n" + request.story_text

        async def call_quality():
            try:
                logger.info("Starting OpenAI call for quality evaluation")
                response = client.chat.completions.create(
                    model="gpt-4",
                    messages=[
                        {"role": "system", "content": "You are a helpful assistant that evaluates user stories."},
                        {"role": "user", "content": quality_prompt}
                    ],
                    max_tokens=500,
                    temperature=0.7,
                )
                logger.info("Completed OpenAI call for quality evaluation")
                return response.choices[0].message.content.strip()
            except Exception as e:
                logger.error(f"Error during quality evaluation: {e}")
                return "Error retrieving quality evaluation."

        async def call_impact():
            try:
                logger.info("Starting OpenAI call for change impact analysis")
                response = client.chat.completions.create(
                    model="gpt-4",
                    messages=[
                        {"role": "system", "content": "You are a helpful assistant that predicts change impact."},
                        {"role": "user", "content": impact_prompt}
                    ],
                    max_tokens=500,
                    temperature=0.7,
                )
                logger.info("Completed OpenAI call for change impact analysis")
                return response.choices[0].message.content.strip()
            except Exception as e:
                logger.error(f"Error during change impact analysis: {e}")
                return "Error retrieving change impact analysis."

        async def call_visualization():
            try:
                logger.info("Starting OpenAI call for requirement visualization")
                response = client.chat.completions.create(
                    model="gpt-4",
                    messages=[
                        {"role": "system", "content": "You are a helpful assistant that generates visualizations."},
                        {"role": "user", "content": visualization_prompt}
                    ],
                    max_tokens=500,
                    temperature=0.7,
                )
                logger.info("Completed OpenAI call for requirement visualization")
                return response.choices[0].message.content.strip()
            except Exception as e:
                logger.error(f"Error during requirement visualization: {e}")
                return "Error retrieving requirement visualization."