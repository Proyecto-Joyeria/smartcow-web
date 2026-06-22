import axios from 'axios';

export const TOKEN_STORAGE_KEY = 'access_token';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const axiosError = error as any;
    const status = axiosError?.response?.status;
    const message = axiosError?.response?.data?.message || axiosError?.message;
    
    console.error('🔴 API Error:', {
      status,
      message,
      data: axiosError?.response?.data,
      config: axiosError?.config?.url,
    });
    
    if (status === 401) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      window.location.replace('/login');
    }
    return Promise.reject(error);
  },
);
