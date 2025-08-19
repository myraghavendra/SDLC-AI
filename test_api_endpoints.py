#!/usr/bin/env python3
"""
Test script to verify all API endpoints are working correctly
"""

import requests
import json

# Test endpoints
ENDPOINTS = [
    "/api/generate",
    "/api/integrated-story",
    "/api/upload-jira",
    "/api/requirement-analyser",
    "/api/get-stories",
    "/api/jira-config",
    "/health",
    "/config"
]

def test_endpoints(base_url="http://localhost:8000"):
    """Test all API endpoints"""
    print(f"Testing API endpoints at {base_url}")
    print("=" * 50)
    
    for endpoint in ENDPOINTS:
        url = f"{base_url}{endpoint}"
        try:
            if endpoint == "/api/generate":
                # Test POST endpoint
                response = requests.post(url, json={
                    "description": "Test user story",
                    "context": "Test context",
                    "framework": "Cypress"
                }, timeout=10)
            elif endpoint == "/api/integrated-story":
                # Test POST endpoint
                response = requests.post(url, json={
                    "tool": "Test Tool",
                    "stories": [{"key": "TEST-1", "title": "Test Story", "description": "Test description"}],
                    "framework": "Cypress"
                }, timeout=10)
            else:
                # Test GET endpoints
                response = requests.get(url, timeout=10)
            
            print(f"✅ {endpoint}: {response.status_code}")
            if response.status_code >= 400:
                print(f"   Error: {response.text[:200]}...")
                
        except requests.exceptions.RequestException as e:
            print(f"❌ {endpoint}: Failed - {e}")
    
    print("\n" + "=" * 50)
    print("Endpoint testing completed!")

if __name__ == "__main__":
    # Test local development
    test_endpoints("http://localhost:8000")
    
    # Test Vercel deployment (uncomment when deployed)
    # test_endpoints("https://sdlc-ai.vercel.app")
