import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// ---- Mocks ------------------------------------------------------------------

vi.mock('@/services/geofences.service', () => ({
  geofencesService: {
    create: vi.fn(),
    update: vi.fn(),
  },
}));

// ---- Subject ----------------------------------------------------------------

import { GeofenceModal } from '@/features/map/components/GeofenceModal';
import { geofencesService } from '@/services/geofences.service';
import type { Geofence } from '@/types/geofence.types';

// ---- Helpers ----------------------------------------------------------------

function makeClient() {
  return new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
}

function renderModal(props: Partial<React.ComponentProps<typeof GeofenceModal>> = {}) {
  const defaults: React.ComponentProps<typeof GeofenceModal> = {
    mode:            'create',
    pendingVertices: [[4.71, -74.07], [4.72, -74.07], [4.72, -74.06]],
    editingGeofence: null,
    onClose:         vi.fn(),
    ...props,
  };
  return render(
    React.createElement(
      QueryClientProvider,
      { client: makeClient() },
      React.createElement(GeofenceModal, defaults),
    ),
  );
}

const MOCK_GEOFENCE: Geofence = {
  id:        'gf-1',
  name:      'Potrero Norte',
  color:     '#1a7a4a',
  vertices:  [[4.71, -74.07], [4.72, -74.07]],
  isActive:  true,
  farmId:    'farm-1',
  createdAt: '2026-01-01T00:00:00Z',
};

// ---- Tests ------------------------------------------------------------------

describe('GeofenceModal', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders the name input', () => {
    renderModal();
    expect(screen.getByLabelText('Nombre')).toBeInTheDocument();
  });

  it('renders the save button', () => {
    renderModal();
    expect(screen.getByRole('button', { name: 'Guardar' })).toBeInTheDocument();
  });

  it('renders the cancel button', () => {
    renderModal();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
  });

  it('shows validation error when submitting empty name', async () => {
    renderModal();
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('El nombre es requerido');
    });
  });

  it('calls onClose when cancel is clicked', () => {
    const onClose = vi.fn();
    renderModal({ onClose });
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('pre-fills fields in edit mode', () => {
    renderModal({ mode: 'edit', editingGeofence: MOCK_GEOFENCE, pendingVertices: null });
    expect(screen.getByLabelText('Nombre')).toHaveValue('Potrero Norte');
  });

  it('calls geofencesService.create on submit in create mode', async () => {
    const createMock = vi.mocked(geofencesService.create);
    createMock.mockResolvedValue(MOCK_GEOFENCE);

    renderModal();
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Zona test' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));

    await waitFor(() => {
      expect(createMock).toHaveBeenCalled();
      const firstArg = createMock.mock.calls[0][0];
      expect(firstArg).toMatchObject({ name: 'Zona test' });
    });
  });

  it('calls geofencesService.update on submit in edit mode', async () => {
    const updateMock = vi.mocked(geofencesService.update);
    updateMock.mockResolvedValue(MOCK_GEOFENCE);

    renderModal({ mode: 'edit', editingGeofence: MOCK_GEOFENCE, pendingVertices: null });
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Nombre editado' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));

    await waitFor(() => {
      expect(updateMock).toHaveBeenCalledWith(
        'gf-1',
        expect.objectContaining({ name: 'Nombre editado' }),
      );
    });
  });
});
