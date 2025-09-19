#!/usr/bin/env python3
"""
JobX AI Interview Platform - Main App
For Render deployment: uvicorn app:app
"""

import sys
from pathlib import Path

# Add api directory to Python path
api_path = Path(__file__).parent / "api"
sys.path.insert(0, str(api_path))

# Import the free AI backend
from api.ollama_backend import app

# This is the app that Render will use
# Command: uvicorn app:app