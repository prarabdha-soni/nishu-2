import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sttService } from '../services/sttService';
import styled from 'styled-components';

const API_BASE = 'http://localhost:8000';
import { toast } from 'react-hot-toast';
import { 
  Phone,
  Settings,
  AlertTriangle,
  Bot,
  MessageCircle,
  Volume2,
  VolumeX,
  Square,
  Mic,
  MicOff,
  Video,
  VideoOff
} from 'lucide-react';

const InterviewContainer = styled.div`
  min-height: 100vh;
  background: #2d3748;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const MainVideoArea = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 2rem;
`;

const AIBotPlaceholder = styled.div`
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3182ce 0%, #2c5282 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  
  &::before {
    content: '';
    position: absolute;
    width: 80%;
    height: 80%;
    border-radius: 50%;
    background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
    opacity: 0.8;
  }
`;

const BotIcon = styled(Bot)`
  width: 120px;
  height: 120px;
  color: white;
  z-index: 1;
  position: relative;
`;

const UserVideoContainer = styled.div`
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  width: 200px;
  height: 150px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  border: 3px solid #4299e1;
`;

const UserVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const UserName = styled.div`
  position: absolute;
  bottom: -30px;
  left: 0;
  right: 0;
  text-align: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
`;

const VideoControls = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
`;

const ControlButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const BottomControlBar = styled.div`
  background: rgba(0, 0, 0, 0.8);
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
`;

const TimerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1rem;
  font-weight: 600;
`;

const ControlButtons = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const MainControlButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => {
    switch (props.type) {
      case 'settings':
        return 'background: rgba(255, 255, 255, 0.2); color: white;';
      case 'end':
        return 'background: #e53e3e; color: white;';
      case 'alert':
        return 'background: #f6ad55; color: white;';
      default:
        return 'background: rgba(255, 255, 255, 0.2); color: white;';
    }
  }}
  
  &:hover {
    transform: scale(1.1);
  }
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

const ChatContainer = styled.div`
  position: absolute;
  top: 2rem;
  left: 2rem;
  width: 350px;
  max-height: 400px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 12px;
  padding: 1rem;
  backdrop-filter: blur(10px);
`;

const ChatMessage = styled.div`
  margin-bottom: 1rem;
  padding: 0.75rem;
  border-radius: 8px;
  color: white;
  
  ${props => props.isAI ? `
    background: rgba(66, 153, 225, 0.3);
    border-left: 3px solid #4299e1;
  ` : `
    background: rgba(255, 255, 255, 0.1);
    border-left: 3px solid #68d391;
  `}
`;

const MessageText = styled.div`
  font-size: 0.875rem;
  line-height: 1.4;
`;

const MessageSender = styled.div`
  font-size: 0.75rem;
  opacity: 0.7;
  margin-bottom: 0.25rem;
  font-weight: 600;
`;


const TextInputContainer = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 2rem;
  width: 350px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 12px;
  padding: 1rem;
  backdrop-filter: blur(10px);
  display: flex;
  gap: 0.5rem;
`;

const TextInput = styled.input`
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0.75rem;
  color: white;
  font-size: 0.875rem;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  &:focus {
    outline: none;
    border-color: #4299e1;
  }
`;


const VoiceSettingsPanel = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(0, 0, 0, 0.9);
  border-radius: 12px;
  padding: 1rem;
  backdrop-filter: blur(10px);
  color: white;
  min-width: 250px;
  z-index: 1000;
`;

const SettingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const SettingLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
`;

const SettingSlider = styled.input`
  width: 100px;
  margin-left: 1rem;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.2rem;
`;


const SendButton = styled.button`
  background: #4299e1;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: #3182ce;
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;


const StartButton = styled.button`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 10px 25px rgba(66, 153, 225, 0.3);
  transition: all 0.3s;
  
  &:hover {
    transform: translate(-50%, -50%) scale(1.05);
    box-shadow: 0 15px 35px rgba(66, 153, 225, 0.4);
  }
`;

const CaptionOverlay = styled.div`
  position: absolute;
  bottom: 180px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0,0,0,0.6);
  color: #fff;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.9rem;
  max-width: 80%;
  pointer-events: none;
`;

