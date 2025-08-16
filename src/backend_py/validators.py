"""
Common validation functions for API endpoints
"""
import os
from typing import Dict, Any, Optional
from fastapi import HTTPException
from src.backend_py.config import get_openai_api_key, get_jira_config


def validate_openai_config() -> bool:
    """Validate OpenAI configuration"""
    try:
        api_key = get_openai_api_key()
        return api_key is not None and len(api_key.strip()) > 0
    except Exception:
        return False


def validate_jira_config() -> Dict[str, bool]:
    """Validate Jira configuration"""
    try:
        jira_config = get_jira_config()
        return {
            "server": bool(jira_config.get("server")),
            "email": bool(jira_config.get("email")),
            "token": bool(jira_config.get("token")),
            "project_key": bool(jira_config.get("project_key"))
        }
    except Exception:
        return {
            "server": False,
            "email": False,
            "token": False,
            "project_key": False
        }


def get_missing_config_message(service: str) -> str:
    """Get user-friendly message for missing configuration"""
    if service == "openai":
        return "OpenAI API key is not configured. Please set OPENAI_API_KEY environment variable."
    elif service == "jira":
        return "Jira configuration is incomplete. Please check JIRA_URL, JIRA_USER, JIRA_API_TOKEN, and JIRA_PROJECT_KEY environment variables."
    else:
        return f"{service} configuration is missing or incomplete."


def validate_required_fields(data: Dict[str, Any], required_fields: list) -> Dict[str, str]:
    """Validate required fields in request data"""
    errors = {}
    for field in required_fields:
        if field not in data or not data[field] or str(data[field]).strip() == "":
            errors[field] = f"{field} is required"
    return errors


def sanitize_string(value: str) -> str:
    """Sanitize string input"""
    if not value:
        return ""
    return str(value).strip()


def validate_jira_url(url: str) -> bool:
    """Validate Jira URL format"""
    if not url:
        return False
    url = url.strip()
    return url.startswith("http://") or url.startswith("https://")
