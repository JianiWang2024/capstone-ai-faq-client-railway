#!/usr/bin/env python3
"""
Railway deployment startup script for FAQ AI System
This script handles Railway-specific configuration and startup
"""

import os
import sys
from app import app

def main():
    """Main startup function for Railway deployment"""
    
    # Set Railway-specific environment variables
    if not os.environ.get('FLASK_ENV'):
        os.environ['FLASK_ENV'] = 'production'
    
    if not os.environ.get('FLASK_DEBUG'):
        os.environ['FLASK_DEBUG'] = 'False'
    
    # Get port from Railway environment
    port = int(os.environ.get('PORT', 5000))
    
    # Get host from Railway environment
    host = os.environ.get('HOST', '0.0.0.0')
    
    print(f"🚀 Starting FAQ AI System on Railway...")
    print(f"📍 Host: {host}")
    print(f"🔌 Port: {port}")
    print(f"🌍 Environment: {os.environ.get('FLASK_ENV', 'production')}")
    print(f"🗄️ Database: {os.environ.get('DATABASE_URL', 'Not set')[:50]}...")
    
    try:
        # Start the Flask application
        app.run(
            host=host,
            port=port,
            debug=False,
            threaded=True
        )
    except Exception as e:
        print(f"❌ Failed to start application: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
