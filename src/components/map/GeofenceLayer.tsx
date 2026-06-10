import { useEffect, useRef } from 'react';
import { Polygon, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import type { Geofence } from '@/types/geofence.types';

interface DrawControlProps {
  onPolygonCreated: (vertices: [number, number][]) => void;
}

function DrawControl({ onPolygonCreated }: DrawControlProps) {
  const map = useMap();
  const drawnItemsRef = useRef<L.FeatureGroup | null>(null);

  useEffect(() => {
    const drawnItems = new L.FeatureGroup();
    drawnItemsRef.current = drawnItems;
    map.addLayer(drawnItems);

    const drawControl = new (L.Control as any).Draw({
      draw: {
        polygon:   { shapeOptions: { color: '#1a7a4a', weight: 2 } },
        polyline:  false,
        rectangle: false,
        circle:    false,
        circlemarker: false,
        marker:    false,
      },
      edit: { featureGroup: drawnItems },
    });
    map.addControl(drawControl);

    const onCreate = (e: any) => {
      const layer = e.layer as L.Polygon;
      const latlngs = (layer.getLatLngs()[0] as L.LatLng[]).map(
        ll => [ll.lat, ll.lng] as [number, number],
      );
      drawnItems.clearLayers();
      onPolygonCreated(latlngs);
    };

    map.on((L as any).Draw.Event.CREATED, onCreate);

    return () => {
      map.off((L as any).Draw.Event.CREATED, onCreate);
      map.removeControl(drawControl);
      map.removeLayer(drawnItems);
    };
  }, [map, onPolygonCreated]);

  return null;
}

interface GeofenceLayerProps {
  geofences:        Geofence[];
  drawingMode:      boolean;
  onPolygonCreated: (vertices: [number, number][]) => void;
}

export function GeofenceLayer({ geofences, drawingMode, onPolygonCreated }: GeofenceLayerProps) {
  const activeGeofences = geofences.filter(g => g.isActive);

  return (
    <>
      {activeGeofences.map(geofence => (
        <Polygon
          key={geofence.id}
          positions={geofence.vertices}
          pathOptions={{
            color:       geofence.color,
            fillColor:   geofence.color,
            fillOpacity: 0.15,
            weight:      2,
          }}
        >
        </Polygon>
      ))}
      {drawingMode && <DrawControl onPolygonCreated={onPolygonCreated} />}
    </>
  );
}
