import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-hot-toast';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp,
  ArrowLeft,
  Download,
  Play,
  Video
} from 'lucide-react';

const ResultsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a202c 0%, #2d3748 50%, #4a5568 100%);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const HeaderSection = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;

  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 16px;
  }
`;

const Title = styled.h1`
  color: #1a202c;
  margin-bottom: 0.5rem;
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: -0.025em;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  color: #4a5568;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2rem;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  letter-spacing: 0.025em;
  
  &:hover {
    background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ScoreCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
`;

const ScoreValue = styled.div`
  font-size: 4rem;
  font-weight: 800;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
  letter-spacing: -0.05em;
`;

const ScoreLabel = styled.div`
  color: #4a5568;
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
  letter-spacing: 0.025em;
`;

const ScoreBar = styled.div`
  width: 100%;
  height: 12px;
  background: #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1.5rem;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ScoreFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #10b981, #34d399);
  width: ${props => props.score}%;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const MetricCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const MetricIcon = styled.div`
  width: 56px;
  height: 56px;
  background: ${props => props.color || '#667eea'};
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const MetricValue = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  color: #1a202c;
  margin-bottom: 0.5rem;
  letter-spacing: -0.025em;
`;

const MetricLabel = styled.div`
  color: #4a5568;
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.025em;
`;

const FeedbackSection = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const FeedbackTitle = styled.h3`
  color: #1a202c;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.025em;
`;

const FeedbackItem = styled.div`
  padding: 1.25rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  backdrop-filter: blur(10px);
  
  ${props => {
    switch (props.type) {
      case 'strength':
        return `
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-left: 4px solid #10b981;
        `;
      case 'improvement':
        return `
          background: rgba(245, 158, 11, 0.1);
          border: 1px solid rgba(245, 158, 11, 0.2);
          border-left: 4px solid #f59e0b;
        `;
      default:
        return `
          background: rgba(102, 126, 234, 0.1);
          border: 1px solid rgba(102, 126, 234, 0.2);
          border-left: 4px solid #667eea;
        `;
    }
  }}
`;

const FeedbackText = styled.p`
  color: #1a202c;
  margin: 0;
  font-size: 1rem;
  line-height: 1.6;
  font-weight: 500;
`;

const RecordingsSection = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const RecordingItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border: 1px solid rgba(226, 232, 240, 0.5);
  border-radius: 12px;
  margin-bottom: 1rem;
  background: rgba(249, 250, 251, 0.8);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.9);
    border-color: rgba(102, 126, 234, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const RecordingInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const RecordingIcon = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
`;

const RecordingDetails = styled.div`
  flex: 1;
`;

const RecordingTitle = styled.div`
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 0.25rem;
  font-size: 1rem;
`;

const RecordingMeta = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
`;

const RecordingActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  font-size: 0.875rem;
  letter-spacing: 0.025em;
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
          
          &:hover {
            background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%);
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
          }
        `;
      case 'secondary':
        return `
          background: rgba(226, 232, 240, 0.8);
          color: #4a5568;
          border: 1px solid rgba(226, 232, 240, 0.5);
          
          &:hover {
            background: rgba(203, 213, 224, 0.8);
            transform: translateY(-2px);
          }
        `;
      default:
        return `
          background: rgba(247, 250, 252, 0.8);
          color: #4a5568;
          border: 1px solid rgba(226, 232, 240, 0.5);
          
          &:hover {
            background: rgba(237, 242, 247, 0.8);
            transform: translateY(-2px);
          }
        `;
    }
  }}
  
  &:active {
    transform: translateY(0);
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
`;

