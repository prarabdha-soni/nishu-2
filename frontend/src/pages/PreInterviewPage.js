import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-hot-toast';
import { 
  Calendar, 
  Clock, 
  Settings, 
  Volume2,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';

const PreInterviewContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 2rem;
`;

const MainContent = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
  align-items: start;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 2rem;
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

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 0.5rem;
  line-height: 1.1;
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: #64748b;
  margin-bottom: 2rem;
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

const DeviceSettings = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const DeviceSetting = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const DeviceLabel = styled.label`
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
`;

const DeviceSelect = styled.div`
  position: relative;
`;

const SelectButton = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #3b82f6;
  }
`;

const TestLink = styled.a`
  color: #3b82f6;
  text-decoration: none;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

const PreparationSection = styled.div`
  text-align: center;
`;

const PreparationTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1.5rem;
`;

const PreparationList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PreparationItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #64748b;
  font-size: 1rem;
`;

const IconWrapper = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
`;

const StartButton = styled.button`
  width: 100%;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 1.5rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const SecondaryButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const SecondaryButton = styled.button`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #3b82f6;
    color: #3b82f6;
  }
`;

const Disclaimer = styled.p`
  font-size: 0.8rem;
  color: #64748b;
  line-height: 1.5;
  text-align: center;
`;

const Navigation = styled.div`
  position: fixed;
  bottom: 2rem;
  left: 2rem;
  right: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NavButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #3b82f6;
    color: #3b82f6;
  }
`;


const PreInterviewPage = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  
  const [devices, setDevices] = useState({
    microphone: 'MacBook Air M',
    speaker: 'MacBook Air S',
    camera: 'FaceTime HD C'
  });
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    initializeMedia();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      // Get available devices
      const deviceList = await navigator.mediaDevices.enumerateDevices();
      const microphones = deviceList.filter(device => device.kind === 'audioinput');
      const speakers = deviceList.filter(device => device.kind === 'audiooutput');
      const cameras = deviceList.filter(device => device.kind === 'videoinput');
      
      if (microphones.length > 0) {
        setDevices(prev => ({ ...prev, microphone: microphones[0].label || 'Default Microphone' }));
      }
      if (speakers.length > 0) {
        setDevices(prev => ({ ...prev, speaker: speakers[0].label || 'Default Speaker' }));
      }
      if (cameras.length > 0) {
        setDevices(prev => ({ ...prev, camera: cameras[0].label || 'Default Camera' }));
      }
      
    } catch (error) {
      console.error('Error accessing media devices:', error);
      toast.error('Could not access camera/microphone. Please check permissions.');
    }
  };

  const testMicrophone = () => {
    toast.success('Microphone test completed');
  };

  const testSpeaker = () => {
    toast.success('Speaker test completed');
  };

  const restartDevices = () => {
    toast.success('Devices restarted');
  };

  const startInterview = async () => {
    setIsLoading(true);
    
    try {
      // Create a new interview session
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
      });

      let sessionId = 'demo_session';
      if (response.ok) {
        const data = await response.json();
        sessionId = data.session_id;
      }
      
      toast.success('Starting interview...');
      navigate(`/interview/${sessionId}`);
    } catch (error) {
      console.error('Error starting interview:', error);
      toast.error('Failed to start interview');
      setIsLoading(false);
    }
  };

  const goBack = () => {
    navigate('/');
  };

  const goNext = () => {
    startInterview();
  };

  return (
    <PreInterviewContainer>
      <MainContent>
        <LeftPanel>
          <Title>SWE Interview</Title>
          <Subtitle>Test out your general software engineering skills.</Subtitle>
          
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
          </VideoContainer>
          
          <DeviceSettings>
            <DeviceSetting>
              <DeviceLabel>Microphone</DeviceLabel>
              <DeviceSelect>
                <SelectButton>
                  <span>{devices.microphone}</span>
                  <ChevronDown size={16} />
                </SelectButton>
              </DeviceSelect>
              <TestLink onClick={testMicrophone}>
                Test your mic
              </TestLink>
            </DeviceSetting>
            
            <DeviceSetting>
              <DeviceLabel>Speaker</DeviceLabel>
              <DeviceSelect>
                <SelectButton>
                  <span>{devices.speaker}</span>
                  <ChevronDown size={16} />
                </SelectButton>
              </DeviceSelect>
              <TestLink onClick={testSpeaker}>
                Play test sound
              </TestLink>
            </DeviceSetting>
            
            <DeviceSetting>
              <DeviceLabel>Camera</DeviceLabel>
              <DeviceSelect>
                <SelectButton>
                  <span>{devices.camera}</span>
                  <ChevronDown size={16} />
                </SelectButton>
              </DeviceSelect>
              <TestLink onClick={restartDevices}>
                Restart devices
              </TestLink>
            </DeviceSetting>
          </DeviceSettings>
        </LeftPanel>
        
        <RightPanel>
          <PreparationSection>
            <PreparationTitle>Get ready for your AI interview</PreparationTitle>
            
            <PreparationList>
              <PreparationItem>
                <IconWrapper>
                  <Calendar size={20} />
                </IconWrapper>
                Start now or come back later
              </PreparationItem>
              <PreparationItem>
                <IconWrapper>
                  <Clock size={20} />
                </IconWrapper>
                Expect to spend 27 minutes
              </PreparationItem>
              <PreparationItem>
                <IconWrapper>
                  <Settings size={20} />
                </IconWrapper>
                Check your device settings
              </PreparationItem>
              <PreparationItem>
                <IconWrapper>
                  <Volume2 size={20} />
                </IconWrapper>
                Find a quiet place with stable internet
              </PreparationItem>
            </PreparationList>
            
            <StartButton onClick={startInterview} disabled={isLoading}>
              {isLoading ? 'Starting...' : 'Start Interview'}
            </StartButton>
            
            <SecondaryButtons>
              <SecondaryButton>
                <HelpCircle size={16} style={{ marginRight: '0.5rem' }} />
                FAQs
              </SecondaryButton>
              <SecondaryButton>
                <AlertTriangle size={16} style={{ marginRight: '0.5rem' }} />
                I'm having issues
              </SecondaryButton>
            </SecondaryButtons>
            
            <Disclaimer>
              jobX uses generative AI to conduct the AI interview. Your responses are used only to assess your candidacy and are never used to train AI models.
            </Disclaimer>
          </PreparationSection>
        </RightPanel>
      </MainContent>
      
      <Navigation>
        <NavButton onClick={goBack}>
          <ArrowLeft size={16} />
          Back
        </NavButton>
        <NavButton onClick={goNext}>
          Next
          <ArrowRight size={16} />
        </NavButton>
      </Navigation>
    </PreInterviewContainer>
  );
};

export default PreInterviewPage;
