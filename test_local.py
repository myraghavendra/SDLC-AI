#!/usr/bin/env python3
import requests
import json

def test_local_api():
    """Test API endpoints locally"""
    base_url = "http://localhost:8001"
    
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
