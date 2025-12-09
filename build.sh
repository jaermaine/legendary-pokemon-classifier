#!/usr/bin/env bash
# Render Build Script
# Ensures correct Python version and installs dependencies

set -e  # Exit on error

echo "🐍 Python version check..."
python --version

echo "📦 Upgrading pip, setuptools, and wheel..."
pip install --upgrade pip setuptools wheel

echo "📥 Installing dependencies..."
pip install -r requirements.txt

echo "✅ Build complete!"

