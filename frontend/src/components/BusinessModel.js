import React from 'react';
import styled from 'styled-components';
import { User, Building2, DollarSign, CheckCircle } from 'lucide-react';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: 900;
  color: #1a202c;
  margin-bottom: 3rem;
  letter-spacing: -0.03em;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FlowContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 3rem 0;
  flex-wrap: wrap;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  min-width: 200px;
`;

const StepIcon = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: ${props => props.color || '#3b82f6'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  color: white;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2);
  }
`;

const StepTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 800;
  color: #1a202c;
  margin-bottom: 0.75rem;
  letter-spacing: -0.02em;
`;

const StepDescription = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.6;
  font-weight: 500;
`;

const Arrow = styled.div`
  font-size: 2rem;
  color: #3b82f6;
  margin: 0 1rem;
  font-weight: 700;

  @media (max-width: 768px) {
    transform: rotate(90deg);
  }
`;

const BusinessModel = () => {
  return (
    <Container>
      <Title>How jobX Works</Title>
      <FlowContainer>
        <Step>
          <StepIcon color="#3b82f6">
            <User size={50} />
          </StepIcon>
          <StepTitle>You Interview Once</StepTitle>
          <StepDescription>
            Take our AI-powered interview. We assess your skills, experience, and career preferences.
          </StepDescription>
        </Step>

        <Arrow>→</Arrow>

        <Step>
          <StepIcon color="#10b981">
            <Building2 size={50} />
          </StepIcon>
          <StepTitle>We Apply to Companies</StepTitle>
          <StepDescription>
            Our AI automatically applies you to matching companies based on your profile and preferences.
          </StepDescription>
        </Step>

        <Arrow>→</Arrow>

        <Step>
          <StepIcon color="#f59e0b">
            <DollarSign size={50} />
          </StepIcon>
          <StepTitle>We Negotiate & Pay Salary</StepTitle>
          <StepDescription>
            Our AI negotiates the best salary and jobX pays you directly from our account. No waiting for company payments.
          </StepDescription>
        </Step>

        <Arrow>→</Arrow>

        <Step>
          <StepIcon color="#8b5cf6">
            <CheckCircle size={50} />
          </StepIcon>
          <StepTitle>You Get Hired & Paid</StepTitle>
          <StepDescription>
            We handle all paperwork and compliance. You work for the company but get paid by jobX - guaranteed salary every month.
          </StepDescription>
        </Step>
      </FlowContainer>
    </Container>
  );
};

export default BusinessModel;
