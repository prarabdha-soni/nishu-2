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
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #64748b;
  font-size: 1.1rem;
`;

const QuestionCard = styled.div`
  background: #f8fafc;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border-left: 4px solid #3b82f6;
`;

const QuestionText = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1rem;
`;

const AnswerInput = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const Button = styled.button`
  background: ${props => props.variant === 'primary' ? '#3b82f6' : '#64748b'};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: ${props => props.variant === 'primary' ? '#2563eb' : '#475569'};
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const VideoContainer = styled.div`
  position: relative;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1rem;
`;

const VideoElement = styled.video`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const Controls = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
`;

const Metrics = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const MetricCard = styled.div`
  background: #f1f5f9;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
`;

const MetricValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
`;

const MetricLabel = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  margin-top: 0.25rem;
`;

const ChatContainer = styled.div`
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const ChatMessage = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 1rem;
  
  &.user {
    flex-direction: row-reverse;
  }
`;

const MessageContent = styled.div`
  background: ${props => props.type === 'user' ? '#3b82f6' : '#f1f5f9'};
  color: ${props => props.type === 'user' ? 'white' : '#1e293b'};
  padding: 0.75rem 1rem;
  border-radius: 12px;
  max-width: 80%;
  font-size: 0.9rem;
`;

const InterviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [interviewState, setInterviewState] = useState('loading');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [questions, setQuestions] = useState([]);
  const [metrics, setMetrics] = useState({
    questionsAnswered: 0,
    recordings: 0,
    timeSpent: 0
  });
  const [isRecording, setIsRecording] = useState(false);
  const [currentRecording, setCurrentRecording] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [sessionData, setSessionData] = useState(null);
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordingIntervalRef = useRef(null);

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

  const initializeInterview = async () => {
    try {
      setInterviewState('loading');
      
      // Start media capture
      await startMediaCapture();
      
      // Try to start interview with backend
      const response = await fetch('/api/v1/interviews/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          candidate_name: 'Test Candidate',
          position_applied: 'Software Engineer',
          resume_text: 'Python developer with 3 years experience',
          job_description: 'Looking for a Python developer'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setSessionData(data);
        
        // Create question object from response
        const question = {
          id: 'q1',
          text: data.first_question,
          type: 'initial'
        };
        
        setCurrentQuestion(question);
        setQuestions([question]);
        setInterviewState('ready');
        
        // Add welcome message to chat
        setChatMessages([{
          type: 'ai',
          content: data.welcome_message
        }]);
        
        toast.success('Interview started successfully!');
      } else {
        throw new Error('Failed to start interview');
      }
    } catch (error) {
      console.error('Error starting interview:', error);
      toast.error('Failed to start interview. Using demo mode.');
      
      // Fallback to demo mode
      const mockQuestions = [
        {
          id: 'q1',
          text: 'Tell me about yourself and your background.',
          type: 'initial'
        },
        {
          id: 'q2',
          text: 'What are your key technical skills?',
          type: 'technical'
        },
        {
          id: 'q3',
          text: 'Describe a challenging project you worked on.',
          type: 'behavioral'
        }
      ];
      
      setQuestions(mockQuestions);
      setCurrentQuestion(mockQuestions[0]);
      setInterviewState('ready');
      toast.success('Interview started (demo mode)');
    }
  };

  const startMediaCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
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

  const startRecording = async () => {
    if (!streamRef.current) {
      toast.error('No media stream available');
      return;
    }

    try {
      const mediaRecorder = new MediaRecorder(streamRef.current, {
        mimeType: 'audio/webm'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      const chunks = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setCurrentRecording(blob);
        setMetrics(prev => ({ ...prev, recordings: prev.recordings + 1 }));
        toast.success('Recording completed!');
      };

      mediaRecorder.start(1000);
      setIsRecording(true);
      toast.success('Recording started');
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to start recording');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const uploadRecording = async (recording, questionId) => {
    // Mock upload function
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`/recordings/${questionId}_${Date.now()}.webm`);
      }, 1000);
    });
  };

  const submitAnswer = async () => {
    if (!answer.trim() && !currentRecording) {
      toast.error('Please provide an answer or recording');
      return;
    }

    try {
      setInterviewState('processing');
      
      let recordingUrl = null;
      
      // Upload current recording if exists
      if (currentRecording) {
        recordingUrl = await uploadRecording(currentRecording, currentQuestion.id);
        if (recordingUrl) {
          toast.success('Recording uploaded successfully!');
        }
      }

      const response = await fetch('/api/v1/interviews/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionData?.session_id || 'demo_session',
          message: answer
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Add user message to chat
        setChatMessages(prev => [...prev, {
          type: 'user',
          content: answer
        }]);
        
        // Add AI response to chat
        setChatMessages(prev => [...prev, {
          type: 'ai',
          content: data.response
        }]);
        
        if (data.next_question) {
          const nextQuestion = {
            id: `q${questions.length + 1}`,
            text: data.next_question,
            type: 'follow_up'
          };
          
          setCurrentQuestion(nextQuestion);
          setQuestions(prev => [...prev, nextQuestion]);
          setAnswer('');
          setCurrentRecording(null);
          setMetrics(prev => ({
            ...prev,
            questionsAnswered: prev.questionsAnswered + 1
          }));
          toast.success('Answer submitted! Next question loaded.');
        } else {
          setInterviewState('completed');
          toast.success('Interview completed!');
        }
      } else {
        throw new Error('Failed to submit answer');
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      toast.error('Failed to submit answer');
    } finally {
      setInterviewState('ready');
    }
  };

  const completeInterview = () => {
    setInterviewState('completed');
    toast.success('Interview completed!');
  };

  if (interviewState === 'loading') {
    return (
      <InterviewContainer>
        <MainContent>
          <LeftPanel>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Loading interview...</div>
              <div>Setting up your interview session...</div>
            </div>
          </LeftPanel>
        </MainContent>
      </InterviewContainer>
    );
  }

  if (interviewState === 'completed') {
    return (
      <InterviewContainer>
        <MainContent>
          <LeftPanel>
            <Header>
              <Title>Interview Completed!</Title>
              <Subtitle>Thank you for participating in the interview.</Subtitle>
            </Header>
            
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <CheckCircle size={64} color="#10b981" style={{ marginBottom: '1rem' }} />
              <h3>Interview Summary</h3>
              <Metrics>
                <MetricCard>
                  <MetricValue>{metrics.questionsAnswered}</MetricValue>
                  <MetricLabel>Questions Answered</MetricLabel>
                </MetricCard>
                <MetricCard>
                  <MetricValue>{metrics.recordings}</MetricValue>
                  <MetricLabel>Recordings</MetricLabel>
                </MetricCard>
                <MetricCard>
                  <MetricValue>{metrics.timeSpent}m</MetricValue>
                  <MetricLabel>Time Spent</MetricLabel>
                </MetricCard>
              </Metrics>
              
              <Button 
                variant="primary" 
                onClick={() => navigate('/')}
                style={{ marginTop: '1rem' }}
              >
                Return to Home
              </Button>
            </div>
          </LeftPanel>
        </MainContent>
      </InterviewContainer>
    );
  }

  return (
    <InterviewContainer>
      <MainContent>
        <LeftPanel>
          <Header>
            <Title>Nishu AI Interview</Title>
            <Subtitle>Software Engineer Position</Subtitle>
          </Header>

          {currentQuestion && (
            <QuestionCard>
              <QuestionText>{currentQuestion.text}</QuestionText>
              <AnswerInput
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here..."
              />
            </QuestionCard>
          )}

          <Controls>
            <Button
              variant={isRecording ? 'secondary' : 'primary'}
              onClick={isRecording ? stopRecording : startRecording}
              disabled={interviewState === 'processing'}
            >
              {isRecording ? <Square size={20} /> : <Mic size={20} />}
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </Button>
            
            <Button
              variant="primary"
              onClick={submitAnswer}
              disabled={interviewState === 'processing' || (!answer.trim() && !currentRecording)}
            >
              <Send size={20} />
              Submit Answer
            </Button>
          </Controls>

          <Metrics>
            <MetricCard>
              <MetricValue>{metrics.questionsAnswered}</MetricValue>
              <MetricLabel>Questions Answered</MetricLabel>
            </MetricCard>
            <MetricCard>
              <MetricValue>{metrics.recordings}</MetricValue>
              <MetricLabel>Recordings</MetricLabel>
            </MetricCard>
            <MetricCard>
              <MetricValue>{metrics.timeSpent}m</MetricValue>
              <MetricLabel>Time Spent</MetricLabel>
            </MetricCard>
          </Metrics>
        </LeftPanel>

        <RightPanel>
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Video size={20} />
            Video Feed
          </h3>
          
          <VideoContainer>
            <VideoElement
              ref={videoRef}
              autoPlay
              muted
              playsInline
            />
          </VideoContainer>

          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageCircle size={20} />
            Chat History
          </h3>
          
          <ChatContainer>
            {chatMessages.map((message, index) => (
              <ChatMessage key={index} className={message.type}>
                <div style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%', 
                  background: message.type === 'user' ? '#3b82f6' : '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '14px'
                }}>
                  {message.type === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <MessageContent type={message.type}>
                  {message.content}
                </MessageContent>
              </ChatMessage>
            ))}
          </ChatContainer>
        </RightPanel>
      </MainContent>
    </InterviewContainer>
  );
};

export default InterviewPage;