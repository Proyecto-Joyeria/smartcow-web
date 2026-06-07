import { useState, useCallback } from 'react';
import { MapView }     from './components/MapView';
import { FilterPanel } from './components/FilterPanel';
import { useGpsSubscription } from '@/hooks/useGpsSubscription';
import type { HealthStatus } from '@/types/animal.types';

const ALL_STATUSES = new Set<HealthStatus>([
  'HEALTHY', 'WARNING', 'CRITICAL', 'OFFLINE', 'PREGNANT',
]);

export function MapPage() {
  useGpsSubscription();

  const [activeStatuses,   setActiveStatuses]   = useState<Set<HealthStatus>>(ALL_STATUSES);
  const [selectedAnimalId, setSelectedAnimalId] = useState<string | null>(null);

  const handleMarkerSelect = useCallback((id: string) => {
    setSelectedAnimalId(prev => (prev === id ? null : id));
  }, []);

  return (
    <div className="absolute inset-0 -m-6">
      <MapView
        activeStatuses={activeStatuses}
        selectedAnimalId={selectedAnimalId}
        onMarkerSelect={handleMarkerSelect}
      />
      <FilterPanel
        activeStatuses={activeStatuses}
        onChange={setActiveStatuses}
      />
    </div>
  );
}
