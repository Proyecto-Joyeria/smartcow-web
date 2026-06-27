import { AlertItem } from './AlertItem';
import type { Alert } from '@/types/alert.types';
import type { AlertItemProps } from './AlertItem';

interface AlertListProps
  extends Pick<AlertItemProps, 'onSelect' | 'onAcknowledge' | 'onViewOnMap' | 'onViewAnimal'> {
  alerts:      Alert[];
  isLoading:   boolean;
  selectedId:  string | null;
}

function SkeletonRow() {
  return (
    <div className="flex gap-3 p-4 border-l-4 border-l-[#30363d] border border-[#30363d] rounded-r-lg bg-[#161b22] animate-pulse">
      <div className="w-9 h-9 rounded-lg bg-[#21262d] shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <div className="h-3.5 bg-[#21262d] rounded w-2/3" />
        <div className="h-3 bg-[#21262d] rounded w-full" />
        <div className="h-3 bg-[#21262d] rounded w-1/3" />
      </div>
    </div>
  );
}

export function AlertList({
  alerts,
  isLoading,
  selectedId,
  onSelect,
  onAcknowledge,
  onViewOnMap,
  onViewAnimal,
}: AlertListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <p className="text-4xl" aria-hidden="true">🔔</p>
        <p className="text-sm text-[#8b949e] text-center">No hay alertas con los filtros actuales.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2" role="list" aria-label="Lista de alertas">
      {alerts.map(alert => (
        <div key={alert.id} role="listitem">
          <AlertItem
            alert={alert}
            selected={selectedId === alert.id}
            onSelect={onSelect}
            onAcknowledge={onAcknowledge}
            onViewOnMap={onViewOnMap}
            onViewAnimal={onViewAnimal}
          />
        </div>
      ))}
    </div>
  );
}
