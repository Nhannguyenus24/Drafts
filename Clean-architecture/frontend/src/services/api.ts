import axios from 'axios';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ChatResponse,
  ConversationResponse,
  HistoryResponse,
  CreateConversationResponse
} from '../types';

const API_BASE_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
};

export const chatService = {
  createConversation: async (name: string): Promise<CreateConversationResponse> => {
    const response = await api.post(`/api/chat/create?name=${encodeURIComponent(name)}`);
    return response.data;
  },

  getHistory: async (): Promise<HistoryResponse> => {
    const response = await api.get('/api/chat/history');
    return response.data;
  },

  getConversation: async (conversationId: number): Promise<ConversationResponse> => {
    const response = await api.get(`/api/chat/getConversation/${conversationId}`);
    return response.data;
  },

  sendMessage: async (conversationId: number, prompt: string): Promise<ChatResponse> => {
    const response = await api.post(`/api/chat/getResponse/${conversationId}`, { prompt });
    return response.data;
  },
};

export default api; 