import { Search, Filter } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { HealthStatus } from '@/types/animal.types';

export interface CattleFilterValues {
  search: string;
  status: HealthStatus | '';
}

interface CattleFiltersProps {
  values:   CattleFilterValues;
  onChange: (values: CattleFilterValues) => void;
  className?: string;
}

const STATUS_OPTIONS: Array<{ value: HealthStatus | ''; label: string }> = [
  { value: '',         label: 'Todos'     },
  { value: 'HEALTHY',  label: 'Sanos'     },
  { value: 'WARNING',  label: 'En alerta' },
  { value: 'CRITICAL', label: 'Críticos'  },
  { value: 'OFFLINE',  label: 'Sin señal' },
  { value: 'PREGNANT', label: 'Gestantes' },
];

const INPUT_BASE =
  'bg-surface-elevated border border-border rounded-md text-body text-primary ' +
  'focus:outline-none focus:border-primary transition-colors placeholder:text-muted';

export function CattleFilters({ values, onChange, className }: CattleFiltersProps) {
  return (
    <div className={cn('flex flex-col sm:flex-row gap-3', className)}>
      <div className="relative flex-1">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none"
          aria-hidden="true"
        />
        <input
          type="search"
          placeholder="Buscar por nombre o código..."
          value={values.search}
          onChange={(e) => onChange({ ...values, search: e.target.value })}
          aria-label="Buscar animal"
          className={cn(INPUT_BASE, 'w-full pl-9 pr-3 py-2')}
        />
      </div>

      <div className="relative">
        <Filter
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none"
          aria-hidden="true"
        />
        <select
          value={values.status}
          onChange={(e) => onChange({ ...values, status: e.target.value as HealthStatus | '' })}
          aria-label="Filtrar por estado"
          className={cn(INPUT_BASE, 'pl-9 pr-8 py-2 appearance-none cursor-pointer')}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
