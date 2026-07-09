import { CheckCircle, AlertTriangle, AlertOctagon, Stethoscope, Eye } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { HealthStatus } from '@/types/animal.types';

interface StatusBadgeProps {
  status: HealthStatus;
  className?: string;
}

const BADGE_CONFIG: Record<
  HealthStatus,
  { label: string; icon: React.ElementType; className: string }
> = {
  HEALTHY:           { label: 'Sana',            icon: CheckCircle,  className: 'bg-green-900/20 text-green-400'   },
  SICK:              { label: 'Enferma',         icon: AlertTriangle, className: 'bg-yellow-900/20 text-yellow-400' },
  RECOVERING:        { label: 'En recuperación', icon: Stethoscope,  className: 'bg-blue-900/20 text-blue-400'     },
  UNDER_OBSERVATION: { label: 'En observación',  icon: Eye,          className: 'bg-purple-900/20 text-purple-300' },
  CRITICAL:          { label: 'Crítico',         icon: AlertOctagon, className: 'bg-red-900/20 text-red-400'       },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const { label, icon: Icon, className: badgeClass } = BADGE_CONFIG[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-1 rounded-sm text-badge font-semibold shrink-0',
        badgeClass,
        className,
      )}
      aria-label={`Estado: ${label}`}
    >
      <Icon size={12} aria-hidden="true" />
      {label}
    </span>
  );
}
