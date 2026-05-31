import { apiClient, TOKEN_STORAGE_KEY } from './api.client';
import type {
  LoginCredentials,
  LoginResponse,
  RegisterCredentials,
  TwoFASetupResponse,
  TwoFAVerifyRequest,
  User,
} from '@/types/auth.types';

export const authService = {
  register: async (credentials: RegisterCredentials): Promise<LoginResponse> => {
    const { data } = await apiClient.post<LoginResponse>('/auth/register', credentials);
    return data;
  },

  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const { data } = await apiClient.post<LoginResponse>('/auth/login', credentials);
    return data;
  },

  logout: (): void => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  },

  setup2FA: async (): Promise<TwoFASetupResponse> => {
    const { data } = await apiClient.post<TwoFASetupResponse>('/auth/2fa/setup');
    return data;
  },

  verify2FA: async (payload: TwoFAVerifyRequest): Promise<void> => {
    await apiClient.post('/auth/2fa/verify', payload);
  },

  getMe: async (): Promise<User> => {
    const { data } = await apiClient.get<User>('/auth/me');
    return data;
  },
};
