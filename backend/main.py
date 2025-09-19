#!/usr/bin/env python3
"""
JobX AI Interview Platform - Main Backend Entry Point
Free AI Infrastructure with Ollama, Whisper, and Edge-TTS
"""

import os
import sys
from pathlib import Path

# Add backend to Python path
backend_path = Path(__file__).parent
sys.path.insert(0, str(backend_path))

from api.ollama_backend import app

if __name__ == "__main__":
    import uvicorn
    
    # Configuration
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    reload = os.getenv("RELOAD", "true").lower() == "true"
    
    print(f"🚀 Starting JobX AI Interview Platform")
    print(f"🌐 Backend: http://{host}:{port}")
    print(f"🔄 Reload: {reload}")
    print(f"💰 Cost: $0/month - Completely Free!")
    
    uvicorn.run(
        "api.ollama_backend:app",
        host=host,
        port=port,
        reload=reload,
        log_level="info"
    )
