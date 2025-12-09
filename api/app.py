"""
Vercel entrypoint for FastAPI application.
Routes to the actual FastAPI app in src/api/app.py
"""

import sys
from pathlib import Path

# Add the project root to the path so we can import src module
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from src.api.app import app

__all__ = ["app"]
