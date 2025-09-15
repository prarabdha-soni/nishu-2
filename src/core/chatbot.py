#!/usr/bin/env python3
"""
Enhanced Chatterbox-based AI Interview System
"""
import logging
from chatterbot import ChatBot
from chatterbot.trainers import ChatterBotCorpusTrainer
from typing import Dict, List, Any, Optional
import json
import time
import random
from src.speech_interface.tts_module import tts_module

logger = logging.getLogger(__name__)

class InterviewChatbot:
    """Enhanced Chatterbox-based interview chatbot with interview-specific responses"""
    
    def __init__(self, name: str = "InterviewBot"):
        self.name = name
        self.chatbot = None
        self.trained = False
        self._initialize_chatbot()
    
    def _initialize_chatbot(self):
        """Initialize Chatterbox chatbot with interview-specific training"""
        try:
            self.chatbot = ChatBot(
                self.name,
                storage_adapter='chatterbot.storage.SQLStorageAdapter',
                database_uri='sqlite:///interview_bot.db',
                logic_adapters=[
                    'chatterbot.logic.BestMatch',
                    'chatterbot.logic.MathematicalEvaluation',
                    'chatterbot.logic.TimeLogicAdapter'
                ],
                preprocessors=[
                    'chatterbot.preprocessors.clean_whitespace'
                ]
            )
            
            # Train the chatbot with interview-specific data
            self._train_chatbot()
            logger.info("Enhanced Chatterbox chatbot initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize Chatterbox: {e}")
            self.chatbot = None
    
    def _train_chatbot(self):
        """Train the chatbot with interview-specific data"""
        if not self.chatbot:
            return
        
        try:
            # Interview-specific training data - only professional responses
            interview_data = [
                # Greetings and introductions
                ("hello", "Hello! I'm Nishu, your AI interview assistant. Welcome to your interview today. Let's begin with a few questions about your background and experience."),
                ("hi", "Hi there! I'm Nishu, your AI interview assistant. I'm excited to learn more about you today. Shall we start with your professional background?"),
                ("good morning", "Good morning! I'm Nishu, your AI interview assistant. Thank you for joining us today. Let's start with some questions about your experience."),
                ("good afternoon", "Good afternoon! I'm Nishu, your AI interview assistant. Welcome to your interview. Let's begin with your professional background."),
                
                # Technical questions
                ("what is your experience", "That's great! Can you tell me more about your technical experience? What programming languages and technologies have you worked with?"),
                ("programming languages", "Excellent! Can you describe a challenging project you've worked on using these technologies? What was your role and what did you learn?"),
                ("project experience", "That sounds interesting! Can you walk me through the technical challenges you faced and how you solved them?"),
                ("challenges", "Great problem-solving approach! How do you stay updated with the latest technologies and best practices in software development?"),
                
                # Technical skills
                ("java", "Java is a powerful language! Can you explain the difference between Java and JavaScript? What are the key advantages of using Java?"),
                ("javascript", "JavaScript is versatile! Can you tell me about your experience with modern JavaScript frameworks like React or Node.js?"),
                ("python", "Python is great for many applications! What Python frameworks or libraries have you used? Can you describe a project where Python was the best choice?"),
                ("react", "React is popular for frontend development! Can you explain the key concepts of React like components, state, and props?"),
                ("node.js", "Node.js is excellent for backend development! Can you describe the differences between Node.js and traditional server-side technologies?"),
                ("database", "Database knowledge is essential! Can you explain the differences between SQL and NoSQL databases? When would you use each?"),
                ("sql", "SQL is fundamental! Can you write a query to find the second highest salary from an employee table?"),
                ("aws", "AWS is widely used! Can you describe your experience with AWS services? Which services have you used and for what purposes?"),
                ("docker", "Docker is great for containerization! Can you explain the benefits of using Docker in software development and deployment?"),
                
                # General responses
                ("yes", "That's good to hear! Can you elaborate on that? I'd like to understand more about your experience in this area."),
                ("no", "That's perfectly fine! Let me ask you about a different aspect of your experience. What other technologies or skills have you worked with?"),
                ("i don't know", "No problem! Let's move on to something else. What are your strongest technical skills that you're most confident about?"),
                ("maybe", "That's okay! Can you tell me what you do know about this topic? Even partial knowledge is valuable."),
                
                # Closing
                ("thank you", "You're welcome! That concludes our interview. Thank you for your time and thoughtful answers. We'll be in touch soon!"),
                ("goodbye", "Thank you for the interview! It was great learning about your experience. Have a wonderful day!"),
            ]
            
            # Train with interview data using a simple approach
            for question, answer in interview_data:
                try:
                    # Use the chatbot's internal training method
                    self.chatbot.storage.create(
                        text=question,
                        in_response_to=answer
                    )
                except Exception as train_error:
                    logger.warning(f"Training error for '{question}': {train_error}")
            
            self.trained = True
            logger.info("Chatbot trained with professional interview data")
            
        except Exception as e:
            logger.error(f"Chatbot training failed: {e}")
            self.trained = False
    
    def get_response(self, message: str, session_id: str = None) -> Dict[str, Any]:
        """Get enhanced response from chatbot with TTS"""
        if not self.chatbot:
            return {
                "response": "I'm sorry, I'm not ready yet. Please try again in a moment.",
                "confidence": 0.0,
                "session_id": session_id
            }
        
        try:
            # Get response from Chatterbox
            response = self.chatbot.get_response(message)
            response_text = str(response)
            
            # Enhance the response to be more interview-appropriate
            enhanced_response = self._enhance_response(response_text, message)
            
            # Only speak if TTS is available and response is not empty
            if tts_module.is_available() and enhanced_response.strip():
                try:
                    tts_module.speak(enhanced_response)
                    logger.info(f"TTS: Spoke response for session {session_id}")
                except Exception as tts_error:
                    logger.error(f"TTS Error: {tts_error}")
            else:
                logger.warning("TTS not available or empty response, response not spoken")
            
            return {
                "response": enhanced_response,
                "confidence": getattr(response, 'confidence', 0.8),
                "session_id": session_id,
                "tts_enabled": tts_module.is_available()
            }
            
        except Exception as e:
            logger.error(f"Error getting response: {e}")
            return {
                "response": "I apologize, but I encountered an error. Could you please repeat your question?",
                "confidence": 0.0,
                "session_id": session_id,
                "tts_enabled": False
            }
        
        try:
            # Get response from Chatterbox
            response = self.chatbot.get_response(message)
            response_text = str(response)
            
            # Enhance the response to be more interview-appropriate
            enhanced_response = self._enhance_response(response_text, message)
            
            # Speak the response using TTS
            if tts_module.is_available():
                tts_module.speak(enhanced_response)
                logger.info(f"TTS: Spoke response for session {session_id}")
            else:
                logger.warning("TTS not available, response not spoken")
            
            return {
                "response": enhanced_response,
                "confidence": getattr(response, 'confidence', 0.8),
                "session_id": session_id,
                "tts_enabled": tts_module.is_available()
            }
            
        except Exception as e:
            logger.error(f"Error getting response: {e}")
            return {
                "response": "I apologize, but I encountered an error. Could you please repeat your question?",
                "confidence": 0.0,
                "session_id": session_id,
                "tts_enabled": False
            }
    

    def get_status(self) -> Dict[str, Any]:
        """Get chatbot status"""
        return {
            "initialized": self.chatbot is not None,
            "trained": self.trained,
            "name": self.name,
            "tts_available": tts_module.is_available()
        }

    def _enhance_response(self, response: str, original_message: str) -> str:
        """Enhance responses to be more interview-appropriate"""
        # Filter out inappropriate responses
        inappropriate_responses = [
            "joke", "funny", "cheetah", "hamburger", "sad", "feel", "move", "honor", "reputation", 
            "challenged", "discredited", "emotions", "arrogant", "stupid", "thinking", "feeling",
            "robot", "sentient", "sapient", "machine", "electronic device", "calculations"
        ]
        
        if any(word in response.lower() for word in inappropriate_responses):
            return self._get_contextual_response(original_message)
        
        # If response is too short or generic, provide a better interview response
        if len(response) < 20 or response in ["Hi", "Hello", "Yes", "No", "OK"]:
            return self._get_contextual_response(original_message)
        
        return response
    
    def _get_contextual_response(self, message: str) -> str:
        """Get contextual interview response based on message content"""
        message_lower = message.lower()
        
        # Technical skills
        if any(tech in message_lower for tech in ["java", "javascript", "python", "react", "node", "sql", "database"]):
            return "That's great! Can you tell me more about your experience with this technology? What projects have you worked on using it?"
        
        # Experience questions
        if any(word in message_lower for word in ["experience", "worked", "project", "developed", "built"]):
            return "Excellent! Can you walk me through a specific project you're proud of? What challenges did you face and how did you solve them?"
        
        # Team/leadership
        if any(word in message_lower for word in ["team", "lead", "manage", "collaborate"]):
            return "That's important! Can you give me an example of a time when you had to work with a team to solve a complex problem?"
        
        # Problem solving
        if any(word in message_lower for word in ["problem", "challenge", "difficult", "bug", "issue"]):
            return "Problem-solving is crucial! Can you describe your approach to debugging and troubleshooting technical issues?"
        
        # General responses
        if message_lower in ["yes", "yeah", "yep"]:
            return "That's good to hear! Can you elaborate on that? I'd like to understand more about your experience."
        
        if message_lower in ["no", "nope", "not really"]:
            return "That's perfectly fine! Let me ask you about a different aspect of your experience. What are your strongest technical skills?"
        
        # Default interview response
        return "That's interesting! Can you tell me more about that? I'd like to understand your experience better."

# Global chatbot instance
interview_chatbot = InterviewChatbot()