const ProfessionalInterviewPage = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  
  const [interviewState, setInterviewState] = useState('ready'); // ready, active, completed
  const [sessionData, setSessionData] = useState(null);
  const pendingTranscriptsRef = useRef([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [userResponse, setUserResponse] = useState('');
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [voiceOnly, setVoiceOnly] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState({ rate: 180, volume: 0.9 });
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [liveCaption, setLiveCaption] = useState('');
  const [sttActive, setSttActive] = useState(false);
  
  const streamRef = useRef(null);
  const videoRef = useRef(null);
  const recordingIntervalRef = useRef(null);

  // STT bindings
  useEffect(() => {
    sttService.setCallbacks({
      onResult: ({ transcript, isFinal }) => {
        if (!isFinal) {
          setLiveCaption(transcript);
          setUserResponse(transcript);
          return;
        }
        setLiveCaption('');
        if (!sessionData?.session_id) {
          pendingTranscriptsRef.current.push(transcript);
        } else {
          handleUserResponse(transcript);
        }
        setUserResponse('');
      },
      onError: (e) => console.error('STT error', e)
    });
  }, []);

  // Auto-start interview when component mounts
  useEffect(() => {
    if (interviewState === 'ready') {
      startInterview();
    }
  }, []);

  const startInterview = async () => {
    try {
      setInterviewState('active');
      
      // Start video stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }

      // Start STT listening
      if (sttService.available) {
        sttService.start();
      } else {
        console.warn('Web Speech API not available');
        toast.error('Speech recognition not supported in this browser.');
      }
      
      // Start interview session
      const response = await fetch(API_BASE + '/api/v1/interviews/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interview_type: 'SWE Interview',
          candidate_name: 'Prarabdha Soni'
        })
      });
      
              if (response.ok) {
          const data = await response.json();
          setSessionData(data);

          // Flush any queued transcripts
          if (pendingTranscriptsRef.current.length) {
            const toSend = [...pendingTranscriptsRef.current];
            pendingTranscriptsRef.current = [];
            toSend.forEach(t => handleUserResponse(t, data.session_id));
          }
          
          // Start timer
          recordingIntervalRef.current = setInterval(() => {
            setRecordingDuration(prev => prev + 1);
          }, 1000);
        
        // AI bot starts asking first question
        setTimeout(() => {
          askFirstQuestion();
        }, 2000);
        
        toast.success('Interview started! AI bot will begin asking questions.');
      } else {
        throw new Error('Failed to start interview');
      }
    } catch (error) {
      console.error('Error starting interview:', error);
      toast.error('Failed to start interview. Please check your camera and microphone permissions.');
    }
  };

  const askFirstQuestion = async () => {
    try {
      const response = await fetch('/api/v1/interviews/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionData?.session_id || 'demo_session',
          message: 'Hello! I am Nishu, your AI interview assistant. Let\'s begin with your first question.'
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Add welcome message
        setChatMessages(prev => [...prev, {
          type: 'ai',
          content: data.response || 'Welcome to your interview! Let\'s start with a technical question.',
          sender: 'Nishu AI'
        }]);
        
        // Speak the welcome message
        if (data.response) {
          speakText(data.response);
        }
        
        if (data.next_question) {
          setCurrentQuestion({ id: 'first', text: data.next_question });
          setChatMessages(prev => [...prev, {
            type: 'ai',
            content: data.next_question,
            sender: 'Nishu AI'
          }]);
          
          // Speak the next question
          speakText(data.next_question);
        }
      }
    } catch (error) {
      console.error('Error getting first question:', error);
    }
  };

  const handleUserResponse = async (response, forcedSessionId = null) => {
    if (!response.trim()) return;
    
    try {
      // Add user message to chat
      setChatMessages(prev => [...prev, {
        type: 'user',
        content: response,
        sender: 'You'
      }]);
      
      // Send response to AI
      const apiResponse = await fetch(API_BASE + '/api/v1/interviews/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: forcedSessionId || sessionData?.session_id, 
          message: response
        })
      });
      
      if (apiResponse.ok) {
        const data = await apiResponse.json();
        
        // Add AI response to chat
        setChatMessages(prev => [...prev, {
          type: 'ai',
          content: data.response || 'Thank you for your answer.',
          sender: 'Nishu AI'
        }]);
        
        // Speak the AI response (only if not already speaking)
        if (data.response && !isSpeaking) {
          speakText(data.response);
        }
        
        if (data.next_question) {
          setCurrentQuestion({ id: 'follow-up', text: data.next_question });
          setChatMessages(prev => [...prev, {
            type: 'ai',
            content: data.next_question,
            sender: 'Nishu AI'
          }]);
        } else {
          // Interview completed
          setInterviewState('completed');
          clearInterval(recordingIntervalRef.current);
          navigate(`/results/${sessionData?.session_id || 'demo_session'}`);
        }
      }
    } catch (error) {
      console.error('Error sending response:', error);
      toast.error('Failed to send response. Please try again.');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };


  const speakText = async (text) => {
    if (!ttsEnabled || isSpeaking) return; // Prevent duplicate calls
    setIsSpeaking(true);

    // Mute mic while TTS plays to prevent feedback/echo
    const prevMuted = isMuted;
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(t => t.enabled = false);
    }
    setIsMuted(true);

    try {
      if (sttService.isListening) sttService.stop();
      await fetch(API_BASE + '/api/v1/tts/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
    } catch (error) {
      console.error('Error speaking text:', error);
      toast.error('Failed to speak AI response.');
    } finally {
      // Re-enable mic to previous state
      if (streamRef.current) {
        streamRef.current.getAudioTracks().forEach(t => t.enabled = !prevMuted);
      }
      setIsMuted(prevMuted);
      // Resume STT after TTS ends
      if (sttService.available) sttService.start();
      setIsSpeaking(false);
    }
  };

  const toggleTTS = () => {
    setTtsEnabled(!ttsEnabled);
    // Pause STT while TTS is enabled and speaking
    if (!ttsEnabled) {
      // Turning ON TTS
      if (sttService.isListening) sttService.stop();
    }
  };


  const updateVoiceSettings = async (newSettings) => {
    try {
      const response = await fetch(API_BASE + '/api/v1/tts/voice/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSettings)
      });
      
      if (response.ok) {
        setVoiceSettings(newSettings);
        console.log('Voice settings updated:', newSettings);
      }
    } catch (error) {
      console.error('Error updating voice settings:', error);
    }
  };

  const handleRateChange = (rate) => {
    const newSettings = { ...voiceSettings, rate: parseInt(rate) };
    updateVoiceSettings(newSettings);
  };

  const handleVolumeChange = (volume) => {
    const newSettings = { ...voiceSettings, volume: parseFloat(volume) };
    updateVoiceSettings(newSettings);
  };

  const stopTTS = async () => {
    try {
      await fetch(API_BASE + '/api/v1/tts/stop', { method: 'POST' });
      setIsSpeaking(false);
    } catch (error) {
      console.error('Error stopping TTS:', error);
    }
  };

  const endInterview = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      try { videoRef.current.srcObject = null; } catch (_) {}
    }
    if (sttService.isListening) sttService.stop();
    clearInterval(recordingIntervalRef.current);
    setInterviewState('completed');
    navigate('/dashboard');
  };

  const startSTT = () => {
    if (sttService.available && !sttService.isListening) {
      const ok = sttService.start();
      if (ok) setSttActive(true);
    }
  };
  const stopSTT = () => {
    if (sttService.isListening) {
      sttService.stop();
      setSttActive(false);
      setLiveCaption('');
    }
  };

  if (interviewState === 'ready') {
    return (
      <InterviewContainer>
        <MainVideoArea>
          <StartButton onClick={startInterview}>
            Start Interview with Nishu AI
          </StartButton>
        </MainVideoArea>
      </InterviewContainer>
    );
  }

  return (
    <InterviewContainer>
      <MainVideoArea>
        {/* AI Bot Visual */}
        <AIBotPlaceholder>
          <BotIcon />
        </AIBotPlaceholder>
        
        {/* User Video */}
        <UserVideoContainer>
          <UserVideo
            ref={videoRef}
            autoPlay
            muted={isMuted}
            playsInline
          />
          <UserName>Prarabdha Soni</UserName>
        </UserVideoContainer>
        
        {/* Video Controls */}
        <VideoControls>
          <ControlButton onClick={() => setIsMuted(!isMuted)}>
            {isMuted ? <MicOff /> : <Mic />}
          </ControlButton>
          <ControlButton onClick={() => (sttActive ? stopSTT() : startSTT())} title={sttActive ? 'Stop Listening' : 'Start Listening'}>
            {sttActive ? <MicOff /> : <Mic />}
          </ControlButton>
          <ControlButton onClick={() => setIsVideoOff(!isVideoOff)}>
            {isVideoOff ? <VideoOff /> : <Video />}
          </ControlButton>
          
          <ControlButton onClick={toggleTTS} title={ttsEnabled ? 'Disable TTS' : 'Enable TTS'}>
            {ttsEnabled ? <Volume2 /> : <VolumeX />}
          </ControlButton>
          {isSpeaking && (
            <ControlButton onClick={stopTTS} title="Stop Speaking">
              <Square />
            </ControlButton>
          )}

        </VideoControls>
        
        {liveCaption && (
          <CaptionOverlay>{liveCaption}</CaptionOverlay>
        )}

        {/* Voice Settings Panel */}
        {showVoiceSettings && (
          <VoiceSettingsPanel>
            <CloseButton onClick={() => setShowVoiceSettings(false)}>×</CloseButton>
            <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem' }}>Voice Settings</h4>
            
            <SettingRow>
              <SettingLabel>Speech Rate</SettingLabel>
              <SettingSlider
                type="range"
                min="120"
                max="250"
                value={voiceSettings.rate}
                onChange={(e) => handleRateChange(e.target.value)}
              />
              <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem' }}>{voiceSettings.rate}</span>
            </SettingRow>
            
            <SettingRow>
              <SettingLabel>Volume</SettingLabel>
              <SettingSlider
                type="range"
                min="0.1"
                max="1.0"
                step="0.1"
                value={voiceSettings.volume}
                onChange={(e) => handleVolumeChange(e.target.value)}
              />
              <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem' }}>{Math.round(voiceSettings.volume * 100)}%</span>
            </SettingRow>
          </VoiceSettingsPanel>
        )}

        {/* Chat Messages (hidden in voice-only mode) */}
        {!voiceOnly && (
          <>
            <ChatContainer>
              {chatMessages.map((message, index) => (
                <ChatMessage key={index} isAI={message.type === 'ai'}>
                  <MessageSender>{message.sender}</MessageSender>
                  <MessageText>{message.content}</MessageText>
                </ChatMessage>
              ))}
            </ChatContainer>
            
            {/* Text Input for Responses */}
            <TextInputContainer>
              <TextInput
                type="text"
                placeholder="Type your answer here..."
                value={userResponse}
                onChange={(e) => setUserResponse(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && userResponse.trim()) {
                    handleUserResponse(userResponse);
                    setUserResponse('');
                  }
                }}
              />
              <SendButton
                onClick={() => {
                  if (userResponse.trim()) {
                    handleUserResponse(userResponse);
                    setUserResponse('');
                  }
                }}
              >
                <MessageCircle />
              </SendButton>
            </TextInputContainer>
          </>
        )}

      </MainVideoArea>
      
      {/* Bottom Control Bar */}
      <BottomControlBar>
        <TimerInfo>
          {formatTime(recordingDuration)} / 27:00 | SWE Interview
        </TimerInfo>
        
        <ControlButtons>
          <MainControlButton type="settings">
            <Settings />
          </MainControlButton>
          <MainControlButton type="end" onClick={endInterview}>
            <Phone />
          </MainControlButton>
          <MainControlButton type="alert">
            <AlertTriangle />
          </MainControlButton>
        </ControlButtons>
      </BottomControlBar>
    </InterviewContainer>
  );
};

export default ProfessionalInterviewPage;
