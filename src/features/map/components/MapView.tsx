import { MapContainer, TileLayer } from 'react-leaflet';
import { AnimalMarkerLayer } from '@/components/map/AnimalMarkerLayer';
import { RouteHistory }      from '@/components/map/RouteHistory';
import type { HealthStatus } from '@/types/animal.types';

const MAP_CENTER: [number, number] = [4.7110, -74.0721];
const MAP_ZOOM = 13;

interface MapViewProps {
  activeStatuses:  Set<HealthStatus>;
  selectedAnimalId: string | null;
  onMarkerSelect:  (animalId: string) => void;
}

export function MapView({ activeStatuses, selectedAnimalId, onMarkerSelect }: MapViewProps) {
  return (
    <MapContainer
      center={MAP_CENTER}
      zoom={MAP_ZOOM}
      className="w-full h-full"
      zoomControl={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <AnimalMarkerLayer
        activeStatuses={activeStatuses}
        onMarkerSelect={onMarkerSelect}
      />
      {selectedAnimalId && (
        <RouteHistory animalId={selectedAnimalId} status="HEALTHY" />
      )}
    </MapContainer>
  );
}
