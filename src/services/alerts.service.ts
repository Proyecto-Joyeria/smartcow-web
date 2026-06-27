import { apiClient } from './api.client';
import type { Alert, AlertFiltersParams } from '@/types/alert.types';

interface ApiEnvelope<T> { data: T; }

export const alertsService = {
  getAll: (params?: AlertFiltersParams): Promise<Alert[]> =>
    apiClient
      .get<ApiEnvelope<Alert[]>>('/alerts', { params })
      .then(r => r.data.data),

  getById: (id: string): Promise<Alert> =>
    apiClient
      .get<ApiEnvelope<Alert>>(`/alerts/${id}`)
      .then(r => r.data.data),

  acknowledge: (id: string): Promise<Alert> =>
    apiClient
      .patch<ApiEnvelope<Alert>>(`/alerts/${id}/acknowledge`)
      .then(r => r.data.data),

  assign: (id: string, userId: string): Promise<Alert> =>
    apiClient
      .patch<ApiEnvelope<Alert>>(`/alerts/${id}/assign`, { userId })
      .then(r => r.data.data),

  resolve: (id: string): Promise<Alert> =>
    apiClient
      .patch<ApiEnvelope<Alert>>(`/alerts/${id}/resolve`)
      .then(r => r.data.data),
};
