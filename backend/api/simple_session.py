#!/usr/bin/env python3
"""
Simple in-memory session manager (Redis replacement)
"""

import json
import uuid
from datetime import datetime
from typing import Optional, Dict, Any

# In-memory storage
sessions = {}

class SimpleSessionManager:
    @staticmethod
    def create_session(interview_type: str, candidate_name: str) -> str:
        """Create a new interview session"""
        session_id = str(uuid.uuid4())
        session_data = {
            "session_id": session_id,
            "interview_type": interview_type,
            "candidate_name": candidate_name,
            "created_at": datetime.now().isoformat(),
            "status": "active",
            "messages": []
        }
        sessions[session_id] = session_data
        return session_id
    
    @staticmethod
    def get_session(session_id: str) -> Optional[Dict]:
        """Get session data"""
        return sessions.get(session_id)
    
    @staticmethod
    def update_session(session_id: str, updates: Dict):
        """Update session data"""
        if session_id in sessions:
            sessions[session_id].update(updates)
    
    @staticmethod
    def add_message(session_id: str, role: str, content: str):
        """Add message to session"""
        if session_id in sessions:
            sessions[session_id]["messages"].append({
                "role": role,
                "content": content,
                "timestamp": datetime.now().isoformat()
            })
    
    @staticmethod
    def get_all_sessions():
        """Get all sessions (for debugging)"""
        return sessions
