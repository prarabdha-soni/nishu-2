import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { User, Video } from 'lucide-react';

const HeaderContainer = styled.header`
  background: ${props => props.theme.colors.surface};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.shadows.sm};
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};

  &:hover {
    color: ${props => props.theme.colors.primary};
    opacity: 0.8;
  }
`;

const NishuLogo = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  color: white;
  font-family: 'Arial', sans-serif;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
`;

const LogoText = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.textSecondary};
`;

function Header() {
  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/">
          <NishuLogo>N</NishuLogo>
          <LogoText>Nishu</LogoText>
        </Logo>
        
        <UserSection>
          <UserInfo>
            <User size={16} />
            <span>Candidate</span>
          </UserInfo>
        </UserSection>
      </HeaderContent>
    </HeaderContainer>
  );
}

export default Header;
