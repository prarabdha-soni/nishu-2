import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { User, Video, Briefcase, Home, Menu, X } from 'lucide-react';

const HeaderContainer = styled.header`
  background: ${props => props.theme.colors.surface};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  position: relative;

  @media (max-width: 768px) {
    padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  }
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
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

const JobXLogo = styled.div`
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

const Navigation = styled.nav`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.lg};

  @media (max-width: 768px) {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: ${props => props.theme.colors.surface};
    border-top: 1px solid ${props => props.theme.colors.border};
    flex-direction: column;
    padding: ${props => props.theme.spacing.md};
    gap: ${props => props.theme.spacing.sm};
    transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(-100%)'};
    opacity: ${props => props.isOpen ? '1' : '0'};
    visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
    transition: all ${props => props.theme.transitions.normal};
    z-index: 1000;
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.textSecondary};
  background: ${props => props.active ? 'rgba(102, 126, 234, 0.1)' : 'transparent'};
  text-decoration: none;
  font-weight: 500;
  transition: all ${props => props.theme.transitions.normal};
  
  &:hover {
    background: ${props => props.active ? 'rgba(102, 126, 234, 0.15)' : 'rgba(0, 0, 0, 0.05)'};
    color: ${props => props.theme.colors.primary};
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    padding: ${props => props.theme.spacing.md};
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};

  @media (max-width: 768px) {
    gap: ${props => props.theme.spacing.sm};
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.textSecondary};

  @media (max-width: 768px) {
    span {
      display: none;
    }
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.sm};
  transition: all ${props => props.theme.transitions.normal};

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    color: ${props => props.theme.colors.primary};
  }

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

function Header() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  
  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/" onClick={closeMobileMenu}>
          <JobXLogo>J</JobXLogo>
          <LogoText>jobX</LogoText>
        </Logo>
        
        <Navigation isOpen={isMobileMenuOpen}>
          <NavLink to="/" active={location.pathname === '/'} onClick={closeMobileMenu}>
            <Home size={16} />
            Home
          </NavLink>
          <NavLink to="/jobs" active={location.pathname === '/jobs'} onClick={closeMobileMenu}>
            <Briefcase size={16} />
            Jobs
          </NavLink>
        </Navigation>
        
        <UserSection>
          <UserInfo>
            <User size={16} />
            <span>Candidate</span>
          </UserInfo>
          <MobileMenuButton onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </MobileMenuButton>
        </UserSection>
      </HeaderContent>
    </HeaderContainer>
  );
}

export default Header;
