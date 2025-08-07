import os
import logging
from dotenv import load_dotenv

load_dotenv()

def get_openai_api_key():
    """
    Get the OpenAI API key from environment variables.
    
    Returns:
        str: The OpenAI API key
    """
    openai_api_key = os.getenv("OPENAI_API_KEY")
    if not openai_api_key:
        logging.warning("OPENAI_API_KEY environment variable is not set. Some features may not work.")
        return None
    return openai_api_key

def get_jira_config():
    """
    Get Jira configuration from environment variables.
    
    Returns:
        dict: Jira configuration containing server, email, and token
    """
    return {
        "server": os.getenv("JIRA_SERVER", ""),
        "email": os.getenv("JIRA_EMAIL", ""),
        "token": os.getenv("JIRA_API_TOKEN", "")
    }

def is_openai_configured():
    """
    Check if OpenAI API key is properly configured.
    
    Returns:
        bool: True if OpenAI is configured, False otherwise
    """
    return get_openai_api_key() is not None
