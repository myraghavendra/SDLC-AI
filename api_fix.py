#!/usr/bin/env python3
"""
Comprehensive fix for the JSON parsing issue with API endpoints.
This addresses the root cause: 404 errors from Vercel deployment.
"""

import os
import json

# Create a proper vercel.json configuration
vercel_config = {
    "version": 2,
    "builds": [
        {
            "src": "package.json",
            "use": "@vercel/static-build",
            "config": {
                "distDir": "dist"
            }
        },
        {
            "src": "api/index.py",
            "use": "@vercel/python",
            "config": {
                "runtime": "python3.12",
                "maxLambdaSize": "50mb"
            }
        }
    ],
    "routes": [
        {
            "src": "/api/(.*)",
            "dest": "/api/index.py"
        },
        {
            "src": "/(.*)",
            "dest": "/$1"
        }
    ],
    "buildCommand": "npm run build",
    "outputDirectory": "dist",
    "installCommand": "npm install",
    "devCommand": "npm run dev"
}

# Write the corrected vercel.json
with open('vercel.json', 'w') as f:
    json.dump(vercel_config, f, indent=2)

print("✅ Fixed vercel.json configuration")

# Create a requirements.txt file for Vercel
requirements_content = """fastapi==0.104.1
uvicorn==0.24.0
pydantic==2.5.0
openai==1.3.7
python-multipart==0.0.6
requests==2.31.0
redis==5.0.1
psycopg2-binary==2.9.9
python-dotenv==1.0.0"""

with open('src/backend_py/requirements.txt', 'w') as f:
    f.write(requirements_content)

print("✅ Updated requirements.txt")

# Create a deployment guide
deployment_guide = """
# Fix for JSON Parsing Error

## Problem Identified
The JSON parsing error occurs because the API endpoints are returning 404 errors instead of JSON responses. This happens when:

1. Vercel routing is not properly configured
2. API routes are not being handled by the FastAPI application
3. The Python backend is not properly deployed

## Solution Applied

### 1. Fixed vercel.json
- Updated routing configuration to properly route /api/* requests to the Python backend
- Ensured the Python runtime is properly configured

### 2. Updated requirements.txt
- Added all necessary Python dependencies for the FastAPI application

### 3. Next Steps for Deployment
1. Ensure all environment variables are set in Vercel dashboard:
   - OPENAI_API_KEY
   - JIRA_URL (optional)
   - JIRA_API_TOKEN (optional)
   - JIRA_USER (optional)

2. Redeploy the application:
   ```bash
   vercel --prod
   ```

3. Test the endpoints after deployment:
   ```bash
   curl -X POST https://your-domain.vercel.app/api/generate \
     -H "Content-Type: application/json" \
     -d '{"description": "Test story", "framework": "Cypress"}'
   ```

## Expected API Endpoints
After successful deployment, these endpoints should work:
- POST /api/generate
- POST /api/integrated-story
- GET /health
- GET /config
"""

with open('DEPLOYMENT_FIX.md', 'w') as f:
    f.write(deployment_guide)

print("✅ Created deployment guide: DEPLOYMENT_FIX.md")

# Create a simple test script for local testing
test_script = """
#!/usr/bin/env python3
import requests
import json

def test_local_api():
    """Test API endpoints locally"""
    base_url = "http://localhost:8000"
    
    print("Testing local API endpoints...")
    
    # Test health endpoint
    try:
        response = requests.get(f"{base_url}/health")
        print(f"Health endpoint: {response.status_code}")
        if response.status_code == 200:
            print("✅ Health endpoint working")
        else:
            print(f"❌ Health endpoint failed: {response.text}")
    except Exception as e:
        print(f"❌ Health endpoint error: {e}")
    
    # Test generate endpoint
    try:
        data = {
            "description": "As a user, I want to login to the application",
            "framework": "Cypress"
        }
        response = requests.post(f"{base_url}/api/generate", json=data)
        print(f"Generate endpoint: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print("✅ Generate endpoint working")
            print(f"Response keys: {list(result.keys())}")
        else:
            print(f"❌ Generate endpoint failed: {response.text}")
    except Exception as e:
        print(f"❌ Generate endpoint error: {e}")

if __name__ == "__main__":
    test_local_api()
"""

with open('test_local.py', 'w') as f:
    f.write(test_script.strip())

print("✅ Created local testing script: test_local.py")
print("\n" + "="*50)
print("SUMMARY OF FIXES APPLIED:")
print("="*50)
print("1. ✅ Fixed vercel.json routing configuration")
print("2. ✅ Updated Python requirements")
print("3. ✅ Created deployment guide")
print("4. ✅ Created local testing script")
print("\nTo resolve the JSON parsing error:")
print("1. Redeploy to Vercel with: vercel --prod")
print("2. Set required environment variables in Vercel dashboard")
print("3. Test endpoints after deployment")
