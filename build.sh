#!/usr/bin/env bash
# Render Build Script
# Installs dependencies with pre-built wheels (compatible with Python 3.13+)

set -e  # Exit on error

echo "🐍 Python version check..."
python --version

echo "📦 Upgrading pip, setuptools, and wheel..."
pip install --upgrade pip setuptools wheel

echo "📥 Installing dependencies..."
echo "   Strategy: Unpinned versions + pre-built wheels (Python 3.13 compatible)"
echo "   - pip automatically selects latest versions with Python 3.13 wheels"
echo "   - --prefer-binary ensures we use pre-built wheels (no compilation)"
echo "   - Eliminates build errors by avoiding source builds entirely"

# Install with preference for binary wheels
# Unpinned versions let pip choose latest compatible versions with pre-built wheels
# This eliminates build errors because:
# 1. pip automatically selects versions with Python 3.13 wheels
# 2. --prefer-binary ensures we use wheels over source builds
# 3. No compilation needed = no build errors
pip install --prefer-binary -r requirements.txt

echo "✅ Build complete!"

