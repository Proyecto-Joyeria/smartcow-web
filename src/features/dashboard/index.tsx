import { Activity, AlertTriangle, Wifi, Clock } from 'lucide-react';
import { MetricCard } from './components/MetricCard';

export function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-heading-xl text-primary">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total animales"
          value="—"
          icon={<Activity size={20} />}
        />
        <MetricCard
          label="Alertas activas"
          value="—"
          icon={<AlertTriangle size={20} />}
          variant="warn"
        />
        <MetricCard
          label="Sensores online"
          value="—"
          icon={<Wifi size={20} />}
          variant="ok"
        />
        <MetricCard
          label="Última sincronización"
          value="—"
          icon={<Clock size={20} />}
        />
      </div>

      <div className="bg-surface-card border border-border rounded-lg p-4 min-h-64 flex items-center justify-center">
        <p className="text-secondary text-body">Mapa GPS — próximo sprint</p>
      </div>

      <div className="bg-surface-card border border-border rounded-lg p-4">
        <h2 className="text-heading-md text-primary mb-3">Alertas recientes</h2>
        <p className="text-secondary text-small text-center py-8">Sin alertas recientes</p>
      </div>
    </div>
  );
}
