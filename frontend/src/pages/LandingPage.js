import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import BusinessModel from '../components/BusinessModel';

const Container = styled.div`
  min-height: 100vh;
  background: #ffffff;
`;

const CornerButton = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 100;
`;

const Hero = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem 4rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  position: relative;

  @media (max-width: 1024px) {
    padding: 0 1.5rem 3rem;
  }
`;

const HeroText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LogoImage = styled.img`
  max-width: 600px;
  width: 100%;
  height: auto;
  object-fit: contain;
  
  @media (max-width: 768px) {
    max-width: 500px;
  }
  
  @media (max-width: 480px) {
    max-width: 400px;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  line-height: 1.1;
  font-weight: 900;
  color: #1a202c;
  margin-bottom: 1.5rem;
  letter-spacing: -0.03em;
  max-width: 900px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Lead = styled.p`
  color: #4a5568;
  font-size: 1.125rem;
  margin-bottom: 2.5rem;
  line-height: 1.6;
  max-width: 700px;
  font-weight: 500;
`;

const Subtitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 800;
  color: #2d3748;
  margin-bottom: 1rem;
  text-align: center;
  letter-spacing: -0.02em;
`;

const Tagline = styled.p`
  color: #718096;
  font-size: 1rem;
  margin-bottom: 3rem;
  text-align: center;
  font-style: italic;
  font-weight: 500;
`;

const CTAGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const PrimaryButton = styled.button`
  padding: 1.25rem 2.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 16px;
  font-weight: 700;
  font-size: 1.125rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
  letter-spacing: 0.025em;
  
  &:hover {
    background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%);
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
  }
`;

const GhostButton = styled.button`
  padding: 1.25rem 2.5rem;
  background: white;
  color: #1a202c;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  font-weight: 700;
  font-size: 1.125rem;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 0.025em;
  
  &:hover {
    border-color: #667eea;
    color: #667eea;
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const Cards = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const Card = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
  
  strong {
    display: block;
    font-size: 1.25rem;
    font-weight: 700;
    color: #1a202c;
    margin-bottom: 0.75rem;
    line-height: 1.3;
  }
  
  p {
    color: #6b7280;
    font-size: 1rem;
    line-height: 1.5;
    margin: 0;
  }
`;

const Section = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-size: 2.25rem;
  font-weight: 900;
  color: #1a202c;
  margin-bottom: 3rem;
  letter-spacing: -0.03em;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ProcessGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const ProcessCard = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
  
  strong {
    display: block;
    font-size: 1.5rem;
    font-weight: 700;
    color: #1a202c;
    text-align: center;
  }
`;

const FooterCTA = styled.div`
  display: flex;
  justify-content: center;
  padding: 4rem 2rem 6rem;
  background: #f8fafc;
`;

export default function LandingPage() {
  const navigate = useNavigate();
  const goStart = () => navigate('/pre-interview');

  return (
    <Container>
      <Hero>
        <CornerButton>
          <PrimaryButton onClick={goStart}>Start Interview</PrimaryButton>
        </CornerButton>
        <HeroText>
          <LogoImage src="/jobx-image.png" alt="jobX" />
        </HeroText>
      </Hero>
    </Container>
  );
} 