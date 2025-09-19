#!/usr/bin/env python3
"""
JobX AI Interview Platform - Free AI Backend
Deploy with: uvicorn app_free:app
"""

import sys
from pathlib import Path

# Add api directory to Python path
api_path = Path(__file__).parent / "api"
sys.path.insert(0, str(api_path))

# Import the free AI backend
from ollama_backend import app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
