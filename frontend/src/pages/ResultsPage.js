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
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
`;

const HeaderSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Title = styled.h1`
  color: #2d3748;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: #4a5568;
  margin-bottom: 16px;
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #4299e1;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: #3182ce;
  }
`;

const ScoreCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const ScoreValue = styled.div`
  font-size: 3rem;
  font-weight: bold;
  color: #10b981;
  margin-bottom: 8px;
`;

const ScoreLabel = styled.div`
  color: #4a5568;
  font-size: 1.1rem;
  margin-bottom: 16px;
`;

const ScoreBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 16px;
`;

const ScoreFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #10b981, #34d399);
  width: ${props => props.score}%;
  transition: width 0.3s ease;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
`;

const MetricCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const MetricIcon = styled.div`
  width: 48px;
  height: 48px;
  background: ${props => props.color || '#4299e1'};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  color: white;
`;

const MetricValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #2d3748;
  margin-bottom: 8px;
`;

const MetricLabel = styled.div`
  color: #4a5568;
  font-size: 0.9rem;
`;

const FeedbackSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const FeedbackTitle = styled.h3`
  color: #2d3748;
  margin-bottom: 16px;
`;

const FeedbackItem = styled.div`
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 12px;
  
  ${props => {
    switch (props.type) {
      case 'strength':
        return 'background: #f0fff4; border-left: 4px solid #10b981;';
      case 'improvement':
        return 'background: #fef5e7; border-left: 4px solid #f59e0b;';
      default:
        return 'background: #f7fafc; border-left: 4px solid #4299e1;';
    }
  }}
`;

const FeedbackText = styled.p`
  color: #2d3748;
  margin: 0;
`;

const RecordingsSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const RecordingItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 12px;
  background: #f9fafb;
`;

const RecordingInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const RecordingIcon = styled.div`
  width: 40px;
  height: 40px;
  background: #4299e1;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const RecordingDetails = styled.div`
  flex: 1;
`;

const RecordingTitle = styled.div`
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 4px;
`;

const RecordingMeta = styled.div`
  font-size: 14px;
  color: #6b7280;
`;

const RecordingActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: #4299e1;
          color: white;
          
          &:hover {
            background: #3182ce;
          }
        `;
      case 'secondary':
        return `
          background: #e2e8f0;
          color: #4a5568;
          
          &:hover {
            background: #cbd5e0;
          }
        `;
      default:
        return `
          background: #f7fafc;
          color: #4a5568;
          border: 1px solid #e2e8f0;
          
          &:hover {
            background: #edf2f7;
          }
        `;
    }
  }}
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 24px;
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
      
      const response = await fetch(`/api/v1/interviews/${interviewId}/summary`);
      
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
    link.href = `http://localhost:8000${recording.url}`;
    link.download = recording.filename;
    link.click();
    toast.success('Recording download started');
  };

  const playRecording = (recording) => {
    window.open(`http://localhost:8000${recording.url}`, '_blank');
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
