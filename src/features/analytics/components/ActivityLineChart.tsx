import { useQuery } from '@tanstack/react-query';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { analyticsService } from '@/services/analytics.service';
import type { AnalyticsFilters } from '@/types/analytics.types';

interface Props { filters: AnalyticsFilters; }

function ChartSkeleton() {
  return (
    <div className="w-full h-52 bg-[#21262d] rounded-lg animate-pulse" aria-hidden="true" />
  );
}

export function ActivityLineChart({ filters }: Props) {
  const { data = [], isLoading } = useQuery({
    queryKey: ['analytics:activity', filters],
    queryFn:  () => analyticsService.getActivity(filters),
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
    <div aria-label="Gráfico de actividad del hato" role="img">
      <ResponsiveContainer width="100%" height={208}>
        <LineChart
          data={data}
          margin={{ top: 8, right: 8, bottom: 0, left: -16 }}
        >
          <CartesianGrid
            stroke="#21262d"
            strokeWidth={1}
            vertical={false}
          />
          <XAxis
            dataKey="ts"
            tickFormatter={v => {
              try { return format(new Date(v), 'd MMM', { locale: es }); }
              catch { return ''; }
            }}
            tick={{ fill: '#8b949e', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickMargin={6}
          />
          <YAxis
            tick={{ fill: '#8b949e', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => `${v}km`}
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
            itemStyle={{ color: '#22a05c' }}
            labelFormatter={v => {
              try { return format(new Date(v), "d MMM yyyy, HH:mm", { locale: es }); }
              catch { return String(v); }
            }}
            formatter={(v: unknown) => [`${Number(v).toFixed(1)} km`, 'Actividad media']}
          />
          {/* Single series — no legend box needed (title names it) */}
          <Line
            type="monotone"
            dataKey="avgKm"
            stroke="#22a05c"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#22a05c', stroke: '#161b22', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
