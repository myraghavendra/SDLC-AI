import logging
from datetime import datetime
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from config import (
    validate_configuration, 
    log_configuration_status,
    get_railway_environment_info,
    secrets_manager
)

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/health")
async def health_check():
    """
    Health check endpoint that also validates configuration
    """
    try:
        # Validate all configurations
        config_status = validate_configuration()
        
        # Get Railway environment info
        env_info = get_railway_environment_info()
        
        # Log configuration status for debugging
        log_configuration_status()
        
        # Determine overall health status
        critical_services = ["openai_configured", "jira_configured"]
        is_healthy = all(config_status.get(service, False) for service in critical_services)
        
        response_data = {
            "status": "healthy" if is_healthy else "degraded",
            "timestamp": datetime.utcnow().isoformat(),
            "configuration": config_status,
            "environment": {
                "is_railway": secrets_manager.is_railway_environment(),
                "service_name": env_info.get("service_name"),
                "environment": env_info.get("environment"),
                "deployment_id": env_info.get("deployment_id")
            },
            "services": {
                "openai": {
                    "configured": config_status.get("openai_configured", False),
                    "status": "available" if config_status.get("openai_configured") else "missing_api_key"
                },
                "jira": {
                    "configured": config_status.get("jira_configured", False),
                    "status": "available" if config_status.get("jira_configured") else "missing_configuration"
                },
                "database": {
                    "configured": config_status.get("database_configured", False),
                    "status": "available" if config_status.get("database_configured") else "not_configured"
                },
                "redis": {
                    "configured": config_status.get("redis_configured", False),
                    "status": "available" if config_status.get("redis_configured") else "not_configured"
                }
            }
        }
        
        # Return appropriate HTTP status
        status_code = 200 if is_healthy else 503
        
        return JSONResponse(
            status_code=status_code,
            content=response_data
        )
        
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return JSONResponse(
            status_code=500,
            content={
                "status": "unhealthy",
                "timestamp": datetime.utcnow().isoformat(),
                "error": str(e)
            }
        )

@router.get("/config/status")
async def configuration_status():
    """
    Detailed configuration status endpoint (for debugging)
    """
    try:
        config_status = validate_configuration()
        env_info = get_railway_environment_info()
        
        # Get Railway secrets (without exposing values)
        railway_secrets = secrets_manager.get_railway_service_secrets()
        secret_keys = list(railway_secrets.keys())
        
        return {
            "configuration_status": config_status,
            "environment_info": env_info,
            "available_secret_keys": secret_keys,
            "is_railway_environment": secrets_manager.is_railway_environment(),
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Configuration status check failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/config/test-connections")
async def test_connections():
    """
    Test actual connections to external services
    """
    results = {
        "timestamp": datetime.utcnow().isoformat(),
        "tests": {}
    }
    
    # Test OpenAI connection
    try:
        from config import get_openai_api_key, is_openai_configured
        if is_openai_configured():
            from openai import OpenAI
            client = OpenAI(api_key=get_openai_api_key())
            # Simple test - list models (this is a lightweight operation)
            models = client.models.list()
            results["tests"]["openai"] = {
                "status": "success",
                "message": f"Connected successfully, {len(models.data)} models available"
            }
        else:
            results["tests"]["openai"] = {
                "status": "skipped",
                "message": "OpenAI not configured"
            }
    except Exception as e:
        results["tests"]["openai"] = {
            "status": "failed",
            "message": str(e)
        }
    
    # Test Jira connection
    try:
        from config import get_jira_config, is_jira_configured
        if is_jira_configured():
            jira_config = get_jira_config()
            from httpx import AsyncClient
            import base64
            
            # Fix the f-string syntax error by separating the credential creation
            email = jira_config['email']
            token = jira_config['token']
            credentials = f"{email}:{token}"
            auth_header = base64.b64encode(credentials.encode()).decode()
            
            headers = {
                "Authorization": f"Basic {auth_header}",
                "Accept": "application/json"
            }
            
            async with AsyncClient(timeout=10.0) as client:
                response = await client.get(f"{jira_config['server']}/rest/api/3/myself", headers=headers)
                if response.status_code == 200:
                    user_info = response.json()
                    results["tests"]["jira"] = {
                        "status": "success",
                        "message": f"Connected as {user_info.get('displayName', 'Unknown')}"
                    }
                else:
                    results["tests"]["jira"] = {
                        "status": "failed",
                        "message": f"HTTP {response.status_code}: {response.text[:100]}"
                    }
        else:
            results["tests"]["jira"] = {
                "status": "skipped",
                "message": "Jira not configured"
            }
    except Exception as e:
        results["tests"]["jira"] = {
            "status": "failed",
            "message": str(e)
        }
    
    # Determine overall status
    test_statuses = [test["status"] for test in results["tests"].values()]
    if "failed" in test_statuses:
        overall_status = "some_failures"
        status_code = 207  # Multi-status
    elif all(status in ["success", "skipped"] for status in test_statuses):
        overall_status = "all_passed"
        status_code = 200
    else:
        overall_status = "unknown"
        status_code = 500
    
    results["overall_status"] = overall_status
    
    return JSONResponse(
        status_code=status_code,
        content=results
    )