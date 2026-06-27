import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AlertItem } from '@/features/alerts/components/AlertItem';
import type { Alert } from '@/types/alert.types';

function makeAlert(overrides: Partial<Alert> = {}): Alert {
  return {
    id:          'alert-1',
    title:       'Temperatura elevada',
    description: 'La temperatura supera el umbral crítico',
    severity:    'CRITICAL',
    status:      'OPEN',
    animalId:    'animal-1',
    animalName:  'Estrella',
    createdAt:   new Date().toISOString(),
    updatedAt:   new Date().toISOString(),
    ...overrides,
  };
}

describe('AlertItem', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders the alert title', () => {
    render(React.createElement(AlertItem, { alert: makeAlert() }));
    expect(screen.getByText('Temperatura elevada')).toBeInTheDocument();
  });

  it('renders the alert description', () => {
    render(React.createElement(AlertItem, { alert: makeAlert() }));
    expect(screen.getByText('La temperatura supera el umbral crítico')).toBeInTheDocument();
  });

  it('renders OPEN status label', () => {
    render(React.createElement(AlertItem, { alert: makeAlert({ status: 'OPEN' }) }));
    expect(screen.getByText('Abierta')).toBeInTheDocument();
  });

  it('renders ACKNOWLEDGED status label', () => {
    render(React.createElement(AlertItem, { alert: makeAlert({ status: 'ACKNOWLEDGED' }) }));
    expect(screen.getByText('Reconocida')).toBeInTheDocument();
  });

  it('renders RESOLVED status label', () => {
    render(React.createElement(AlertItem, { alert: makeAlert({ status: 'RESOLVED' }) }));
    expect(screen.getByText('Resuelta')).toBeInTheDocument();
  });

  it('renders animal name when present', () => {
    render(React.createElement(AlertItem, { alert: makeAlert({ animalName: 'Luna' }) }));
    expect(screen.getByText(/Luna/)).toBeInTheDocument();
  });

  it('calls onSelect when clicked', () => {
    const onSelect = vi.fn();
    const alert = makeAlert();
    render(React.createElement(AlertItem, { alert, onSelect }));
    fireEvent.click(screen.getByRole('button', { name: /Alerta:/ }));
    expect(onSelect).toHaveBeenCalledWith(alert);
  });

  it('calls onSelect when Enter key pressed', () => {
    const onSelect = vi.fn();
    const alert = makeAlert();
    render(React.createElement(AlertItem, { alert, onSelect }));
    fireEvent.keyDown(screen.getByRole('button', { name: /Alerta:/ }), { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledWith(alert);
  });

  it('shows acknowledge button on hover for OPEN alerts', () => {
    const onAcknowledge = vi.fn();
    const alert = makeAlert({ status: 'OPEN' });
    render(React.createElement(AlertItem, { alert, onAcknowledge }));
    fireEvent.mouseEnter(screen.getByRole('button', { name: /Alerta:/ }));
    expect(screen.getByRole('button', { name: 'Reconocer alerta' })).toBeInTheDocument();
  });

  it('calls onAcknowledge when Reconocer is clicked', () => {
    const onAcknowledge = vi.fn();
    const alert = makeAlert({ status: 'OPEN' });
    render(React.createElement(AlertItem, { alert, onAcknowledge }));
    fireEvent.mouseEnter(screen.getByRole('button', { name: /Alerta:/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Reconocer alerta' }));
    expect(onAcknowledge).toHaveBeenCalledWith('alert-1');
  });

  it('does not show acknowledge button for RESOLVED alerts', () => {
    const onAcknowledge = vi.fn();
    const alert = makeAlert({ status: 'RESOLVED' });
    render(React.createElement(AlertItem, { alert, onAcknowledge }));
    fireEvent.mouseEnter(screen.getByRole('button', { name: /Alerta:/ }));
    expect(screen.queryByRole('button', { name: 'Reconocer alerta' })).not.toBeInTheDocument();
  });

  it('shows selected style when selected prop is true', () => {
    const alert = makeAlert();
    render(React.createElement(AlertItem, { alert, selected: true }));
    const el = screen.getByRole('button', { name: /Alerta:/ });
    expect(el.className).toContain('bg-[#21262d]');
  });
});
