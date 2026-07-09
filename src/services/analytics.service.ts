import { apiClient } from './api.client';
import type {
  ActivityPoint,
  TemperatureBucket,
  HeatmapCell,
  AnimalRisk,
  AnalyticsFilters,
} from '@/types/analytics.types';

interface ApiEnvelope<T> { data: T; }

export const analyticsService = {
  getActivity: (params?: AnalyticsFilters): Promise<ActivityPoint[]> =>
    apiClient
      .get<ApiEnvelope<ActivityPoint[]>>('/analytics/activity', { params })
      .then(r => r.data.data),

  getTemperatureDistribution: (params?: AnalyticsFilters): Promise<TemperatureBucket[]> =>
    apiClient
      .get<ApiEnvelope<TemperatureBucket[]>>('/analytics/temperature', { params })
      .then(r => r.data.data),

  getHeatmap: (params?: AnalyticsFilters): Promise<HeatmapCell[]> =>
    apiClient
      .get<ApiEnvelope<HeatmapCell[]>>('/analytics/heatmap', { params })
      .then(r => r.data.data),

  getTopRisk: (): Promise<AnimalRisk[]> =>
    apiClient
      .get<ApiEnvelope<AnimalRisk[]>>('/analytics/risk')
      .then(r => r.data.data),

  exportReport: async (params?: AnalyticsFilters): Promise<void> => {
    const response = await apiClient.get('/reports/analytics', {
      params,
      responseType: 'blob',
    });
    const url      = URL.createObjectURL(response.data as Blob);
    const anchor   = document.createElement('a');
    anchor.href     = url;
    anchor.download = `reporte-smartcow-${new Date().toISOString().slice(0, 10)}.pdf`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  },
};
