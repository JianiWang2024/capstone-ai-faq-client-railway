#!/bin/bash

echo "🚀 Starting FAQ AI System on Railway..."

# Set Railway-specific environment variables
export FLASK_ENV=${FLASK_ENV:-production}
export FLASK_DEBUG=${FLASK_DEBUG:-False}
export PORT=${PORT:-5000}
export HOST=${HOST:-0.0.0.0}

echo "📍 Environment: $FLASK_ENV"
echo "🔌 Port: $PORT"
echo "🌍 Host: $HOST"

# Check if we're in the right directory
if [ ! -f "faq-backend/railway_start.py" ]; then
    echo "❌ Error: railway_start.py not found. Please ensure you're in the correct directory."
    exit 1
fi

# Start the application
echo "🚀 Starting Flask application..."
cd faq-backend && python railway_start.py
