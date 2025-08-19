#!/usr/bin/env python3
import sys
import os

# Add the project root to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src', 'backend_py'))

try:
    from server import app
    print("✅ FastAPI app imported successfully")
    print("\nAvailable routes:")
    print("-" * 50)
    
    for route in app.routes:
        methods = list(route.methods) if hasattr(route, 'methods') else ['GET']
        path = route.path
        print(f"  {path} - {methods}")
        
    print("\n" + "=" * 50)
    print("Route Analysis:")
    
    # Check for specific routes
    expected_routes = [
        '/api/generate',
        '/api/integrated-story',
        '/health',
        '/config'
    ]
    
    found_routes = [route.path for route in app.routes]
    
    for expected in expected_routes:
        if expected in found_routes:
            print(f"✅ {expected} - FOUND")
        else:
            print(f"❌ {expected} - NOT FOUND")
    
except Exception as e:
    print(f"❌ Error importing FastAPI app: {e}")
    import traceback
    traceback.print_exc()
