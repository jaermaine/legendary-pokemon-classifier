"""
ASGI application entry point for Render deployment.
This file is used by Gunicorn with UvicornWorker to serve the FastAPI application.
"""

import sys
from pathlib import Path

# Add the project root to the path so we can import src module
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

from src.api.app import app

# ASGI app - this is what gunicorn + uvicorn worker will use
__all__ = ["app"]
