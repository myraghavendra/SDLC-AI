from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi import Request
from dotenv import load_dotenv
import os
import logging
import openai

from .config import get_openai_api_key, log_configuration_status
from .generate_api import router as generate_router
from .upload_jira_api import router as upload_jira_router
from .jira_config_api import router as jira_config_router
from .get_stories_api import router as get_stories_router
from .requirement_analyser_api import router as requirement_analyser_router

load_dotenv()

app = FastAPI(
    title="SDLC AI Backend",
    description="Backend API for SDLC AI Dashboard",
    version="1.0.0"
)

# Configure CORS for Railway deployment
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://sdlc-ai-production.up.railway.app",
    "https://*.vercel.app",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.error(f"Validation error for request {request.url}: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors(), "body": exc.body},
    )

# Initialize OpenAI client using centralized config
openai_api_key = get_openai_api_key()
if openai_api_key:
    os.environ["OPENAI_API_KEY"] = openai_api_key
    openai.api_key = openai_api_key
else:
    logger.warning("OPENAI_API_KEY not configured. Some features may not work.")

# Log configuration status on startup
log_configuration_status()

# Include routers from modularized API files
app.include_router(generate_router)
app.include_router(upload_jira_router)
app.include_router(jira_config_router)
app.include_router(get_stories_router)
app.include_router(requirement_analyser_router)

# Add health check endpoint for debugging
@app.get("/api/config-status")
async def config_status():
    """Configuration status endpoint for debugging"""
    from src.backend_py.config import validate_configuration
    
    config_status = validate_configuration()
    return {
        "configuration": config_status,
        "message": "Check configuration status for debugging"
    }
