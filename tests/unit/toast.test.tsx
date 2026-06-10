import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ToastProvider, useToastContext } from '@/contexts/ToastContext';

// ---- Helper component -------------------------------------------------------

function TriggerButton({ title, message }: { title: string; message?: string }) {
  const { addToast } = useToastContext();
  return React.createElement('button', {
    onClick: () => addToast({ title, message, variant: 'warning', duration: 3000 }),
  }, 'Disparar toast');
}

function renderWithToast(title: string, message?: string) {
  return render(
    React.createElement(
      ToastProvider,
      null,
      React.createElement(TriggerButton, { title, message }),
    ),
  );
}

// ---- Tests ------------------------------------------------------------------

describe('ToastProvider', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows a toast when addToast is called', () => {
    renderWithToast('Cruce de geocerca', 'Estrella entró en "Potrero Norte"');
    fireEvent.click(screen.getByRole('button', { name: 'Disparar toast' }));
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Cruce de geocerca');
  });

  it('displays the toast message', () => {
    renderWithToast('Cruce de geocerca', 'Luna salió de "Zona sur"');
    fireEvent.click(screen.getByRole('button', { name: 'Disparar toast' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Luna salió de "Zona sur"');
  });

  it('removes toast when close button is clicked', () => {
    renderWithToast('Test toast');
    fireEvent.click(screen.getByRole('button', { name: 'Disparar toast' }));
    expect(screen.getByRole('alert')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Cerrar notificación' }));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('removes toast automatically after the duration', () => {
    renderWithToast('Auto-dismiss');
    fireEvent.click(screen.getByRole('button', { name: 'Disparar toast' }));
    expect(screen.getByRole('alert')).toBeInTheDocument();

    act(() => { vi.advanceTimersByTime(3001); });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('can show multiple toasts simultaneously', () => {
    renderWithToast('Toast 1');
    const btn = screen.getByRole('button', { name: 'Disparar toast' });
    fireEvent.click(btn);
    fireEvent.click(btn);
    expect(screen.getAllByRole('alert')).toHaveLength(2);
  });
});
