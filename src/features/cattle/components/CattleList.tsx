import { cn } from '@/utils/cn';
import { AnimalCard } from '@/components/ui/AnimalCard';
import type { AnimalSummary } from '@/types/animal.types';

interface CattleListProps {
  animals:     AnimalSummary[];
  isLoading:   boolean;
  selectedId:  string | null;
  onSelect:    (id: string) => void;
  onCreateNew: () => void;
  className?:  string;
}

function SkeletonCard() {
  return (
    <div className="bg-surface-card border border-border rounded-lg p-4 animate-pulse">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-surface-elevated rounded w-3/4" />
          <div className="h-3 bg-surface-elevated rounded w-1/2" />
          <div className="h-3 bg-surface-elevated rounded w-1/3" />
        </div>
        <div className="h-6 w-16 bg-surface-elevated rounded-sm shrink-0" />
      </div>
    </div>
  );
}

export function CattleList({
  animals,
  isLoading,
  selectedId,
  onSelect,
  onCreateNew,
  className,
}: CattleListProps) {
  if (isLoading) {
    return (
      <div
        className={cn('flex flex-col gap-3', className)}
        aria-busy="true"
        aria-label="Cargando animales"
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (animals.length === 0) {
    return (
      <div className={cn('flex flex-col items-center justify-center py-16 gap-4', className)}>
        <p className="text-secondary text-body text-center">
          No hay animales registrados.
        </p>
        <button
          type="button"
          onClick={onCreateNew}
          className={cn(
            'min-h-[44px] px-4 rounded-md bg-primary text-white',
            'text-body font-medium hover:bg-primary-hover transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface-primary',
          )}
        >
          Registrar primer animal
        </button>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {animals.map((animal) => (
        <AnimalCard
          key={animal.id}
          animal={animal}
          isSelected={animal.id === selectedId}
          onClick={() => onSelect(animal.id)}
        />
      ))}
    </div>
  );
}
