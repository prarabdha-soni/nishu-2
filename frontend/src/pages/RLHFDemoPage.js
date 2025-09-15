import React, { useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-hot-toast';

// Import our RLHF components
import FeedbackForm from '../components/feedback/FeedbackForm';
import ModelStatus from '../components/rlhf/ModelStatus';
import RealTimeAnalysis from '../components/behavioral/RealTimeAnalysis';

const DemoContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`;

const DemoSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  h2 {
    margin-bottom: 16px;
    color: #2d3748;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 8px;
  }
`;

const TabContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 1px solid #e2e8f0;
`;

const Tab = styled.button`
  padding: 12px 24px;
  background: ${props => props.active ? '#4299e1' : 'transparent'};
  color: ${props => props.active ? 'white' : '#4a5568'};
  border: none;
  border-radius: 8px 8px 0 0;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.active ? '#3182ce' : '#f7fafc'};
  }
`;

const InfoBox = styled.div`
  background: #ebf8ff;
  border: 1px solid #bee3f8;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
  
  h3 {
    color: #2a4365;
    margin-bottom: 8px;
  }
  
  p {
    color: #2a4365;
    margin-bottom: 8px;
  }
  
  ul {
    color: #2a4365;
    margin-left: 20px;
  }
`;

const RLHFDemoPage = () => {
  const [activeTab, setActiveTab] = useState('feedback');

  const handleFeedbackSubmit = (result) => {
    console.log('Feedback submitted:', result);
    toast.success('Feedback submitted successfully! This will be used for RLHF training.');
  };

  const handleFeedbackCancel = () => {
    toast.info('Feedback cancelled');
  };

  const handleSignalDetected = (signals) => {
    console.log('Behavioral signals detected:', signals);
    toast.info(`Detected ${signals.length} behavioral signals`);
  };

  return (
    <DemoContainer>
      <h1>🤖 RLHF/RLAIF System Demo</h1>
      
      <InfoBox>
        <h3>About This Demo</h3>
        <p>This demo showcases the Reinforcement Learning from Human Feedback (RLHF) and AI Feedback (RLAIF) system for the AI Interview Bot.</p>
        <ul>
          <li><strong>Feedback Form:</strong> Submit human feedback for RLHF training</li>
          <li><strong>Model Status:</strong> Monitor RLHF model performance and training</li>
          <li><strong>Real-time Analysis:</strong> Live behavioral signal detection during interviews</li>
        </ul>
      </InfoBox>

      <TabContainer>
        <Tab 
          active={activeTab === 'feedback'} 
          onClick={() => setActiveTab('feedback')}
        >
          📝 Feedback Form
        </Tab>
        <Tab 
          active={activeTab === 'model-status'} 
          onClick={() => setActiveTab('model-status')}
        >
          📊 Model Status
        </Tab>
        <Tab 
          active={activeTab === 'behavioral'} 
          onClick={() => setActiveTab('behavioral')}
        >
          🎥 Real-time Analysis
        </Tab>
      </TabContainer>

      {activeTab === 'feedback' && (
        <DemoSection>
          <h2>Human Feedback Collection</h2>
          <p style={{ marginBottom: '24px', color: '#4a5568' }}>
            This form allows recruiters to provide detailed feedback on candidate responses, 
            which is used to train the reward model for RLHF.
          </p>
          <FeedbackForm
            answerId={123}
            candidateName="John Doe"
            question="Tell me about your experience with machine learning and how you would approach building a recommendation system."
            answer="I have 3 years of experience with machine learning, primarily using Python and scikit-learn. For a recommendation system, I would start by analyzing the data to understand user preferences and item features. I'd consider collaborative filtering approaches like matrix factorization or content-based filtering. I'd also evaluate deep learning methods like neural collaborative filtering if we have enough data. The key is to start simple and iterate based on performance metrics like precision, recall, and user engagement."
            onSubmit={handleFeedbackSubmit}
            onCancel={handleFeedbackCancel}
          />
        </DemoSection>
      )}

      {activeTab === 'model-status' && (
        <DemoSection>
          <h2>RLHF Model Status & Training</h2>
          <p style={{ marginBottom: '24px', color: '#4a5568' }}>
            Monitor the performance of your RLHF models, view training history, and trigger new training runs.
          </p>
          <ModelStatus />
        </DemoSection>
      )}

      {activeTab === 'behavioral' && (
        <DemoSection>
          <h2>Real-time Behavioral Analysis</h2>
          <p style={{ marginBottom: '24px', color: '#4a5568' }}>
            Live analysis of candidate behavior during interviews, including emotion detection, 
            engagement tracking, and real-time feedback.
          </p>
          <RealTimeAnalysis
            sessionId="demo_session_123"
            onSignalDetected={handleSignalDetected}
          />
        </DemoSection>
      )}

      <DemoSection>
        <h2>🔬 How RLHF Works in This System</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          <div>
            <h3>1. Data Collection</h3>
            <ul>
              <li>Human feedback from recruiters</li>
              <li>Behavioral signals from video/audio</li>
              <li>Question-answer pairs</li>
              <li>Performance metrics</li>
            </ul>
          </div>
          
          <div>
            <h3>2. Reward Model Training</h3>
            <ul>
              <li>Neural network learns to score responses</li>
              <li>Combines human ratings + behavioral signals</li>
              <li>Multi-aspect scoring (content, behavior, communication)</li>
              <li>Continuous improvement from feedback</li>
            </ul>
          </div>
          
          <div>
            <h3>3. Question Generator Fine-tuning</h3>
            <ul>
              <li>PPO training with reward model</li>
              <li>Adaptive question generation</li>
              <li>Context-aware question selection</li>
              <li>Performance-based difficulty adjustment</li>
            </ul>
          </div>
          
          <div>
            <h3>4. Continuous Deployment</h3>
            <ul>
              <li>Canary deployment for safety</li>
              <li>Automated rollback on performance drop</li>
              <li>A/B testing framework</li>
              <li>Real-time monitoring</li>
            </ul>
          </div>
        </div>
      </DemoSection>

      <DemoSection>
        <h2>📈 Behavioral Signals Detected</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <div style={{ background: '#f0fff4', padding: '16px', borderRadius: '8px', border: '1px solid #9ae6b4' }}>
            <h4 style={{ color: '#22543d', marginBottom: '8px' }}>�� Engagement Signals</h4>
            <ul style={{ color: '#22543d', fontSize: '14px' }}>
              <li>Eye contact duration</li>
              <li>Face direction tracking</li>
              <li>Gesture frequency</li>
              <li>Voice energy levels</li>
            </ul>
          </div>
          
          <div style={{ background: '#fef5e7', padding: '16px', borderRadius: '8px', border: '1px solid #f6e05e' }}>
            <h4 style={{ color: '#744210', marginBottom: '8px' }}>😊 Emotion Analysis</h4>
            <ul style={{ color: '#744210', fontSize: '14px' }}>
              <li>7 basic emotions (FER)</li>
              <li>Stress level detection</li>
              <li>Confidence indicators</li>
              <li>Emotional stability</li>
            </ul>
          </div>
          
          <div style={{ background: '#ebf8ff', padding: '16px', borderRadius: '8px', border: '1px solid #90cdf4' }}>
            <h4 style={{ color: '#2a4365', marginBottom: '8px' }}>🗣️ Speech Patterns</h4>
            <ul style={{ color: '#2a4365', fontSize: '14px' }}>
              <li>Speaking rate (WPM)</li>
              <li>Pause frequency</li>
              <li>Filler word detection</li>
              <li>Vocabulary richness</li>
            </ul>
          </div>
          
          <div style={{ background: '#faf5ff', padding: '16px', borderRadius: '8px', border: '1px solid #c084fc' }}>
            <h4 style={{ color: '#553c9a', marginBottom: '8px' }}>⚡ Real-time Feedback</h4>
            <ul style={{ color: '#553c9a', fontSize: '14px' }}>
              <li>Live signal detection</li>
              <li>Instant alerts</li>
              <li>Performance suggestions</li>
              <li>Adaptive responses</li>
            </ul>
          </div>
        </div>
      </DemoSection>
    </DemoContainer>
  );
};

export default RLHFDemoPage;
