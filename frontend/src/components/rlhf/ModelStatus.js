import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-hot-toast';

const StatusContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const StatusGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const StatusCard = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 20px;
  
  h3 {
    margin: 0 0 16px 0;
    color: #2d3748;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  
  ${props => {
    switch (props.status) {
      case 'active':
        return 'background: #c6f6d5; color: #22543d;';
      case 'training':
        return 'background: #fed7d7; color: #742a2a;';
      case 'inactive':
        return 'background: #e2e8f0; color: #4a5568;';
      default:
        return 'background: #e2e8f0; color: #4a5568;';
    }
  }}
`;

const MetricRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  
  span:first-child {
    color: #4a5568;
  }
  
  span:last-child {
    font-weight: 600;
    color: #2d3748;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  margin: 8px 0;
  
  div {
    height: 100%;
    background: ${props => props.color || '#4299e1'};
    width: ${props => props.progress || 0}%;
    transition: width 0.3s ease;
  }
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  background: #4299e1;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
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

const TrainingHistory = styled.div`
  margin-top: 32px;
  
  h3 {
    margin-bottom: 16px;
    color: #2d3748;
  }
`;

const HistoryTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
  }
  
  th {
    background: #f7fafc;
    font-weight: 600;
    color: #4a5568;
  }
  
  tr:hover {
    background: #f7fafc;
  }
`;

const ModelStatus = () => {
  const [modelStatus, setModelStatus] = useState(null);
  const [trainingHistory, setTrainingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [retraining, setRetraining] = useState(false);

  useEffect(() => {
    fetchModelStatus();
    fetchTrainingHistory();
    
    // Set up polling for real-time updates
    const interval = setInterval(() => {
      fetchModelStatus();
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const fetchModelStatus = async () => {
    try {
      const response = await fetch('/api/v1/rlhf/models/status');
      const data = await response.json();
      setModelStatus(data);
    } catch (error) {
      console.error('Error fetching model status:', error);
      toast.error('Failed to fetch model status');
    } finally {
      setLoading(false);
    }
  };

  const fetchTrainingHistory = async () => {
    try {
      const response = await fetch('/api/v1/rlhf/training/history');
      const data = await response.json();
      setTrainingHistory(data.training_runs || []);
    } catch (error) {
      console.error('Error fetching training history:', error);
    }
  };

  const startRetraining = async () => {
    setRetraining(true);
    
    try {
      const response = await fetch('/api/v1/rlhf/training/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dataset_name: 'latest_feedback',
          model_version: `v${Date.now()}`,
          num_epochs: 3
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('Training started successfully!');
        setTimeout(fetchModelStatus, 2000); // Refresh status
      } else {
        toast.error(result.error || 'Failed to start training');
      }
    } catch (error) {
      console.error('Error starting training:', error);
      toast.error('Failed to start training');
    } finally {
      setRetraining(false);
    }
  };

  const evaluateModels = async () => {
    try {
      const response = await fetch('/api/v1/rlhf/training/evaluate', {
        method: 'POST'
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('Model evaluation completed');
        setModelStatus(prev => ({
          ...prev,
          evaluation_results: result
        }));
      } else {
        toast.error('Failed to evaluate models');
      }
    } catch (error) {
      console.error('Error evaluating models:', error);
      toast.error('Failed to evaluate models');
    }
  };

  if (loading) {
    return (
      <StatusContainer>
        <div>Loading model status...</div>
      </StatusContainer>
    );
  }

  if (!modelStatus) {
    return (
      <StatusContainer>
        <div>Failed to load model status</div>
      </StatusContainer>
    );
  }

  return (
    <StatusContainer>
      <h2>RLHF Model Status</h2>
      
      <StatusGrid>
        <StatusCard>
          <h3>
            Reward Model
            <StatusBadge status={modelStatus.reward_model?.status}>
              {modelStatus.reward_model?.status || 'Unknown'}
            </StatusBadge>
          </h3>
          
          <MetricRow>
            <span>Accuracy:</span>
            <span>{((modelStatus.reward_model?.performance?.accuracy || 0) * 100).toFixed(1)}%</span>
          </MetricRow>
          
          <MetricRow>
            <span>MSE:</span>
            <span>{(modelStatus.reward_model?.performance?.mse || 0).toFixed(3)}</span>
          </MetricRow>
          
          <MetricRow>
            <span>Test Examples:</span>
            <span>{modelStatus.reward_model?.performance?.test_examples || 0}</span>
          </MetricRow>
          
          <ProgressBar 
            progress={(modelStatus.reward_model?.performance?.accuracy || 0) * 100}
            color="#10b981"
          >
            <div />
          </ProgressBar>
        </StatusCard>

        <StatusCard>
          <h3>
            Question Generator
            <StatusBadge status={modelStatus.question_generator?.status}>
              {modelStatus.question_generator?.status || 'Unknown'}
            </StatusBadge>
          </h3>
          
          <MetricRow>
            <span>Quality Score:</span>
            <span>{((modelStatus.question_generator?.performance?.average_quality_score || 0) * 100).toFixed(1)}%</span>
          </MetricRow>
          
          <MetricRow>
            <span>Evaluations:</span>
            <span>{modelStatus.question_generator?.performance?.evaluations_performed || 0}</span>
          </MetricRow>
          
          <MetricRow>
            <span>Model Path:</span>
            <span style={{ fontSize: '12px', wordBreak: 'break-all' }}>
              {modelStatus.question_generator?.performance?.model_path || 'Not available'}
            </span>
          </MetricRow>
          
          <ProgressBar 
            progress={(modelStatus.question_generator?.performance?.average_quality_score || 0) * 100}
            color="#8b5cf6"
          >
            <div />
          </ProgressBar>
        </StatusCard>
      </StatusGrid>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
        <ActionButton 
          onClick={startRetraining} 
          disabled={retraining}
        >
          {retraining ? 'Starting Training...' : 'Start Retraining'}
        </ActionButton>
        
        <ActionButton onClick={evaluateModels}>
          Evaluate Models
        </ActionButton>
      </div>

      <TrainingHistory>
        <h3>Recent Training Runs</h3>
        
        {trainingHistory.length === 0 ? (
          <div style={{ color: '#4a5568', padding: '20px', textAlign: 'center' }}>
            No training runs found
          </div>
        ) : (
          <HistoryTable>
            <thead>
              <tr>
                <th>Run ID</th>
                <th>Started</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Performance</th>
                <th>Examples Used</th>
              </tr>
            </thead>
            <tbody>
              {trainingHistory.slice(0, 10).map((run, index) => (
                <tr key={run.id || index}>
                  <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                    {run.run_id || 'N/A'}
                  </td>
                  <td>{run.started_at ? new Date(run.started_at).toLocaleDateString() : 'N/A'}</td>
                  <td>{run.duration || 'N/A'}</td>
                  <td>
                    <StatusBadge status={run.status}>
                      {run.status || 'Unknown'}
                    </StatusBadge>
                  </td>
                  <td>{run.final_accuracy ? `${(run.final_accuracy * 100).toFixed(1)}%` : 'N/A'}</td>
                  <td>{run.training_examples_used || 0}</td>
                </tr>
              ))}
            </tbody>
          </HistoryTable>
        )}
      </TrainingHistory>
    </StatusContainer>
  );
};

export default ModelStatus;
