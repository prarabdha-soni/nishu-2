import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { toast } from 'react-hot-toast';

const AnalysisContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
`;

const VideoContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 24px;
  margin-bottom: 24px;
`;

const VideoSection = styled.div`
  video {
    width: 100%;
    max-width: 640px;
    height: auto;
    border-radius: 8px;
    background: #000;
  }
`;

const RealTimePanel = styled.div`
  background: #f7fafc;
  border-radius: 8px;
  padding: 16px;
  
  h3 {
    margin: 0 0 16px 0;
    color: #2d3748;
    font-size: 16px;
  }
`;

const SignalIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  
  span:first-child {
    color: #4a5568;
    font-size: 14px;
  }
`;

const SignalValue = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  
  .value {
    font-weight: 600;
    color: ${props => {
      if (props.level === 'good') return '#22543d';
      if (props.level === 'warning') return '#d69e2e';
      if (props.level === 'danger') return '#c53030';
      return '#4a5568';
    }};
  }
  
  .indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => {
      if (props.level === 'good') return '#22543d';
      if (props.level === 'warning') return '#d69e2e';
      if (props.level === 'danger') return '#c53030';
      return '#a0aec0';
    }};
  }
`;

const AlertsSection = styled.div`
  margin-top: 16px;
`;

const Alert = styled.div`
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  margin-bottom: 8px;
  
  ${props => {
    switch (props.type) {
      case 'warning':
        return 'background: #fef5e7; color: #744210; border-left: 4px solid #d69e2e;';
      case 'danger':
        return 'background: #fed7d7; color: #742a2a; border-left: 4px solid #c53030;';
      case 'info':
        return 'background: #ebf8ff; color: #2a4365; border-left: 4px solid #4299e1;';
      default:
        return 'background: #f0fff4; color: #22543d; border-left: 4px solid #38a169;';
    }
  }}
`;

const ControlsSection = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 24px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => props.primary ? `
    background: #4299e1;
    color: white;
    
    &:hover {
      background: #3182ce;
    }
  ` : `
    background: #e2e8f0;
    color: #4a5568;
    
    &:hover {
      background: #cbd5e0;
    }
  `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const EmotionChart = styled.div`
  margin-top: 16px;
  
  h4 {
    margin: 0 0 12px 0;
    font-size: 14px;
    color: #4a5568;
  }
`;

const EmotionBar = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  
  .label {
    width: 80px;
    font-size: 12px;
    color: #4a5568;
  }
  
  .bar {
    flex: 1;
    height: 6px;
    background: #e2e8f0;
    border-radius: 3px;
    overflow: hidden;
    margin: 0 8px;
    
    .fill {
      height: 100%;
      background: ${props => props.color || '#4299e1'};
      width: ${props => props.value || 0}%;
      transition: width 0.3s ease;
    }
  }
  
  .value {
    font-size: 12px;
    font-weight: 500;
    color: #2d3748;
    min-width: 30px;
  }
