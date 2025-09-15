import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { toast } from 'react-hot-toast';
import { 
  Mic, 
  MicOff, 
  Send, 
  Bot, 
  User, 
  Volume2, 
  VolumeX,
  Brain,
  TrendingUp
} from 'lucide-react';

const ChatContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-height: 500px;
  display: flex;
  flex-direction: column;
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
`;

const BotIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const ChatTitle = styled.h3`
  color: #2d3748;
  margin: 0;
  font-size: 1.2rem;
`;

const ChatStatus = styled.div`
  margin-left: auto;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  
  ${props => {
    switch (props.status) {
      case 'listening':
        return 'background: #fef3c7; color: #92400e;';
      case 'speaking':
        return 'background: #dbeafe; color: #1e40af;';
      case 'thinking':
        return 'background: #fef3c7; color: #92400e;';
      case 'learning':
        return 'background: #d1fae5; color: #065f46;';
      default:
        return 'background: #d1fae5; color: #065f46;';
    }
  }}
`;

const AIMetrics = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  font-size: 12px;
`;

const MetricItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #4a5568;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 20px;
  max-height: 300px;
  padding-right: 8px;
`;

const Message = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
  
  ${props => props.isUser && `
    flex-direction: row-reverse;
  `}
`;

const MessageIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  
  ${props => props.isUser ? `
    background: #4299e1;
  ` : `
    background: linear-gradient(135deg, #667eea, #764ba2);
  `}
`;

const MessageContent = styled.div`
  background: ${props => props.isUser ? '#4299e1' : '#f7fafc'};
  color: ${props => props.isUser ? 'white' : '#2d3748'};
  padding: 12px 16px;
  border-radius: 18px;
  max-width: 70%;
  word-wrap: break-word;
  line-height: 1.4;
  
  ${props => props.isUser ? `
    border-bottom-right-radius: 4px;
  ` : `
    border-bottom-left-radius: 4px;
  `}
`;

const MessageMeta = styled.div`
  font-size: 10px;
  color: #6b7280;
  margin-top: 4px;
  font-style: italic;
`;

const InputContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const TextInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  font-size: 16px;
  outline: none;
  
  &:focus {
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
  }
`;

const VoiceButton = styled.button`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => {
    if (props.isListening) {
      return `
        background: #ef4444;
        color: white;
        animation: pulse 1s infinite;
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `;
    } else if (props.isSpeaking) {
      return `
        background: #3b82f6;
        color: white;
      `;
    } else {
      return `
        background: #f3f4f6;
        color: #6b7280;
        
        &:hover {
          background: #e5e7eb;
        }
      `;
    }
  }}
`;

const SendButton = styled.button`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: #4299e1;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: #3182ce;
  }
  
  &:disabled {
    background: #a0aec0;
    cursor: not-allowed;
  }
`;

const ControlsContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 16px;
  justify-content: center;
`;

const ControlButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  background: white;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  
  &:hover {
    background: #f7fafc;
    border-color: #cbd5e0;
  }
  
  ${props => props.active && `
    background: #4299e1;
    color: white;
    border-color: #4299e1;
  `}
`;

