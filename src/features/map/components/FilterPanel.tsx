import { cn } from '@/utils/cn';
import type { LiveStatus } from '@/store/slices/gpsSlice';

interface FilterPanelProps {
  activeStatuses: Set<LiveStatus>;
  onChange:       (statuses: Set<LiveStatus>) => void;
}

const FILTERS: Array<{ status: LiveStatus; label: string; color: string }> = [
  { status: 'HEALTHY',  label: 'Sanos',     color: 'bg-green-500'  },
  { status: 'WARNING',  label: 'Alerta',    color: 'bg-yellow-500' },
  { status: 'CRITICAL', label: 'Críticos',  color: 'bg-red-500'    },
  { status: 'OFFLINE',  label: 'Sin señal', color: 'bg-gray-500'   },
  { status: 'PREGNANT', label: 'Gestantes', color: 'bg-purple-400' },
];

export function FilterPanel({ activeStatuses, onChange }: FilterPanelProps) {
  const toggle = (status: LiveStatus) => {
    const next = new Set(activeStatuses);
    if (next.has(status)) {
      next.delete(status);
    } else {
      next.add(status);
    }
    onChange(next);
  };

  return (
    <div
      className="absolute top-3 right-3 z-[1000] bg-surface-card border border-border rounded-lg p-3 flex flex-col gap-2 shadow-lg min-w-[140px]"
      role="group"
      aria-label="Filtrar marcadores por estado"
    >
      <p className="text-small text-secondary font-medium">Filtrar</p>
      {FILTERS.map(({ status, label, color }) => {
        const active = activeStatuses.has(status);
        return (
          <label
            key={status}
            className="flex items-center gap-2 cursor-pointer min-h-[28px]"
          >
            <input
              type="checkbox"
              checked={active}
              onChange={() => toggle(status)}
              aria-label={`Mostrar animales ${label}`}
              className="sr-only"
            />
            <span
              className={cn(
                'w-4 h-4 rounded-sm border-2 flex items-center justify-center transition-colors',
                active ? 'border-transparent' : 'border-border bg-transparent',
                active ? color : '',
              )}
              aria-hidden="true"
            >
              {active && (
                <svg viewBox="0 0 10 8" className="w-2.5 h-2.5 fill-white">
                  <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                </svg>
              )}
            </span>
            <span className="text-small text-secondary">{label}</span>
          </label>
        );
      })}
    </div>
  );
}
