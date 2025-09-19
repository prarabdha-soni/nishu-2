"""
Free Open-Source AI Backend using Ollama
Replaces expensive API calls with local models
"""

import asyncio
import json
import uuid
import os
import tempfile
import subprocess
from datetime import datetime
from typing import Optional, List, Dict, Any
from pathlib import Path

import redis
import whisper
import edge_tts
import asyncio
import requests
import uvicorn
from fastapi import FastAPI, HTTPException, UploadFile, File, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import ollama

# Initialize FastAPI app
app = FastAPI(title="Free AI Interview Platform", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://nishu-2.onrender.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize simple session manager (Redis replacement)
from simple_session import SimpleSessionManager

# Global model instances
whisper_model = None
ollama_models = {
    'fast': 'phi3:3.8b',      # 4GB RAM - Fast responses
    'balanced': 'llama3.1:8b', # 8GB RAM - Good quality
    'quality': 'mistral:7b',   # 7GB RAM - High quality
    'multilingual': 'qwen2.5:7b' # 7GB RAM - Multilingual
}

# Pydantic models
class InterviewStartRequest(BaseModel):
    interview_type: str = "technical"
    candidate_name: str = "Anonymous"

class ChatRequest(BaseModel):
    session_id: str
    message: str

class TTSRequest(BaseModel):
    text: str
    session_id: str
    voice: str = "en-US-AriaNeural"

class STTRequest(BaseModel):
    session_id: str
    language: str = "en"

# Initialize models
async def initialize_models():
    """Initialize AI models on startup"""
    global whisper_model
    
    try:
        print("Loading Whisper model...")
        whisper_model = whisper.load_model("base")
        print("✅ Whisper model loaded")
        
        # Test Ollama connection
        print("Testing Ollama connection...")
        models = ollama.list()
        print(f"✅ Ollama connected. Available models: {[m['name'] for m in models['models']]}")
        
        # Ensure we have at least one model
        if not any(m['name'].startswith('phi3') for m in models['models']):
            print("Downloading phi3:3.8b model...")
            ollama.pull('phi3:3.8b')
            
    except Exception as e:
        print(f"❌ Error initializing models: {e}")

@app.on_event("startup")
async def startup_event():
    await initialize_models()

# Session Management
class SessionManager:
    @staticmethod
    def create_session(interview_type: str, candidate_name: str) -> str:
        return SimpleSessionManager.create_session(interview_type, candidate_name)
    
    @staticmethod
    def get_session(session_id: str) -> Optional[Dict]:
        return SimpleSessionManager.get_session(session_id)
    
    @staticmethod
    def update_session(session_id: str, updates: Dict):
        SimpleSessionManager.update_session(session_id, updates)
    
    @staticmethod
    def add_message(session_id: str, role: str, content: str):
        SimpleSessionManager.add_message(session_id, role, content)

# AI Model Selection
class AIModelSelector:
    @staticmethod
    def select_model(message: str, session_data: Dict) -> str:
        """Select the best model based on context and requirements"""
        
        # Check message complexity
        complexity_score = len(message.split()) / 50  # Simple heuristic
        
        # Check if multilingual
        has_non_english = any(ord(char) > 127 for char in message)
        
        # Check conversation length
        message_count = len(session_data.get("messages", []))
        
        if has_non_english:
            return ollama_models['multilingual']
        elif complexity_score > 0.3 or message_count > 10:
            return ollama_models['quality']
        elif message_count < 3:
            return ollama_models['fast']
        else:
            return ollama_models['balanced']

# API Endpoints
@app.post("/api/v1/interviews/start")
async def start_interview(request: InterviewStartRequest):
    """Start a new interview session"""
    try:
        session_id = SessionManager.create_session(
            request.interview_type, 
            request.candidate_name
        )
        
        # Add welcome message
        welcome_message = f"Hello {request.candidate_name}! I'm your AI interviewer. Let's begin with your {request.interview_type} interview."
        SessionManager.add_message(session_id, "assistant", welcome_message)
        
        return {
            "session_id": session_id,
            "status": "started",
            "welcome_message": welcome_message
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/interviews/chat")
async def chat_with_ai(request: ChatRequest):
    """Chat with AI interviewer"""
    try:
        session_data = SessionManager.get_session(request.session_id)
        if not session_data:
            raise HTTPException(status_code=404, detail="Session not found")
        
        # Add user message
        SessionManager.add_message(request.session_id, "user", request.message)
        
        # Select appropriate model
        model_name = AIModelSelector.select_model(request.message, session_data)
        
        # Build conversation context
        messages = [
            {
                "role": "system",
                "content": f"""You are a professional {session_data['interview_type']} interviewer. 
                Your name is Nishu AI. Be helpful, professional, and ask relevant questions.
                Keep responses concise (2-3 sentences max). Ask follow-up questions when appropriate.
                If the interview seems complete, provide constructive feedback."""
            }
        ]
        
        # Add recent conversation history (last 6 messages)
        recent_messages = session_data["messages"][-6:]
        for msg in recent_messages:
            messages.append({
                "role": msg["role"],
                "content": msg["content"]
            })
        
        # Get AI response
        response = ollama.chat(
            model=model_name,
            messages=messages,
            options={
                "temperature": 0.7,
                "top_p": 0.9,
                "max_tokens": 200
            }
        )
        
        ai_response = response['message']['content']
        
        # Add AI response to session
        SessionManager.add_message(request.session_id, "assistant", ai_response)
        
        # Check if interview should end
        if any(keyword in ai_response.lower() for keyword in ['thank you', 'interview complete', 'that concludes']):
            SessionManager.update_session(request.session_id, {"status": "completed"})
        
        return {
            "response": ai_response,
            "model_used": model_name,
            "session_status": session_data.get("status", "active")
        }
        
    except Exception as e:
        print(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/stt/transcribe")
async def transcribe_audio(audio: UploadFile = File(...)):
    """Transcribe audio using Whisper"""
    try:
        if not whisper_model:
            raise HTTPException(status_code=500, detail="Whisper model not loaded")
        
        # Save uploaded audio to temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_file:
            content = await audio.read()
            temp_file.write(content)
            temp_file_path = temp_file.name
        
        # Transcribe using Whisper
        result = whisper_model.transcribe(temp_file_path)
        
        # Clean up temporary file
        os.unlink(temp_file_path)
        
        return {
            "transcript": result["text"],
            "language": result.get("language", "en"),
            "confidence": result.get("segments", [{}])[0].get("avg_logprob", 0) if result.get("segments") else 0
        }
        
    except Exception as e:
        print(f"STT error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/tts/speak")
async def text_to_speech(request: TTSRequest):
    """Convert text to speech using Edge-TTS"""
    try:
        # Generate unique filename
        audio_filename = f"tts_{request.session_id}_{uuid.uuid4().hex}.mp3"
        audio_path = f"/tmp/{audio_filename}"
        
        # Generate speech using Edge-TTS
        communicate = edge_tts.Communicate(request.text, request.voice)
        await communicate.save(audio_path)
        
        # Return audio file
        return FileResponse(
            audio_path,
            media_type="audio/mpeg",
            filename=audio_filename,
            background=lambda: os.unlink(audio_path)  # Clean up after sending
        )
        
    except Exception as e:
        print(f"TTS error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/interviews/{session_id}/summary")
async def get_interview_summary(session_id: str):
    """Get interview summary and analysis"""
    try:
        session_data = SessionManager.get_session(session_id)
        if not session_data:
            raise HTTPException(status_code=404, detail="Session not found")
        
        # Generate summary using AI
        messages = [
            {
                "role": "system",
                "content": "You are an interview analyst. Provide a concise summary and constructive feedback."
            },
            {
                "role": "user",
                "content": f"Analyze this {session_data['interview_type']} interview:\n\n" + 
                          "\n".join([f"{msg['role']}: {msg['content']}" for msg in session_data['messages']])
            }
        ]
        
        response = ollama.chat(
            model=ollama_models['quality'],
            messages=messages
        )
        
        summary = response['message']['content']
        
        return {
            "session_id": session_id,
            "candidate_name": session_data['candidate_name'],
            "interview_type": session_data['interview_type'],
            "duration": len(session_data['messages']),
            "summary": summary,
            "status": session_data.get('status', 'active')
        }
        
    except Exception as e:
        print(f"Summary error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Check Ollama connection (optional)
        try:
            models = ollama.list()
            ollama_status = "connected"
            model_list = [m['name'] for m in models['models']]
        except:
            ollama_status = "not available"
            model_list = []
        
        return {
            "status": "healthy",
            "ollama": ollama_status,
            "models": model_list,
            "whisper": "loaded" if whisper_model else "not loaded",
            "sessions_active": len(SimpleSessionManager.get_all_sessions()),
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }

# WebSocket for real-time communication
@app.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    await websocket.accept()
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            if message_data["type"] == "chat":
                # Process chat message
                chat_request = ChatRequest(
                    session_id=session_id,
                    message=message_data["message"]
                )
                
                # Get AI response
                response = await chat_with_ai(chat_request)
                
                # Send response back
                await websocket.send_text(json.dumps({
                    "type": "response",
                    "content": response["response"],
                    "model_used": response["model_used"]
                }))
                
    except WebSocketDisconnect:
        print(f"WebSocket disconnected for session {session_id}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
