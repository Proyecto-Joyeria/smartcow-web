import { apiClient, TOKEN_STORAGE_KEY } from './api.client';
import type {
  LoginCredentials,
  LoginResponse,
  RegisterCredentials,
  TwoFASetupResponse,
  TwoFAVerifyRequest,
  User,
} from '@/types/auth.types';

// El backend envuelve toda respuesta exitosa en { data: <resultado> }.
// Este tipo lo modela para desenvolverlo de forma consistente.
interface ApiEnvelope<T> {
  data: T;
}

export const authService = {
  register: async (credentials: RegisterCredentials): Promise<LoginResponse> => {
    const { data } = await apiClient.post<ApiEnvelope<LoginResponse>>('/auth/register', credentials);
    return data.data;
  },

  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const { data } = await apiClient.post<ApiEnvelope<LoginResponse>>('/auth/login', credentials);
    return data.data;
  },

  logout: (): void => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  },

  setup2FA: async (): Promise<TwoFASetupResponse> => {
    const { data } = await apiClient.post<ApiEnvelope<TwoFASetupResponse>>('/auth/2fa/setup');
    return data.data;
  },

  verify2FA: async (payload: TwoFAVerifyRequest): Promise<void> => {
    await apiClient.post('/auth/2fa/verify', payload);
  },

  getMe: async (): Promise<User> => {
    const { data } = await apiClient.get<ApiEnvelope<User>>('/auth/me');
    return data.data;
  },
};
