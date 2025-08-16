import logging
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
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
    
    # Initialize database connection if configured
    if is_database_configured():
        try:
            await init_database()
        except Exception as e:
            logger.error(f"Failed to initialize database: {e}")
    
    # Initialize Redis connection if configured
    if is_redis_configured():
        try:
            await init_redis()
        except Exception as e:
            logger.error(f"Failed to initialize Redis: {e}")
    
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
    
    # Test actual connections
    if is_database_configured() and db_connection:
        try:
            cursor = db_connection.cursor()
            cursor.execute("SELECT 1")
            cursor.close()
            health_status["services"]["database"] = True
        except:
            health_status["services"]["database"] = False
            health_status["status"] = "degraded"
    
    if is_redis_configured() and redis_client:
        try:
            redis_client.ping()
            health_status["services"]["redis"] = True
        except:
            health_status["services"]["redis"] = False
            health_status["status"] = "degraded"
    
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

# Include all routers
app.include_router(generate_router)
app.include_router(upload_jira_router)
app.include_router(requirement_analyser_router)
app.include_router(get_stories_router)
app.include_router(jira_config_router)

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
