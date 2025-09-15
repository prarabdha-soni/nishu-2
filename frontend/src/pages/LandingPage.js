import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  background: #f8fafc;
`;

const Hero = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 1.5rem 2rem;
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 2rem;
  align-items: center;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    padding-top: 3rem;
  }
`;

const HeroText = styled.div``;

const Title = styled.h1`
  font-size: 3rem;
  line-height: 1.1;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 1rem;
`;

const Lead = styled.p`
  color: #475569;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
`;

const CTAGroup = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const PrimaryButton = styled.button`
  padding: 0.9rem 1.2rem;
  background: #2563eb;
  color: white;
  border-radius: 10px;
  font-weight: 600;
`;

const GhostButton = styled.button`
  padding: 0.9rem 1.2rem;
  background: white;
  color: #0f172a;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-weight: 600;
`;

const Cards = styled.section`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1.5rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 1.25rem;
`;

const Section = styled.section`
  max-width: 1200px;
  margin: 2rem auto 3rem;
  padding: 0 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 1rem;
`;

const ProcessGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const FooterCTA = styled.div`
  display: flex;
  justify-content: center;
  padding: 2rem 1.5rem 3rem;
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
            Nishu hires on your behalf. Global compliance, protected payouts, and faster onboarding.
          </Lead>
          <CTAGroup>
            <PrimaryButton onClick={goStart}>Start Hiring Today</PrimaryButton>
            <GhostButton onClick={goStart}>Start Interview</GhostButton>
          </CTAGroup>
        </HeroText>
        <div></div>
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
          <Card>
            <strong>Apply</strong>
          </Card>
          <Card>
            <strong>Get Matched</strong>
          </Card>
          <Card>
            <strong>Start Working</strong>
          </Card>
          <Card>
            <strong>Get Paid</strong>
          </Card>
        </ProcessGrid>
      </Section>

      <FooterCTA>
        <PrimaryButton onClick={goStart}>Start Earning Today</PrimaryButton>
      </FooterCTA>
    </Container>
  );
} 