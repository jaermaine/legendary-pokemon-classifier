#!/bin/bash
# Netlify Build Script
# Replaces API URL placeholder in js/config/api-config.js with environment variable

set -e  # Exit on error

echo "🚀 Starting Netlify build..."

# Check if VITE_API_BASE_URL is set
if [ -n "$VITE_API_BASE_URL" ]; then
    echo "📝 Setting API URL to: $VITE_API_BASE_URL"
    
    # Replace placeholder in api-config.js (works on Linux/Mac)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s|__RENDER_URL_PLACEHOLDER__|$VITE_API_BASE_URL|g" js/config/api-config.js
    else
        # Linux (Netlify uses Ubuntu)
        sed -i "s|__RENDER_URL_PLACEHOLDER__|$VITE_API_BASE_URL|g" js/config/api-config.js
    fi
    
    echo "✅ API URL updated in api-config.js"
    
    # Verify the replacement worked
    if grep -q "$VITE_API_BASE_URL" js/config/api-config.js; then
        echo "✅ Verification: API URL found in api-config.js"
    else
        echo "⚠️  Warning: API URL replacement may have failed"
    fi
else
    echo "⚠️  VITE_API_BASE_URL not set"
    echo "   Using fallback: https://legendary-pokemon-classifier.onrender.com"
    echo "   To customize: Set VITE_API_BASE_URL in Netlify environment variables"
fi

# Build is complete (no actual build needed for static site)
echo "✅ Build complete - ready to deploy"

