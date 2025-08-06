import os
from dotenv import load_dotenv

load_dotenv()

def get_openai_api_key():
    """
    Get the OpenAI API key from environment variables.
    
    Returns:
        str: The OpenAI API key
    """
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY environment variable is not set")
    return api_key

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
