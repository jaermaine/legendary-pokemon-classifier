#!/bin/bash
# Netlify Build Script
# Replaces API URL placeholder in index.html with environment variable

set -e  # Exit on error

echo "🚀 Starting Netlify build..."

# Check if VITE_API_BASE_URL is set
if [ -n "$VITE_API_BASE_URL" ]; then
    echo "📝 Setting API URL to: $VITE_API_BASE_URL"
    
    # Replace placeholder in index.html (works on Linux/Mac)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s|REPLACE_WITH_RENDER_URL|$VITE_API_BASE_URL|g" index.html
    else
        # Linux (Netlify uses Ubuntu)
        sed -i "s|REPLACE_WITH_RENDER_URL|$VITE_API_BASE_URL|g" index.html
    fi
    
    echo "✅ API URL updated in index.html"
    
    # Verify the replacement worked
    if grep -q "$VITE_API_BASE_URL" index.html; then
        echo "✅ Verification: API URL found in index.html"
    else
        echo "⚠️  Warning: API URL replacement may have failed"
    fi
else
    echo "⚠️  VITE_API_BASE_URL not set"
    echo "   Using default: http://localhost:8000"
    echo "   To fix: Set VITE_API_BASE_URL in Netlify environment variables"
fi

# Build is complete (no actual build needed for static site)
echo "✅ Build complete - ready to deploy"

