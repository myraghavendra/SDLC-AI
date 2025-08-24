#!/usr/bin/env python3
import requests
import json

def test_deployed_api():
    """Test the deployed API endpoints on Vercel with bypass token"""
    base_url = "https://sdlc-mlfetmgd2-raghavendars-projects.vercel.app"
    bypass_token = "raghavendraraogvraghavendraraogv"
    
    print("Testing deployed API endpoints with bypass token...")
    
    # Test health endpoint with bypass token
    try:
        response = requests.get(
            f"{base_url}/health?x-vercel-set-bypass-cookie=true&x-vercel-protection-bypass={bypass_token}"
        )
        print(f"Health endpoint: {response.status_code}")
        print(f"Content-Type: {response.headers.get('content-type')}")
        print(f"Response length: {len(response.text)}")
        print(f"Response preview: {response.text[:200]}...")
        if response.status_code == 200:
            print("✅ Health endpoint working")
            try:
                data = response.json()
                print(f"Response JSON: {data}")
            except Exception as json_error:
                print(f"❌ JSON parsing error: {json_error}")
        else:
            print(f"❌ Health endpoint failed: {response.text}")
    except Exception as e:
        print(f"❌ Health endpoint error: {e}")
    
    # Test a non-existent API endpoint to verify 404 handling
    try:
        response = requests.get(
            f"{base_url}/api/nonexistent-endpoint?x-vercel-set-bypass-cookie=true&x-vercel-protection-bypass={bypass_token}"
        )
        print(f"API 404 test endpoint: {response.status_code}")
        if response.status_code == 404:
            print("✅ API 404 error handling working")
            try:
                data = response.json()
                print(f"Response: {data}")
            except:
                print("Response is not JSON")
                print(f"Response preview: {response.text[:200]}...")
        else:
            print(f"❌ API 404 error handling failed: {response.text}")
    except Exception as e:
        print(f"❌ API 404 test error: {e}")

if __name__ == "__main__":
    test_deployed_api()
