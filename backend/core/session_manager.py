#!/usr/bin/env python3
"""
Simple Session Manager for Interview System
"""
import json
import uuid
import time
import logging
from typing import Dict, List, Any, Optional

logger = logging.getLogger(__name__)

class SessionManager:
    """Simple in-memory session manager"""
    
    def __init__(self):
        self.sessions = {}
        self.session_timeout = 3600  # 1 hour
    
    def create_session(self, session_id: str, initial_data: Dict[str, Any]) -> bool:
        """Create a new session"""
        try:
            session_data = {
                'session_id': session_id,
                'data': initial_data,
                'created_at': time.time(),
                'last_activity': time.time(),
                'questions_asked': [],
                'responses_received': [],
                'conversation_history': []
            }
            
            self.sessions[session_id] = session_data
            logger.info(f"Session {session_id} created")
            return True
            
        except Exception as e:
            logger.error(f"Error creating session {session_id}: {e}")
            return False
    
    def get_session(self, session_id: str) -> Optional[Dict[str, Any]]:
        """Get session data"""
        return self.sessions.get(session_id)
    
    def update_session(self, session_id: str, updates: Dict[str, Any]) -> bool:
        """Update session data"""
        try:
            if session_id in self.sessions:
                self.sessions[session_id].update(updates)
                self.sessions[session_id]['last_activity'] = time.time()
                return True
            return False
        except Exception as e:
            logger.error(f"Error updating session {session_id}: {e}")
            return False
    
    def add_question(self, session_id: str, question: Dict[str, Any]) -> bool:
        """Add a question to the session"""
        try:
            if session_id in self.sessions:
                if 'questions_asked' not in self.sessions[session_id]:
                    self.sessions[session_id]['questions_asked'] = []
                
                self.sessions[session_id]['questions_asked'].append(question)
                self.sessions[session_id]['last_activity'] = time.time()
                return True
            return False
        except Exception as e:
            logger.error(f"Error adding question to session {session_id}: {e}")
            return False
    
    def add_response(self, session_id: str, response: Dict[str, Any]) -> bool:
        """Add a response to the session"""
        try:
            if session_id in self.sessions:
                if 'responses_received' not in self.sessions[session_id]:
                    self.sessions[session_id]['responses_received'] = []
                
                self.sessions[session_id]['responses_received'].append(response)
                self.sessions[session_id]['last_activity'] = time.time()
                return True
            return False
        except Exception as e:
            logger.error(f"Error adding response to session {session_id}: {e}")
            return False
    
    def add_conversation_turn(self, session_id: str, turn: Dict[str, Any]) -> bool:
        """Add a conversation turn"""
        try:
            if session_id in self.sessions:
                if 'conversation_history' not in self.sessions[session_id]:
                    self.sessions[session_id]['conversation_history'] = []
                
                self.sessions[session_id]['conversation_history'].append(turn)
                self.sessions[session_id]['last_activity'] = time.time()
                return True
            return False
        except Exception as e:
            logger.error(f"Error adding conversation turn to session {session_id}: {e}")
            return False
    
    def get_session_summary(self, session_id: str) -> Optional[Dict[str, Any]]:
        """Get session summary"""
        session = self.sessions.get(session_id)
        if not session:
            return None
        
        return {
            'session_id': session_id,
            'total_questions': len(session.get('questions_asked', [])),
            'total_responses': len(session.get('responses_received', [])),
            'conversation_turns': len(session.get('conversation_history', [])),
            'created_at': session.get('created_at', 0),
            'last_activity': session.get('last_activity', 0)
        }
    
    def cleanup_expired_sessions(self) -> int:
        """Clean up expired sessions"""
        current_time = time.time()
        expired_sessions = []
        
        for session_id, session_data in self.sessions.items():
            if current_time - session_data.get('last_activity', 0) > self.session_timeout:
                expired_sessions.append(session_id)
        
        for session_id in expired_sessions:
            del self.sessions[session_id]
        
        if expired_sessions:
            logger.info(f"Cleaned up {len(expired_sessions)} expired sessions")
        
        return len(expired_sessions)

# Global instance
session_manager = SessionManager()
