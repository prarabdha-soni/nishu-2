import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const HomeContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: white;
  text-align: center;
  padding: 2rem;
`;

const JobXLogo = styled.div`
  width: 120px;
  height: 120px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 72px;
  font-weight: bold;
  color: white;
  font-family: 'Arial', sans-serif;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 1rem;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: 3rem;
  opacity: 0.9;
  max-width: 600px;
  line-height: 1.6;
`;

const StartButton = styled.button`
  padding: 1.5rem 3rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  font-size: 1.25rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
  }
`;

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-redirect to pre-interview after 3 seconds
    const timer = setTimeout(() => {
      navigate('/pre-interview');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleStartClick = () => {
    navigate('/pre-interview');
  };

  return (
    <HomeContainer>
      <JobXLogo>J</JobXLogo>
      <Title>jobX</Title>
      <Subtitle>
        AI-Powered Interview System
        <br />
        Experience the future of technical interviews
      </Subtitle>
      <StartButton onClick={handleStartClick}>
        Start Your Interview
      </StartButton>
    </HomeContainer>
  );
};

export default HomePage;
