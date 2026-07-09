import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/analytics.service';
import type { AnalyticsFilters, HeatmapCell } from '@/types/analytics.types';

interface Props { filters: AnalyticsFilters; }

/* ── Layout constants ── */
const CELL_W  = 26;
const CELL_H  = 22;
const LABEL_W = 108;
const HEADER_H = 22;
const HOURS   = Array.from({ length: 24 }, (_, i) => i);

/* ── Sequential color scale (single green hue, dark surface → bright green) ── */
function heatColor(value: number): string {
  if (value <= 0) return '#21262d';
  // 0→0.5: surface #21262d → brand #1a7a4a
  if (value <= 0.5) {
    const t = value * 2;
    const r = Math.round(0x21 + (0x1a - 0x21) * t);
    const g = Math.round(0x26 + (0x7a - 0x26) * t);
    const b = Math.round(0x2d + (0x4a - 0x2d) * t);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }
  // 0.5→1: brand #1a7a4a → bright #4caf50
  const t = (value - 0.5) * 2;
  const r = Math.round(0x1a + (0x4c - 0x1a) * t);
  const g = Math.round(0x7a + (0xaf - 0x7a) * t);
  const b = Math.round(0x4a + (0x50 - 0x4a) * t);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function groupByAnimal(
  cells: HeatmapCell[],
): Array<{ id: string; name: string; byHour: Map<number, number> }> {
  const map = new Map<string, { name: string; byHour: Map<number, number> }>();
  for (const cell of cells) {
    if (!map.has(cell.animalId)) {
      map.set(cell.animalId, { name: cell.animalName, byHour: new Map() });
    }
    map.get(cell.animalId)!.byHour.set(cell.hour, cell.value);
  }
  return Array.from(map.entries()).map(([id, v]) => ({ id, ...v }));
}

function HeatmapSkeleton() {
  return <div className="w-full h-44 bg-[#21262d] rounded-lg animate-pulse" aria-hidden="true" />;
}

export function ActivityHeatmap({ filters }: Props) {
  const { data = [], isLoading } = useQuery({
    queryKey: ['analytics:heatmap', filters],
    queryFn:  () => analyticsService.getHeatmap(filters),
    staleTime: 60_000,
  });

  if (isLoading) return <HeatmapSkeleton />;

  const rows  = groupByAnimal(data);
  const svgW  = LABEL_W + HOURS.length * CELL_W;
  const svgH  = HEADER_H + rows.length * CELL_H + 32; // +32 for legend

  if (rows.length === 0) {
    return (
      <div
        role="status"
        className="flex items-center justify-center h-44 text-sm text-[#8b949e]"
      >
        Sin datos de actividad
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <svg
        role="img"
        aria-label="Mapa de calor de actividad por animal y hora del día"
        width={svgW}
        height={svgH}
        style={{ display: 'block', minWidth: svgW }}
      >
        {/* Hour headers — only label multiples of 6 to avoid crowding */}
        {HOURS.map(h => (
          <text
            key={h}
            x={LABEL_W + h * CELL_W + CELL_W / 2}
            y={HEADER_H - 6}
            textAnchor="middle"
            fill="#6e7681"
            fontSize={9}
            fontFamily="inherit"
          >
            {h % 6 === 0 ? `${String(h).padStart(2, '0')}h` : ''}
          </text>
        ))}

        {/* Animal rows */}
        {rows.map(({ id, name, byHour }, rowIdx) => (
          <g key={id}>
            <text
              x={LABEL_W - 6}
              y={HEADER_H + rowIdx * CELL_H + CELL_H / 2 + 4}
              textAnchor="end"
              fill="#8b949e"
              fontSize={10}
              fontFamily="inherit"
            >
              {name.length > 13 ? `${name.slice(0, 12)}…` : name}
            </text>

            {HOURS.map(h => {
              const value = byHour.get(h) ?? 0;
              return (
                <rect
                  key={h}
                  x={LABEL_W + h * CELL_W + 1}
                  y={HEADER_H + rowIdx * CELL_H + 1}
                  width={CELL_W - 2}
                  height={CELL_H - 2}
                  rx={2}
                  fill={heatColor(value)}
                  aria-label={`${name}, ${String(h).padStart(2, '0')}:00 — ${Math.round(value * 100)}%`}
                />
              );
            })}
          </g>
        ))}

        {/* Color legend — sequential, single hue */}
        <g transform={`translate(${LABEL_W}, ${HEADER_H + rows.length * CELL_H + 10})`}>
          {Array.from({ length: 10 }, (_, i) => i / 9).map((v, i) => (
            <rect
              key={i}
              x={i * 16}
              y={0}
              width={15}
              height={8}
              rx={1}
              fill={heatColor(v)}
            />
          ))}
          <text x={0}   y={20} fill="#6e7681" fontSize={9} fontFamily="inherit">Sin actividad</text>
          <text x={144} y={20} fill="#6e7681" fontSize={9} textAnchor="end" fontFamily="inherit">Alta</text>
        </g>
      </svg>
    </div>
  );
}
