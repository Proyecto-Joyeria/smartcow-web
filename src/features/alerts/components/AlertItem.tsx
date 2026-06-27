import { useState } from 'react';
import { AlertTriangle, Info, MapPin, Eye, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/utils/cn';
import type { Alert, AlertSeverity } from '@/types/alert.types';

const SEVERITY_BORDER: Record<AlertSeverity, string> = {
  CRITICAL: 'border-l-[#f44336]',
  WARNING:  'border-l-[#ffb300]',
  INFO:     'border-l-[#1a7a4a]',
};

const SEVERITY_ICON_BG: Record<AlertSeverity, string> = {
  CRITICAL: 'bg-red-900/30 text-[#f44336]',
  WARNING:  'bg-yellow-900/30 text-[#ffb300]',
  INFO:     'bg-green-900/20 text-[#1a7a4a]',
};

const STATUS_LABEL: Record<Alert['status'], string> = {
  OPEN:         'Abierta',
  ACKNOWLEDGED: 'Reconocida',
  RESOLVED:     'Resuelta',
};

const STATUS_COLOR: Record<Alert['status'], string> = {
  OPEN:         'text-[#f44336]',
  ACKNOWLEDGED: 'text-[#ffb300]',
  RESOLVED:     'text-[#4caf50]',
};

function SeverityIcon({ severity }: { severity: AlertSeverity }) {
  if (severity === 'CRITICAL') return <AlertTriangle size={18} aria-hidden="true" />;
  if (severity === 'WARNING')  return <AlertTriangle size={18} aria-hidden="true" />;
  return <Info size={18} aria-hidden="true" />;
}

export interface AlertItemProps {
  alert:           Alert;
  selected?:       boolean;
  onSelect?:       (alert: Alert) => void;
  onAcknowledge?:  (id: string) => void;
  onViewOnMap?:    (alert: Alert) => void;
  onViewAnimal?:   (animalId: string) => void;
}

export function AlertItem({
  alert,
  selected = false,
  onSelect,
  onAcknowledge,
  onViewOnMap,
  onViewAnimal,
}: AlertItemProps) {
  const [hovered, setHovered] = useState(false);

  const relativeTime = formatDistanceToNow(new Date(alert.createdAt), {
    addSuffix: true,
    locale: es,
  });

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Alerta: ${alert.title}`}
      aria-pressed={selected}
      onClick={() => onSelect?.(alert)}
      onKeyDown={e => e.key === 'Enter' && onSelect?.(alert)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        'flex gap-3 p-4 border-l-4 rounded-r-lg cursor-pointer',
        'border border-[#30363d] transition-colors',
        SEVERITY_BORDER[alert.severity],
        selected
          ? 'bg-[#21262d]'
          : 'bg-[#161b22] hover:bg-[#1c2128]',
      )}
    >
      {/* Ícono 36×36 */}
      <div className={cn(
        'w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5',
        SEVERITY_ICON_BG[alert.severity],
      )}>
        <SeverityIcon severity={alert.severity} />
      </div>

      {/* Contenido */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-[#e6edf3] leading-snug">{alert.title}</p>
          <time
            dateTime={alert.createdAt}
            title={new Date(alert.createdAt).toISOString()}
            className="text-xs text-[#6e7681] whitespace-nowrap shrink-0"
          >
            {relativeTime}
          </time>
        </div>

        <p className="text-xs text-[#8b949e] mt-0.5 leading-relaxed line-clamp-2">
          {alert.description}
        </p>

        <div className="flex items-center gap-3 mt-1">
          <span className={cn('text-xs font-medium', STATUS_COLOR[alert.status])}>
            {STATUS_LABEL[alert.status]}
          </span>
          {alert.animalName && (
            <span className="text-xs text-[#6e7681]">· {alert.animalName}</span>
          )}
        </div>

        {/* Acciones — visibles en hover */}
        {hovered && (
          <div className="flex items-center gap-2 mt-2">
            {alert.animalId && onViewOnMap && (
              <button
                type="button"
                aria-label="Ver en mapa"
                onClick={e => { e.stopPropagation(); onViewOnMap(alert); }}
                className="flex items-center gap-1 text-xs text-[#8b949e] hover:text-[#1a7a4a] transition-colors"
              >
                <MapPin size={12} aria-hidden="true" />
                Ver en mapa
              </button>
            )}
            {alert.animalId && onViewAnimal && (
              <button
                type="button"
                aria-label="Ver animal"
                onClick={e => { e.stopPropagation(); onViewAnimal(alert.animalId!); }}
                className="flex items-center gap-1 text-xs text-[#8b949e] hover:text-[#e6edf3] transition-colors"
              >
                <Eye size={12} aria-hidden="true" />
                Ver res
              </button>
            )}
            {alert.status === 'OPEN' && onAcknowledge && (
              <button
                type="button"
                aria-label="Reconocer alerta"
                onClick={e => { e.stopPropagation(); onAcknowledge(alert.id); }}
                className="flex items-center gap-1 text-xs text-[#8b949e] hover:text-[#4caf50] transition-colors"
              >
                <CheckCircle size={12} aria-hidden="true" />
                Reconocer
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
