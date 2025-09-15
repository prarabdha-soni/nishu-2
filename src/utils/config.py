"""
Configuration management for AI Interview System
"""
import yaml
import os
from typing import Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)

class Config:
    """Configuration manager"""
    
    def __init__(self, config_path: str = "configs/config.yaml"):
        self.config_path = config_path
        self.config = self._load_config()
    
    def _load_config(self) -> Dict[str, Any]:
        """Load configuration from YAML file"""
        try:
            if os.path.exists(self.config_path):
                with open(self.config_path, 'r') as file:
                    return yaml.safe_load(file)
            else:
                logger.warning(f"Config file {self.config_path} not found, using defaults")
                return self._get_default_config()
        except Exception as e:
            logger.error(f"Error loading config: {e}")
            return self._get_default_config()
    
    def _get_default_config(self) -> Dict[str, Any]:
        """Get default configuration"""
        return {
            "models": {
                "llama": {
                    "model_name": "meta-llama/Llama-2-7b-chat-hf",
                    "fallback_model": "microsoft/DialoGPT-medium",
                    "max_length": 200,
                    "temperature": 0.7,
                    "device": "auto"
                },
                "chatterbox": {
                    "database_uri": "sqlite:///interview_bot.db",
                    "max_similarity_threshold": 0.90,
                    "default_response": "I understand. Could you tell me more about that?"
                },
                "nlp": {
                    "spacy_model": "en_core_web_sm",
                    "sentence_transformer": "all-MiniLM-L6-v2"
                }
            },
            "redis": {
                "host": "localhost",
                "port": 6379,
                "db": 0,
                "session_timeout": 3600
            },
            "api": {
                "host": "0.0.0.0",
                "port": 8000,
                "cors_origins": ["http://localhost:3000"],
                "max_file_size": 10485760
            },
            "tts": {
                "default_method": "pyttsx3",
                "rate": 150,
                "volume": 0.9,
                "language": "en"
            },
            "interview": {
                "max_questions": 15,
                "initial_questions": 3,
                "adaptive_questions": 2,
                "stages": [
                    "resume_analysis",
                    "initial_questions",
                    "adaptive_questions",
                    "deep_dive",
                    "closing"
                ]
            },
            "logging": {
                "level": "INFO",
                "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
                "file": "logs/ai_interview_system.log"
            }
        }
    
    def get(self, key: str, default: Any = None) -> Any:
        """Get configuration value by key"""
        keys = key.split('.')
        value = self.config
        
        try:
            for k in keys:
                value = value[k]
            return value
        except (KeyError, TypeError):
            return default
    
    def get_model_config(self, model_name: str) -> Dict[str, Any]:
        """Get model-specific configuration"""
        return self.get(f"models.{model_name}", {})
    
    def get_redis_config(self) -> Dict[str, Any]:
        """Get Redis configuration"""
        return self.get("redis", {})
    
    def get_api_config(self) -> Dict[str, Any]:
        """Get API configuration"""
        return self.get("api", {})
    
    def get_tts_config(self) -> Dict[str, Any]:
        """Get TTS configuration"""
        return self.get("tts", {})
    
    def get_interview_config(self) -> Dict[str, Any]:
        """Get interview configuration"""
        return self.get("interview", {})

# Global config instance
config = Config()
