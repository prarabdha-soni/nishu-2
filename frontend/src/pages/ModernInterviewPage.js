import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-hot-toast';
import { 
  Play, 
  Square, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff,
  Send,
  CheckCircle,
  MessageCircle,
  Bot,
  User
} from 'lucide-react';

const InterviewContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 2rem;
`;

const MainContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
  align-items: start;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const LeftPanel = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
`;

const RightPanel = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`;

const StatusBadge = styled.div`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  
  ${props => {
    switch (props.status) {
      case 'ready':
        return 'background: #dcfce7; color: #166534;';
      case 'recording':
        return 'background: #fef2f2; color: #dc2626;';
      case 'processing':
        return 'background: #fef3c7; color: #d97706;';
      case 'completed':
        return 'background: #dbeafe; color: #2563eb;';
      default:
        return 'background: #f3f4f6; color: #374151;';
    }
  }}
`;

const VideoContainer = styled.div`
  position: relative;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 2rem;
  aspect-ratio: 16/9;
`;

const VideoElement = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const VideoPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-size: 1.1rem;
`;

const RecordingIndicator = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #ef4444;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &::before {
    content: '';
    width: 8px;
    height: 8px;
    background: white;
    border-radius: 50%;
    animation: pulse 1s infinite;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const ControlsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ControlButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #3b82f6;
    background: #f8fafc;
  }
  
  ${props => props.active && `
    border-color: #3b82f6;
    background: #eff6ff;
    color: #3b82f6;
  `}
  
  ${props => props.recording && `
    border-color: #ef4444;
    background: #fef2f2;
    color: #ef4444;
  `}
`;

const ControlLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
`;

const QuestionCard = styled.div`
  background: #f8fafc;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border-left: 4px solid #3b82f6;
`;

const QuestionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const QuestionIcon = styled.div`
  width: 32px;
  height: 32px;
  background: #3b82f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const QuestionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
`;

const QuestionText = styled.p`
  color: #64748b;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
`;

const AnswerSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
`;

const AnswerLabel = styled.label`
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
`;

const AnswerTextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-family: inherit;
  font-size: 1rem;
  resize: vertical;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const PrimaryButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const SecondaryButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #3b82f6;
    color: #3b82f6;
  }
`;

const ChatSection = styled.div`
  margin-bottom: 2rem;
`;

const ChatTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ChatMessages = styled.div`
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  background: #f8fafc;
`;

const ChatMessage = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const MessageAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  
  ${props => props.type === 'ai' ? `
    background: #3b82f6;
  ` : `
    background: #10b981;
  `}
`;

const MessageContent = styled.div`
  flex: 1;
  background: white;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  line-height: 1.5;
  color: #374151;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const MetricCard = styled.div`
  background: #f8fafc;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
`;

const MetricValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #1e293b;
  margin-bottom: 0.25rem;
`;

const MetricLabel = styled.div`
  font-size: 0.875rem;
  color: #64748b;
`;

const NishuLogo = styled.div`
  position: fixed;
  top: 2rem;
  left: 2rem;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: bold;
  color: white;
  font-family: 'Arial', sans-serif;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  z-index: 1000;
`;

const RecordingStatus = styled.div`
  background: #f0f9ff;
  border: 1px solid #0ea5e9;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #0c4a6e;
`;

