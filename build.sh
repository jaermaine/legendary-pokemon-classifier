#!/usr/bin/env bash
# Render Build Script
# Ensures correct Python version and installs dependencies

set -e  # Exit on error

echo "🐍 Python version check..."
python --version

# Verify Python version matches runtime.txt (3.11.x)
PYTHON_VERSION=$(python --version 2>&1 | awk '{print $2}' | cut -d. -f1,2)
if [ "$PYTHON_VERSION" != "3.11" ]; then
    echo "⚠️  Warning: Expected Python 3.11, but got Python $PYTHON_VERSION"
    echo "   This may cause build issues. Check runtime.txt and Render Python version settings."
fi

echo "📦 Upgrading pip, setuptools, and wheel..."
pip install --upgrade pip setuptools wheel

echo "📥 Installing dependencies..."
echo "   Using --prefer-binary to avoid building from source when possible"
pip install --prefer-binary -r requirements.txt

echo "✅ Build complete!"

