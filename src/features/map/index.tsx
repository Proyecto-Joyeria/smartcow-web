import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MapPinned } from 'lucide-react';
import { MapView }        from './components/MapView';
import { FilterPanel }    from './components/FilterPanel';
import { GeofencePanel }  from './components/GeofencePanel';
import { GeofenceModal }  from './components/GeofenceModal';
import { useGpsSubscription }   from '@/hooks/useGpsSubscription';
import { useGeofenceEvents }    from '@/hooks/useGeofenceEvents';
import { geofencesService }     from '@/services/geofences.service';
import type { LiveStatus }      from '@/store/slices/gpsSlice';
import type { Geofence }        from '@/types/geofence.types';

const ALL_STATUSES = new Set<LiveStatus>([
  'HEALTHY', 'WARNING', 'CRITICAL', 'OFFLINE', 'PREGNANT',
]);

type ModalState =
  | { open: false }
  | { open: true; mode: 'create'; pendingVertices: [number, number][] }
  | { open: true; mode: 'edit';   editingGeofence: Geofence };

export function MapPage() {
  useGpsSubscription();
  useGeofenceEvents();

  const [activeStatuses,   setActiveStatuses]   = useState<Set<LiveStatus>>(ALL_STATUSES);
  const [selectedAnimalId, setSelectedAnimalId] = useState<string | null>(null);
  const [panelOpen,        setPanelOpen]        = useState(false);
  const [drawingMode,      setDrawingMode]       = useState(false);
  const [modal,            setModal]             = useState<ModalState>({ open: false });

  const { data: geofences = [] } = useQuery({
    queryKey: ['geofences'],
    queryFn:  geofencesService.getAll,
    staleTime: 60_000,
  });

  const handleMarkerSelect = useCallback((id: string) => {
    setSelectedAnimalId(prev => (prev === id ? null : id));
  }, []);

  const handleNewGeofence = useCallback(() => {
    setPanelOpen(false);
    setDrawingMode(true);
  }, []);

  const handlePolygonCreated = useCallback((vertices: [number, number][]) => {
    setDrawingMode(false);
    setModal({ open: true, mode: 'create', pendingVertices: vertices });
  }, []);

  const handleEditGeofence = useCallback((geofence: Geofence) => {
    setModal({ open: true, mode: 'edit', editingGeofence: geofence });
  }, []);

  const handleCloseModal = useCallback(() => {
    setModal({ open: false });
  }, []);

  return (
    <div className="absolute inset-0 -m-6">
      <MapView
        activeStatuses={activeStatuses}
        selectedAnimalId={selectedAnimalId}
        geofences={geofences}
        drawingMode={drawingMode}
        onMarkerSelect={handleMarkerSelect}
        onPolygonCreated={handlePolygonCreated}
      />

      <FilterPanel
        activeStatuses={activeStatuses}
        onChange={setActiveStatuses}
      />

      {/* Botón para abrir panel de geocercas */}
      <button
        type="button"
        aria-label="Gestionar geocercas"
        aria-pressed={panelOpen}
        onClick={() => setPanelOpen(v => !v)}
        className="absolute top-4 left-4 z-[1000] w-9 h-9 flex items-center justify-center rounded-lg bg-[#161b22] border border-[#30363d] text-[#8b949e] hover:text-[#e6edf3] hover:border-[#1a7a4a] transition-colors shadow-md"
      >
        <MapPinned size={18} aria-hidden="true" />
      </button>

      {drawingMode && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[1000] px-4 py-2 bg-[#161b22] border border-[#1a7a4a] rounded-lg text-xs text-[#22a05c] shadow-lg pointer-events-none">
          Dibuja el polígono en el mapa — haz clic para cada vértice, doble clic para cerrar
        </div>
      )}

      {panelOpen && (
        <GeofencePanel
          onClose={() => setPanelOpen(false)}
          onNewGeofence={handleNewGeofence}
          onEditGeofence={handleEditGeofence}
        />
      )}

      {modal.open && (
        <GeofenceModal
          mode={modal.mode}
          pendingVertices={modal.mode === 'create' ? modal.pendingVertices : null}
          editingGeofence={modal.mode === 'edit' ? modal.editingGeofence : null}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
