#!/usr/bin/env python3
"""
Diagnostic script to test the API endpoints and identify JSON parsing issues.
This script will test the /api/generate endpoint and provide detailed debugging information.
"""

import requests
import json
import sys
import traceback

def test_api_endpoint(url, method='POST', data=None, headers=None):
    """Test an API endpoint and provide detailed debugging information."""
    print(f"\n{'='*60}")
    print(f"Testing {method} {url}")
    print(f"{'='*60}")
    
    try:
        if method.upper() == 'POST':
            response = requests.post(url, json=data, headers=headers, timeout=30)
        else:
            response = requests.get(url, headers=headers, timeout=30)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        print(f"Content-Type: {response.headers.get('content-type', 'Not specified')}")
        
        # Check if response is JSON
        content_type = response.headers.get('content-type', '')
        is_json = 'application/json' in content_type
        
        print(f"Is JSON Response: {is_json}")
        
        # Try to parse as JSON
        try:
            json_data = response.json()
            print("JSON Response (formatted):")
            print(json.dumps(json_data, indent=2))
            return {
                'success': True,
                'status_code': response.status_code,
                'json_data': json_data,
                'is_json': True
            }
        except json.JSONDecodeError as e:
            print(f"JSON Parse Error: {e}")
            print("Response Content (first 500 chars):")
            content_preview = response.text[:500]
            print(content_preview)
            if len(response.text) > 500:
                print("... (truncated)")
            return {
                'success': False,
                'status_code': response.status_code,
                'error': str(e),
                'content_preview': content_preview,
                'is_json': False
            }
            
    except requests.exceptions.RequestException as e:
        print(f"Request Error: {e}")
        return {
            'success': False,
            'error': str(e),
            'status_code': None
        }

def main():
    """Main diagnostic function."""
    print("API Endpoint Diagnostic Tool")
    print("Testing for JSON parsing issues...")
    
    # Test endpoints
    base_url = "https://sdlc-ai.vercel.app"
    # base_url = "http://localhost:8000"  # Uncomment for local testing
    
    endpoints = [
        {
            'url': f"{base_url}/api/generate",
            'method': 'POST',
            'data': {
                'description': 'As a user, I want to be able to login to the application',
                'context': 'Web application with email/password authentication',
                'framework': 'Cypress'
            }
        },
        {
            'url': f"{base_url}/api/integrated-story",
            'method': 'POST',
            'data': {
                'tool': 'Jira',
                'stories': [
                    {
                        'key': 'TEST-1',
                        'title': 'User Login Feature',
                        'description': 'As a user, I want to login to the application'
                    }
                ],
                'framework': 'Cypress'
            }
        },
        {
            'url': f"{base_url}/health",
            'method': 'GET'
        }
    ]
    
    results = []
    
    for endpoint in endpoints:
        result = test_api_endpoint(
            endpoint['url'], 
            endpoint['method'], 
            endpoint.get('data')
        )
        results.append({
            'endpoint': endpoint['url'],
            'result': result
        })
    
    # Summary
    print(f"\n{'='*60}")
    print("SUMMARY")
    print(f"{'='*60}")
    
    failed_endpoints = []
    for result in results:
        endpoint = result['endpoint']
        res = result['result']
        
        if res['success']:
            print(f"✅ {endpoint} - OK ({res['status_code']})")
        else:
            print(f"❌ {endpoint} - FAILED")
            failed_endpoints.append({
                'endpoint': endpoint,
                'error': res.get('error', 'Unknown error'),
                'status_code': res.get('status_code')
            })
    
    if failed_endpoints:
        print(f"\nFailed Endpoints:")
        for failed in failed_endpoints:
            print(f"  - {failed['endpoint']}: {failed['error']} (Status: {failed['status_code']})")
    
    return len(failed_endpoints) == 0

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
