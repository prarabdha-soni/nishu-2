import React from 'react';
import styled from 'styled-components';
import { 
  Briefcase,
  Calendar,
  Bell,
  Home,
  UserPlus,
  DollarSign,
  Star,
  Clock,
  Rocket
} from 'lucide-react';

const JobsContainer = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  display: flex;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const LeftSidebar = styled.div`
  width: 320px;
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
`;

const Logo = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.25rem;
  margin-bottom: 2rem;
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.active ? 'rgba(102, 126, 234, 0.1)' : 'transparent'};
  color: ${props => props.active ? '#667eea' : '#4a5568'};
  
  &:hover {
    background: ${props => props.active ? 'rgba(102, 126, 234, 0.15)' : 'rgba(0, 0, 0, 0.05)'};
  }
`;

const NavIcon = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NavText = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
`;

const BottomNav = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  margin-top: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
`;

const ProfileAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 2rem;
  background: #ffffff;
  margin: 1rem;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ComingSoonIcon = styled.div`
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
`;

const ComingSoonTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 1rem;
  letter-spacing: -0.025em;
  text-align: center;
`;

const ComingSoonSubtitle = styled.p`
  font-size: 1.25rem;
  color: #6b7280;
  margin-bottom: 2rem;
  text-align: center;
  line-height: 1.6;
  max-width: 500px;
`;

const ComingSoonDescription = styled.p`
  font-size: 1rem;
  color: #9ca3af;
  text-align: center;
  line-height: 1.6;
  max-width: 600px;
  margin-bottom: 3rem;
`;

const NotifyButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
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

const Header = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 1.5rem;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  background: #f8fafc;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    background: #ffffff;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  width: 20px;
  height: 20px;
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #ffffff;
  color: #4a5568;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #cbd5e0;
    background: #f8fafc;
  }
`;

const FilterButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
`;

const FilterBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: none;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#ffffff'};
  color: ${props => props.active ? '#ffffff' : '#4a5568'};
  border: 1px solid ${props => props.active ? 'transparent' : '#e2e8f0'};
  
  &:hover {
    background: ${props => props.active ? 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)' : '#f8fafc'};
  }
`;

const JobsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const JobCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: ${props => props.selected ? '2px solid #667eea' : '1px solid #e2e8f0'};
  
  &:hover {
    border-color: #cbd5e0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const JobHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const JobIcon = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
`;

const JobInfo = styled.div`
  flex: 1;
`;

const JobTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 0.5rem;
`;

const JobMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
`;

const JobTag = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => props.type === 'qualified' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(102, 126, 234, 0.1)'};
  color: ${props => props.type === 'qualified' ? '#10b981' : '#667eea'};
`;

const JobDate = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
`;

const JobDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const JobDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #4a5568;
`;

const JobDetailIcon = styled.div`
  width: 16px;
  height: 16px;
  color: #9ca3af;
`;

const JobDetailText = styled.span`
  font-weight: 500;
`;

const JobType = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => props.type === 'fulltime' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)'};
  color: ${props => props.type === 'fulltime' ? '#10b981' : '#3b82f6'};
`;

const FloatingButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%);
    transform: scale(1.1);
    box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
  }
`;

const JobsPage = () => {
  return (
    <JobsContainer>
      <LeftSidebar>
        <Logo>J</Logo>
        
        <NavItem active>
          <NavIcon>
            <Briefcase size={20} />
          </NavIcon>
          <NavText>Jobs</NavText>
        </NavItem>
        
        <NavItem>
          <NavIcon>
            <Home size={20} />
          </NavIcon>
          <NavText>Home</NavText>
        </NavItem>
        
        <NavItem>
          <NavIcon>
            <UserPlus size={20} />
          </NavIcon>
          <NavText>Referrals</NavText>
        </NavItem>
        
        <NavItem>
          <NavIcon>
            <DollarSign size={20} />
          </NavIcon>
          <NavText>Payments</NavText>
        </NavItem>
        
        <NavItem>
          <NavIcon>
            <Star size={20} />
          </NavIcon>
          <NavText>Profile</NavText>
        </NavItem>
        
        <BottomNav>
          <NavItem>
            <NavIcon>
              <Calendar size={20} />
            </NavIcon>
          </NavItem>
          
          <NavItem>
            <NavIcon>
              <Bell size={20} />
            </NavIcon>
          </NavItem>
          
          <ProfileSection>
            <ProfileAvatar>JD</ProfileAvatar>
          </ProfileSection>
        </BottomNav>
      </LeftSidebar>
      
      <MainContent>
        <ComingSoonIcon>
          <Rocket size={48} />
        </ComingSoonIcon>
        
        <ComingSoonTitle>Coming Soon</ComingSoonTitle>
        
        <ComingSoonSubtitle>
          We're building something amazing for job seekers
        </ComingSoonSubtitle>
        
        <ComingSoonDescription>
          Our job marketplace is currently under development. We're working hard to bring you the best opportunities and matching system. Stay tuned for updates!
        </ComingSoonDescription>
        
        <NotifyButton>
          Notify Me When Ready
        </NotifyButton>
      </MainContent>
    </JobsContainer>
  );
};

export default JobsPage;
