#!/usr/bin/env python3
"""
Comprehensive fix for Vercel FUNCTION_INVOCATION_FAILED error
This addresses common causes: missing dependencies, environment variables, and import issues
"""

import os
import json
import subprocess

def create_vercel_json():
    """Create optimized vercel.json for Vercel deployment"""
    config = {
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
        "devCommand": "npm run dev",
        "env": {
            "PYTHONPATH": "/var/task"
        }
    }
    
    with open('vercel.json', 'w') as f:
        json.dump(config, f, indent=2)
    
    print("✅ Created optimized vercel.json")

def create_api_index():
    """Create a robust api/index.py that handles Vercel environment properly"""
    api_content = '''import os
import sys
import logging

# Configure logging for Vercel
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Add project root to Python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    # Import the FastAPI app
    from src.backend_py.server import app
    logger.info("Successfully imported FastAPI app")
except ImportError as e:
    logger.error(f"Failed to import FastAPI app: {e}")
    # Create a fallback app
    from fastapi import FastAPI
    app = FastAPI()
    
    @app.get("/")
    async def root():
        return {"error": "Application failed to start", "details": str(e)}
    
    @app.get("/health")
    async def health():
        return {"status": "error", "message": str(e)}

# Export the app for Vercel
app = app
'''
    
    with open('api/index.py', 'w') as f:
        f.write(api_content)
    
    print("✅ Created robust api/index.py")

def create_requirements_txt():
    """Create comprehensive requirements.txt with all dependencies"""
    requirements = '''fastapi==0.104.1
uvicorn==0.24.0
pydantic==2.5.0
openai==1.3.7
python-multipart==0.0.6
requests==2.31.0
redis==5.0.1
psycopg2-binary==2.9.9
python-dotenv==1.0.0
typing-extensions==4.8.0
'''
    
    with open('src/backend_py/requirements.txt', 'w') as f:
        f.write(requirements)
    
    print("✅ Updated requirements.txt")

def create_environment_check():
    """Create environment variable check script"""
    check_script = '''#!/usr/bin/env python3
import os
import sys
import json

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from src.backend_py.config import validate_configuration, get_missing_config_summary
    
    print("🔍 Environment Configuration Check")
    print("=" * 50)
    
    config = validate_configuration()
    missing = get_missing_config_summary()
    
    print("Configuration Status:")
    for service, status in config.items():
        status_text = "✅" if status else "❌"
        print(f"  {service}: {status_text}")
    
    print("\nMissing Configuration:")
    for service, items in missing.items():
        if items:
            print(f"  {service}: {', '.join(items)}")
    
    # Check Vercel environment
    is_vercel = os.getenv('VERCEL') is not None
    print(f"\nRunning on Vercel: {'Yes' if is_vercel else 'No'}")
    
    # Check Python path
    print(f"\nPython Path: {sys.path}")
    
except Exception as e:
    print(f"Error checking configuration: {e}")
    import traceback
    traceback.print_exc()
'''
    
    with open('check_env.py', 'w') as f:
        f.write(check_script)
    
    print("✅ Created environment check script: check_env.py")

def create_deployment_script():
    """Create deployment script with proper error handling"""
    deploy_script = '''#!/usr/bin/env python3
import os
import subprocess
import sys

def deploy_to_vercel():
    """Deploy to Vercel with proper error handling"""
    print("🚀 Starting Vercel deployment...")
    
    # Check if Vercel CLI is installed
    try:
        subprocess.run(['vercel', '--version'], check=True, capture_output=True)
    except FileNotFoundError:
        print("❌ Vercel CLI not found. Install with: npm i -g vercel")
        return False
    
    # Check for required environment variables
    required_vars = ['OPENAI_API_KEY']
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    
    if missing_vars:
        print(f"⚠️  Missing environment variables: {', '.join(missing_vars)}")
        print("Please set these in Vercel dashboard or .env file")
    
    # Deploy
    try:
        print("📦 Deploying to Vercel...")
        result = subprocess.run(['vercel', '--prod'], check=True)
        print("✅ Deployment completed successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Deployment failed: {e}")
        return False

if __name__ == "__main__":
    success = deploy_to_vercel()
    sys.exit(0 if success else 1)
'''
    
    with open('deploy.py', 'w') as f:
        f.write(deploy_script)
    
    print("✅ Created deployment script: deploy.py")

def create_post_deployment_test():
    """Create post-deployment test script"""
    test_script = '''#!/usr/bin/env python3
import requests
import json
import sys

def test_deployed_api():
    """Test the deployed API endpoints"""
    
    # Get the deployment URL
    if len(sys.argv) > 1:
        base_url = sys.argv[1]
    else:
        base_url = "https://sdlc-ai.vercel.app"
    
    print(f"🧪 Testing deployed API at: {base_url}")
    print("=" * 60)
    
    tests = [
        {
            "name": "Health Check",
            "url": f"{base_url}/health",
            "method": "GET"
        },
        {
            "name": "Configuration Status",
            "url": f"{base_url}/config",
            "method": "GET"
        },
        {
            "name": "Generate API",
            "url": f"{base_url}/api/generate",
            "method": "POST",
            "data": {
                "description": "As a user, I want to login to the application",
                "framework": "Cypress"
            }
        }
    ]
    
    results = []
    
    for test in tests:
        try:
            print(f"\nTesting {test['name']}...")
            
            if test["method"] == "POST":
                response = requests.post(
                    test["url"], 
                    json=test.get("data", {}),
                    timeout=30
                )
            else:
                response = requests.get(test["url"], timeout=30)
            
            result = {
                "name": test["name"],
                "status": response.status_code,
                "success": response.status_code == 200
            }
            
            if response.status_code == 200:
                try:
                    result["response"] = response.json()
                except:
                    result["response"] = response.text
                print(f"✅ {test['name']}: {response.status_code}")
            else:
                result["error"] = response.text[:200]
                print(f"❌ {test['name']}: {response.status_code} - {response.text[:100]}")
            
            results.append(result)
            
        except Exception as e:
            print(f"❌ {test['name']}: Error - {e}")
            results.append({
                "name": test["name"],
                "success": False,
                "error": str(e)
            })
    
    # Summary
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    
    passed = sum(1 for r in results if r["success"])
    total = len(results)
    
    print(f"Passed: {passed}/{total}")
    
    if passed == total:
        print("🎉 All tests passed! API is working correctly.")
    else:
        print("⚠️  Some tests failed. Check the logs above.")
    
    return passed == total

if __name__ == "__main__":
    success = test_deployed_api()
    sys.exit(0 if success else 1)
'''
    
    with open('test_deployed.py', 'w') as f:
        f.write(test_script)
    
    print("✅ Created post-deployment test script: test_deployed.py")

def main():
    """Run all fixes"""
    print("🔧 Applying comprehensive Vercel fixes...")
    print("=" * 50)
    
    create_vercel_json()
    create_api_index()
    create_requirements_txt()
    create_environment_check()
    create_deployment_script()
    create_post_deployment_test()
    
    print("\n" + "=" * 50)
    print("✅ All fixes applied successfully!")
    print("\nNext steps:")
    print("1. Set environment variables in Vercel dashboard:")
    print("   - OPENAI_API_KEY (required)")
    print("   - JIRA_URL, JIRA_API_TOKEN, JIRA_USER (optional)")
    print("\n2. Deploy to Vercel:")
    print("   python deploy.py")
    print("\n3. Test after deployment:")
    print("   python test_deployed.py https://your-domain.vercel.app")

if __name__ == "__main__":
    main()