// Generate fallback questions
const generateFallbackQuestions = (jobTitle, requiredSkills, candidateSkills) => {
  const questions = [
    {
      id: 'q1',
      content: "Tell me about yourself and your background in software development.",
      type: 'behavioral',
      difficulty: 'easy',
      source: 'fallback'
    },
    {
      id: 'q2',
      content: "Describe a challenging project you've worked on recently. What technologies did you use and what problems did you solve?",
      type: 'project_based',
      difficulty: 'medium',
      source: 'fallback'
    },
    {
      id: 'q3',
      content: "How do you approach debugging complex technical issues? Give me an example of a difficult bug you've solved.",
      type: 'technical',
      difficulty: 'medium',
      source: 'fallback'
    }
  ];

  // Customize questions based on job title and skills
  if (jobTitle && jobTitle.toLowerCase().includes('senior')) {
    questions.push({
      id: 'q4',
      content: "How would you design a scalable web application that needs to handle millions of users?",
      type: 'system_design',
      difficulty: 'hard',
      source: 'fallback'
    });
  }

  if (requiredSkills && requiredSkills.some(skill => skill.toLowerCase().includes('python'))) {
    questions[2] = {
      id: 'q3',
      content: "How would you optimize a Python application that's running slowly? Walk me through your debugging process.",
      type: 'technical',
      difficulty: 'medium',
      source: 'fallback'
    };
  }

  return questions;
};