const AIChatBot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI interviewer powered by real AI models. I can speak, listen, and learn from our conversation. Let's start!",
      isUser: false,
      timestamp: Date.now(),
      meta: "Real AI Model"
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isTextToSpeechEnabled, setIsTextToSpeechEnabled] = useState(true);
  const [aiMetrics, setAiMetrics] = useState({
    totalInterviews: 0,
    avgResponseQuality: 0,
    modelAccuracy: 0,
    feedbackDataCount: 0
  });
  
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        toast.success('Listening...');
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
        handleSendMessage(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast.error('Speech recognition error');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      toast.error('Speech recognition not supported in this browser');
      setIsVoiceEnabled(false);
    }

    // Initialize text-to-speech
    if ('speechSynthesis' in window) {
      synthesisRef.current = window.speechSynthesis;
    } else {
      toast.error('Text-to-speech not supported in this browser');
      setIsTextToSpeechEnabled(false);
    }

    // Load AI metrics
    loadAIMetrics();
    scrollToBottom();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadAIMetrics = async () => {
    try {
      const response = await fetch('/ai/performance');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAiMetrics({
            totalInterviews: data.metrics.total_interviews || 0,
            avgResponseQuality: Math.round((data.metrics.avg_response_quality || 0) * 100),
            modelAccuracy: Math.round((data.metrics.model_accuracy || 0) * 100),
            feedbackDataCount: data.metrics.feedback_data_count || 0
          });
        }
      }
    } catch (error) {
      console.error('Error loading AI metrics:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const speakText = (text) => {
    if (!isTextToSpeechEnabled || !synthesisRef.current) return;

    // Cancel any ongoing speech
    synthesisRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      setIsSpeaking(false);
    };

    synthesisRef.current.speak(utterance);
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const handleSendMessage = async (text = inputText) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: text.trim(),
      isUser: true,
      timestamp: Date.now(),
      meta: "You"
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsThinking(true);

    try {
      // Call real AI service
      const aiResponse = await generateRealAIResponse(text);
      
      const botMessage = {
        id: Date.now() + 1,
        text: aiResponse.text,
        isUser: false,
        timestamp: Date.now(),
        meta: aiResponse.model || "Real AI"
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Speak the AI response
      if (isTextToSpeechEnabled) {
        speakText(aiResponse.text);
      }
      
      // Update metrics
      loadAIMetrics();
      
    } catch (error) {
      console.error('Error generating AI response:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm sorry, I encountered an error. Please try again.",
        isUser: false,
        timestamp: Date.now(),
        meta: "Error"
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsThinking(false);
    }
  };

  const generateRealAIResponse = async (userInput) => {
    try {
      // Call the real AI service endpoint
      const response = await fetch('/api/v1/interviews/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionToken: 'chatbot_session',
          candidateProfile: {
            experience: '3-5 years',
            skills: ['JavaScript', 'React', 'Node.js'],
            role: 'Software Engineer'
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        return {
          text: data.question.content,
          model: data.aiAnalysis?.model_used || 'Real AI'
        };
      } else {
        throw new Error('Failed to get AI response');
      }
    } catch (error) {
      console.error('Error calling AI service:', error);
      // Fallback to intelligent responses
      return generateIntelligentResponse(userInput);
    }
  };

  const generateIntelligentResponse = (userInput) => {
    // More intelligent responses based on context
    const input = userInput.toLowerCase();
    
    if (input.includes('experience') || input.includes('worked')) {
      return {
        text: "That's great experience! Can you tell me about a specific project you're most proud of and what made it challenging?",
        model: "Intelligent Fallback"
      };
    } else if (input.includes('challenge') || input.includes('difficult')) {
      return {
        text: "I'd love to hear more about how you overcame that challenge. What was your strategy and what did you learn from it?",
        model: "Intelligent Fallback"
      };
    } else if (input.includes('team') || input.includes('collaborate')) {
      return {
        text: "Teamwork is crucial in software development. How do you handle conflicts or disagreements in a team setting?",
        model: "Intelligent Fallback"
      };
    } else if (input.includes('learn') || input.includes('study')) {
      return {
        text: "Continuous learning is important in tech. What's the most recent technology or skill you've learned, and how did you approach learning it?",
        model: "Intelligent Fallback"
      };
    } else if (input.includes('goal') || input.includes('future')) {
      return {
        text: "That's a great goal! How do you plan to achieve it in the next few years, and what steps are you taking now?",
        model: "Intelligent Fallback"
      };
    } else if (input.includes('ai') || input.includes('artificial intelligence')) {
      return {
        text: "Interesting! How do you see AI impacting software development, and have you worked with any AI tools or frameworks?",
        model: "Intelligent Fallback"
      };
    } else {
      const responses = [
        "That's interesting. Can you elaborate on that point?",
        "I see. How did you approach that situation?",
        "That sounds like a valuable experience. What were the key takeaways?",
        "Great! Can you walk me through your thought process on that?",
        "I understand. What would you do differently if you faced that again?",
        "That's impressive. How do you stay updated with new technologies?",
        "Interesting perspective. What motivates you in your work?",
        "I appreciate that insight. What are your career goals?",
        "That's a good example. How do you handle working under pressure?",
        "Excellent. How do you ensure code quality in your projects?"
      ];
      
      return {
        text: responses[Math.floor(Math.random() * responses.length)],
        model: "Intelligent Fallback"
      };
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleVoice = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const stopSpeaking = () => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <ChatContainer>
      <ChatHeader>
        <BotIcon>
          <Brain size={20} />
        </BotIcon>
        <ChatTitle>Real AI Interviewer</ChatTitle>
        <ChatStatus status={isListening ? 'listening' : isSpeaking ? 'speaking' : isThinking ? 'thinking' : 'ready'}>
          {isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : isThinking ? 'Thinking...' : 'Ready'}
        </ChatStatus>
      </ChatHeader>

      <AIMetrics>
        <MetricItem>
          <TrendingUp size={12} />
          <span>{aiMetrics.totalInterviews} interviews</span>
        </MetricItem>
        <MetricItem>
          <Brain size={12} />
          <span>{aiMetrics.avgResponseQuality}% quality</span>
        </MetricItem>
        <MetricItem>
          <span>Accuracy: {aiMetrics.modelAccuracy}%</span>
        </MetricItem>
        <MetricItem>
          <span>{aiMetrics.feedbackDataCount} feedback items</span>
        </MetricItem>
      </AIMetrics>

      <MessagesContainer>
        {messages.map((message) => (
          <Message key={message.id} isUser={message.isUser}>
            <MessageIcon isUser={message.isUser}>
              {message.isUser ? <User size={16} /> : <Bot size={16} />}
            </MessageIcon>
            <MessageContent isUser={message.isUser}>
              {message.text}
              <MessageMeta>{message.meta}</MessageMeta>
            </MessageContent>
          </Message>
        ))}
        {isThinking && (
          <Message>
            <MessageIcon>
              <Bot size={16} />
            </MessageIcon>
            <MessageContent>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  width: '12px', 
                  height: '12px', 
                  borderRadius: '50%', 
                  background: '#4299e1',
                  animation: 'pulse 1s infinite'
                }}></div>
                AI is thinking...
              </div>
            </MessageContent>
          </Message>
        )}
        <div ref={messagesEndRef} />
      </MessagesContainer>

      <InputContainer>
        <TextInput
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message or use voice..."
          disabled={isThinking}
        />
        
        <VoiceButton
          isListening={isListening}
          isSpeaking={isSpeaking}
          onClick={toggleVoice}
          disabled={!isVoiceEnabled || isThinking}
        >
          {isListening ? <MicOff size={20} /> : <Mic size={20} />}
        </VoiceButton>
        
        <SendButton
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim() || isThinking}
        >
          <Send size={20} />
        </SendButton>
      </InputContainer>

      <ControlsContainer>
        <ControlButton
          active={isVoiceEnabled}
          onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
        >
          <Mic size={16} />
          Voice Input
        </ControlButton>
        
        <ControlButton
          active={isTextToSpeechEnabled}
          onClick={() => setIsTextToSpeechEnabled(!isTextToSpeechEnabled)}
        >
          <Volume2 size={16} />
          AI Voice
        </ControlButton>
        
        {isSpeaking && (
          <ControlButton onClick={stopSpeaking}>
            <VolumeX size={16} />
            Stop Speaking
          </ControlButton>
        )}
      </ControlsContainer>
    </ChatContainer>
  );
};

export default AIChatBot;
