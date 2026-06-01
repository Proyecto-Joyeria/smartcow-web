import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CattleList } from './CattleList';
import type { AnimalSummary } from '@/types/animal.types';

const mockAnimals: AnimalSummary[] = [
  {
    id:           'a1',
    code:         'TAG-001',
    name:         'Estrella',
    breed:        'Holstein',
    sex:          'FEMALE',
    healthStatus: 'HEALTHY',
  },
  {
    id:           'a2',
    code:         'TAG-002',
    name:         'Luna',
    breed:        'Angus',
    sex:          'FEMALE',
    healthStatus: 'WARNING',
  },
];

const defaultProps = {
  animals:     mockAnimals,
  isLoading:   false,
  selectedId:  null,
  onSelect:    vi.fn(),
  onCreateNew: vi.fn(),
};

describe('CattleList', () => {
  it('renderiza un AnimalCard por cada animal', () => {
    render(<CattleList {...defaultProps} />);
    expect(screen.getByText('Estrella')).toBeTruthy();
    expect(screen.getByText('Luna')).toBeTruthy();
  });

  it('muestra skeleton de carga cuando isLoading es true', () => {
    render(<CattleList {...defaultProps} animals={[]} isLoading />);
    expect(screen.getByLabelText('Cargando animales')).toBeTruthy();
  });

  it('muestra empty state cuando no hay animales y no está cargando', () => {
    render(<CattleList {...defaultProps} animals={[]} />);
    expect(screen.getByText(/no hay animales registrados/i)).toBeTruthy();
  });

  it('llama onCreateNew al hacer clic en el botón del empty state', () => {
    const onCreateNew = vi.fn();
    render(<CattleList {...defaultProps} animals={[]} onCreateNew={onCreateNew} />);
    fireEvent.click(screen.getByText('Registrar primer animal'));
    expect(onCreateNew).toHaveBeenCalledTimes(1);
  });

  it('llama onSelect con el id correcto al hacer clic en una card', () => {
    const onSelect = vi.fn();
    render(<CattleList {...defaultProps} onSelect={onSelect} />);
    fireEvent.click(screen.getByLabelText('Ver ficha de Estrella'));
    expect(onSelect).toHaveBeenCalledWith('a1');
  });

  it('marca la card seleccionada con aria-pressed=true', () => {
    render(<CattleList {...defaultProps} selectedId="a1" />);
    expect(screen.getByLabelText('Ver ficha de Estrella').getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByLabelText('Ver ficha de Luna').getAttribute('aria-pressed')).toBe('false');
  });
});
