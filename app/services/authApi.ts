// app/services/authApi.ts
import { apiClient } from './api';
import type { LoginCredentials, User } from '~/types';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  userId: string;
  fullName: string;
  userType: string;
  expiresIn: number;
  message: string;
}

export interface TokenValidationResponse {
  valid: boolean;
  userId?: string;
  message: string;
}

export const authApi = {
  /**
   * Autenticar usuario
   */
  login: async (credentials: LoginCredentials) => {
    return apiClient.post<AuthResponse>('/auth/login', credentials);
  },

  /**
   * Cerrar sesión
   */
  logout: async () => {
    return apiClient.post('/auth/logout');
  },

  /**
   * Refrescar token de acceso
   */
  refreshToken: async (refreshToken: string) => {
    return apiClient.post<{ accessToken: string }>('/auth/refresh', {
      refreshToken
    });
  },

  /**
   * Validar token JWT
   */
  validateToken: async (token: string) => {
    return apiClient.post<TokenValidationResponse>('/auth/validate', {
      token
    });
  },

  /**
   * Health check del servicio de autenticación
   */
  healthCheck: async () => {
    return apiClient.get('/auth/health');
  }
};