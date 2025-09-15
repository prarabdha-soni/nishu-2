#!/usr/bin/env python3
"""
Nishu AI Interview System - Clean Chatterbox Implementation
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uuid
import time
import os
import logging

# Import core modules
from src.core.chatbot import interview_chatbot
from src.scoring.voice_scorer import voice_scorer
from src.core.session_manager import session_manager
from src.speech_interface.tts_module import tts_module

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Nishu AI Interview System",
    description="Intelligent AI-powered interview system with Chatterbox",
    version="2.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/recordings", StaticFiles(directory="recordings"), name="recordings")

# Pydantic models
class InterviewStartRequest(BaseModel):
    candidate_name: Optional[str] = "Candidate"
    position_applied: Optional[str] = "Software Engineer"
    resume_text: Optional[str] = ""
    job_description: Optional[str] = ""

class InterviewStartResponse(BaseModel):
    session_id: str
    welcome_message: str
    first_question: str
    system_status: Dict[str, Any]

class ChatRequest(BaseModel):
    session_id: str
    message: str

class ChatResponse(BaseModel):
    response: str
    next_question: Optional[str] = None
    analysis: Optional[Dict[str, Any]] = None
    session_summary: Dict[str, Any]

class SystemStatusResponse(BaseModel):
    chatbot_status: Dict[str, Any]
    session_count: int
    system_health: str

@app.get("/")
async def root():
    return {
        "message": "Nishu AI Interview System - Intelligent Interview Platform",
        "version": "2.0.0",
        "features": [
            "Chatterbox AI Interview Bot",
            "Intelligent Question Generation",
            "Response Analysis",
            "Session Management",
            "Real-time Chat Interface"
        ]
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "chatbot_available": interview_chatbot.chatbot is not None,
        "sessions_active": len(session_manager.sessions)
    }

@app.get("/api/v1/system/status", response_model=SystemStatusResponse)
async def get_system_status():
    """Get comprehensive system status"""
    try:
        chatbot_status = interview_chatbot.get_status()
        
        return SystemStatusResponse(
            chatbot_status=chatbot_status,
            session_count=len(session_manager.sessions),
            system_health="excellent" if chatbot_status['initialized'] else "degraded"
        )
    except Exception as e:
        logger.error(f"Error getting system status: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get system status: {str(e)}")

@app.post("/api/v1/interviews/start", response_model=InterviewStartResponse)
async def start_interview(request: InterviewStartRequest):
    """Start a new interview session"""
    try:
        session_id = str(uuid.uuid4())
        
        # Create session
        initial_data = {
            'candidate_name': request.candidate_name,
            'position_applied': request.position_applied,
            'resume_text': request.resume_text,
            'job_description': request.job_description,
            'start_time': time.time(),
            'stage': 'initial'
        }
        
        session_manager.create_session(session_id, initial_data)
        
        # Generate welcome message and first question
        welcome_message = f"Hello {request.candidate_name}! Welcome to your interview for the {request.position_applied} position. I'm Nishu, your AI interviewer. Let's begin!"
        first_question = "Hello! I'm Nishu, your AI interview assistant. Welcome to your interview today. Let's begin with a few questions about your background and experience."
        
        # Add first question to session
        session_manager.add_question(session_id, {
            'question': first_question,
            'timestamp': time.time(),
            'type': 'initial'
        })
        
        # Add conversation turn
        session_manager.add_conversation_turn(session_id, {
            'type': 'ai',
            'content': welcome_message,
            'timestamp': time.time()
        })
        
        session_manager.add_conversation_turn(session_id, {
            'type': 'ai',
            'content': first_question,
            'timestamp': time.time()
        })
        
        return InterviewStartResponse(
            session_id=session_id,
            welcome_message=welcome_message,
            first_question=first_question,
            system_status=interview_chatbot.get_status()
        )
        
    except Exception as e:
        logger.error(f"Error starting interview: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to start interview: {str(e)}")

@app.post("/api/v1/interviews/chat", response_model=ChatResponse)
async def chat_with_interviewer(request: ChatRequest):
    """Chat with the AI interviewer"""
    try:
        # Get session
        session = session_manager.get_session(request.session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Interview session not found")
        
        # Get chatbot response (dict)
        bot = interview_chatbot.get_response(request.message, request.session_id)
        bot_text = bot.get("response", "")
        
        # Add candidate message to conversation
        session_manager.add_conversation_turn(request.session_id, {
            'type': 'candidate',
            'content': request.message,
            'timestamp': time.time()
        })
        
        # Add chatbot response to conversation (if any)
        if bot_text:
            session_manager.add_conversation_turn(request.session_id, {
                'type': 'ai',
                'content': bot_text,
                'timestamp': time.time()
            })
        
        # Store basic analysis placeholder
        session_manager.add_response(request.session_id, {
            'message': request.message,
            'analysis': {'score': 0.8, 'feedback': 'Good response'},
            'timestamp': time.time()
        })
        
        # Simple next question placeholder
        next_question = "Thank you for your response. Let me ask you another question about your experience."
        session_manager.add_question(request.session_id, {
            'question': next_question,
            'timestamp': time.time(),
            'type': 'follow_up'
        })
        
        # Get session summary
        session_summary = session_manager.get_session_summary(request.session_id)
        
        return ChatResponse(
            response=bot_text,
            next_question=next_question,
            analysis={"score": 0.8, "feedback": "Good response"},
            session_summary=session_summary
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in chat: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to process chat: {str(e)}")

@app.get("/api/v1/interviews/{session_id}/summary")
async def get_interview_summary(session_id: str):
    """Get interview summary"""
    try:
        session = session_manager.get_session(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Interview session not found")
        
        # Calculate overall performance
        responses = session.get('responses_received', [])
        if responses:
            scores = [r.get('analysis', {}).get('score', 0) for r in responses]
            avg_score = sum(scores) / len(scores)
        else:
            avg_score = 0.0
        
        # Get conversation history
        conversation = session.get('conversation_history', [])
        
        return {
            "session_id": session_id,
            "candidate_name": session.get('data', {}).get('candidate_name', 'Unknown'),
            "position_applied": session.get('data', {}).get('position_applied', 'Unknown'),
            "total_questions": len(session.get('questions_asked', [])),
            "total_responses": len(responses),
            "average_score": round(avg_score * 100, 2),
            "conversation_turns": len(conversation),
            "interview_duration": time.time() - session.get('data', {}).get('start_time', time.time()),
            "recommendation": "hire" if avg_score > 0.7 else "consider" if avg_score > 0.5 else "not_hire",
            "conversation_history": conversation[-10:]  # Last 10 turns
        }
        
    except Exception as e:
        logger.error(f"Error getting interview summary: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get interview summary: {str(e)}")

@app.get("/api/v1/interviews/{session_id}/conversation")
async def get_conversation_history(session_id: str):
    """Get full conversation history"""
    try:
        session = session_manager.get_session(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Interview session not found")
        
        return {
            "session_id": session_id,
            "conversation_history": session.get('conversation_history', []),
            "questions_asked": session.get('questions_asked', []),
            "responses_received": session.get('responses_received', [])
        }
        
    except Exception as e:
        logger.error(f"Error getting conversation history: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get conversation history: {str(e)}")


@app.post("/api/v1/tts/speak")
async def speak_text(request: dict):
    """Convert text to speech"""
    try:
        text = request.get('text', '')
        if not text.strip():
            raise HTTPException(status_code=400, detail="Text is required")
        
        success = tts_module.speak(text)
        
        return {
            "success": success,
            "text": text,
            "tts_available": tts_module.is_available()
        }
        
    except Exception as e:
        logger.error(f"Error in TTS: {e}")
        raise HTTPException(status_code=500, detail=f"TTS error: {str(e)}")

@app.post("/api/v1/tts/stop")
async def stop_tts():
    try:
        tts_module.stop()
        return {"success": True}
    except Exception as e:
        logger.error(f"Error stopping TTS: {e}")
        raise HTTPException(status_code=500, detail=f"TTS stop error: {str(e)}")

@app.post("/api/v1/tts/voice/settings")
async def update_tts_settings(request: dict):
    try:
        rate = request.get('rate')
        volume = request.get('volume')
        if rate is not None:
            tts_module.set_voice_rate(int(rate))
        if volume is not None:
            tts_module.set_volume(float(volume))
        return {"success": True, "rate": rate, "volume": volume}
    except Exception as e:
        logger.error(f"Error updating TTS settings: {e}")
        raise HTTPException(status_code=500, detail=f"TTS settings error: {str(e)}")

@app.get("/api/v1/tts/status")
async def get_tts_status():
    """Get TTS status"""
    try:
        return {
            "tts_available": tts_module.is_available(),
            "engine_initialized": tts_module.initialized
        }
    except Exception as e:
        logger.error(f"Error getting TTS status: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get TTS status: {str(e)}")

@app.get("/api/v1/tts/voice/info")
async def get_voice_info():
    """Get current voice information"""
    try:
        if not tts_module.engine:
            return {"error": "TTS engine not available"}
        
        voices = tts_module.engine.getProperty('voices')
        current_voice = tts_module.engine.getProperty('voice')
        rate = tts_module.engine.getProperty('rate')
        volume = tts_module.engine.getProperty('volume')
        
        return {
            "current_voice": current_voice,
            "rate": rate,
            "volume": volume,
            "available_voices": [{"id": v.id, "name": v.name} for v in voices] if voices else []
        }
        
    except Exception as e:
        logger.error(f"Error getting voice info: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get voice info: {str(e)}")



@app.post("/api/v1/interviews/{session_id}/score")
async def score_interview_session(session_id: str):
    """Score an interview session"""
    try:
        session = session_manager.get_session(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Interview session not found")
        
        # Get conversation history
        conversation = session_manager.get_conversation(session_id)
        
        # Score the session
        score_data = voice_scorer.score_interview_session(conversation)
        
        return {
            "success": True,
            "session_id": session_id,
            "score_data": score_data
        }
        
    except Exception as e:
        logger.error(f"Error scoring interview session: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to score interview: {str(e)}")

@app.post("/api/v1/interviews/{session_id}/score/response")
async def score_response(session_id: str, request: dict):
    """Score a single response"""
    try:
        response_text = request.get('response_text', '')
        if not response_text:
            raise HTTPException(status_code=400, detail="Response text is required")
        
        # Score the response
        score_data = voice_scorer.score_response(response_text)
        
        return {
            "success": True,
            "session_id": session_id,
            "score_data": score_data
        }
        
    except Exception as e:
        logger.error(f"Error scoring response: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to score response: {str(e)}")


@app.post("/api/v1/system/cleanup")
async def cleanup_sessions():
    """Clean up expired sessions"""
    try:
        cleaned_count = session_manager.cleanup_expired_sessions()
        return {
            "message": f"Cleaned up {cleaned_count} expired sessions",
            "active_sessions": len(session_manager.sessions)
        }
    except Exception as e:
        logger.error(f"Error cleaning up sessions: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to cleanup sessions: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
