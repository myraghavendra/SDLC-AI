import logging
import os
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.responses import PlainTextResponse
from contextlib import asynccontextmanager
import redis
import psycopg2
from typing import Dict, Any

from src.backend_py.config import (
    validate_configuration, 
    get_missing_config_summary,
    log_configuration_status,
    is_database_configured,
    is_redis_configured,
    get_database_config,
    get_redis_config
)
from src.backend_py.generate_api import router as generate_router
from src.backend_py.upload_jira_api import router as upload_jira_router
from src.backend_py.requirement_analyser_api import router as requirement_analyser_router
from src.backend_py.get_stories_api import router as get_stories_router
from src.backend_py.jira_config_api import router as jira_config_router
from src.backend_py.integrated_story_api import router as integrated_story_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Global variables for database and Redis connections
db_connection = None
redis_client = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifespan"""
    # Startup
    logger.info("Starting application...")
    log_configuration_status()
    
    # Initialize database connection if configured - but don't fail if it doesn't work
    if is_database_configured():
        try:
            await init_database()
        except Exception as e:
            logger.error(f"Failed to initialize database: {e}")
            logger.warning("Database connection failed, but application will continue without it")
    
    # Initialize Redis connection if configured - but don't fail if it doesn't work
    if is_redis_configured():
        try:
            await init_redis()
        except Exception as e:
            logger.error(f"Failed to initialize Redis: {e}")
            logger.warning("Redis connection failed, but application will continue without it")
    
    yield
    
    # Shutdown
    logger.info("Shutting down application...")
    if db_connection:
        try:
            db_connection.close()
        except:
            pass
    if redis_client:
        try:
            await redis_client.close()
        except:
            pass

# Create FastAPI app with lifespan
app = FastAPI(
    title="AI Story Generator API",
    description="API for generating user stories and test cases using AI",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def init_database():
    """Initialize database connection"""
    global db_connection
    try:
        db_config = get_database_config()
        db_connection = psycopg2.connect(db_config["database_url"])
        logger.info("Database connection established successfully")
    except Exception as e:
        logger.error(f"Database connection failed: {e}")
        raise

async def init_redis():
    """Initialize Redis connection"""
    global redis_client
    try:
        redis_config = get_redis_config()
        redis_client = redis.from_url(redis_config["redis_url"])
        redis_client.ping()
        logger.info("Redis connection established successfully")
    except Exception as e:
        logger.error(f"Redis connection failed: {e}")
        raise

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    health_status = {
        "status": "healthy",
        "services": {
            "database": is_database_configured(),
            "redis": is_redis_configured(),
            "openai": True,  # This will be checked in individual endpoints
            "jira": True     # This will be checked in individual endpoints
        }
    }
    
    # Test actual connections only if they are configured and initialized
    if is_database_configured():
        if db_connection:
            try:
                cursor = db_connection.cursor()
                cursor.execute("SELECT 1")
                cursor.close()
                health_status["services"]["database"] = True
            except Exception as e:
                logger.error(f"Database connection test failed: {e}")
                health_status["services"]["database"] = False
                health_status["status"] = "degraded"
        else:
            # Database is configured but connection not initialized
            health_status["services"]["database"] = False
            health_status["status"] = "degraded"
    else:
        # Database is not configured, which is acceptable
        health_status["services"]["database"] = False
    
    if is_redis_configured():
        if redis_client:
            try:
                redis_client.ping()
                health_status["services"]["redis"] = True
            except Exception as e:
                logger.error(f"Redis connection test failed: {e}")
                health_status["services"]["redis"] = False
                health_status["status"] = "degraded"
        else:
            # Redis is configured but connection not initialized
            health_status["services"]["redis"] = False
            health_status["status"] = "degraded"
    else:
        # Redis is not configured, which is acceptable
        health_status["services"]["redis"] = False
    
    # If core services (API itself) are working, consider it healthy even if optional services are down
    if health_status["status"] == "degraded" and not any([
        health_status["services"]["database"],
        health_status["services"]["redis"]
    ]):
        # Only database and redis are down, but they're optional for basic functionality
        health_status["status"] = "healthy"
    
    return JSONResponse(content=health_status)

# Configuration status endpoint
@app.get("/config")
async def config_status():
    """Get configuration status"""
    return JSONResponse(content={
        "configuration": validate_configuration(),
        "missing": get_missing_config_summary()
    })

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "AI Story Generator API",
        "version": "1.0.0",
        "health": "/health",
        "config": "/config",
        "docs": "/docs"
    }

# Global exception handlers
@app.exception_handler(404)
async def not_found_exception_handler(request: Request, exc: HTTPException):
    """Handle 404 Not Found errors"""
    logger.warning(f"404 Not Found: {request.url.path}")
    return JSONResponse(
        status_code=404,
        content={
            "error": "NOT_FOUND",
            "message": f"The requested resource '{request.url.path}' was not found",
            "code": "NOT_FOUND",
            "details": {
                "path": request.url.path,
                "method": request.method,
                "timestamp": exc.__str__()
            }
        }
    )

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Handle HTTP exceptions"""
    logger.error(f"HTTP Error {exc.status_code}: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": "HTTP_ERROR",
            "message": exc.detail,
            "code": f"HTTP_{exc.status_code}",
            "details": {
                "path": request.url.path,
                "method": request.method
            }
        }
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle validation errors"""
    logger.error(f"Validation error: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content={
            "error": "VALIDATION_ERROR",
            "message": "Invalid request data",
            "code": "VALIDATION_FAILED",
            "details": {
                "errors": exc.errors(),
                "path": request.url.path,
                "method": request.method
            }
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handle all other exceptions"""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "INTERNAL_SERVER_ERROR",
            "message": "An unexpected error occurred",
            "code": "SERVER_ERROR",
            "details": {
                "path": request.url.path,
                "method": request.method,
                "error_type": exc.__class__.__name__
            }
        }
    )

# Include all routers
app.include_router(generate_router)
app.include_router(upload_jira_router)
app.include_router(requirement_analyser_router)
app.include_router(get_stories_router)
app.include_router(jira_config_router)
app.include_router(integrated_story_router)

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
