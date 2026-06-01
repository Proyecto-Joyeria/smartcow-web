import { memo } from 'react';
import { cn } from '@/utils/cn';
import { StatusBadge } from './StatusBadge';
import type { AnimalSummary } from '@/types/animal.types';

interface AnimalCardProps {
  animal:      AnimalSummary;
  onClick?:    () => void;
  isSelected?: boolean;
  className?:  string;
}

export const AnimalCard = memo(function AnimalCard({
  animal,
  onClick,
  isSelected,
  className,
}: AnimalCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Ver ficha de ${animal.name ?? animal.code}`}
      aria-pressed={isSelected}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
      className={cn(
        'bg-surface-card border rounded-lg p-4 cursor-pointer',
        'transition-colors duration-150',
        isSelected
          ? 'border-primary'
          : 'border-border hover:border-primary',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-heading-md text-primary truncate">
            {animal.name ?? animal.code}
          </p>
          {animal.name && (
            <p className="text-small text-secondary font-mono">{animal.code}</p>
          )}
          <p className="text-small text-secondary">{animal.breed}</p>
        </div>
        <StatusBadge status={animal.healthStatus} />
      </div>
    </div>
  );
});
