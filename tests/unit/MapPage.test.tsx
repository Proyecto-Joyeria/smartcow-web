import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { gpsReducer } from '@/store/slices/gpsSlice';
import { MapPage } from '@/features/map';

// ---- Mocks ------------------------------------------------------------------

vi.mock('@/hooks/useGpsSubscription', () => ({
  useGpsSubscription: vi.fn(),
}));

vi.mock('@/hooks/useGeofenceEvents', () => ({
  useGeofenceEvents: vi.fn(),
}));

vi.mock('@/hooks/useWebSocket', () => ({
  useWebSocket: () => ({ on: vi.fn(), off: vi.fn(), emit: vi.fn() }),
}));

vi.mock('@/services/geofences.service', () => ({
  geofencesService: { getAll: vi.fn().mockResolvedValue([]) },
}));

vi.mock('leaflet-draw', () => ({}));
vi.mock('leaflet-draw/dist/leaflet.draw.css', () => ({}));

// Avoid JSX in factory (hoisted before jsx-runtime is available)
vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) =>
    React.createElement('div', { 'data-testid': 'map-container' }, children),
  TileLayer:  () => null,
  Marker:     ({ children }: { children?: React.ReactNode }) =>
    React.createElement('div', { 'data-testid': 'marker' }, children),
  Popup:      ({ children }: { children?: React.ReactNode }) =>
    React.createElement('div', null, children),
  Polyline:   () => null,
  Polygon:    () => null,
  useMap:     () => ({
    addLayer: vi.fn(), removeLayer: vi.fn(),
    addControl: vi.fn(), removeControl: vi.fn(),
    on: vi.fn(), off: vi.fn(),
  }),
}));

vi.mock('leaflet', () => ({
  default: {
    divIcon: vi.fn(() => ({})),
    Icon: {
      Default: {
        mergeOptions: vi.fn(),
        prototype: { _getIconUrl: undefined },
      },
    },
  },
  divIcon: vi.fn(() => ({})),
  Icon: {
    Default: {
      mergeOptions: vi.fn(),
      prototype: { _getIconUrl: undefined },
    },
  },
}));

// ---- Helpers ---------------------------------------------------------------

function makeStore() {
  return configureStore({ reducer: { gps: gpsReducer } });
}

function renderMapPage() {
  const store  = makeStore();
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    React.createElement(
      QueryClientProvider, { client },
      React.createElement(Provider, { store },
        React.createElement(MapPage),
      ),
    ),
  );
}

// ---- Tests -----------------------------------------------------------------

describe('MapPage', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('renders the map container', () => {
    renderMapPage();
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
  });

  it('renders FilterPanel with all status labels', () => {
    renderMapPage();
    const panel = screen.getByRole('group', { name: 'Filtrar marcadores por estado' });
    expect(panel).toBeInTheDocument();
    expect(panel).toHaveTextContent('Sanos');
    expect(panel).toHaveTextContent('Alerta');
    expect(panel).toHaveTextContent('Críticos');
    expect(panel).toHaveTextContent('Sin señal');
    expect(panel).toHaveTextContent('Gestantes');
  });

  it('all status filters start as checked', () => {
    renderMapPage();
    const checkboxes = screen.getAllByRole('checkbox', { hidden: true });
    checkboxes.forEach(cb => expect(cb).toBeChecked());
  });

  it('toggling a filter unchecks it', () => {
    renderMapPage();
    const checkboxes = screen.getAllByRole('checkbox', { hidden: true });
    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0]).not.toBeChecked();
  });

  it('toggling a filter twice restores it', () => {
    renderMapPage();
    const checkboxes = screen.getAllByRole('checkbox', { hidden: true });
    fireEvent.click(checkboxes[0]);
    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0]).toBeChecked();
  });
});
