#!/usr/bin/env python3
"""
Railway Deployment Check Script
This script checks if the application is properly configured for Railway deployment
"""

import os
import sys

def check_environment():
    """Check if all required environment variables are set"""
    print("🔍 Checking Railway deployment environment...")
    print("=" * 50)
    
    # Required variables
    required_vars = [
        'DATABASE_URL',
        'OPENAI_API_KEY',
        'SECRET_KEY',
        'FLASK_ENV'
    ]
    
    missing_vars = []
    
    for var in required_vars:
        value = os.environ.get(var)
        if value:
            # Mask sensitive values
            if 'password' in var.lower() or 'key' in var.lower():
                display_value = value[:10] + "..." if len(value) > 10 else "***"
            else:
                display_value = value
            print(f"✅ {var}: {display_value}")
        else:
            print(f"❌ {var}: Not set")
            missing_vars.append(var)
    
    print("=" * 50)
    
    # Check database URL format
    db_url = os.environ.get('DATABASE_URL')
    if db_url:
        if 'railway' in db_url or 'rlwy.net' in db_url:
            print("✅ Database URL appears to be Railway format")
        else:
            print("⚠️  Database URL doesn't appear to be Railway format")
    
    # Check if we're in Railway environment
    if os.environ.get('RAILWAY_ENVIRONMENT'):
        print("✅ Running in Railway environment")
    else:
        print("ℹ️  Not running in Railway environment (this is normal for local testing)")
    
    # Summary
    if missing_vars:
        print(f"\n❌ Missing {len(missing_vars)} required environment variables:")
        for var in missing_vars:
            print(f"   - {var}")
        return False
    else:
        print("\n✅ All required environment variables are set!")
        return True

def check_database_connection():
    """Check if we can connect to the database"""
    print("\n🔍 Checking database connection...")
    
    try:
        from sqlalchemy import create_engine, text
        from config import Config
        
        # Create engine
        engine = create_engine(Config.SQLALCHEMY_DATABASE_URI)
        
        # Test connection
        with engine.connect() as conn:
            result = conn.execute(text("SELECT version()"))
            version = result.scalar()
            print(f"✅ Database connection successful: {version}")
            return True
            
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

def main():
    """Main function"""
    print("🚀 Railway Deployment Check")
    print("=" * 50)
    
    # Check environment
    env_ok = check_environment()
    
    # Check database if environment is ok
    if env_ok:
        db_ok = check_database_connection()
        
        if db_ok:
            print("\n🎉 All checks passed! Your app is ready for Railway deployment.")
        else:
            print("\n⚠️  Environment is configured but database connection failed.")
    else:
        print("\n❌ Environment configuration incomplete. Please set missing variables.")
    
    print("\n📋 Next steps:")
    print("1. Set all required environment variables in Railway")
    print("2. Deploy your application")
    print("3. Check the deployment logs")

if __name__ == '__main__':
    main()
