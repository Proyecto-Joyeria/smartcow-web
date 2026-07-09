import { apiClient } from './api.client';
import type { Prediction } from '@/types/analytics.types';

interface ApiEnvelope<T> { data: T; }

export const aiService = {
  getPrediction: (animalId: string): Promise<Prediction> =>
    apiClient
      .get<ApiEnvelope<Prediction>>(`/ai/predict/${animalId}`)
      .then(r => r.data.data),
};
