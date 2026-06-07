import { memo } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { cn } from '@/utils/cn';
import type { GPSPosition } from '@/store/slices/gpsSlice';
import type { HealthStatus } from '@/types/animal.types';

interface MarkerConfig {
  size:      number;
  color:     string;
  ringClass: string;
  opacity:   number;
}

const MARKER_CONFIG: Record<HealthStatus, MarkerConfig> = {
  HEALTHY:  { size: 14, color: '#4caf50', ringClass: 'animate-ping-slow',   opacity: 1   },
  WARNING:  { size: 14, color: '#ffb300', ringClass: 'animate-ping-medium', opacity: 1   },
  CRITICAL: { size: 16, color: '#f44336', ringClass: 'animate-ping-fast',   opacity: 1   },
  OFFLINE:  { size: 12, color: '#6e7681', ringClass: '',                    opacity: 0.7 },
  PREGNANT: { size: 14, color: '#ce93d8', ringClass: '',                    opacity: 1   },
};

function createDivIcon(cfg: MarkerConfig, status: HealthStatus): L.DivIcon {
  const hasRing = cfg.ringClass !== '';
  const zIndex  = status === 'CRITICAL' ? 'z-[1000]' : 'z-[500]';

  const html = `
    <div class="relative flex items-center justify-center" style="width:${cfg.size + 16}px;height:${cfg.size + 16}px">
      ${hasRing ? `
        <span class="absolute inline-flex rounded-full ${cfg.ringClass}"
          style="width:${cfg.size}px;height:${cfg.size}px;background-color:${cfg.color};opacity:0.6">
        </span>
      ` : ''}
      <span class="relative inline-flex rounded-full ${zIndex}"
        style="width:${cfg.size}px;height:${cfg.size}px;background-color:${cfg.color};opacity:${cfg.opacity}">
      </span>
    </div>
  `;

  return L.divIcon({
    html,
    className:   '',
    iconSize:    [cfg.size + 16, cfg.size + 16],
    iconAnchor:  [(cfg.size + 16) / 2, (cfg.size + 16) / 2],
    popupAnchor: [0, -(cfg.size + 16) / 2],
  });
}

interface AnimalMarkerProps {
  position: GPSPosition;
  onSelect?: (animalId: string) => void;
}

export const AnimalMarker = memo(
  function AnimalMarker({ position, onSelect }: AnimalMarkerProps) {
    const cfg  = MARKER_CONFIG[position.status];
    const icon = createDivIcon(cfg, position.status);

    const statusLabel: Record<HealthStatus, string> = {
      HEALTHY:  'Sano',
      WARNING:  'Alerta',
      CRITICAL: 'Crítico',
      OFFLINE:  'Sin señal',
      PREGNANT: 'Gestante',
    };

    return (
      <Marker
        position={[position.lat, position.lng]}
        icon={icon}
        eventHandlers={{ click: () => onSelect?.(position.animalId) }}
        aria-label={`Marcador: ${position.name ?? position.animalId}`}
      >
        <Popup>
          <div className={cn('min-w-[140px] text-small')}>
            <p className="font-medium text-heading-md mb-1">
              {position.name ?? position.animalId}
            </p>
            <p>Estado: <strong>{statusLabel[position.status]}</strong></p>
            <p className="text-secondary font-mono text-[11px] mt-1">
              {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
            </p>
            {position.ts && (
              <p className="text-secondary text-[11px]">
                {new Date(position.ts).toLocaleTimeString('es-CO')}
              </p>
            )}
          </div>
        </Popup>
      </Marker>
    );
  },
  (prev, next) =>
    prev.position.lat    === next.position.lat &&
    prev.position.lng    === next.position.lng &&
    prev.position.status === next.position.status,
);
