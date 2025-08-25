import os
import logging
from dotenv import load_dotenv
import json
from typing import Optional, Dict, Any

# Load environment variables from .env file (for local development)
load_dotenv()

class VercelSecretsManager:
    """
    Manager class for handling Vercel environment variables and secrets
    """
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        
    def get_secret(self, key: str, default: Optional[str] = None) -> Optional[str]:
        """
        Get a secret value from Vercel environment variables
        
        Args:
            key: Secret key name
            default: Default value if secret not found
            
        Returns:
            Secret value or default
        """
        # Get from Vercel environment variables
        value = os.getenv(key, default)
        
        if not value:
            self.logger.warning(f"Secret '{key}' not found in environment variables")
            return default
            
        return value
    
    def is_vercel_environment(self) -> bool:
        """
        Check if running in Vercel environment
        
        Returns:
            True if running on Vercel
        """
        return os.getenv('VERCEL') is not None or \
               os.getenv('VERCEL_ENV') is not None

# Initialize secrets manager
secrets_manager = VercelSecretsManager()

def get_openai_api_key() -> Optional[str]:
    """
    Get the OpenAI API key from Railway secrets or environment variables.
    
    Returns:
        str: The OpenAI API key
    """
    openai_api_key = secrets_manager.get_secret("OPENAI_API_KEY")

 

    if not openai_api_key or openai_api_key == "your_act" or "sk-" not in openai_api_key:
        logging.warning("OPENAI_API_KEY not properly configured. Some features may not work.")
        return None
        
    return openai_api_key

def get_jira_config() -> Dict[str, str]:
    """
    Get Jira configuration from Railway secrets or environment variables.
    
    Returns:
        dict: Jira configuration containing server, email, token, and project key
    """
    return {
        "server": secrets_manager.get_secret("JIRA_URL", ""),
        "email": secrets_manager.get_secret("JIRA_USER", ""),
        "token": secrets_manager.get_secret("JIRA_API_TOKEN", ""),
        "project_key": secrets_manager.get_secret("JIRA_PROJECT_KEY", "")
    }

def get_database_config() -> Dict[str, Optional[str]]:
    """
    Get database configuration from Railway secrets
    
    Returns:
        dict: Database configuration
    """
    return {
        "database_url": secrets_manager.get_secret("DATABASE_URL"),
        "database_private_url": secrets_manager.get_secret("DATABASE_PRIVATE_URL"),
        "postgres_db": secrets_manager.get_secret("POSTGRES_DB"),
        "postgres_user": secrets_manager.get_secret("POSTGRES_USER"),
        "postgres_password": secrets_manager.get_secret("POSTGRES_PASSWORD"),
        "postgres_host": secrets_manager.get_secret("POSTGRES_HOST"),
        "postgres_port": secrets_manager.get_secret("POSTGRES_PORT")
    }

def get_redis_config() -> Dict[str, Optional[str]]:
    """
    Get Redis configuration from Railway secrets
    
    Returns:
        dict: Redis configuration
    """
    return {
        "redis_url": secrets_manager.get_secret("REDIS_URL"),
        "redis_private_url": secrets_manager.get_secret("REDIS_PRIVATE_URL")
    }

def get_railway_environment_info() -> Dict[str, Optional[str]]:
    """
    Get Railway environment information
    
    Returns:
        dict: Railway environment details
    """
    return {
        "environment": secrets_manager.get_secret("RAILWAY_ENVIRONMENT"),
        "service_name": secrets_manager.get_secret("RAILWAY_SERVICE_NAME"),
        "service_id": secrets_manager.get_secret("RAILWAY_SERVICE_ID"),
        "project_name": secrets_manager.get_secret("RAILWAY_PROJECT_NAME"),
        "project_id": secrets_manager.get_secret("RAILWAY_PROJECT_ID"),
        "deployment_id": secrets_manager.get_secret("RAILWAY_DEPLOYMENT_ID"),
        "replica_id": secrets_manager.get_secret("RAILWAY_REPLICA_ID")
    }

def is_openai_configured() -> bool:
    """
    Check if OpenAI API key is properly configured.
    
    Returns:
        bool: True if OpenAI is configured, False otherwise
    """
    api_key = get_openai_api_key()
    return api_key is not None

def is_jira_configured() -> bool:
    """
    Check if Jira is properly configured.
    
    Returns:
        bool: True if Jira is configured, False otherwise
    """
    jira_config = get_jira_config()
    required_fields = ["server", "email", "token", "project_key"]
    
    return all(jira_config.get(field) for field in required_fields)

def is_database_configured() -> bool:
    """
    Check if database is properly configured
    
    Returns:
        bool: True if database is configured, False otherwise
    """
    return bool(get_database_config().get("database_url"))

def is_redis_configured() -> bool:
    """
    Check if Redis is properly configured
    
    Returns:
        bool: True if Redis is configured, False otherwise
    """
    return bool(get_redis_config().get("redis_url"))

def validate_configuration() -> Dict[str, bool]:
    """
    Validate all service configurations
    
    Returns:
        dict: Configuration status for each service
    """
    return {
        "openai_configured": is_openai_configured(),
        "jira_configured": is_jira_configured(),
        "is_vercel_environment": secrets_manager.is_vercel_environment(),
        "database_configured": is_database_configured(),
        "redis_configured": is_redis_configured()
    }

def get_missing_config_summary() -> Dict[str, list]:
    """
    Get a summary of missing configuration items
    
    Returns:
        dict: List of missing configuration items by service
    """
    missing = {
        "openai": [],
        "jira": [],
        "database": [],
        "redis": []
    }
    
    # Check OpenAI
    if not is_openai_configured():
        missing["openai"].append("OPENAI_API_KEY")
    
    # Check Jira
    jira_config = get_jira_config()
    if not jira_config.get("server"):
        missing["jira"].append("JIRA_URL")
    if not jira_config.get("email"):
        missing["jira"].append("JIRA_USER")
    if not jira_config.get("token"):
        missing["jira"].append("JIRA_API_TOKEN")
    if not jira_config.get("project_key"):
        missing["jira"].append("JIRA_PROJECT_KEY")
    
    # Check Database
    db_config = get_database_config()
    if not db_config.get("database_url"):
        missing["database"].append("DATABASE_URL")
    
    # Check Redis
    redis_config = get_redis_config()
    if not redis_config.get("redis_url"):
        missing["redis"].append("REDIS_URL")
    
    return missing

def log_configuration_status():
    """
    Log the current configuration status
    """
    logger = logging.getLogger(__name__)
    config_status = validate_configuration()
    
    logger.info("Configuration Status:")
    for service, status in config_status.items():
        status_text = "✓" if status else "✗"
        logger.info(f"  {service}: {status_text}")
    
    if secrets_manager.is_vercel_environment():
        logger.info("Running in Vercel environment")
        env_info = get_railway_environment_info()
        logger.info(f"  Service: {env_info.get('service_name', 'Unknown')}")
        logger.info(f"  Environment: {env_info.get('environment', 'Unknown')}")
    else:
        logger.info("Running in local development environment")

# Initialize logging on module import
if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    log_configuration_status()