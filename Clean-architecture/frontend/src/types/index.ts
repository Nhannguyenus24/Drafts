export interface User {
  id: number;
  name: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  data: {
    token: string;
  };
  status: number;
}

export interface Conversation {
  id: number;
  name: string;
  userId: number;
  createdAt: string;
}

export interface Message {
  id: number;
  content: string;
  timestamp: string;
  isUser: boolean;
}

export interface ChatResponse {
  message: string;
  data: string;
  status: number;
}

export interface ConversationResponse {
  message: string;
  data: Message[];
  status: number;
}

export interface HistoryResponse {
  message: string;
  data: Conversation[];
  status: number;
}

export interface CreateConversationResponse {
  message: string;
  data: number;
  status: number;
} 