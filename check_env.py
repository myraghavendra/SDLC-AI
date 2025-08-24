#!/usr/bin/env python3
"""
Environment Configuration Checker
This script validates that all required environment variables are properly configured.
"""

import os
import sys
from dotenv import load_dotenv

def check_environment():
    """Check if required environment variables are set"""
    # Check if we're running in Vercel environment
    is_vercel = os.getenv('VERCEL') is not None
    
    # Only load .env file if not in Vercel environment
    if not is_vercel:
        load_dotenv()
    
    required_vars = [
        'OPENAI_API_KEY',
        'JIRA_URL',
        'JIRA_USER', 
        'JIRA_API_TOKEN',
        'JIRA_PROJECT_KEY'
    ]
    
    optional_vars = [
        'PORT',
        'DATABASE_URL',
        'REDIS_URL',
        'DEBUG'
    ]
    
    print("🔍 Environment Configuration Check")
    print("=" * 50)
    
    # Display environment context
    if is_vercel:
        print("🌐 Running in Vercel environment")
        vercel_env = os.getenv('VERCEL_ENV', 'unknown')
        print(f"   Environment: {vercel_env}")
    else:
        print("💻 Running in local development environment")
    
    print()
    
    # Check required variables
    missing_required = []
    for var in required_vars:
        value = os.getenv(var)
        if not value or value.strip() == '':
            missing_required.append(var)
            print(f"❌ {var}: MISSING")
        else:
            # Mask sensitive values
            if var in ['OPENAI_API_KEY', 'JIRA_API_TOKEN']:
                masked_value = value[:4] + '*' * (len(value) - 8) + value[-4:] if len(value) > 8 else '****'
                print(f"✅ {var}: {masked_value}")
            elif var == 'JIRA_USER':
                print(f"✅ {var}: {value}")
            else:
                print(f"✅ {var}: SET")
    
    # Check optional variables
    print("\n📋 Optional Variables:")
    for var in optional_vars:
        value = os.getenv(var)
        if value:
            if var in ['DATABASE_URL', 'REDIS_URL']:
                # Show only the protocol and host for URLs
                if '://' in value:
                    parts = value.split('://')
                    if len(parts) > 1:
                        host_part = parts[1].split('@')[-1].split('/')[0]
                        print(f"   ✅ {var}: {parts[0]}://...@{host_part}")
                    else:
                        print(f"   ✅ {var}: SET")
                else:
                    print(f"   ✅ {var}: SET")
            else:
                print(f"   ✅ {var}: {value}")
        else:
            print(f"   ⚠️  {var}: NOT SET (optional)")
    
    # Summary
    print("\n" + "=" * 50)
    if missing_required:
        print(f"❌ Configuration incomplete. Missing {len(missing_required)} required variables:")
        for var in missing_required:
            print(f"   - {var}")
        
        if is_vercel:
            print("\n💡 Please set these variables in your Vercel dashboard:")
            print("   Project Settings → Environment Variables")
            print("   Add each variable with its corresponding value")
        else:
            print("\n💡 Please set these variables in your .env file:")
            print("   Copy .env.example to .env and update the values")
        
        return False
    else:
        print("✅ All required environment variables are configured!")
        
        if is_vercel:
            print("\n🚀 Vercel deployment is ready!")
        else:
            print("\n🚀 Local development environment is ready!")
        
        return True

def main():
    """Main function"""
    try:
        success = check_environment()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"Error checking environment: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
