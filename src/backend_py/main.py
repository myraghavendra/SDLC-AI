import os
import sys
from mangum import Mangum

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import the FastAPI app
from server import app

# Create the Vercel serverless handler
handler = Mangum(app)

# This is the entry point for Vercel serverless functions
def handler(event, context):
    """AWS Lambda handler for Vercel serverless deployment"""
    return handler(event, context)
