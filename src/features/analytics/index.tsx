import { useState } from 'react';
import type { ReactNode } from 'react';
import { ActivityLineChart }    from './components/ActivityLineChart';
import { TemperatureHistogram } from './components/TemperatureHistogram';
import { ActivityHeatmap }      from './components/ActivityHeatmap';
import { RiskTable }            from './components/RiskTable';
import { AnalyticsFilters }     from './components/AnalyticsFilters';
import { ExportButton }         from './components/ExportButton';
import { ErrorBoundary }        from '@/components/common/ErrorBoundary';
import type { AnalyticsFilters as Filters } from '@/types/analytics.types';

interface ChartCardProps {
  title:    string;
  children: ReactNode;
}

function ChartCard({ title, children }: ChartCardProps) {
  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 flex flex-col gap-3">
      <p className="text-sm font-semibold text-[#e6edf3]">{title}</p>
      {children}
    </div>
  );
}

export function AnalyticsPage() {
  const [filters, setFilters] = useState<Filters>({});

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold text-[#e6edf3]">Análisis del hato</h1>
          <p className="text-sm text-[#8b949e] mt-0.5">Métricas de comportamiento y predicciones IA</p>
        </div>
        <ExportButton filters={filters} />
      </div>

      {/* Filters */}
      <AnalyticsFilters filters={filters} onChange={setFilters} />

      {/* Charts 2-col grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Actividad del hato">
          {/* ErrorBoundary por si recharts falla en este entorno — el resto de la página sigue funcionando */}
          <ErrorBoundary>
            <ActivityLineChart filters={filters} />
          </ErrorBoundary>
        </ChartCard>

        <ChartCard title="Distribución de temperatura por raza">
          <ErrorBoundary>
            <TemperatureHistogram filters={filters} />
          </ErrorBoundary>
        </ChartCard>
      </div>

      {/* Heatmap — full width */}
      <ChartCard title="Actividad 24h por animal">
        <ActivityHeatmap filters={filters} />
      </ChartCard>

      {/* Risk table */}
      <ChartCard title="Top animales en riesgo (IA)">
        <RiskTable />
      </ChartCard>
    </div>
  );
}
