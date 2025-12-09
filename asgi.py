"""
ASGI application entry point for Render deployment.
This file is used by Gunicorn with UvicornWorker to serve the FastAPI application.

Gunicorn requires:
1. uvicorn package installed
2. gunicorn[uvicorn] extra installed (or gunicorn + uvicorn separately)
3. --worker-class uvicorn.workers.UvicornWorker specified
4. This asgi.py file at project root with 'app' variable

The app object MUST be an ASGI application (FastAPI is ASGI).
"""

import sys
from pathlib import Path

# Add the project root to the path so we can import src module
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

# Import the FastAPI ASGI application
from src.api.app import app

# Verify it's an ASGI app
if not callable(app):
    raise RuntimeError("app is not callable - FastAPI app import failed")

# ASGI app - this is what gunicorn + uvicorn worker will use
__all__ = ["app"]

# Debug: Print when loaded
print("✅ asgi.py loaded successfully - FastAPI app ready for Gunicorn+UvicornWorker")

