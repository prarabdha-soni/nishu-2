import axios from 'axios';

const API_BASE_URL = 'https://nishu-2.onrender.com';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
}); 