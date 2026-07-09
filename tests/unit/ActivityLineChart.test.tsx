import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ActivityLineChart } from '@/features/analytics/components/ActivityLineChart';
import type { ActivityPoint } from '@/types/analytics.types';

// ---- Mocks ------------------------------------------------------------------

vi.mock('@/services/analytics.service', () => ({
  analyticsService: { getActivity: vi.fn() },
}));

// Recharts components use ReactDOM.findDOMNode (removed in React 19) — stub them out
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) =>
    React.createElement('div', { 'data-testid': 'responsive-container' }, children),
  LineChart: ({ children }: { children: React.ReactNode }) =>
    React.createElement('div', { 'data-testid': 'line-chart' }, children),
  Line:          () => null,
  XAxis:         () => null,
  YAxis:         () => null,
  CartesianGrid: () => null,
  Tooltip:       () => null,
}));

// ---- Helpers ----------------------------------------------------------------

import { analyticsService } from '@/services/analytics.service';

const mockGetActivity = analyticsService.getActivity as ReturnType<typeof vi.fn>;

function makePoints(n = 3): ActivityPoint[] {
  return Array.from({ length: n }, (_, i) => ({
    ts:    new Date(2025, 0, i + 1).toISOString(),
    avgKm: 5 + i,
  }));
}

function renderChart(filters = {}, resolvedData: ActivityPoint[] | null = makePoints()) {
  if (resolvedData !== null) {
    mockGetActivity.mockResolvedValue(resolvedData);
  }
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    React.createElement(
      QueryClientProvider, { client },
      React.createElement(ActivityLineChart, { filters }),
    ),
  );
}

// ---- Tests ------------------------------------------------------------------

describe('ActivityLineChart', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows skeleton while loading', () => {
    mockGetActivity.mockReturnValue(new Promise(() => {})); // never resolves
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(
      React.createElement(
        QueryClientProvider, { client },
        React.createElement(ActivityLineChart, { filters: {} }),
      ),
    );
    // Skeleton is aria-hidden — it's in the DOM but hidden to AT
    const skeleton = document.querySelector('[aria-hidden="true"]');
    expect(skeleton).toBeInTheDocument();
  });

  it('shows empty state when data is empty array', async () => {
    renderChart({}, []);
    const status = await screen.findByRole('status');
    expect(status).toHaveTextContent('Sin datos para el período seleccionado');
  });

  it('renders chart container when data is available', async () => {
    renderChart();
    expect(await screen.findByTestId('responsive-container')).toBeInTheDocument();
  });

  it('renders the LineChart element', async () => {
    renderChart();
    expect(await screen.findByTestId('line-chart')).toBeInTheDocument();
  });

  it('has accessible wrapper with role img', async () => {
    renderChart();
    const wrapper = await screen.findByRole('img', { name: /actividad del hato/i });
    expect(wrapper).toBeInTheDocument();
  });

  it('calls getActivity with the provided filters', async () => {
    const filters = { from: '2025-01-01', to: '2025-01-31' };
    renderChart(filters);
    await screen.findByTestId('responsive-container');
    expect(mockGetActivity).toHaveBeenCalledWith(filters);
  });
});
