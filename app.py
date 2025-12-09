"""
Root-level app entrypoint for Render deployment.
This file allows gunicorn to use 'app:app' while still using the modular structure.
"""

# Import the app from api.app (which imports from src.api.app)
from api.app import app

__all__ = ["app"]

