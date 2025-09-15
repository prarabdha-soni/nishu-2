#!/usr/bin/env python3
"""
Ultra-Clean Text-to-Speech Module for Nishu AI Interview System
"""
import logging
import os
import tempfile
from typing import Optional
import pyttsx3

logger = logging.getLogger(__name__)

class TTSModule:
    """Ultra-clean Text-to-Speech module with premium voice settings"""
    
    def __init__(self):
        self.engine = None
        self.initialized = False
        self._initialize_tts()
    
    def _initialize_tts(self):
        """Initialize the TTS engine with premium settings"""
        try:
            self.engine = pyttsx3.init()
            
            # Get available voices
            voices = self.engine.getProperty('voices')
            logger.info(f"Available voices: {[v.name for v in voices] if voices else 'None'}")
            
            # Select the cleanest, most professional voice
            if voices:
                # Prioritize high-quality, clear voices
                premium_voices = [
                    'Samantha', 'Alex', 'Victoria', 'Daniel', 'Fiona',
                    'Karen', 'Moira', 'Tessa', 'Veena', 'Zira',
                    'com.apple.voice.compact.en-US.Samantha',
                    'com.apple.voice.compact.en-US.Alex',
                    'com.apple.voice.compact.en-US.Victoria'
                ]
                
                selected_voice = None
                for preferred in premium_voices:
                    for voice in voices:
                        if preferred.lower() in voice.name.lower() or preferred.lower() in voice.id.lower():
                            selected_voice = voice
                            break
                    if selected_voice:
                        break
                
                # If no premium voice found, use the first US English voice
                if not selected_voice and voices:
                    for voice in voices:
                        if 'en-US' in voice.id or 'en_US' in voice.id:
                            selected_voice = voice
                            break
                
                # Fallback to first voice
                if not selected_voice and voices:
                    selected_voice = voices[0]
                
                if selected_voice:
                    self.engine.setProperty('voice', selected_voice.id)
                    logger.info(f"Selected premium voice: {selected_voice.name} ({selected_voice.id})")
            
            # Ultra-clean speech settings
            self.engine.setProperty('rate', 160)  # Slower for clarity
            self.engine.setProperty('volume', 0.95)  # High volume for clarity
            
            self.initialized = True
            logger.info("Ultra-clean TTS engine initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize TTS engine: {e}")
            self.engine = None
            self.initialized = False
    
    def speak(self, text: str) -> bool:
        """Convert text to speech with ultra-clean quality"""
        if not self.initialized or not self.engine:
            logger.warning("TTS engine not initialized")
            return False
        
        try:
            # Clean and optimize the text for speech
            clean_text = self._clean_text(text)
            
            if not clean_text.strip():
                return False
            
            logger.info(f"Speaking: {clean_text[:50]}...")
            
            # Speak with premium settings
            self.engine.say(clean_text)
            self.engine.runAndWait()
            
            return True
            
        except Exception as e:
            logger.error(f"Error in TTS: {e}")
            return False
    
    def _clean_text(self, text: str) -> str:
        """Ultra-clean text processing for optimal speech synthesis"""
        # Remove markdown and special characters
        text = text.replace('*', '').replace('_', '').replace('`', '')
        text = text.replace('**', '').replace('##', '').replace('#', '')
        text = text.replace('[', '').replace(']', '').replace('(', '').replace(')', '')
        
        # Replace technical terms with speech-friendly versions
        replacements = {
            'SWE': 'Software Engineer',
            'API': 'A P I',
            'SQL': 'S Q L',
            'HTML': 'H T M L',
            'CSS': 'C S S',
            'JS': 'JavaScript',
            'React': 'React',
            'Node.js': 'Node J S',
            'GitHub': 'Git Hub',
            'AWS': 'A W S',
            'Docker': 'Docker',
            'Kubernetes': 'Kubernetes',
            'JSON': 'J S O N',
            'XML': 'X M L',
            'HTTP': 'H T T P',
            'HTTPS': 'H T T P S',
            'URL': 'U R L',
            'UI': 'U I',
            'UX': 'U X',
            'AI': 'A I',
            'ML': 'Machine Learning',
            'DB': 'Database',
            'CRUD': 'C R U D',
            'REST': 'REST',
            'GraphQL': 'Graph Q L',
            'npm': 'N P M',
            'yarn': 'Yarn',
            'git': 'Git',
            'bash': 'Bash',
            'Linux': 'Linux',
            'Windows': 'Windows',
            'macOS': 'Mac O S'
        }
        
        for old, new in replacements.items():
            text = text.replace(old, new)
        
        # Clean up multiple spaces and ensure proper punctuation
        text = ' '.join(text.split())
        
        # Ensure proper sentence endings
        if text and not text.endswith(('.', '!', '?')):
            text += '.'
        
        return text
    
    def set_voice_rate(self, rate: int):
        """Set speech rate (words per minute)"""
        if self.engine and self.initialized:
            self.engine.setProperty('rate', rate)
    
    def set_volume(self, volume: float):
        """Set volume (0.0 to 1.0)"""
        if self.engine and self.initialized:
            self.engine.setProperty('volume', volume)
    
    def stop(self):
        """Stop current speech"""
        if self.engine and self.initialized:
            try:
                self.engine.stop()
            except Exception as e:
                logger.error(f"Error stopping TTS: {e}")
    
    def is_available(self) -> bool:
        """Check if TTS is available"""
        return self.initialized and self.engine is not None

# Global TTS instance
tts_module = TTSModule()
