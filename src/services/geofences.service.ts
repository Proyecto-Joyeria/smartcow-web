import { apiClient } from './api.client';
import type { Geofence, CreateGeofenceDto } from '@/types/geofence.types';

interface ApiEnvelope<T> { data: T; }

export const geofencesService = {
  getAll: (): Promise<Geofence[]> =>
    apiClient
      .get<ApiEnvelope<Geofence[]>>('/geofences')
      .then(r => r.data.data),

  getById: (id: string): Promise<Geofence> =>
    apiClient
      .get<ApiEnvelope<Geofence>>(`/geofences/${id}`)
      .then(r => r.data.data),

  create: (data: CreateGeofenceDto): Promise<Geofence> =>
    apiClient
      .post<ApiEnvelope<Geofence>>('/geofences', data)
      .then(r => r.data.data),

  update: (id: string, data: Partial<CreateGeofenceDto>): Promise<Geofence> =>
    apiClient
      .patch<ApiEnvelope<Geofence>>(`/geofences/${id}`, data)
      .then(r => r.data.data),

  toggle: (id: string, isActive: boolean): Promise<Geofence> =>
    apiClient
      .patch<ApiEnvelope<Geofence>>(`/geofences/${id}`, { isActive })
      .then(r => r.data.data),

  remove: (id: string): Promise<void> =>
    apiClient.delete(`/geofences/${id}`).then(() => undefined),
};
