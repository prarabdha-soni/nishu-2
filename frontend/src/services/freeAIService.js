/**
 * Free AI Service - Replaces expensive API calls with local models
 * Zero-cost alternative to OpenAI, ElevenLabs, etc.
 */

class FreeAIService {
  constructor() {
    this.apiBase = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    this.sessionId = null;
    this.isConnected = false;
  }

  // Health Check
  async checkHealth() {
    try {
      const response = await fetch(`${this.apiBase}/api/v1/health`);
      const data = await response.json();
      this.isConnected = data.status === 'healthy';
      return data;
    } catch (error) {
      console.error('Health check failed:', error);
      this.isConnected = false;
      return { status: 'unhealthy', error: error.message };
    }
  }

  // Start Interview Session
  async startInterview(interviewType = 'technical', candidateName = 'Anonymous') {
    try {
      const response = await fetch(`${this.apiBase}/api/v1/interviews/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interview_type: interviewType,
          candidate_name: candidateName
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      this.sessionId = data.session_id;
      return data;
    } catch (error) {
      console.error('Failed to start interview:', error);
      throw error;
    }
  }

  // Chat with AI
  async chatWithAI(message) {
    if (!this.sessionId) {
      throw new Error('No active session. Start interview first.');
    }

    try {
      const response = await fetch(`${this.apiBase}/api/v1/interviews/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: this.sessionId,
          message: message
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Chat failed:', error);
      throw error;
    }
  }

  // Speech-to-Text using Whisper
  async transcribeAudio(audioBlob) {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'audio.wav');

      const response = await fetch(`${this.apiBase}/api/v1/stt/transcribe`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`STT error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('STT failed:', error);
      throw error;
    }
  }

  // Text-to-Speech using Edge-TTS
  async speakText(text, voice = 'en-US-AriaNeural') {
    try {
      const response = await fetch(`${this.apiBase}/api/v1/tts/speak`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          session_id: this.sessionId,
          voice: voice
        })
      });

      if (!response.ok) {
        throw new Error(`TTS error! status: ${response.status}`);
      }

      // Convert response to audio blob
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Play audio
      const audio = new Audio(audioUrl);
      audio.onended = () => URL.revokeObjectURL(audioUrl);
      
      return new Promise((resolve, reject) => {
        audio.onload = () => resolve(audio);
        audio.onerror = reject;
        audio.play();
      });
    } catch (error) {
      console.error('TTS failed:', error);
      throw error;
    }
  }

  // Get Interview Summary
  async getInterviewSummary() {
    if (!this.sessionId) {
      throw new Error('No active session');
    }

    try {
      const response = await fetch(`${this.apiBase}/api/v1/interviews/${this.sessionId}/summary`);
      
      if (!response.ok) {
        throw new Error(`Summary error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Summary failed:', error);
      throw error;
    }
  }

  // WebSocket Connection for Real-time Chat
  connectWebSocket(onMessage, onError) {
    if (!this.sessionId) {
      throw new Error('No active session');
    }

    const ws = new WebSocket(`ws://localhost:8000/ws/${this.sessionId}`);
    
    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      onError(error);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return ws;
  }

  // Send message via WebSocket
  sendWebSocketMessage(ws, message) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'chat',
        message: message
      }));
    }
  }

  // Close WebSocket
  closeWebSocket(ws) {
    if (ws) {
      ws.close();
    }
  }
}

// Export singleton instance
export const freeAIService = new FreeAIService();
export default freeAIService;
