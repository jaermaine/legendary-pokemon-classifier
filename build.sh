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
echo "   - pandas>=2.2.3 has pre-built wheels for Python 3.13"
echo "   - scikit-learn>=1.4.0 has pre-built wheels for Python 3.13"
echo "   - pydantic>=2.6.0 has pre-built wheels for Python 3.13 (avoids Rust compilation)"
echo "   - All dependencies updated for Python 3.13 compatibility"

# Install with preference for binary wheels
# This avoids building from source which causes compilation errors
# --prefer-binary: Prefer binary wheels over source builds
# --only-binary:all: Only use binary wheels (fail if not available)
# We use --prefer-binary to allow fallback if needed, but should get wheels
pip install --prefer-binary -r requirements.txt

echo "✅ Build complete!"

