import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';

// Components
import Header from './components/Header';
import PreInterviewPage from './pages/PreInterviewPage';
import ProfessionalInterviewPage from './pages/ProfessionalInterviewPage';
import InterviewPage from './pages/InterviewPage';
import ResultsPage from './pages/ResultsPage';
import LandingPage from './pages/LandingPage';
import JobsPage from './pages/JobsPage';

// Professional Theme
const theme = {
  colors: {
    primary: '#667eea',
    primaryDark: '#5b21b6',
    secondary: '#764ba2',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 50%, #4a5568 100%)',
    surface: 'rgba(255, 255, 255, 0.95)',
    surfaceDark: 'rgba(0, 0, 0, 0.85)',
    text: '#1a202c',
    textSecondary: '#4a5568',
    textLight: '#e2e8f0',
    border: 'rgba(255, 255, 255, 0.1)',
    borderLight: '#e2e8f0',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    primaryHover: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
    success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 50%, #4a5568 100%)',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  borderRadius: {
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.25rem',
    xxl: '1.5rem',
  },
  shadows: {
    sm: '0 2px 4px rgba(0, 0, 0, 0.1)',
    md: '0 4px 12px rgba(0, 0, 0, 0.15)',
    lg: '0 10px 25px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 40px rgba(0, 0, 0, 0.1)',
    glow: '0 0 20px rgba(102, 126, 234, 0.3)',
  },
  transitions: {
    fast: '0.2s ease',
    normal: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '0.5s ease',
  },
};

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: ${props => props.theme.gradients.background};
    color: ${props => props.theme.colors.text};
    line-height: 1.6;
    min-height: 100vh;
  }

  code {
    font-family: 'JetBrains Mono', 'Fira Code', source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
    font-family: inherit;
  }

  input, textarea, select {
    outline: none;
    font-family: inherit;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.025em;
  }

  p {
    line-height: 1.6;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(102, 126, 234, 0.5);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(102, 126, 234, 0.7);
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.gradients.background};
`;

const MainContent = styled.main`
  flex: 1;
  padding: 0;
  position: relative;
`;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router>
        <AppContainer>
          <Header />
          <MainContent>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/pre-interview" element={<PreInterviewPage />} />
              <Route path="/interview/:sessionToken" element={<ProfessionalInterviewPage />} />
              <Route path="/interview-old/:sessionToken" element={<InterviewPage />} />
              <Route path="/results/:interviewId" element={<ResultsPage />} />
              <Route path="/jobs" element={<JobsPage />} />
            </Routes>
          </MainContent>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(0, 0, 0, 0.9)',
                color: '#fff',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                fontFamily: 'Inter, sans-serif',
                fontWeight: '500',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </AppContainer>
      </Router>
    </ThemeProvider>
  );
}

export default App;
