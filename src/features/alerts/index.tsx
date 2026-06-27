import { useCallback, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { AlertFilters } from './components/AlertFilters';
import { AlertList }    from './components/AlertList';
import { AlertDetail }  from './components/AlertDetail';
import { alertsService } from '@/services/alerts.service';
import { useToast } from '@/hooks/useToast';
import type { Alert, AlertFiltersParams } from '@/types/alert.types';

export function AlertCenterPage() {
  const navigate     = useNavigate();
  const queryClient  = useQueryClient();
  const { success, error } = useToast();

  const [filters,     setFilters]     = useState<AlertFiltersParams>({});
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ['alerts', filters],
    queryFn:  () => alertsService.getAll(filters),
    staleTime: 15_000,
  });

  const acknowledgeMutation = useMutation({
    mutationFn: alertsService.acknowledge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      success('Alerta reconocida');
    },
    onError: () => error('Error', 'No se pudo reconocer la alerta.'),
  });

  const handleSelect = useCallback((alert: Alert) => {
    setSelectedAlert(prev => prev?.id === alert.id ? null : alert);
  }, []);

  const handleViewOnMap = useCallback((alert: Alert) => {
    navigate('/map');
  }, [navigate]);

  const handleViewAnimal = useCallback((animalId: string) => {
    navigate('/cattle');
  }, [navigate]);

  const handleCloseDetail = useCallback(() => {
    setSelectedAlert(null);
  }, []);

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <h1 className="text-xl font-semibold text-[#e6edf3]">Centro de alertas</h1>
        <p className="text-sm text-[#8b949e] mt-0.5">
          {isLoading ? 'Cargando…' : `${alerts.length} alerta${alerts.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      <AlertFilters filters={filters} onChange={setFilters} />

      <AlertList
        alerts={alerts}
        isLoading={isLoading}
        selectedId={selectedAlert?.id ?? null}
        onSelect={handleSelect}
        onAcknowledge={(id) => acknowledgeMutation.mutate(id)}
        onViewOnMap={handleViewOnMap}
        onViewAnimal={handleViewAnimal}
      />

      <AlertDetail
        alert={selectedAlert}
        onClose={handleCloseDetail}
      />
    </div>
  );
}
