import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  background: #ffffff;
`;

const Hero = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 6rem 2rem 4rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (max-width: 1024px) {
    padding: 4rem 1.5rem 3rem;
  }
`;

const HeroText = styled.div``;

const Title = styled.h1`
  font-size: 3.5rem;
  line-height: 1.1;
  font-weight: 800;
  color: #1a202c;
  margin-bottom: 1.5rem;
  letter-spacing: -0.025em;
  max-width: 800px;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Lead = styled.p`
  color: #4a5568;
  font-size: 1.25rem;
  margin-bottom: 2.5rem;
  line-height: 1.6;
  max-width: 600px;
`;

const CTAGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const PrimaryButton = styled.button`
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.2);
  
  &:hover {
    background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }
`;

const GhostButton = styled.button`
  padding: 1rem 2rem;
  background: white;
  color: #1a202c;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #667eea;
    color: #667eea;
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
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
  font-size: 2.5rem;
  font-weight: 800;
  color: #1a202c;
  margin-bottom: 3rem;
  letter-spacing: -0.025em;
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
        <HeroText>
          <Title>Hire Global Talent, Pay Daily or Weekly. Simple.</Title>
          <Lead>
            jobX hires on your behalf. Global compliance, protected payouts, and faster onboarding.
          </Lead>
          <CTAGroup>
            <PrimaryButton onClick={goStart}>Start Hiring Today</PrimaryButton>
            <GhostButton onClick={goStart}>Start Interview</GhostButton>
          </CTAGroup>
        </HeroText>
      </Hero>

      <Section>
        <SectionTitle>How It Works</SectionTitle>
        <Cards>
          <Card>
            <strong>Tell us your requirements</strong>
            <p>Roles, skills, timezone, budget.</p>
          </Card>
          <Card>
            <strong>Get matched with market</strong>
            <p>Curated candidates from our network.</p>
          </Card>
          <Card>
            <strong>Pay daily / weekly</strong>
            <p>Reliable payments with compliance and protections.</p>
          </Card>
        </Cards>
      </Section>

      <Section>
        <SectionTitle>Our Process</SectionTitle>
        <ProcessGrid>
          <ProcessCard>
            <strong>Apply</strong>
          </ProcessCard>
          <ProcessCard>
            <strong>Get Matched</strong>
          </ProcessCard>
          <ProcessCard>
            <strong>Start Working</strong>
          </ProcessCard>
          <ProcessCard>
            <strong>Get Paid</strong>
          </ProcessCard>
        </ProcessGrid>
      </Section>

      <FooterCTA>
        <PrimaryButton onClick={goStart}>Start Earning Today</PrimaryButton>
      </FooterCTA>
    </Container>
  );
} 