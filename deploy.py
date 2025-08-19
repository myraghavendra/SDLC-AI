#!/usr/bin/env python3
import os
import subprocess
import sys

def deploy_to_vercel():
    """Deploy to Vercel with proper error handling"""
    print("Starting Vercel deployment...")
    
    # Check if Vercel CLI is installed
    try:
        subprocess.run(['vercel', '--version'], check=True, capture_output=True)
    except FileNotFoundError:
        print("Vercel CLI not found. Install with: npm i -g vercel")
        return False
    
    # Check for required environment variables
    required_vars = ['OPENAI_API_KEY']
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    
    if missing_vars:
        print(f"Missing environment variables: {', '.join(missing_vars)}")
        print("Please set these in Vercel dashboard or .env file")
    
    # Deploy
    try:
        print("Deploying to Vercel...")
        result = subprocess.run(['vercel', '--prod'], check=True)
        print("Deployment completed successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"Deployment failed: {e}")
        return False

if __name__ == "__main__":
    success = deploy_to_vercel()
    sys.exit(0 if success else 1)
