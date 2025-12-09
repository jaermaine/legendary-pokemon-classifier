#!/usr/bin/env bash
# Render Build Script
# Installs dependencies with pre-built wheels (compatible with Python 3.13+)

set -e  # Exit on error

echo "🐍 Python version check..."
python --version

echo "📦 Upgrading pip, setuptools, and wheel..."
pip install --upgrade pip setuptools wheel

echo "📥 Installing dependencies..."
echo "   Strategy: Use pre-built wheels to avoid compilation (Python 3.13 compatible)"
echo "   pandas>=2.2.3 has pre-built wheels for Python 3.13"

# Install with preference for binary wheels
# This avoids building from source which causes compilation errors
pip install --prefer-binary -r requirements.txt

echo "✅ Build complete!"

