import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { AnimalMarker } from './AnimalMarker';
import { selectAllPositions } from '@/store/slices/gpsSlice';
import type { HealthStatus } from '@/types/animal.types';

interface AnimalMarkerLayerProps {
  activeStatuses: Set<HealthStatus>;
  onMarkerSelect: (animalId: string) => void;
}

export function AnimalMarkerLayer({ activeStatuses, onMarkerSelect }: AnimalMarkerLayerProps) {
  const positions = useSelector(selectAllPositions);

  const handleSelect = useCallback(
    (id: string) => onMarkerSelect(id),
    [onMarkerSelect],
  );

  return (
    <>
      {positions
        .filter(p => activeStatuses.has(p.status))
        .map(position => (
          <AnimalMarker
            key={position.animalId}
            position={position}
            onSelect={handleSelect}
          />
        ))}
    </>
  );
}
