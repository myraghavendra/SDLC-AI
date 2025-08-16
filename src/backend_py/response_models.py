"""
Standardized response models for consistent API responses
"""
from typing import Any, Dict, Optional
from pydantic import BaseModel


class APIResponse(BaseModel):
    """Standardized API response model"""
    success: bool
    data: Optional[Any] = None
    message: Optional[str] = None
    errors: Optional[Dict[str, Any]] = None


class ErrorResponse(BaseModel):
    """Standardized error response model"""
    success: bool = False
    message: str
    errors: Optional[Dict[str, Any]] = None


class HealthResponse(BaseModel):
    """Health check response model"""
    status: str
    services: Dict[str, Any]


class ConfigResponse(BaseModel):
    """Configuration status response model"""
    configuration: bool
    missing: Dict[str, str]
