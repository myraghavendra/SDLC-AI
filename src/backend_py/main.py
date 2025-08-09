import logging
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import your existing routers
from generate_api import router as generate_router
from get_stories_api import router as get_stories_router
from jira_config_api import router as jira_config_router
from requirement_analyser_api import router as requirement_analyser_router
from upload_jira_api import router as upload_jira_router

# Import the new health check router
from health_check_api import router as health_router

# Import configuration functions
from config import log_configuration_status, validate_configuration

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan events
    """
    # Startup
    logger.info("Starting up application...")
    
    # Log configuration status on startup
    log_configuration_status()
    
    # Validate configuration
    config_status = validate_configuration()
    
    # Log warnings for missing configurations
    if not config_status["openai_configured"]:
        logger.warning("OpenAI is not configured - AI features will be disabled")
    
    if not config_status["jira_configured"]:
        logger.warning("Jira is not configured - Jira integration will not work")
    
    if config_status["is_railway_environment"]:
        logger.info("Running in Railway environment")
    else:
        logger.info("Running in local development environment")
    
    yield
    
    # Shutdown
    logger.info("Shutting down application...")

# Create FastAPI application
app = FastAPI(
    title="Test Automation and Requirements API",
    description="API for generating test automation code and managing requirements with Railway secrets integration",
    version="2.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routers
app.include_router(generate_router, tags=["Generation"])
app.include_router(get_stories_router, tags=["Stories"])
app.include_router(jira_config_router, tags=["Configuration"])
app.include_router(requirement_analyser_router, tags=["Requirements"])
app.include_router(upload_jira_router, tags=["Upload"])
app.include_router(health_router, tags=["Health"])

@app.get("/")
async def root():
    """
    Root endpoint with API information
    """
    config_status = validate_configuration()
    
    return {
        "message": "Test Automation and Requirements API",
        "version": "2.0.0",
        "status": "running",
        "features": {
            "ai_generation": config_status["openai_configured"],
            "jira_integration": config_status["jira_configured"],
            "railway_secrets": config_status["is_railway_environment"]
        },
        "endpoints": {
            "health": "/health",
            "config_status": "/config/status",
            "test_connections": "/config/test-connections",
            "generate": "/api/generate",
            "get_stories": "/api/getStories", 
            "analyze_requirement": "/api/analyzeRequirement",
            "upload_jira": "/api/upload-jira",
            "defect_summary": "/api/defectSummaryReport"
        }
    }

# Add middleware for request logging (optional)
@app.middleware("http")
async def log_requests(request, call_next):
    """
    Log all incoming requests
    """
    start_time = time.time()
    
    # Log request
    logger.info(f"Incoming request: {request.method} {request.url}")
    
    # Process request
    response = await call_next(request)
    
    # Log response time
    process_time = time.time() - start_time
    logger.info(f"Request completed in {process_time:.3f}s with status {response.status_code}")
    
    return response

if __name__ == "__main__":
    import time
    import uvicorn
    
    # Get port from Railway environment or default to 8000
    port = int(os.getenv("PORT", 8000))
    
    logger.info(f"Starting server on port {port}")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=False,  # Set to True for development
        log_level="info"
    )
