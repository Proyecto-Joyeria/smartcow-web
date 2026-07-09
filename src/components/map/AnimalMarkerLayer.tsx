import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { AnimalMarker } from './AnimalMarker';
import { selectAllPositions } from '@/store/slices/gpsSlice';
import type { LiveStatus } from '@/store/slices/gpsSlice';

interface AnimalMarkerLayerProps {
  activeStatuses: Set<LiveStatus>;
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
