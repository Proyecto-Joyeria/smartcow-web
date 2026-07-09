import { cn } from '@/utils/cn';
import type { AnalyticsFilters } from '@/types/analytics.types';

interface Props {
  filters:  AnalyticsFilters;
  onChange: (f: AnalyticsFilters) => void;
}

const PRESETS = [
  { label: 'Hoy',     days: 1  },
  { label: '7 días',  days: 7  },
  { label: '30 días', days: 30 },
  { label: '90 días', days: 90 },
] as const;

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function presetDates(days: number): { from: string; to: string } {
  return {
    to:   isoDate(new Date()),
    from: isoDate(new Date(Date.now() - days * 86_400_000)),
  };
}

function isPresetActive(filters: AnalyticsFilters, days: number): boolean {
  const { from, to } = presetDates(days);
  return filters.from === from && filters.to === to;
}

export function AnalyticsFilters({ filters, onChange }: Props) {
  const hasAny = !!(filters.from || filters.to || filters.breed || filters.sector);

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Quick date presets */}
      <div className="flex gap-1" role="group" aria-label="Rango de fecha rápido">
        {PRESETS.map(({ label, days }) => (
          <button
            key={label}
            type="button"
            aria-pressed={isPresetActive(filters, days)}
            onClick={() => onChange({ ...filters, ...presetDates(days) })}
            className={cn(
              'px-3 py-1 rounded-full text-xs font-medium border transition-colors',
              isPresetActive(filters, days)
                ? 'border-[#1a7a4a] bg-green-900/20 text-[#22a05c]'
                : 'border-[#30363d] text-[#8b949e] hover:border-[#8b949e] hover:text-[#e6edf3]',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Custom date range */}
      <div className="flex items-center gap-2">
        <input
          type="date"
          aria-label="Desde"
          value={filters.from ?? ''}
          onChange={e => onChange({ ...filters, from: e.target.value || undefined })}
          className="bg-[#0d1117] border border-[#30363d] rounded-lg px-2 py-1 text-xs text-[#e6edf3] outline-none focus:border-[#1a7a4a] transition-colors [color-scheme:dark]"
        />
        <span className="text-xs text-[#6e7681]">–</span>
        <input
          type="date"
          aria-label="Hasta"
          value={filters.to ?? ''}
          onChange={e => onChange({ ...filters, to: e.target.value || undefined })}
          className="bg-[#0d1117] border border-[#30363d] rounded-lg px-2 py-1 text-xs text-[#e6edf3] outline-none focus:border-[#1a7a4a] transition-colors [color-scheme:dark]"
        />
      </div>

      {/* Breed */}
      <input
        type="text"
        placeholder="Raza…"
        aria-label="Filtrar por raza"
        value={filters.breed ?? ''}
        onChange={e => onChange({ ...filters, breed: e.target.value || undefined })}
        className="bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-1 text-xs text-[#e6edf3] placeholder:text-[#6e7681] outline-none focus:border-[#1a7a4a] transition-colors w-28"
      />

      {/* Sector */}
      <input
        type="text"
        placeholder="Sector…"
        aria-label="Filtrar por sector"
        value={filters.sector ?? ''}
        onChange={e => onChange({ ...filters, sector: e.target.value || undefined })}
        className="bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-1 text-xs text-[#e6edf3] placeholder:text-[#6e7681] outline-none focus:border-[#1a7a4a] transition-colors w-28"
      />

      {hasAny && (
        <button
          type="button"
          onClick={() => onChange({})}
          className="text-xs text-[#8b949e] hover:text-[#e6edf3] transition-colors"
        >
          Limpiar
        </button>
      )}
    </div>
  );
}
