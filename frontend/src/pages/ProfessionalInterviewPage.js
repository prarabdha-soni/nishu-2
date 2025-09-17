import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sttService } from '../services/sttService';
import styled from 'styled-components';
import { toast } from 'react-hot-toast';
import { 
  Phone,
  Settings,
  AlertTriangle,
  Bot,
  MessageCircle,
  Volume2,
  VolumeX,
  Square,
  Mic,
  MicOff,
  Video,
  VideoOff,
  CheckCircle,
  Monitor,
  Calendar,
  Clock,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

const API_BASE = 'https://nishu-2.onrender.com';

const InterviewContainer = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  display: flex;
  position: relative;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

const LeftSidebar = styled.div`
  width: 320px;
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
  position: relative;

  @media (max-width: 1024px) {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e2e8f0;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const SidebarHeader = styled.div`
  margin-bottom: 2rem;
`;

const AppTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 1rem;
`;

const ProgressSection = styled.div`
  margin-bottom: 2rem;
`;

const ProgressTitle = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 0.75rem;
`;

const ProgressText = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.75rem;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.75rem;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  width: 67%;
  border-radius: 4px;
`;

const StepsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const StepItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  background: ${props => props.active ? 'rgba(102, 126, 234, 0.1)' : 'transparent'};
  border: ${props => props.active ? '1px solid rgba(102, 126, 234, 0.2)' : '1px solid transparent'};
`;

const StepIcon = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.completed ? '#667eea' : props.active ? '#667eea' : '#9ca3af'};
`;

const StepText = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.active ? '#667eea' : '#4a5568'};
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  background: #ffffff;
  margin: 1rem;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  @media (max-width: 1024px) {
    margin: 0.5rem;
    padding: 1.5rem;
  }

  @media (max-width: 768px) {
    margin: 0.25rem;
    padding: 1rem;
    border-radius: 12px;
  }
`;

const RightSidebar = styled.div`
  width: 360px;
  background: #ffffff;
  border-left: 1px solid #e2e8f0;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.05);

  @media (max-width: 1024px) {
    width: 100%;
    border-left: none;
    border-top: 1px solid #e2e8f0;
    padding: 1.5rem;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const MainVideoArea = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;


const SidebarTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 2rem;
  letter-spacing: -0.025em;
`;

const Checklist = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 2.5rem;
`;

const ChecklistItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #4a5568;
  font-size: 0.875rem;
  padding: 0.75rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    background: #f8fafc;
  }
`;

const ChecklistIcon = styled.div`
  width: 20px;
  height: 20px;
  color: #9ca3af;
  flex-shrink: 0;
`;

const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2.5rem;
`;

const PrimaryButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1.25rem 1.5rem;
  border-radius: 16px;
  font-weight: 600;
  font-size: 1.125rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.2);
  
  &:hover {
    background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }
`;

const SecondaryButton = styled.button`
  background: #ffffff;
  color: #4a5568;
  border: 1px solid #e2e8f0;
  padding: 0.875rem 1.5rem;
  border-radius: 12px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #f8fafc;
    border-color: #cbd5e0;
    transform: translateY(-1px);
  }
`;

const Disclaimer = styled.p`
  font-size: 0.75rem;
  color: #9ca3af;
  line-height: 1.4;
  margin-top: auto;
`;

const NextButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  min-width: 120px;
  height: 56px;
  border-radius: 28px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
  font-weight: 600;
  font-size: 0.875rem;
  padding: 0 1.5rem;
  
  &:hover {
    background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%);
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
  }
`;

const PageTitle = styled.h1`
  font-size: 2.25rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5rem;
  letter-spacing: -0.025em;
`;

const InterviewPrompt = styled.p`
  font-size: 1.125rem;
  color: #6b7280;
  margin-bottom: 2.5rem;
  line-height: 1.6;
  font-weight: 400;
`;

const VideoSection = styled.div`
  background: #000000;
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  position: relative;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const MicrophoneSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: white;
  text-align: center;
`;

