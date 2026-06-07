import { useSelector } from 'react-redux';
import { Polyline } from 'react-leaflet';
import { selectRouteHistory } from '@/store/slices/gpsSlice';
import type { RootState } from '@/store';
import type { HealthStatus } from '@/types/animal.types';

const ROUTE_COLOR: Record<HealthStatus, string> = {
  HEALTHY:  '#4caf50',
  WARNING:  '#ffb300',
  CRITICAL: '#f44336',
  OFFLINE:  '#6e7681',
  PREGNANT: '#ce93d8',
};

interface RouteHistoryProps {
  animalId: string;
  status:   HealthStatus;
}

export function RouteHistory({ animalId, status }: RouteHistoryProps) {
  const history = useSelector((state: RootState) => selectRouteHistory(animalId)(state));

  if (history.length < 2) return null;

  return (
    <Polyline
      positions={history}
      color={ROUTE_COLOR[status]}
      weight={2}
      opacity={0.6}
      dashArray="4 4"
    />
  );
}
