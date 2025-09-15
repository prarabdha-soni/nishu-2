import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  Calendar, 
  TrendingUp,
  Eye,
  Filter,
  Search,
  Download
} from 'lucide-react';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.lg};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
`;

const HeaderActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.background};
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const StatCard = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.md};
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  background: ${props => props.theme.colors.primary}20;
  border-radius: ${props => props.theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.primary};
`;

const StatTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const StatChange = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${props => props.theme.spacing.xl};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`;

const Card = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.md};
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const CardTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const SearchBar = styled.div`
  position: relative;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.md} ${props => props.theme.spacing.md} 2.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: ${props => props.theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.textSecondary};
  size: 20;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: ${props => props.theme.colors.background};
`;

const TableRow = styled.tr`
  border-bottom: 1px solid ${props => props.theme.colors.border};

  &:hover {
    background: ${props => props.theme.colors.background};
  }
`;

const TableHeaderCell = styled.th`
  padding: ${props => props.theme.spacing.md};
  text-align: left;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const TableCell = styled.td`
  padding: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.text};
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: 0.8rem;
  font-weight: 500;

  ${props => props.$status === 'completed' && `
    background: ${props.theme.colors.success}20;
    color: ${props.theme.colors.success};
  `}

  ${props => props.$status === 'in_progress' && `
    background: ${props.theme.colors.warning}20;
    color: ${props.theme.colors.warning};
  `}

  ${props => props.$status === 'scheduled' && `
    background: ${props.theme.colors.primary}20;
    color: ${props.theme.colors.primary};
  `}
`;

const ScoreBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: 0.8rem;
  font-weight: 600;

  ${props => props.$score >= 8 && `
    background: ${props.theme.colors.success}20;
    color: ${props.theme.colors.success};
  `}

  ${props => props.$score >= 6 && props.$score < 8 && `
    background: ${props.theme.colors.warning}20;
    color: ${props.theme.colors.warning};
  `}

  ${props => props.$score < 6 && `
    background: ${props.theme.colors.error}20;
    color: ${props.theme.colors.error};
  `}
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md};
  border-bottom: 1px solid ${props => props.theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const ActivityIcon = styled.div`
  width: 32px;
  height: 32px;
  background: ${props => props.theme.colors.primary}20;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.primary};
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityTitle = styled.div`
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const ActivityTime = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textSecondary};
`;

function DashboardPage() {
  const [interviews, setInterviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      // Mock data - would typically fetch from API
      const mockInterviews = [
        {
          id: 1,
          candidate_name: 'John Doe',
          position: 'Senior Python Developer',
          status: 'completed',
          score: 8.5,
          date: '2024-01-15',
          duration: '45 min'
        },
        {
          id: 2,
          candidate_name: 'Jane Smith',
          position: 'Frontend Developer',
          status: 'in_progress',
          score: null,
          date: '2024-01-15',
          duration: '30 min'
        },
        {
          id: 3,
          candidate_name: 'Mike Johnson',
          position: 'Full Stack Developer',
          status: 'scheduled',
          score: null,
          date: '2024-01-16',
          duration: '60 min'
        }
      ];
      
      setInterviews(mockInterviews);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredInterviews = interviews.filter(interview =>
    interview.candidate_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    interview.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalInterviews: 156,
    completedInterviews: 142,
    averageScore: 7.8,
    thisWeek: 12
  };

  const recentActivity = [
    {
      id: 1,
      title: 'Interview completed for John Doe',
      time: '2 hours ago',
      icon: <BarChart3 size={16} />
    },
    {
      id: 2,
      title: 'New interview scheduled for Mike Johnson',
      time: '4 hours ago',
      icon: <Calendar size={16} />
    },
    {
      id: 3,
      title: 'Interview started for Jane Smith',
      time: '6 hours ago',
      icon: <Users size={16} />
    }
  ];

  if (isLoading) {
    return (
      <DashboardContainer>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div>Loading dashboard...</div>
        </div>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <Header>
        <Title>Dashboard</Title>
        <HeaderActions>
          <ActionButton>
            <Filter size={16} />
            Filter
          </ActionButton>
          <ActionButton>
            <Download size={16} />
            Export
          </ActionButton>
        </HeaderActions>
      </Header>

      <StatsGrid>
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <StatHeader>
            <StatIcon>
              <BarChart3 size={24} />
            </StatIcon>
            <StatTitle>Total Interviews</StatTitle>
          </StatHeader>
          <StatValue>{stats.totalInterviews}</StatValue>
          <StatChange>
            <TrendingUp size={16} />
            +12% from last month
          </StatChange>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <StatHeader>
            <StatIcon>
              <Users size={24} />
            </StatIcon>
            <StatTitle>Completed</StatTitle>
          </StatHeader>
          <StatValue>{stats.completedInterviews}</StatValue>
          <StatChange>
            <TrendingUp size={16} />
            {Math.round((stats.completedInterviews / stats.totalInterviews) * 100)}% completion rate
          </StatChange>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <StatHeader>
            <StatIcon>
              <TrendingUp size={24} />
            </StatIcon>
            <StatTitle>Average Score</StatTitle>
          </StatHeader>
          <StatValue>{stats.averageScore}</StatValue>
          <StatChange>
            <TrendingUp size={16} />
            +0.3 from last month
          </StatChange>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <StatHeader>
            <StatIcon>
              <Calendar size={24} />
            </StatIcon>
            <StatTitle>This Week</StatTitle>
          </StatHeader>
          <StatValue>{stats.thisWeek}</StatValue>
          <StatChange>
            <TrendingUp size={16} />
            +3 from last week
          </StatChange>
        </StatCard>
      </StatsGrid>

      <ContentGrid>
        <MainContent>
          <Card
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <CardHeader>
              <CardTitle>Recent Interviews</CardTitle>
            </CardHeader>
            
            <SearchBar>
              <SearchIcon size={20} />
              <SearchInput
                type="text"
                placeholder="Search interviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchBar>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>Candidate</TableHeaderCell>
                  <TableHeaderCell>Position</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell>Score</TableHeaderCell>
                  <TableHeaderCell>Date</TableHeaderCell>
                  <TableHeaderCell>Duration</TableHeaderCell>
                  <TableHeaderCell>Actions</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <tbody>
                {filteredInterviews.map((interview) => (
                  <TableRow key={interview.id}>
                    <TableCell>{interview.candidate_name}</TableCell>
                    <TableCell>{interview.position}</TableCell>
                    <TableCell>
                      <StatusBadge $status={interview.status}>
                        {interview.status.replace('_', ' ')}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>
                      {interview.score ? (
                        <ScoreBadge $score={interview.score}>
                          {interview.score}/10
                        </ScoreBadge>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>{interview.date}</TableCell>
                    <TableCell>{interview.duration}</TableCell>
                    <TableCell>
                      <ActionButton>
                        <Eye size={16} />
                        View
                      </ActionButton>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </Card>
        </MainContent>

        <Sidebar>
          <Card
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            
            {recentActivity.map((activity) => (
              <ActivityItem key={activity.id}>
                <ActivityIcon>
                  {activity.icon}
                </ActivityIcon>
                <ActivityContent>
                  <ActivityTitle>{activity.title}</ActivityTitle>
                  <ActivityTime>{activity.time}</ActivityTime>
                </ActivityContent>
              </ActivityItem>
            ))}
          </Card>
        </Sidebar>
      </ContentGrid>
    </DashboardContainer>
  );
}

export default DashboardPage;
