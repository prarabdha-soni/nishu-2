import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-hot-toast';

const FeedbackContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const FormSection = styled.div`
  margin-bottom: 24px;
  
  h3 {
    margin-bottom: 12px;
    color: #2d3748;
    font-size: 18px;
    font-weight: 600;
  }
`;

const RatingSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
`;

const RatingItem = styled.div`
  display: flex;
  flex-direction: column;
  
  label {
    font-weight: 500;
    margin-bottom: 8px;
    color: #4a5568;
  }
`;

const StarRating = styled.div`
  display: flex;
  gap: 4px;
  
  button {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: ${props => props.filled ? '#fbbf24' : '#d1d5db'};
    transition: color 0.2s;
    
    &:hover {
      color: #fbbf24;
    }
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-family: inherit;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => props.primary ? `
    background: #4299e1;
    color: white;
    border: 1px solid #4299e1;
    
    &:hover {
      background: #3182ce;
    }
    
    &:disabled {
      background: #a0aec0;
      cursor: not-allowed;
    }
  ` : `
    background: white;
    color: #4a5568;
    border: 1px solid #e2e8f0;
    
    &:hover {
      background: #f7fafc;
    }
  `}
`;

const RecommendationSelect = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-family: inherit;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
  }
`;

const FeedbackForm = ({ answerId, candidateName, question, answer, onSubmit, onCancel }) => {
  const [ratings, setRatings] = useState({
    overall: 0,
    relevance: 0,
    completeness: 0,
    technical_accuracy: 0,
    communication: 0
  });

  const [feedback, setFeedback] = useState({
    strengths: '',
    weaknesses: '',
    suggestions: '',
    general_comments: ''
  });

  const [recommendation, setRecommendation] = useState('maybe');
  const [confidence, setConfidence] = useState(0.8);
  const [submitting, setSubmitting] = useState(false);

  const handleRatingChange = (category, value) => {
    setRatings(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleFeedbackChange = (field, value) => {
    setFeedback(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (ratings.overall === 0) {
      toast.error('Please provide an overall rating');
      return;
    }

    setSubmitting(true);

    try {
      const feedbackData = {
        answer_id: answerId,
        evaluator_id: 1, // Would get from auth context
        overall_rating: ratings.overall,
        relevance_rating: ratings.relevance || null,
        completeness_rating: ratings.completeness || null,
        technical_accuracy_rating: ratings.technical_accuracy || null,
        communication_rating: ratings.communication || null,
        strengths: feedback.strengths,
        weaknesses: feedback.weaknesses,
        suggestions: feedback.suggestions,
        general_comments: feedback.general_comments,
        recommendation: recommendation,
        confidence_level: confidence / 10
      };

      const response = await fetch('/api/v1/rlhf/feedback/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData)
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Feedback submitted successfully!');
        onSubmit && onSubmit(result);
      } else {
        toast.error(result.error || 'Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  const StarRatingComponent = ({ category, value, onChange }) => (
    <StarRating>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(category, star)}
        >
          {star <= value ? '★' : '☆'}
        </button>
      ))}
    </StarRating>
  );

  return (
    <FeedbackContainer>
      <h2>Evaluate Candidate Response</h2>
      
      <FormSection>
        <h3>Candidate: {candidateName}</h3>
        <div style={{ background: '#f7fafc', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
          <strong>Question:</strong> {question}
        </div>
        <div style={{ background: '#f7fafc', padding: '16px', borderRadius: '8px' }}>
          <strong>Answer:</strong> {answer}
        </div>
      </FormSection>

      <form onSubmit={handleSubmit}>
        <FormSection>
          <h3>Rating Scores (1-10)</h3>
          <RatingSection>
            <RatingItem>
              <label>Overall Rating *</label>
              <StarRatingComponent
                category="overall"
                value={ratings.overall}
                onChange={handleRatingChange}
              />
            </RatingItem>
            
            <RatingItem>
              <label>Relevance</label>
              <StarRatingComponent
                category="relevance"
                value={ratings.relevance}
                onChange={handleRatingChange}
              />
            </RatingItem>
            
            <RatingItem>
              <label>Completeness</label>
              <StarRatingComponent
                category="completeness"
                value={ratings.completeness}
                onChange={handleRatingChange}
              />
            </RatingItem>
            
            <RatingItem>
              <label>Technical Accuracy</label>
              <StarRatingComponent
                category="technical_accuracy"
                value={ratings.technical_accuracy}
                onChange={handleRatingChange}
              />
            </RatingItem>
            
            <RatingItem>
              <label>Communication</label>
              <StarRatingComponent
                category="communication"
                value={ratings.communication}
                onChange={handleRatingChange}
              />
            </RatingItem>
          </RatingSection>
        </FormSection>

        <FormSection>
          <h3>Detailed Feedback</h3>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Strengths
            </label>
            <TextArea
              value={feedback.strengths}
              onChange={(e) => handleFeedbackChange('strengths', e.target.value)}
              placeholder="What did the candidate do well?"
            />
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Areas for Improvement
            </label>
            <TextArea
              value={feedback.weaknesses}
              onChange={(e) => handleFeedbackChange('weaknesses', e.target.value)}
              placeholder="What could the candidate improve?"
            />
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Suggestions
            </label>
            <TextArea
              value={feedback.suggestions}
              onChange={(e) => handleFeedbackChange('suggestions', e.target.value)}
              placeholder="Specific suggestions for improvement"
            />
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              General Comments
            </label>
            <TextArea
              value={feedback.general_comments}
              onChange={(e) => handleFeedbackChange('general_comments', e.target.value)}
              placeholder="Any additional comments"
            />
          </div>
        </FormSection>

        <FormSection>
          <h3>Recommendation</h3>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Hiring Recommendation
            </label>
            <RecommendationSelect
              value={recommendation}
              onChange={(e) => setRecommendation(e.target.value)}
            >
              <option value="hire">Strong Hire</option>
              <option value="maybe">Maybe</option>
              <option value="no_hire">No Hire</option>
            </RecommendationSelect>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Confidence Level: {confidence}/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={confidence}
              onChange={(e) => setConfidence(parseInt(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
        </FormSection>

        <ButtonGroup>
          <Button type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" primary disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </ButtonGroup>
      </form>
    </FeedbackContainer>
  );
};

export default FeedbackForm;