const MicrophoneIcon = styled.div`
  width: 60px;
  height: 60px;
  color: #ffffff;
  margin-bottom: 0.5rem;
  opacity: 0.9;
`;

const MicrophoneText = styled.div`
  color: #ffffff;
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const MicrophoneDropdown = styled.select`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: white;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
  backdrop-filter: blur(10px);
  
  option {
    background: #1a202c;
    color: white;
  }
`;

const MicrophoneLink = styled.a`
  color: #60a5fa;
  font-size: 0.875rem;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    color: #93c5fd;
    text-decoration: underline;
  }
`;

const BackButton = styled.button`
  position: absolute;
  bottom: 1.5rem;
  left: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const CameraIcon = styled.div`
  width: 100px;
  height: 100px;
  color: #ffffff;
  margin-bottom: 1.5rem;
  opacity: 0.8;
`;

const CameraText = styled.div`
  color: #ffffff;
  text-align: center;
  margin-bottom: 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: -0.025em;
`;

const CameraSubtext = styled.div`
  color: #d1d5db;
  text-align: center;
  font-size: 1rem;
  margin-bottom: 2.5rem;
  line-height: 1.5;
`;

const CameraButton = styled.button`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: #ef4444;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3);
  
  &:hover {
    background: #dc2626;
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
  }
`;

const DeviceControls = styled.div`
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
`;

const DeviceItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  padding: 1rem;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #cbd5e0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const DeviceIcon = styled.div`
  width: 24px;
  height: 24px;
  color: #6b7280;
`;

const DeviceText = styled.span`
  font-size: 0.875rem;
  color: #374151;
  font-weight: 600;
  text-align: center;
`;

const DeviceLink = styled.a`
  color: #667eea;
  font-size: 0.875rem;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  
  &:hover {
    color: #5b21b6;
    text-decoration: underline;
  }
`;

const AIBotPlaceholder = styled.div`
  width: 420px;
  height: 420px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);

  @media (max-width: 768px) {
    width: 280px;
    height: 280px;
  }

  @media (max-width: 480px) {
    width: 240px;
    height: 240px;
  }
  
  &::before {
    content: '';
    position: absolute;
    width: 85%;
    height: 85%;
    border-radius: 50%;
    background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%);
    opacity: 0.9;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

const IntroVideo = styled.video`
  width: 100%;
  height: 100%;
  border-radius: 16px;
  object-fit: cover;
  display: block;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  z-index: 10;
  position: relative;
`;

const IntroFrame = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.35);
  border-radius: 24px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.35);
`;

const BotIcon = styled(Bot)`
  width: 120px;
  height: 120px;
  color: white;
  z-index: 1;
  position: relative;
`;

const RippleContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const Ripple = styled.div`
  position: absolute;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  animation: ripple 2s infinite;
  opacity: 0;

  &:nth-child(1) { animation-delay: 0s; }
  &:nth-child(2) { animation-delay: 0.5s; }
  &:nth-child(3) { animation-delay: 1s; }

  @keyframes ripple {
    0% {
      width: 0;
      height: 0;
      opacity: 0.6;
    }
    100% {
      width: 100%;
      height: 100%;
      opacity: 0;
    }
  }
`;

const ModelDetail = styled.div`
  position: absolute;
  bottom: -50px;
  left: 50%;
  transform: translateX(-50%);
  color: #cbd5e0;
  font-size: 0.85rem;
  text-align: center;
  font-weight: 500;
  background: rgba(0, 0, 0, 0.6);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  letter-spacing: 0.05em;
  text-transform: uppercase;
`;

const UserVideoContainer = styled.div`
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  width: 200px;
  height: 150px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  border: 3px solid #4299e1;
`;

const UserVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const UserName = styled.div`
  position: absolute;
  bottom: -30px;
  left: 0;
  right: 0;
  text-align: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
`;

const VideoControls = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
`;

const ControlButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const BottomControlBar = styled.div`
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.5rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
  box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
  }
`;

const TimerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1rem;
  font-weight: 600;
  color: #e2e8f0;
  letter-spacing: 0.025em;
`;

const ControlButtons = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const MainControlButton = styled.button`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  
  ${props => {
    switch (props.type) {
      case 'settings':
        return `
          background: rgba(255, 255, 255, 0.15);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
        `;
      case 'end':
        return `
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
        `;
      case 'alert':
        return `
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
        `;
      default:
        return `
          background: rgba(255, 255, 255, 0.15);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
        `;
    }
  }}
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

const ChatContainer = styled.div`
  position: absolute;
  top: 2rem;
  left: 2rem;
  width: 380px;
  max-height: 450px;
  background: rgba(0, 0, 0, 0.85);
  border-radius: 16px;
  padding: 1.5rem;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    position: relative;
    top: auto;
    left: auto;
    width: 100%;
    max-height: 300px;
    margin-bottom: 1rem;
    padding: 1rem;
  }
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
`;

const ChatMessage = styled.div`
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 12px;
  color: white;
  backdrop-filter: blur(10px);
  
  ${props => props.isAI ? `
    background: rgba(102, 126, 234, 0.2);
    border: 1px solid rgba(102, 126, 234, 0.3);
    border-left: 4px solid #667eea;
  ` : `
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-left: 4px solid #10b981;
  `}
`;

const MessageText = styled.div`
  font-size: 0.9rem;
  line-height: 1.5;
  color: #e2e8f0;
`;

const MessageSender = styled.div`
  font-size: 0.75rem;
  opacity: 0.8;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #cbd5e0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;


const TextInputContainer = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 2rem;
  width: 380px;
  background: rgba(0, 0, 0, 0.85);
  border-radius: 16px;
  padding: 1.5rem;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    position: relative;
    bottom: auto;
    left: auto;
    width: 100%;
    margin-top: 1rem;
    padding: 1rem;
  }
  display: flex;
  gap: 0.75rem;
`;

const TextInput = styled.input`
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 1rem;
  color: white;
  font-size: 0.9rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  &:focus {
    outline: none;
    border-color: #667eea;
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;


const VoiceSettingsPanel = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(0, 0, 0, 0.9);
  border-radius: 12px;
  padding: 1rem;
  backdrop-filter: blur(10px);
  color: white;
  min-width: 250px;
  z-index: 1000;
`;

const SettingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const SettingLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
`;

const SettingSlider = styled.input`
  width: 100px;
  margin-left: 1rem;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.2rem;
`;


const SendButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  padding: 1rem 1.25rem;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  
  &:hover {
    background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
`;


const StartButton = styled.button`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1.25rem 2.5rem;
  border-radius: 16px;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 
    0 15px 35px rgba(102, 126, 234, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  letter-spacing: 0.025em;
  
  &:hover {
    transform: translate(-50%, -50%) scale(1.05);
    box-shadow: 
      0 20px 40px rgba(102, 126, 234, 0.5),
      0 0 0 1px rgba(255, 255, 255, 0.2);
    background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%);
  }
  
  &:active {
    transform: translate(-50%, -50%) scale(0.98);
  }
`;

const CaptionOverlay = styled.div`
  position: absolute;
  bottom: 180px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0,0,0,0.6);
  color: #fff;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.9rem;
  max-width: 80%;
  pointer-events: none;
`;