const ModernInterviewPage = () => {
  const { sessionToken } = useParams();
  const navigate = useNavigate();
  
  const [interviewState, setInterviewState] = useState('ready');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [sessionData, setSessionData] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [metrics, setMetrics] = useState({
    questionsAnswered: 0,
    recordings: 0
  });
  const [recordingBlob, setRecordingBlob] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordingIntervalRef = useRef(null);

  const initializeInterview = async () => {
    try {
      setInterviewState('processing');
      
      // Start camera and microphone
      await startMediaCapture();
      
      // Get first question
      const response = await fetch('/api/v1/interviews/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resume_text: "Demo candidate resume",
          job_description: "Software Engineer position",
          candidate_name: "Demo Candidate",
          position_applied: "Software Engineer"
        })
      };

      if (response.ok) {
        const data = await response.json();
        setSessionData(data);
        
        // Use questions from API or generate fallback questions
        let interviewQuestions = data.initial_questions || [];
        if (interviewQuestions.length === 0) {
          interviewQuestions = generateFallbackQuestions(
            data.job_analysis?.title || 'Software Engineer',
            data.job_analysis?.required_skills || [],
            data.resume_analysis?.skills_extracted ? Object.keys(data.resume_analysis.skills_extracted) : []
          );
        }
        
        setQuestions(interviewQuestions);
        setCurrentQuestion(interviewQuestions[0]);
        setInterviewState('ready');
        toast.success('Interview started successfully!');
      } else {
        // Use mock data
        const mockQuestions = generateFallbackQuestions('Software Engineer', [], []);
        setQuestions(mockQuestions);
        setCurrentQuestion(mockQuestions[0]);
        setInterviewState('ready');
        toast.success('Interview started (demo mode)');
      }
    } catch (error) {
      console.error('Error initializing interview:', error);
      const mockQuestions = generateFallbackQuestions('Software Engineer', [], []);
      setQuestions(mockQuestions);
      setCurrentQuestion(mockQuestions[0]);
      setInterviewState('ready');
      toast.success('Interview started (demo mode)');
    }
  };

  useEffect(() => {
    initializeInterview();
    
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, []);

  const startMediaCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      };
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      toast.success('Camera and microphone ready');
    } catch (error) {
      console.error('Error accessing media:', error);
      toast.error('Could not access camera/microphone');
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  const startRecording = async () => {
    if (!streamRef.current) {
      toast.error('No media stream available');
      return;
    }

    // Check if stream has audio tracks
    const audioTracks = streamRef.current.getAudioTracks();
    if (audioTracks.length === 0) {
      toast.error('No audio track available. Please check microphone permissions.');
      return;
    }

    try {
      // Check if MediaRecorder is supported
      if (!window.MediaRecorder) {
        toast.error('MediaRecorder not supported in this browser');
        return;
      }

      // Get supported MIME types
      const options = { mimeType: 'audio/webm' };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = 'audio/mp4';
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          options.mimeType = 'audio/wav';
        }
      }

      const mediaRecorder = new MediaRecorder(streamRef.current, options);
      mediaRecorderRef.current = mediaRecorder;
      const chunks = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: options.mimeType });
        setRecordingBlob(blob);
        setMetrics(prev => ({ ...prev, recordings: prev.recordings + 1 }));
        toast.success(`Recording saved! Duration: ${recordingDuration}s`);
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event.error);
        toast.error('Recording error occurred');
        setIsRecording(false);
      };

      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      setRecordingDuration(0);
      
      // Start duration counter
      recordingIntervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
      toast.success('Recording started');
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to start recording: ' + error.message);
    }
  };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = 'audio/mp4';
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          options.mimeType = 'audio/wav';
        }
      }

      const mediaRecorder = new MediaRecorder(streamRef.current, options);
      mediaRecorderRef.current = mediaRecorder;
      const chunks = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: options.mimeType });
        setRecordingBlob(blob);
        setMetrics(prev => ({ ...prev, recordings: prev.recordings + 1 }));
        toast.success(`Recording saved! Duration: ${recordingDuration}s`);
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event.error);
        toast.error('Recording error occurred');
        setIsRecording(false);
      };

      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      setRecordingDuration(0);
      
      // Start duration counter
      recordingIntervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
      toast.success('Recording started');
      
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to start recording: ' + error.message);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      
      toast.success('Recording stopped');
    }
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioOn(audioTrack.enabled);
      }
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) {
      toast.error('Please provide an answer');
      return;
    }

    try {
      setInterviewState('processing');
      
      // Add user message to chat
      setChatMessages(prev => [...prev, {
        type: 'user',
        content: answer
      }]);
      
      const response = await fetch('/api/v1/interviews/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionData?.session_id || sessionToken || 'demo_session',
          message: answer,
          
        })
      };

      if (response.ok) {
        const data = await response.json();
        
        // Add AI response to chat
        setChatMessages(prev => [...prev, {
          type: 'ai',
          content: data.analysis?.strengths?.[0] || 'Thank you for your answer. Let me ask the next question.'
        }]);
        
        if (data.next_question && data.next_question.length > 0) {
          setCurrentQuestion(data.next_question[0]);
          setAnswer('');
          setRecordingBlob(null);
          setMetrics(prev => ({
            ...prev,
            questionsAnswered: prev.questionsAnswered + 1
          }));
          toast.success('Answer submitted! Next question loaded.');
        } else if (data.completed) {
          setInterviewState('completed');
          toast.success('Interview completed! Redirecting to results...');
          setTimeout(() => {
            navigate(`/results/${sessionData?.session_id || 'demo'}`);
          }, 2000);
        }
      } else {
        // Move to next question in our local questions array
        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex < questions.length) {
          setChatMessages(prev => [...prev, {
            type: 'ai',
            content: 'Thank you for your answer. Let me ask the next question.'
          }]);
          
          setCurrentQuestionIndex(nextIndex);
          setCurrentQuestion(questions[nextIndex]);
          setAnswer('');
          setRecordingBlob(null);
          setMetrics(prev => ({
            ...prev,
            questionsAnswered: prev.questionsAnswered + 1
          }));
          toast.success('Answer submitted! Next question loaded.');
        } else {
          // Interview completed
          setInterviewState('completed');
          toast.success('Interview completed! Redirecting to results...');
          setTimeout(() => {
            navigate(`/results/${sessionData?.session_id || 'demo'}`);
          }, 2000);
        }
      }
      
      setInterviewState('ready');
    } catch (error) {
      console.error('Error submitting answer:', error);
      toast.error('Failed to submit answer');
      setInterviewState('ready');
    }
  };

  const endInterview = () => {
    if (isRecording) {
      stopRecording();
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setInterviewState('completed');
    toast.success('Interview ended');
    setTimeout(() => {
      navigate(`/results/${sessionData?.session_id || 'demo'}`);
    }, 1000);
  };

  return (
    <InterviewContainer>
      <NishuLogo>N</NishuLogo>
      
      <MainContent>
        <LeftPanel>
          <Header>
            <Title>AI Interview</Title>
            <StatusBadge status={interviewState}>
              {interviewState.toUpperCase()}
            </StatusBadge>
          </Header>
          
          <VideoContainer>
            {isVideoOn ? (
              <VideoElement 
                ref={videoRef} 
                autoPlay 
                muted 
                playsInline
              />
            ) : (
              <VideoPlaceholder>
                Camera is disabled
              </VideoPlaceholder>
            )}
            {isRecording && (
              <RecordingIndicator>
                REC {recordingDuration}s
              </RecordingIndicator>
            )}
          </VideoContainer>
          
          <ControlsGrid>
            <ControlButton 
              onClick={toggleRecording}
              recording={isRecording}
            >
              {isRecording ? <Square size={20} /> : <Play size={20} />}
              <ControlLabel>
                {isRecording ? 'Stop' : 'Record'}
              </ControlLabel>
            </ControlButton>
            
            <ControlButton 
              onClick={toggleVideo}
              active={isVideoOn}
            >
              {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
              <ControlLabel>
                {isVideoOn ? 'Video On' : 'Video Off'}
              </ControlLabel>
            </ControlButton>
            
            <ControlButton 
              onClick={toggleAudio}
              active={isAudioOn}
            >
              {isAudioOn ? <Mic size={20} /> : <MicOff size={20} />}
              <ControlLabel>
                {isAudioOn ? 'Audio On' : 'Audio Off'}
              </ControlLabel>
            </ControlButton>
          </ControlsGrid>
          
          {recordingBlob && (
            <RecordingStatus>
              <strong>Recording Ready!</strong><br />
              Size: {(recordingBlob.size / 1024).toFixed(1)} KB<br />
              Duration: {recordingDuration}s<br />
              Type: {recordingBlob.type}
            </RecordingStatus>
          )}
          
          {currentQuestion && (
            <QuestionCard>
              <QuestionHeader>
                <QuestionIcon>
                  <Bot size={16} />
                </QuestionIcon>
                <QuestionTitle>Question {currentQuestionIndex + 1} of {questions.length}</QuestionTitle>
              </QuestionHeader>
              <QuestionText>{currentQuestion.content}</QuestionText>
            </QuestionCard>
          )}
          
          <AnswerSection>
            <AnswerLabel>Your Answer</AnswerLabel>
            <AnswerTextArea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here..."
              disabled={interviewState === 'processing'}
            />
            
            <ActionButtons>
              <PrimaryButton 
                onClick={submitAnswer}
                disabled={interviewState === 'processing' || !answer.trim()}
              >
                <Send size={16} />
                Submit Answer
              </PrimaryButton>
              
              <SecondaryButton onClick={endInterview}>
                <CheckCircle size={16} />
                End Interview
              </SecondaryButton>
            </ActionButtons>
          </AnswerSection>
        </LeftPanel>
        
        <RightPanel>
          <ChatSection>
            <ChatTitle>
              <MessageCircle size={20} />
              AI Chat
            </ChatTitle>
            <ChatMessages>
              {chatMessages.length === 0 ? (
                <div style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>
                  Start the interview to begin chatting with AI
                </div>
              ) : (
                chatMessages.map((message, index) => (
                  <ChatMessage key={index}>
                    <MessageAvatar type={message.type}>
                      {message.type === 'ai' ? <Bot size={16} /> : <User size={16} />}
                    </MessageAvatar>
                    <MessageContent>{message.content}</MessageContent>
                  </ChatMessage>
                ))
              )}
            </ChatMessages>
          </ChatSection>
          
          <MetricsGrid>
            <MetricCard>
              <MetricValue>{metrics.questionsAnswered}</MetricValue>
              <MetricLabel>Questions</MetricLabel>
            </MetricCard>
            <MetricCard>
              <MetricValue>{metrics.recordings}</MetricValue>
              <MetricLabel>Recordings</MetricLabel>
            </MetricCard>
          </MetricsGrid>
        </RightPanel>
      </MainContent>
    </InterviewContainer>
  );
};

export default ModernInterviewPage;
