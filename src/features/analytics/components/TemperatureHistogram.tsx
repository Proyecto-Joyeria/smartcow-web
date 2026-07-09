import { useQuery } from '@tanstack/react-query';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import { analyticsService } from '@/services/analytics.service';
import type { AnalyticsFilters, TemperatureBucket } from '@/types/analytics.types';

interface Props { filters: AnalyticsFilters; }

function ChartSkeleton() {
  return (
    <div className="w-full h-52 bg-[#21262d] rounded-lg animate-pulse" aria-hidden="true" />
  );
}

/**
 * Color semántico por rango de temperatura:
 * <38 °C → azul (hipotermia), 38–39 °C → verde (normal),
 * 39–39.5 °C → ámbar (elevada), >39.5 °C → rojo (crítica)
 */
function bucketColor(range: string): string {
  const low = parseFloat(range);
  if (isNaN(low))    return '#22a05c';
  if (low < 38.0)    return '#2196f3';
  if (low < 39.0)    return '#22a05c';
  if (low < 39.5)    return '#ffb300';
  return '#f44336';
}

export function TemperatureHistogram({ filters }: Props) {
  const { data = [], isLoading } = useQuery({
    queryKey: ['analytics:temperature', filters],
    queryFn:  () => analyticsService.getTemperatureDistribution(filters),
    staleTime: 60_000,
  });

  if (isLoading) return <ChartSkeleton />;

  if (data.length === 0) {
    return (
      <div
        role="status"
        className="flex items-center justify-center h-52 text-sm text-[#8b949e]"
      >
        Sin datos para el período seleccionado
      </div>
    );
  }

  return (
    <div aria-label="Histograma de distribución de temperatura" role="img">
      {/* Leyenda de colores (fuera del chart — texto no usa color de datos) */}
      <div className="flex items-center gap-4 mb-2 flex-wrap">
        {[
          { color: '#2196f3', label: '< 38 °C' },
          { color: '#22a05c', label: '38–39 °C' },
          { color: '#ffb300', label: '39–39.5 °C' },
          { color: '#f44336', label: '> 39.5 °C' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-sm shrink-0"
              style={{ backgroundColor: color }}
              aria-hidden="true"
            />
            <span className="text-xs text-[#8b949e]">{label}</span>
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <BarChart
          data={data}
          margin={{ top: 4, right: 8, bottom: 0, left: -16 }}
          barSize={20}
        >
          <CartesianGrid stroke="#21262d" strokeWidth={1} vertical={false} />
          <XAxis
            dataKey="range"
            tick={{ fill: '#8b949e', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickMargin={6}
          />
          <YAxis
            tick={{ fill: '#8b949e', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              background:   '#161b22',
              border:       '1px solid #30363d',
              borderRadius: 8,
              fontSize:     12,
              color:        '#e6edf3',
            }}
            labelStyle={{ color: '#8b949e', marginBottom: 4 }}
            cursor={{ fill: '#1c2128' }}
            formatter={(v: unknown) => [v, 'Animales']}
          />
          {/* Bars coloreadas por rango semántico — identidad por label+color */}
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {(data as TemperatureBucket[]).map((entry, i) => (
              <Cell key={i} fill={bucketColor(entry.range)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
