import { cn } from '@/utils/cn';
import type { AlertSeverity, AlertStatus, AlertFiltersParams } from '@/types/alert.types';

interface AlertFiltersProps {
  filters:   AlertFiltersParams;
  onChange:  (filters: AlertFiltersParams) => void;
}

const SEVERITIES: { value: AlertSeverity; label: string }[] = [
  { value: 'CRITICAL', label: 'Crítico' },
  { value: 'WARNING',  label: 'Alerta'  },
  { value: 'INFO',     label: 'Info'    },
];

const STATUSES: { value: AlertStatus; label: string }[] = [
  { value: 'OPEN',         label: 'Abiertas'    },
  { value: 'ACKNOWLEDGED', label: 'Reconocidas' },
  { value: 'RESOLVED',     label: 'Resueltas'   },
];

const SEVERITY_ACTIVE: Record<AlertSeverity, string> = {
  CRITICAL: 'bg-red-900/30 text-[#f44336] border-[#f44336]',
  WARNING:  'bg-yellow-900/30 text-[#ffb300] border-[#ffb300]',
  INFO:     'bg-green-900/20 text-[#1a7a4a] border-[#1a7a4a]',
};

export function AlertFilters({ filters, onChange }: AlertFiltersProps) {
  const setSeverity = (v: AlertSeverity) =>
    onChange({ ...filters, severity: filters.severity === v ? undefined : v });

  const setStatus = (v: AlertStatus) =>
    onChange({ ...filters, status: filters.status === v ? undefined : v });

  const setSearch = (search: string) =>
    onChange({ ...filters, search: search || undefined });

  return (
    <div className="flex flex-col gap-3 pb-4 border-b border-[#30363d]">
      {/* Búsqueda */}
      <input
        type="search"
        placeholder="Buscar alertas…"
        value={filters.search ?? ''}
        onChange={e => setSearch(e.target.value)}
        aria-label="Buscar alertas"
        className={cn(
          'w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2',
          'text-sm text-[#e6edf3] placeholder:text-[#6e7681]',
          'outline-none focus:border-[#1a7a4a] transition-colors',
        )}
      />

      {/* Severidad */}
      <div className="flex gap-2 flex-wrap" role="group" aria-label="Filtrar por severidad">
        {SEVERITIES.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            aria-pressed={filters.severity === value}
            onClick={() => setSeverity(value)}
            className={cn(
              'px-3 py-1 rounded-full text-xs font-medium border transition-colors',
              filters.severity === value
                ? SEVERITY_ACTIVE[value]
                : 'border-[#30363d] text-[#8b949e] hover:border-[#8b949e] hover:text-[#e6edf3]',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Estado */}
      <div className="flex gap-2 flex-wrap" role="group" aria-label="Filtrar por estado">
        {STATUSES.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            aria-pressed={filters.status === value}
            onClick={() => setStatus(value)}
            className={cn(
              'px-3 py-1 rounded-full text-xs font-medium border transition-colors',
              filters.status === value
                ? 'border-[#1a7a4a] bg-green-900/20 text-[#22a05c]'
                : 'border-[#30363d] text-[#8b949e] hover:border-[#8b949e] hover:text-[#e6edf3]',
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
