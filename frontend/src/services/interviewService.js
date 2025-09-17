import axios from 'axios';

const API_BASE_URL = 'https://nishu-2.onrender.com/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const interviewService = {
  // Start interview session
  async startInterviewSession(interviewId, candidateData) {
    try {
      const response = await api.post(`/interviews/${interviewId}/start`, candidateData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to start interview session');
    }
  },

  // Get session status
  async getSessionStatus(sessionToken) {
    try {
      const response = await api.get(`/interviews/sessions/${sessionToken}/status`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to get session status');
    }
  },

  // Submit response
  async submitResponse(sessionToken, responseData) {
    try {
      const response = await api.post(`/interviews/sessions/${sessionToken}/respond`, responseData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to submit response');
    }
  },

  // Get next question
  async getNextQuestion(sessionToken, context = {}) {
    try {
      const response = await api.get(`/interviews/sessions/${sessionToken}/next-question`, {
        params: context
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to get next question');
    }
  },

  // Conclude interview
  async concludeInterview(sessionToken) {
    try {
      const response = await api.post(`/interviews/sessions/${sessionToken}/conclude`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to conclude interview');
    }
  },

  // Get interview results
  async getInterviewResults(interviewId) {
    try {
      const response = await api.get(`/interviews/${interviewId}/results`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to get interview results');
    }
  },

  // List interviews
  async listInterviews(skip = 0, limit = 100) {
    try {
      const response = await api.get('/interviews', {
        params: { skip, limit }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to list interviews');
    }
  },

  // Create interview
  async createInterview(interviewData) {
    try {
      const response = await api.post('/interviews/create', interviewData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to create interview');
    }
  }
};
