import { apiClient } from './api.client';
import type {
  AnimalSummary,
  AnimalDetail,
  AnimalVitals,
  CreateAnimalDto,
  HealthStatus,
} from '@/types/animal.types';

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
    apiClient.get<AnimalSummary[]>('/animals', { params }).then(r => r.data),

  getById: (id: string): Promise<AnimalDetail> =>
    apiClient.get<AnimalDetail>(`/animals/${id}`).then(r => r.data),

  getVitals: (id: string): Promise<AnimalVitals> =>
    apiClient.get<AnimalVitals>(`/animals/${id}/vitals`).then(r => r.data),

  create: (data: CreateAnimalDto): Promise<AnimalDetail> =>
    apiClient.post<AnimalDetail>('/animals', data).then(r => r.data),

  update: (id: string, data: Partial<CreateAnimalDto>): Promise<AnimalDetail> =>
    apiClient.patch<AnimalDetail>(`/animals/${id}`, data).then(r => r.data),

  remove: (id: string): Promise<void> =>
    apiClient.delete(`/animals/${id}`).then(() => undefined),

  uploadPhoto: (id: string, file: File): Promise<AnimalDetail> => {
    const form = new FormData();
    form.append('photo', file);
    return apiClient
      .patch<AnimalDetail>(`/animals/${id}/photo`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(r => r.data);
  },

  importCSV: (file: File, onProgress?: (pct: number) => void): Promise<ImportResult> => {
    const form = new FormData();
    form.append('file', file);
    return apiClient
      .post<ImportResult>('/animals/import', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          if (onProgress && e.total) {
            onProgress(Math.round((e.loaded / e.total) * 100));
          }
        },
      })
      .then(r => r.data);
  },
};