`;

const RealTimeAnalysis = ({ sessionId, onSignalDetected }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentSignals, setCurrentSignals] = useState({
    eye_contact: 0.8,
    engagement: 0.7,
    stress_level: 0.3,
    speaking_rate: 120,
    confidence: 0.6
  });
  const [emotions, setEmotions] = useState({
    happy: 0.2,
    neutral: 0.6,
    sad: 0.1,
    angry: 0.05,
    surprised: 0.05
  });
  const [alerts, setAlerts] = useState([]);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startAnalysis = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: true
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      setIsAnalyzing(true);
      startRealTimeDetection(mediaStream);
      
      toast.success('Real-time analysis started');
    } catch (error) {
      console.error('Error starting analysis:', error);
      toast.error('Failed to access camera/microphone');
    }
  };

  const stopAnalysis = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    
    setIsAnalyzing(false);
    toast.success('Analysis stopped');
  };

  const startRealTimeDetection = (mediaStream) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    if (!canvas || !video) return;
    
    const context = canvas.getContext('2d');
    canvas.width = 640;
    canvas.height = 480;
    
    const processFrame = async () => {
      if (!isAnalyzing) return;
      
      // Draw current video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to blob for analysis
      canvas.toBlob(async (blob) => {
        if (blob) {
          const reader = new FileReader();
          reader.onload = async () => {
            const base64Frame = reader.result.split(',')[1];
            
            // Send frame for analysis
            await analyzeFrame(base64Frame);
          };
          reader.readAsDataURL(blob);
        }
      }, 'image/jpeg', 0.8);
      
      // Process next frame
      setTimeout(processFrame, 1000); // Analyze every second
    };
    
    // Start processing when video is ready
    video.addEventListener('loadeddata', () => {
      processFrame();
    });
  };

  const analyzeFrame = async (frameData) => {
    try {
      const response = await fetch('/api/v1/behavioral/analyze/real-time', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          frame_data: frameData,
          transcript_chunk: '' // Would get from speech recognition
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Update signals based on detected behaviors
        updateSignalsFromDetection(result.signals_detected);
        
        // Show real-time feedback
        if (result.real_time_feedback) {
          updateAlerts(result.real_time_feedback);
        }
        
        // Notify parent component
        if (onSignalDetected) {
          onSignalDetected(result.signals_detected);
        }
      }
    } catch (error) {
      console.error('Error analyzing frame:', error);
    }
  };

  const updateSignalsFromDetection = (signals) => {
    const newSignals = { ...currentSignals };
    const newEmotions = { ...emotions };
    
    signals.forEach(signal => {
      switch (signal.signal_type) {
        case 'no_face_detected':
          newSignals.eye_contact = 0;
          break;
        case 'eye_contact_good':
          newSignals.eye_contact = Math.min(1, newSignals.eye_contact + 0.1);
          break;
        case 'silence_detected':
          newSignals.speaking_rate = 0;
          break;
        case 'excessive_fillers':
          newSignals.confidence = Math.max(0, newSignals.confidence - 0.1);
          break;
        default:
          break;
      }
    });
    
    setCurrentSignals(newSignals);
  };

  const updateAlerts = (feedback) => {
    const newAlerts = [...feedback.alerts || []].map(alert => ({
      id: Date.now() + Math.random(),
      type: 'warning',
      message: alert,
      timestamp: new Date()
    }));
    
    const suggestions = [...feedback.suggestions || []].map(suggestion => ({
      id: Date.now() + Math.random(),
      type: 'info',
      message: suggestion,
      timestamp: new Date()
    }));
    
    setAlerts(prev => [...newAlerts, ...suggestions, ...prev].slice(0, 5));
  };

  const getSignalLevel = (value, thresholds = { good: 0.7, warning: 0.4 }) => {
    if (value >= thresholds.good) return 'good';
    if (value >= thresholds.warning) return 'warning';
    return 'danger';
  };

  const formatValue = (value, type = 'percentage') => {
    if (type === 'percentage') {
      return `${Math.round(value * 100)}%`;
    }
    if (type === 'wpm') {
      return `${Math.round(value)} WPM`;
    }
    return value.toFixed(2);
  };

  return (
    <AnalysisContainer>
      <h2>Real-Time Behavioral Analysis</h2>
      
      <ControlsSection>
        <Button 
          primary 
          onClick={isAnalyzing ? stopAnalysis : startAnalysis}
        >
          {isAnalyzing ? 'Stop Analysis' : 'Start Analysis'}
        </Button>
        
        <span style={{ color: '#4a5568' }}>
          {isAnalyzing ? '🔴 Analyzing...' : '⚪ Stopped'}
        </span>
      </ControlsSection>

      <VideoContainer>
        <VideoSection>
          <video ref={videoRef} autoPlay muted playsInline />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </VideoSection>

        <RealTimePanel>
          <h3>Live Signals</h3>
          
          <SignalIndicator>
            <span>Eye Contact</span>
            <SignalValue level={getSignalLevel(currentSignals.eye_contact)}>
              <span className="value">{formatValue(currentSignals.eye_contact)}</span>
              <div className="indicator" />
            </SignalValue>
          </SignalIndicator>
          
          <SignalIndicator>
            <span>Engagement</span>
            <SignalValue level={getSignalLevel(currentSignals.engagement)}>
              <span className="value">{formatValue(currentSignals.engagement)}</span>
              <div className="indicator" />
            </SignalValue>
          </SignalIndicator>
          
          <SignalIndicator>
            <span>Confidence</span>
            <SignalValue level={getSignalLevel(currentSignals.confidence)}>
              <span className="value">{formatValue(currentSignals.confidence)}</span>
              <div className="indicator" />
            </SignalValue>
          </SignalIndicator>
          
          <SignalIndicator>
            <span>Stress Level</span>
            <SignalValue level={getSignalLevel(1 - currentSignals.stress_level)}>
              <span className="value">{formatValue(currentSignals.stress_level)}</span>
              <div className="indicator" />
            </SignalValue>
          </SignalIndicator>
          
          <SignalIndicator>
            <span>Speaking Rate</span>
            <SignalValue level={getSignalLevel(currentSignals.speaking_rate / 200)}>
              <span className="value">{formatValue(currentSignals.speaking_rate, 'wpm')}</span>
              <div className="indicator" />
            </SignalValue>
          </SignalIndicator>

          <EmotionChart>
            <h4>Current Emotions</h4>
            
            {Object.entries(emotions).map(([emotion, value]) => (
              <EmotionBar key={emotion} value={value * 100} color="#8b5cf6">
                <span className="label">{emotion}</span>
                <div className="bar">
                  <div className="fill" />
                </div>
                <span className="value">{Math.round(value * 100)}%</span>
              </EmotionBar>
            ))}
          </EmotionChart>

          <AlertsSection>
            <h4 style={{ fontSize: '14px', color: '#4a5568', margin: '16px 0 12px 0' }}>
              Recent Alerts
            </h4>
            
            {alerts.length === 0 ? (
              <div style={{ color: '#a0aec0', fontSize: '12px', textAlign: 'center' }}>
                No alerts
              </div>
            ) : (
              alerts.map(alert => (
                <Alert key={alert.id} type={alert.type}>
                  {alert.message}
                </Alert>
              ))
            )}
          </AlertsSection>
        </RealTimePanel>
      </VideoContainer>
    </AnalysisContainer>
  );
};

export default RealTimeAnalysis;
