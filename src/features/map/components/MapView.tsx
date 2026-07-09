import { MapContainer, TileLayer } from 'react-leaflet';
import { AnimalMarkerLayer } from '@/components/map/AnimalMarkerLayer';
import { RouteHistory }      from '@/components/map/RouteHistory';
import { GeofenceLayer }     from '@/components/map/GeofenceLayer';
import type { LiveStatus }   from '@/store/slices/gpsSlice';
import type { Geofence }     from '@/types/geofence.types';

const MAP_CENTER: [number, number] = [4.7110, -74.0721];
const MAP_ZOOM = 13;

interface MapViewProps {
  activeStatuses:   Set<LiveStatus>;
  selectedAnimalId: string | null;
  geofences:        Geofence[];
  drawingMode:      boolean;
  onMarkerSelect:   (animalId: string) => void;
  onPolygonCreated: (vertices: [number, number][]) => void;
}

export function MapView({
  activeStatuses,
  selectedAnimalId,
  geofences,
  drawingMode,
  onMarkerSelect,
  onPolygonCreated,
}: MapViewProps) {
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
      <GeofenceLayer
        geofences={geofences}
        drawingMode={drawingMode}
        onPolygonCreated={onPolygonCreated}
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
