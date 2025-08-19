#!/usr/bin/env python3
"""
Script to fix the Vercel configuration for proper API routing.
"""

import json
import os

# Create a corrected vercel.json
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
                "runtime": "python3.12"
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

print("✅ vercel.json has been updated with corrected routing configuration")
print("\nKey changes made:")
print("- Ensured /api/(.*) routes properly route to /api/index.py")
print("- Maintained existing build and deployment configuration")

# Also create a requirements.txt for the Python backend
requirements_content = """
fastapi==0.104.1
uvicorn==0.24.0
pydantic==2.5.0
openai==1.3.7
python-multipart==0.0.6
requests==2.31.0
redis==5.0.1
psycopg2-binary==2.9.9
python-dotenv==1.0.0
"""

with open('src/backend_py/requirements.txt', 'w') as f:
    f.write(requirements_content.strip())

print("\n✅ Updated requirements.txt for Python dependencies")
