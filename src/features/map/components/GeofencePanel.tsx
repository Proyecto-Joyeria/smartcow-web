import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Eye, EyeOff, Pencil, Plus, Trash2, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { geofencesService } from '@/services/geofences.service';
import type { Geofence } from '@/types/geofence.types';

interface GeofencePanelProps {
  onClose:          () => void;
  onNewGeofence:    () => void;
  onEditGeofence:   (geofence: Geofence) => void;
}

function GeofenceRow({
  geofence,
  onToggle,
  onEdit,
  onDelete,
}: {
  geofence: Geofence;
  onToggle: (id: string, active: boolean) => void;
  onEdit:   (geofence: Geofence) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg border transition-colors',
        geofence.isActive
          ? 'border-[#30363d] bg-[#161b22]'
          : 'border-[#21262d] bg-[#0d1117] opacity-60',
      )}
    >
      <span
        className="w-3 h-3 rounded-full shrink-0"
        style={{ backgroundColor: geofence.color }}
        aria-hidden="true"
      />
      <p className="flex-1 text-sm font-medium text-[#e6edf3] truncate">{geofence.name}</p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label={geofence.isActive ? 'Desactivar geocerca' : 'Activar geocerca'}
          onClick={() => onToggle(geofence.id, !geofence.isActive)}
          className="w-7 h-7 flex items-center justify-center rounded text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#21262d] transition-colors"
        >
          {geofence.isActive
            ? <Eye size={14} aria-hidden="true" />
            : <EyeOff size={14} aria-hidden="true" />
          }
        </button>
        <button
          type="button"
          aria-label="Editar geocerca"
          onClick={() => onEdit(geofence)}
          className="w-7 h-7 flex items-center justify-center rounded text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#21262d] transition-colors"
        >
          <Pencil size={14} aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Eliminar geocerca"
          onClick={() => onDelete(geofence.id)}
          className="w-7 h-7 flex items-center justify-center rounded text-[#8b949e] hover:text-[#f44336] hover:bg-red-900/20 transition-colors"
        >
          <Trash2 size={14} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export function GeofencePanel({ onClose, onNewGeofence, onEditGeofence }: GeofencePanelProps) {
  const queryClient = useQueryClient();

  const { data: geofences = [], isLoading } = useQuery({
    queryKey: ['geofences'],
    queryFn:  geofencesService.getAll,
    staleTime: 60_000,
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      geofencesService.toggle(id, isActive),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['geofences'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: geofencesService.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['geofences'] }),
  });

  return (
    <aside
      aria-label="Panel de geocercas"
      className={cn(
        'absolute top-4 left-14 z-[1000]',
        'w-72 max-h-[calc(100vh-6rem)]',
        'bg-[#161b22] border border-[#30363d] rounded-xl shadow-2xl',
        'flex flex-col',
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#30363d] shrink-0">
        <h2 className="text-sm font-semibold text-[#e6edf3]">Geocercas</h2>
        <button
          type="button"
          aria-label="Cerrar panel de geocercas"
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#21262d] transition-colors"
        >
          <X size={14} aria-hidden="true" />
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
        {isLoading && (
          <div className="flex flex-col gap-2 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-[#21262d] rounded-lg" />
            ))}
          </div>
        )}

        {!isLoading && geofences.length === 0 && (
          <p className="text-xs text-[#8b949e] text-center py-6">
            No hay geocercas configuradas.
          </p>
        )}

        {geofences.map(geofence => (
          <GeofenceRow
            key={geofence.id}
            geofence={geofence}
            onToggle={(id, isActive) => toggleMutation.mutate({ id, isActive })}
            onEdit={onEditGeofence}
            onDelete={(id) => deleteMutation.mutate(id)}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="px-3 pb-3 shrink-0">
        <button
          type="button"
          onClick={onNewGeofence}
          className={cn(
            'w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg',
            'bg-[#1a7a4a] hover:bg-[#22a05c] text-white text-sm font-medium',
            'transition-colors',
          )}
        >
          <Plus size={15} aria-hidden="true" />
          Nueva geocerca
        </button>
      </div>
    </aside>
  );
}
