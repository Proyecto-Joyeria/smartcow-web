import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AnimalCard } from './AnimalCard';
import type { AnimalSummary } from '@/types/animal.types';

const mockAnimal: AnimalSummary = {
  id:           'a1',
  code:         'TAG-001',
  name:         'Estrella',
  breed:        'Holstein',
  sex:          'FEMALE',
  healthStatus: 'HEALTHY',
};

const mockAnimalNoName: AnimalSummary = {
  id:           'a2',
  code:         'TAG-002',
  breed:        'Angus',
  sex:          'MALE',
  healthStatus: 'WARNING',
};

describe('AnimalCard', () => {
  it('muestra el nombre cuando está disponible', () => {
    render(<AnimalCard animal={mockAnimal} />);
    expect(screen.getByText('Estrella')).toBeTruthy();
    expect(screen.getByText('TAG-001')).toBeTruthy();
  });

  it('muestra el código como título cuando no hay nombre', () => {
    render(<AnimalCard animal={mockAnimalNoName} />);
    expect(screen.getByText('TAG-002')).toBeTruthy();
  });

  it('muestra la raza del animal', () => {
    render(<AnimalCard animal={mockAnimal} />);
    expect(screen.getByText('Holstein')).toBeTruthy();
  });

  it('muestra el StatusBadge con el estado correcto', () => {
    render(<AnimalCard animal={mockAnimal} />);
    expect(screen.getByLabelText('Estado: Sana')).toBeTruthy();
  });

  it('llama onClick al hacer clic', () => {
    const onClick = vi.fn();
    render(<AnimalCard animal={mockAnimal} onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('llama onClick al presionar Enter (accesibilidad teclado)', () => {
    const onClick = vi.fn();
    render(<AnimalCard animal={mockAnimal} onClick={onClick} />);
    fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' });
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('aplica aria-pressed=true cuando isSelected es true', () => {
    render(<AnimalCard animal={mockAnimal} isSelected />);
    expect(screen.getByRole('button').getAttribute('aria-pressed')).toBe('true');
  });

  it('no llama onClick si no se pasa la prop', () => {
    render(<AnimalCard animal={mockAnimal} />);
    expect(() => fireEvent.click(screen.getByRole('button'))).not.toThrow();
  });
});
