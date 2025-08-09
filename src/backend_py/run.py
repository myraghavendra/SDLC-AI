#!/usr/bin/env python
"""
Entry point for the FastAPI application
This script handles the Python path correctly when running the application directly
"""

import os
import sys

# Add the current directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

# Now import and run the main application
from main import app
import uvicorn

if __name__ == "__main__":
    # Get port from Railway environment or default to 8000
    port = int(os.getenv("PORT", 8000))
    
    print(f"Starting server on port {port}")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=False,  # Set to True for development
        log_level="info"
    )