const ProfessionalInterviewPage = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  
  const [interviewState, setInterviewState] = useState('ready'); // ready, active, completed
  const [sessionData, setSessionData] = useState(null);
  const pendingTranscriptsRef = useRef([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [userResponse, setUserResponse] = useState('');
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [voiceOnly, setVoiceOnly] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState({ rate: 180, volume: 0.9 });
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [liveCaption, setLiveCaption] = useState('');
  const [sttActive, setSttActive] = useState(false);
  const introVideoRef = useRef(null);
  const [introSrc, setIntroSrc] = useState('/avatar.mp4');
  const [introPlaying, setIntroPlaying] = useState(false);
  
  const streamRef = useRef(null);
  const videoRef = useRef(null);
  const recordingIntervalRef = useRef(null);

  // STT bindings
  useEffect(() => {
    sttService.setCallbacks({
      onResult: ({ transcript, isFinal }) => {
        if (!isFinal) {
          setLiveCaption(transcript);
          setUserResponse(transcript);
          return;
        }
        setLiveCaption('');
        if (!sessionData?.session_id) {
          pendingTranscriptsRef.current.push(transcript);
        } else {
          handleUserResponse(transcript);
        }
        setUserResponse('');
      },
      onError: (e) => {
        console.error('STT error', e);
        // Only show error for non-permission issues
        if (e.error !== 'not-allowed' && e.error !== 'permission-denied') {
          toast.error('Speech recognition error. Please allow microphone and try Chrome.');
        }
        setSttActive(false);
      }
    });
  }, []);

  // When returning to ready state, bust cache and try to autoplay the intro video
  useEffect(() => {
    if (interviewState === 'ready') {
      const qs = `?_=${Date.now()}`;
      setIntroSrc(`/avatar.mp4${qs}`);
      setTimeout(() => {
        try { introVideoRef.current && introVideoRef.current.play(); } catch (_) {}
      }, 50);
    }
  }, [interviewState]);

  // Auto-start interview when component mounts
  useEffect(() => {
    if (interviewState === 'ready') {
      startInterview();
    }
  }, []);

  const beginInterviewCore = async () => {
    try {
      // Move to interview UI regardless of device access
      setInterviewState('active');

      // Try to get camera/mic, but continue if denied or unavailable
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
        }
      } catch (mediaErr) {
        console.warn('Media devices unavailable or permission denied:', mediaErr);
        toast("Camera/microphone unavailable. Continuing with voice-only or chat.");
      }

      // Start STT listening
      if (sttService.available) {
        sttService.start();
      } else {
        console.warn('Web Speech API not available');
        toast.error('Speech recognition not supported in this browser.');
      }
      
      // Immediately greet the user with a spoken prompt
      const defaultWelcome = "Hi, tell me about yourself.";
      setChatMessages(prev => [...prev, {
        type: 'ai',
        content: defaultWelcome,
        sender: 'Nishu AI'
      }]);
      speakText(defaultWelcome);

      // Start interview session
      const response = await fetch(API_BASE + '/api/v1/interviews/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interview_type: 'SWE Interview',
          candidate_name: 'Prarabdha Soni'
        })
      });
      
              if (response.ok) {
          const data = await response.json();
          setSessionData(data);

          // Flush any queued transcripts
          if (pendingTranscriptsRef.current.length) {
            const toSend = [...pendingTranscriptsRef.current];
            pendingTranscriptsRef.current = [];
            toSend.forEach(t => handleUserResponse(t, data.session_id));
          }
          
          // Start timer
          recordingIntervalRef.current = setInterval(() => {
            setRecordingDuration(prev => prev + 1);
          }, 1000);
        
        // AI bot starts asking first question
        setTimeout(() => {
          askFirstQuestion();
        }, 2000);
        
        toast.success('Interview started! AI bot will begin asking questions.');
      } else {
        throw new Error('Failed to start interview');
      }
    } catch (error) {
      console.error('Error starting interview:', error);
      toast.error('Failed to start interview. Please retry.');
    }
  };

  const startInterview = async () => {
    try {
      // Kick off intro video once user clicks start; play once then begin interview core
      setIntroPlaying(true);
      const qs = `?_=${Date.now()}`;
      setIntroSrc(`/avatar.mp4${qs}`);
      setTimeout(() => {
        const vid = introVideoRef.current;
        if (vid) {
          try {
            vid.loop = false;
            vid.currentTime = 0;
            // Unmute for intro audio; user gesture has occurred
            vid.muted = false;
            const playPromise = vid.play();
            if (playPromise && typeof playPromise.then === 'function') {
              playPromise.catch(() => {/* ignore */});
            }
            vid.onended = () => {
              setIntroPlaying(false);
              beginInterviewCore();
            };
          } catch (_) {
            beginInterviewCore();
          }
        } else {
          beginInterviewCore();
        }
      }, 50);
    } catch (_) {
      beginInterviewCore();
    }
  };

  const askFirstQuestion = async () => {
    try {
      const response = await fetch(API_BASE + '/api/v1/interviews/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionData?.session_id || 'demo_session',
          message: 'Hello! I am Nishu, your AI interview assistant. Let\'s begin with your first question.'
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Add welcome message
        setChatMessages(prev => [...prev, {
          type: 'ai',
          content: data.response || 'Welcome to your interview! Let\'s start with a technical question.',
          sender: 'Nishu AI'
        }]);
        
        // Speak the welcome message
        if (data.response) {
          speakText(data.response);
        }
        
        if (data.next_question) {
          setCurrentQuestion({ id: 'first', text: data.next_question });
          setChatMessages(prev => [...prev, {
            type: 'ai',
            content: data.next_question,
            sender: 'Nishu AI'
          }]);
          
          // Speak the next question
          speakText(data.next_question);
        }
      }
    } catch (error) {
      console.error('Error getting first question:', error);
    }
  };

  const handleUserResponse = async (response, forcedSessionId = null) => {
    if (!response.trim()) return;
    
    try {
      // Add user message to chat
      setChatMessages(prev => [...prev, {
        type: 'user',
        content: response,
        sender: 'You'
      }]);
      
      // Send response to AI
      const apiResponse = await fetch(API_BASE + '/api/v1/interviews/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: forcedSessionId || sessionData?.session_id, 
          message: response
        })
      });
      
      if (apiResponse.ok) {
        const data = await apiResponse.json();
        
        // Add AI response to chat
        setChatMessages(prev => [...prev, {
          type: 'ai',
          content: data.response || 'Thank you for your answer.',
          sender: 'Nishu AI'
        }]);
        
        // Speak the AI response (only if not already speaking)
        if (data.response && !isSpeaking) {
          speakText(data.response);
        }
        
        if (data.next_question) {
          setCurrentQuestion({ id: 'follow-up', text: data.next_question });
          setChatMessages(prev => [...prev, {
            type: 'ai',
            content: data.next_question,
            sender: 'Nishu AI'
          }]);
        } else {
          // Interview completed
          setInterviewState('completed');
          clearInterval(recordingIntervalRef.current);
          navigate(`/results/${sessionData?.session_id || 'demo_session'}`);
        }
      }
    } catch (error) {
      console.error('Error sending response:', error);
      toast.error('Failed to send response. Please try again.');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };


  const speakText = async (text) => {
    if (!ttsEnabled || isSpeaking) return;
    const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    if (!synth) {
      console.warn('SpeechSynthesis API not available');
      toast.error('Text-to-speech not supported in this browser.');
      return;
    }

    setIsSpeaking(true);

    // Mute mic while TTS plays to prevent feedback/echo
    const prevMuted = isMuted;
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(t => t.enabled = false);
    }
    setIsMuted(true);

    try {
      if (sttService.isListening) sttService.stop();

      const utterance = new SpeechSynthesisUtterance(text);
      // Map rate from words-per-minute style to speechSynthesis range (0.1 - 10)
      // Our voiceSettings.rate defaults to ~180; normalize around 1.0 baseline
      const normalizedRate = Math.min(2, Math.max(0.5, (voiceSettings.rate || 180) / 180));
      utterance.rate = normalizedRate;
      utterance.volume = Math.min(1, Math.max(0, voiceSettings.volume ?? 0.9));
      utterance.onend = () => {
        if (streamRef.current) {
          streamRef.current.getAudioTracks().forEach(t => t.enabled = !prevMuted);
        }
        setIsMuted(prevMuted);
        if (sttService.available) sttService.start();
        setIsSpeaking(false);
      };
      utterance.onerror = (e) => {
        console.error('Speech synthesis error:', e);
        if (streamRef.current) {
          streamRef.current.getAudioTracks().forEach(t => t.enabled = !prevMuted);
        }
        setIsMuted(prevMuted);
        if (sttService.available) sttService.start();
        setIsSpeaking(false);
        toast.error('Failed to speak AI response.');
      };

      synth.cancel();
      synth.speak(utterance);
    } catch (error) {
      console.error('Error speaking text:', error);
      if (streamRef.current) {
        streamRef.current.getAudioTracks().forEach(t => t.enabled = !prevMuted);
      }
      setIsMuted(prevMuted);
      if (sttService.available) sttService.start();
      setIsSpeaking(false);
      toast.error('Failed to speak AI response.');
    }
  };

  const toggleTTS = () => {
    const next = !ttsEnabled;
    setTtsEnabled(next);
    if (!next) {
      // Turning OFF TTS - stop any ongoing speech
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
      if (sttService.available && !sttService.isListening) sttService.start();
    }
  };


  const updateVoiceSettings = async (newSettings) => {
    try {
      const response = await fetch(API_BASE + '/api/v1/tts/voice/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSettings)
      });
      
      if (response.ok) {
        setVoiceSettings(newSettings);
        console.log('Voice settings updated:', newSettings);
      }
    } catch (error) {
      console.error('Error updating voice settings:', error);
    }
  };

  const handleRateChange = (rate) => {
    const newSettings = { ...voiceSettings, rate: parseInt(rate) };
    updateVoiceSettings(newSettings);
  };

  const handleVolumeChange = (volume) => {
    const newSettings = { ...voiceSettings, volume: parseFloat(volume) };
    updateVoiceSettings(newSettings);
  };

  const stopTTS = async () => {
    try {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
      if (sttService.available && !sttService.isListening) sttService.start();
    } catch (error) {
      console.error('Error stopping TTS:', error);
    }
  };

  const endInterview = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      try { videoRef.current.srcObject = null; } catch (_) {}
    }
    if (sttService.isListening) sttService.stop();
    clearInterval(recordingIntervalRef.current);
    setInterviewState('completed');
    navigate('/dashboard');
  };

  const startSTT = () => {
    if (sttService.available && !sttService.isListening) {
      const ok = sttService.start();
      if (ok) setSttActive(true);
    }
  };
  const stopSTT = () => {
    if (sttService.isListening) {
      sttService.stop();
      setSttActive(false);
      setLiveCaption('');
    }
  };

  if (interviewState === 'ready') {
    return (
      <InterviewContainer>
        <LeftSidebar>
          <SidebarHeader>
            <AppTitle>jobX Interview Platform</AppTitle>
          </SidebarHeader>
          
          <ProgressSection>
            <ProgressTitle>Your Progress</ProgressTitle>
            <ProgressText>2 of 3 steps done</ProgressText>
            <ProgressBar>
              <ProgressFill />
            </ProgressBar>
            <ProgressText>67%</ProgressText>
          </ProgressSection>
          
          <StepsList>
            <StepItem>
              <StepIcon completed>
                <CheckCircle size={20} />
              </StepIcon>
              <StepText>Profile Setup</StepText>
            </StepItem>
            
            <StepItem active>
              <StepIcon active>
                <Monitor size={20} />
              </StepIcon>
              <StepText>SWE Interview</StepText>
            </StepItem>
            
            <StepItem>
              <StepIcon completed>
                <CheckCircle size={20} />
              </StepIcon>
              <StepText>Work Authorization</StepText>
            </StepItem>
          </StepsList>
        </LeftSidebar>
        
        <MainContent>
          <PageTitle>SWE Interview</PageTitle>
          <InterviewPrompt>Test out your general software engineering skills.</InterviewPrompt>
          
          <VideoSection>
            {introPlaying ? (
              <IntroVideo
                ref={introVideoRef}
                src={introSrc}
                muted={!introPlaying}
                playsInline
                preload="auto"
                poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='420' height='420'%3E%3Crect width='100%25' height='100%25' rx='210' ry='210' fill='%232b6cb0'/%3E%3C/svg%3E"
                onLoadedData={() => console.log('Intro video loaded')}
                onError={() => toast.error('Intro video failed to load. Ensure avatar.mp4 is in public/.')}
                onEnded={() => {
                  setIntroPlaying(false);
                  beginInterviewCore();
                }}
              >
                <source src={introSrc} type="video/mp4" />
              </IntroVideo>
            ) : (
              <MicrophoneSection>
                <MicrophoneIcon>
                  <Mic size={60} />
                </MicrophoneIcon>
                <MicrophoneText>Microphone</MicrophoneText>
                <MicrophoneDropdown>
                  <option>MacBook Air M</option>
                  <option>MacBook Air S</option>
                  <option>External Microphone</option>
                </MicrophoneDropdown>
                <MicrophoneLink href="#">Test your mic</MicrophoneLink>
              </MicrophoneSection>
            )}
            <BackButton>
              <ChevronLeft size={16} />
              Back
            </BackButton>
          </VideoSection>
          
          <DeviceControls>
            <DeviceItem>
              <DeviceIcon>
                <Mic size={24} />
              </DeviceIcon>
              <DeviceText>Microphone</DeviceText>
              <DeviceLink href="#">Test your mic</DeviceLink>
            </DeviceItem>
            
            <DeviceItem>
              <DeviceIcon>
                <Volume2 size={24} />
              </DeviceIcon>
              <DeviceText>Speakers</DeviceText>
              <DeviceLink href="#">Play test sound</DeviceLink>
            </DeviceItem>
            
            <DeviceItem>
              <DeviceIcon>
                <Video size={24} />
              </DeviceIcon>
              <DeviceText>Camera</DeviceText>
              <DeviceLink href="#">Check permissions</DeviceLink>
            </DeviceItem>
          </DeviceControls>
        </MainContent>
        
        <RightSidebar>
          <SidebarTitle>Get ready for your AI interview</SidebarTitle>
          
          <Checklist>
            <ChecklistItem>
              <ChecklistIcon>
                <Calendar size={20} />
              </ChecklistIcon>
              Start now or come back later.
            </ChecklistItem>
            
            <ChecklistItem>
              <ChecklistIcon>
                <Clock size={20} />
              </ChecklistIcon>
              Expect to spend 27 minutes.
            </ChecklistItem>
            
            <ChecklistItem>
              <ChecklistIcon>
                <Settings size={20} />
              </ChecklistIcon>
              Check your device settings.
            </ChecklistItem>
            
            <ChecklistItem>
              <ChecklistIcon>
                <VolumeX size={20} />
              </ChecklistIcon>
              Find a quiet place with stable internet.
            </ChecklistItem>
          </Checklist>
          
          <ActionButtons>
            {introPlaying ? (
              <PrimaryButton onClick={() => { setIntroPlaying(false); beginInterviewCore(); }}>
                Skip Intro
              </PrimaryButton>
            ) : (
              <PrimaryButton onClick={startInterview}>
                Start Interview
              </PrimaryButton>
            )}
            <SecondaryButton>FAQs</SecondaryButton>
            <SecondaryButton>I'm having issues</SecondaryButton>
          </ActionButtons>
          
          <Disclaimer>
            jobX uses generative AI to conduct the AI interview. Your responses are used only to assess your candidacy and are never used to train AI models.
          </Disclaimer>
        </RightSidebar>
        
        <NextButton onClick={startInterview}>
          Next
          <ChevronRight size={20} />
        </NextButton>
      </InterviewContainer>
    );
  }

  return (
    <InterviewContainer>
      <MainVideoArea>
        {/* AI Bot Visual */}
        <AIBotPlaceholder>
          <BotIcon />
          <RippleContainer>
            <Ripple />
            <Ripple />
            <Ripple />
          </RippleContainer>
          <ModelDetail>model detail jobx-vSTS-0.1</ModelDetail>
        </AIBotPlaceholder>
        
        {/* User Video */}
        <UserVideoContainer>
          <UserVideo
            ref={videoRef}
            autoPlay
            muted={isMuted}
            playsInline
          />
          <UserName>Prarabdha Soni</UserName>
        </UserVideoContainer>
        
        {/* Video Controls */}
        <VideoControls>
          <ControlButton onClick={() => setIsMuted(!isMuted)}>
            {isMuted ? <MicOff /> : <Mic />}
          </ControlButton>
          <ControlButton onClick={() => (sttActive ? stopSTT() : startSTT())} title={sttActive ? 'Stop Listening' : 'Start Listening'}>
            {sttActive ? <MicOff /> : <Mic />}
          </ControlButton>
          <ControlButton onClick={() => setIsVideoOff(!isVideoOff)}>
            {isVideoOff ? <VideoOff /> : <Video />}
          </ControlButton>
          
          <ControlButton onClick={toggleTTS} title={ttsEnabled ? 'Disable TTS' : 'Enable TTS'}>
            {ttsEnabled ? <Volume2 /> : <VolumeX />}
          </ControlButton>
          {isSpeaking && (
            <ControlButton onClick={stopTTS} title="Stop Speaking">
              <Square />
            </ControlButton>
          )}

        </VideoControls>
        
        {liveCaption && (
          <CaptionOverlay>{liveCaption}</CaptionOverlay>
        )}

        {/* Voice Settings Panel */}
        {showVoiceSettings && (
          <VoiceSettingsPanel>
            <CloseButton onClick={() => setShowVoiceSettings(false)}>×</CloseButton>
            <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem' }}>Voice Settings</h4>
            
            <SettingRow>
              <SettingLabel>Speech Rate</SettingLabel>
              <SettingSlider
                type="range"
                min="120"
                max="250"
                value={voiceSettings.rate}
                onChange={(e) => handleRateChange(e.target.value)}
              />
              <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem' }}>{voiceSettings.rate}</span>
            </SettingRow>
            
            <SettingRow>
              <SettingLabel>Volume</SettingLabel>
              <SettingSlider
                type="range"
                min="0.1"
                max="1.0"
                step="0.1"
                value={voiceSettings.volume}
                onChange={(e) => handleVolumeChange(e.target.value)}
              />
              <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem' }}>{Math.round(voiceSettings.volume * 100)}%</span>
            </SettingRow>
          </VoiceSettingsPanel>
        )}

        {/* Chat Messages (hidden in voice-only mode) */}
        {!voiceOnly && (
          <>
            <ChatContainer>
              {chatMessages.map((message, index) => (
                <ChatMessage key={index} isAI={message.type === 'ai'}>
                  <MessageSender>{message.sender}</MessageSender>
                  <MessageText>{message.content}</MessageText>
                </ChatMessage>
              ))}
            </ChatContainer>
            
            {/* Text Input for Responses */}
            <TextInputContainer>
              <TextInput
                type="text"
                placeholder="Type your answer here..."
                value={userResponse}
                onChange={(e) => setUserResponse(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && userResponse.trim()) {
                    handleUserResponse(userResponse);
                    setUserResponse('');
                  }
                }}
              />
              <SendButton
                onClick={() => {
                  if (userResponse.trim()) {
                    handleUserResponse(userResponse);
                    setUserResponse('');
                  }
                }}
              >
                <MessageCircle />
              </SendButton>
            </TextInputContainer>
          </>
        )}

      </MainVideoArea>
      
      {/* Bottom Control Bar */}
      <BottomControlBar>
        <TimerInfo>
          {formatTime(recordingDuration)} / 27:00 | SWE Interview
        </TimerInfo>
        
        <ControlButtons>
          <MainControlButton type="settings">
            <Settings />
          </MainControlButton>
          <MainControlButton type="end" onClick={endInterview}>
            <Phone />
          </MainControlButton>
          <MainControlButton type="alert">
            <AlertTriangle />
          </MainControlButton>
        </ControlButtons>
      </BottomControlBar>
    </InterviewContainer>
  );
};

export default ProfessionalInterviewPage;
