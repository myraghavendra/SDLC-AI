#!/usr/bin/env python3
"""
Test script to verify all API endpoints are working correctly
"""

import requests
import json

# Test endpoints
ENDPOINTS = [
    "/api/generate",
    "/api/defectSummaryReport",
    "/api/upload-jira",
    "/api/analyzeRequirement",
    "/api/getStories",
    "/api/getStoriesByFilter",
    "/api/getJiraProjects",
    "/api/getJiraConfig",
    "/api/integrated-story",
    "/api/integrated-story/health",
    "/health",
    "/config",
    "/"
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
                    "description": "As a user, I want to be able to log in to the system so that I can access my account",
                    "context": "Authentication system with email/password login",
                    "framework": "Cypress"
                }, timeout=10)
            elif endpoint == "/api/defectSummaryReport":
                # Test POST endpoint
                response = requests.post(url, json={
                    "project_name": "TEST"
                }, timeout=10)
            elif endpoint == "/api/upload-jira":
                # Test POST endpoint
                response = requests.post(url, json={
                    "summary": "Test User Story - Login Functionality",
                    "description": "As a user, I want to be able to log in to the system so that I can access my account"
                }, timeout=10)
            elif endpoint == "/api/analyzeRequirement":
                # Test POST endpoint
                response = requests.post(url, json={
                    "tool": "JIRA",
                    "story_key": "TEST-1",
                    "story_text": "As a user, I want to be able to log in to the system so that I can access my account",
                    "prompt": "Evaluate this user story for quality and completeness"
                }, timeout=10)
            elif endpoint == "/api/getStories":
                # Test POST endpoint
                response = requests.post(url, json={
                    "tool": "jira",
                    "jira_url": "https://test.atlassian.net",
                    "project_key": "TEST"
                }, timeout=10)
            elif endpoint == "/api/getStoriesByFilter":
                # Test POST endpoint
                response = requests.post(url, json={
                    "tool": "jira",
                    "jira_url": "https://test.atlassian.net",
                    "filter_id": "12345",
                    "project_key": "TEST"
                }, timeout=10)
            elif endpoint == "/api/integrated-story":
                # Test POST endpoint
                response = requests.post(url, json={
                    "tool": "JIRA",
                    "stories": [
                        {
                            "key": "TEST-1",
                            "title": "Login Functionality",
                            "description": "As a user, I want to be able to log in to the system"
                        },
                        {
                            "key": "TEST-2", 
                            "title": "Logout Functionality",
                            "description": "As a user, I want to be able to log out of the system"
                        }
                    ],
                    "framework": "Cypress",
                    "context": "Authentication system integration"
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
