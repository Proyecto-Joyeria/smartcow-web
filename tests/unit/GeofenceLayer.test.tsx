import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

// ---- Mocks ------------------------------------------------------------------

vi.mock('leaflet', () => ({
  default: {
    divIcon:      vi.fn(() => ({})),
    FeatureGroup: vi.fn(() => ({ addTo: vi.fn(), clearLayers: vi.fn() })),
    Icon: {
      Default: {
        mergeOptions:   vi.fn(),
        prototype:      { _getIconUrl: undefined },
      },
    },
  },
  divIcon:      vi.fn(() => ({})),
  FeatureGroup: vi.fn(() => ({ addTo: vi.fn(), clearLayers: vi.fn() })),
  Icon: {
    Default: {
      mergeOptions:   vi.fn(),
      prototype:      { _getIconUrl: undefined },
    },
  },
}));

vi.mock('leaflet-draw', () => ({}));

vi.mock('leaflet-draw/dist/leaflet.draw.css', () => ({}));

vi.mock('react-leaflet', () => ({
  Polygon:  ({ positions, pathOptions }: { positions: [number, number][]; pathOptions?: { color?: string } }) =>
    React.createElement('div', {
      'data-testid': 'geofence-polygon',
      'data-color':  pathOptions?.color,
      'data-vertices': positions.length,
    }),
  useMap: () => ({
    addLayer:      vi.fn(),
    removeLayer:   vi.fn(),
    addControl:    vi.fn(),
    removeControl: vi.fn(),
    on:            vi.fn(),
    off:           vi.fn(),
  }),
}));

// ---- Subject ----------------------------------------------------------------

import { GeofenceLayer } from '@/components/map/GeofenceLayer';
import type { Geofence } from '@/types/geofence.types';

// ---- Helpers ----------------------------------------------------------------

const makeGeofence = (overrides: Partial<Geofence> = {}): Geofence => ({
  id:        'gf-1',
  name:      'Potrero Norte',
  color:     '#1a7a4a',
  vertices:  [[4.71, -74.07], [4.72, -74.07], [4.72, -74.06]],
  isActive:  true,
  farmId:    'farm-1',
  createdAt: '2026-01-01T00:00:00Z',
  ...overrides,
});

// ---- Tests ------------------------------------------------------------------

describe('GeofenceLayer', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders nothing when geofences list is empty', () => {
    render(
      React.createElement(GeofenceLayer, {
        geofences:        [],
        drawingMode:      false,
        onPolygonCreated: vi.fn(),
      }),
    );
    expect(screen.queryAllByTestId('geofence-polygon')).toHaveLength(0);
  });

  it('renders one polygon per active geofence', () => {
    const geofences = [
      makeGeofence({ id: 'gf-1', isActive: true  }),
      makeGeofence({ id: 'gf-2', isActive: true  }),
      makeGeofence({ id: 'gf-3', isActive: false }),
    ];
    render(
      React.createElement(GeofenceLayer, {
        geofences,
        drawingMode:      false,
        onPolygonCreated: vi.fn(),
      }),
    );
    expect(screen.getAllByTestId('geofence-polygon')).toHaveLength(2);
  });

  it('applies the geofence color to the polygon', () => {
    const geofences = [makeGeofence({ color: '#ffb300' })];
    render(
      React.createElement(GeofenceLayer, {
        geofences,
        drawingMode:      false,
        onPolygonCreated: vi.fn(),
      }),
    );
    const polygon = screen.getByTestId('geofence-polygon');
    expect(polygon).toHaveAttribute('data-color', '#ffb300');
  });

  it('does not render inactive geofences', () => {
    const geofences = [makeGeofence({ isActive: false })];
    render(
      React.createElement(GeofenceLayer, {
        geofences,
        drawingMode:      false,
        onPolygonCreated: vi.fn(),
      }),
    );
    expect(screen.queryAllByTestId('geofence-polygon')).toHaveLength(0);
  });

  it('passes correct vertex count to polygon', () => {
    const vertices: [number, number][] = [
      [4.71, -74.07], [4.72, -74.07], [4.72, -74.06], [4.71, -74.06],
    ];
    const geofences = [makeGeofence({ vertices })];
    render(
      React.createElement(GeofenceLayer, {
        geofences,
        drawingMode:      false,
        onPolygonCreated: vi.fn(),
      }),
    );
    const polygon = screen.getByTestId('geofence-polygon');
    expect(polygon).toHaveAttribute('data-vertices', '4');
  });
});