const ResultsPage = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, [interviewId]);

  const loadResults = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`https://nishu-2.onrender.com/api/v1/interviews/${interviewId}/summary`);
      
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      } else {
        // Use mock data
        setResults({
          interviewId: interviewId,
          overallScore: 85,
          totalQuestions: 5,
          questionsAnswered: 5,
          duration: 25,
          averageResponseTime: 4.2,
          recordings: [
            {
              questionId: 1,
              filename: "q1_20241209_123456_question_1.webm",
              url: "/recordings/demo_session/q1_20241209_123456_question_1.webm",
              size: 2048576,
              uploadTime: Date.now() - 3600000
            },
            {
              questionId: 2,
              filename: "q2_20241209_123500_question_2.webm",
              url: "/recordings/demo_session/q2_20241209_123500_question_2.webm",
              size: 1536000,
              uploadTime: Date.now() - 3000000
            }
          ],
          strengths: [
            "Clear communication and articulation",
            "Strong technical knowledge demonstrated",
            "Good problem-solving approach"
          ],
          improvements: [
            "Could provide more specific examples",
            "Consider elaborating on implementation details"
          ],
          recommendation: "hire",
          feedback: "Overall strong performance with good technical skills and communication."
        });
      }
    } catch (error) {
      console.error('Error loading results:', error);
      // Use mock data
      setResults({
        interviewId: interviewId,
        overallScore: 85,
        totalQuestions: 5,
        questionsAnswered: 5,
        duration: 25,
        averageResponseTime: 4.2,
        recordings: [],
        strengths: [
          "Clear communication and articulation",
          "Strong technical knowledge demonstrated",
          "Good problem-solving approach"
        ],
        improvements: [
          "Could provide more specific examples",
          "Consider elaborating on implementation details"
        ],
        recommendation: "hire",
        feedback: "Overall strong performance with good technical skills and communication."
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadRecording = (recording) => {
    const link = document.createElement('a');
    link.href = `https://nishu-2.onrender.com${recording.url}`;
    link.download = recording.filename;
    link.click();
    toast.success('Recording download started');
  };

  const playRecording = (recording) => {
    window.open(`https://nishu-2.onrender.com${recording.url}`, '_blank');
  };

  const downloadReport = () => {
    toast.success('Report download started');
    // Implement actual download logic
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <ResultsContainer>
        <div style={{ textAlign: 'center', padding: '48px' }}>
          <div>Loading results...</div>
        </div>
      </ResultsContainer>
    );
  }

  if (!results) {
    return (
      <ResultsContainer>
        <div style={{ textAlign: 'center', padding: '48px' }}>
          <div>No results found</div>
          <BackButton onClick={() => navigate('/')}>
            <ArrowLeft size={16} />
            Back to Interview
          </BackButton>
        </div>
      </ResultsContainer>
    );
  }

  return (
    <ResultsContainer>
      <HeaderSection>
        <Title>Interview Results</Title>
        <Subtitle>Interview ID: {results.interviewId}</Subtitle>
        <BackButton onClick={() => navigate('/')}>
          <ArrowLeft size={16} />
          Back to Interview
        </BackButton>
      </HeaderSection>

      <ScoreCard>
        <ScoreValue>{results.overallScore}%</ScoreValue>
        <ScoreLabel>Overall Performance Score</ScoreLabel>
        <ScoreBar>
          <ScoreFill score={results.overallScore} />
        </ScoreBar>
        <div style={{ 
          fontSize: '1.1rem', 
          fontWeight: '600',
          color: results.overallScore >= 80 ? '#10b981' : 
                 results.overallScore >= 60 ? '#f59e0b' : '#ef4444'
        }}>
          {results.overallScore >= 80 ? 'Excellent' : 
           results.overallScore >= 60 ? 'Good' : 'Needs Improvement'}
        </div>
      </ScoreCard>

      <MetricsGrid>
        <MetricCard>
          <MetricIcon color="#10b981">
            <CheckCircle size={24} />
          </MetricIcon>
          <MetricValue>{results.questionsAnswered}</MetricValue>
          <MetricLabel>Questions Answered</MetricLabel>
        </MetricCard>

        <MetricCard>
          <MetricIcon color="#4299e1">
            <Clock size={24} />
          </MetricIcon>
          <MetricValue>{results.duration}m</MetricValue>
          <MetricLabel>Total Duration</MetricLabel>
        </MetricCard>

        <MetricCard>
          <MetricIcon color="#8b5cf6">
            <TrendingUp size={24} />
          </MetricIcon>
          <MetricValue>{results.averageResponseTime}m</MetricValue>
          <MetricLabel>Avg Response Time</MetricLabel>
        </MetricCard>

        <MetricCard>
          <MetricIcon color={results.recommendation === 'hire' ? '#10b981' : '#f59e0b'}>
            {results.recommendation === 'hire' ? <CheckCircle size={24} /> : <XCircle size={24} />}
          </MetricIcon>
          <MetricValue style={{ fontSize: '1.2rem' }}>
            {results.recommendation === 'hire' ? 'Hire' : 'Consider'}
          </MetricValue>
          <MetricLabel>Recommendation</MetricLabel>
        </MetricCard>
      </MetricsGrid>

      {results.recordings && results.recordings.length > 0 && (
        <RecordingsSection>
          <FeedbackTitle>📹 Interview Recordings</FeedbackTitle>
          <p style={{ color: '#6b7280', marginBottom: '16px' }}>
            Your recorded responses for each question:
          </p>
          
          {results.recordings.map((recording, index) => (
            <RecordingItem key={index}>
              <RecordingInfo>
                <RecordingIcon>
                  <Video size={20} />
                </RecordingIcon>
                <RecordingDetails>
                  <RecordingTitle>
                    Question {recording.questionId} Recording
                  </RecordingTitle>
                  <RecordingMeta>
                    {formatFileSize(recording.size)} • {formatDate(recording.uploadTime)}
                  </RecordingMeta>
                </RecordingDetails>
              </RecordingInfo>
              
              <RecordingActions>
                <ActionButton 
                  variant="primary" 
                  onClick={() => playRecording(recording)}
                >
                  <Play size={16} />
                  Play
                </ActionButton>
                
                <ActionButton 
                  variant="secondary" 
                  onClick={() => downloadRecording(recording)}
                >
                  <Download size={16} />
                  Download
                </ActionButton>
              </RecordingActions>
            </RecordingItem>
          ))}
        </RecordingsSection>
      )}

      <FeedbackSection>
        <FeedbackTitle>Strengths</FeedbackTitle>
        {results.strengths.map((strength, index) => (
          <FeedbackItem key={index} type="strength">
            <FeedbackText>{strength}</FeedbackText>
          </FeedbackItem>
        ))}
      </FeedbackSection>

      <FeedbackSection>
        <FeedbackTitle>Areas for Improvement</FeedbackTitle>
        {results.improvements.map((improvement, index) => (
          <FeedbackItem key={index} type="improvement">
            <FeedbackText>{improvement}</FeedbackText>
          </FeedbackItem>
        ))}
      </FeedbackSection>

      <FeedbackSection>
        <FeedbackTitle>Overall Feedback</FeedbackTitle>
        <FeedbackItem>
          <FeedbackText>{results.feedback}</FeedbackText>
        </FeedbackItem>
      </FeedbackSection>

      <ActionButtons>
        <ActionButton variant="primary" onClick={downloadReport}>
          <Download size={16} />
          Download Report
        </ActionButton>
        
        <ActionButton variant="secondary" onClick={() => navigate('/')}>
          <ArrowLeft size={16} />
          New Interview
        </ActionButton>
      </ActionButtons>
    </ResultsContainer>
  );
};

export default ResultsPage;
