import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('./api.client', () => ({
  TOKEN_STORAGE_KEY: 'access_token',
  apiClient: {
    post: vi.fn(),
    get:  vi.fn(),
  },
}));

import { authService } from './auth.service';
import { apiClient, TOKEN_STORAGE_KEY } from './api.client';

const mockUser = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'OPERATOR' as const,
  farmId: 'farm-1',
  twoFactorEnabled: false,
};

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

describe('authService.login', () => {
  it('retorna la respuesta del servidor al hacer login', async () => {
    const mockResponse = { accessToken: 'tok-123', user: mockUser };
    vi.mocked(apiClient.post).mockResolvedValueOnce({ data: mockResponse });

    const result = await authService.login({ email: 'test@example.com', password: 'password123' });

    expect(result).toEqual(mockResponse);
    expect(apiClient.post).toHaveBeenCalledWith('/auth/login', {
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('propaga el error en credenciales incorrectas', async () => {
    vi.mocked(apiClient.post).mockRejectedValueOnce({ response: { status: 401 } });

    await expect(
      authService.login({ email: 'bad@example.com', password: 'wrong' }),
    ).rejects.toBeDefined();
  });
});

describe('authService.logout', () => {
  it('elimina el token de localStorage', () => {
    localStorage.setItem(TOKEN_STORAGE_KEY, 'tok-123');
    authService.logout();
    expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull();
  });
});

describe('authService.getMe', () => {
  it('retorna el usuario autenticado desde la API', async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockUser });

    const result = await authService.getMe();

    expect(result).toEqual(mockUser);
    expect(apiClient.get).toHaveBeenCalledWith('/auth/me');
  });
});
