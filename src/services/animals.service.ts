import { apiClient } from './api.client';
import type {
  AnimalSummary,
  AnimalDetail,
  AnimalVitals,
  CreateAnimalDto,
  HealthStatus,
} from '@/types/animal.types';

interface ApiEnvelope<T> { data: T; }

export interface GetAnimalsParams {
  search?: string;
  status?: HealthStatus;
}

export interface ImportError {
  row:     number;
  field:   string;
  message: string;
}

export interface ImportResult {
  created: number;
  errors:  ImportError[];
}

export const animalsService = {
  getAll: (params?: GetAnimalsParams): Promise<AnimalSummary[]> =>
    apiClient
      .get<ApiEnvelope<AnimalSummary[]>>('/animals', { params })
      .then(r => r.data.data),

  getById: (id: string): Promise<AnimalDetail> =>
    apiClient
      .get<ApiEnvelope<AnimalDetail>>(`/animals/${id}`)
      .then(r => r.data.data),

  getVitals: (id: string): Promise<AnimalVitals> =>
    apiClient
      .get<ApiEnvelope<AnimalVitals>>(`/animals/${id}/vitals`)
      .then(r => r.data.data),

  create: (data: CreateAnimalDto): Promise<AnimalDetail> =>
    apiClient
      .post<ApiEnvelope<AnimalDetail>>('/animals', data)
      .then(r => r.data.data),

  update: (id: string, data: Partial<CreateAnimalDto>): Promise<AnimalDetail> =>
    apiClient
      .patch<ApiEnvelope<AnimalDetail>>(`/animals/${id}`, data)
      .then(r => r.data.data),

  remove: (id: string): Promise<void> =>
    apiClient.delete(`/animals/${id}`).then(() => undefined),

  uploadPhoto: (id: string, file: File): Promise<AnimalDetail> => {
    const form = new FormData();
    form.append('photo', file);
    return apiClient
      .patch<ApiEnvelope<AnimalDetail>>(`/animals/${id}/photo`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(r => r.data.data);
  },

  importCSV: (file: File, onProgress?: (pct: number) => void): Promise<ImportResult> => {
    const form = new FormData();
    form.append('file', file);
    return apiClient
      .post<ApiEnvelope<ImportResult>>('/animals/import', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          if (onProgress && e.total) {
            onProgress(Math.round((e.loaded / e.total) * 100));
          }
        },
      })
      .then(r => r.data.data);
  },
};
