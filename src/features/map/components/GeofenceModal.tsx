import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { geofencesService } from '@/services/geofences.service';
import type { Geofence } from '@/types/geofence.types';

const PRESET_COLORS = [
  '#1a7a4a', '#22a05c', '#ffb300', '#f44336',
  '#2196f3', '#9c27b0', '#ff5722', '#00bcd4',
];

const schema = z.object({
  name:  z.string().min(1, 'El nombre es requerido').max(60, 'Máximo 60 caracteres'),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Color inválido'),
});

type FormValues = z.infer<typeof schema>;

export interface GeofenceModalProps {
  mode:             'create' | 'edit';
  pendingVertices:  [number, number][] | null;
  editingGeofence:  Geofence | null;
  onClose:          () => void;
}

export function GeofenceModal({
  mode,
  pendingVertices,
  editingGeofence,
  onClose,
}: GeofenceModalProps) {
  const queryClient = useQueryClient();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name:  editingGeofence?.name  ?? '',
      color: editingGeofence?.color ?? PRESET_COLORS[0],
    },
  });

  const selectedColor = watch('color');

  useEffect(() => {
    if (editingGeofence) {
      setValue('name',  editingGeofence.name);
      setValue('color', editingGeofence.color);
    }
  }, [editingGeofence, setValue]);

  const createMutation = useMutation({
    mutationFn: geofencesService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['geofences'] });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<{ name: string; color: string }> }) =>
      geofencesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['geofences'] });
      onClose();
    },
  });

  const onSubmit = (values: FormValues) => {
    if (mode === 'create' && pendingVertices) {
      createMutation.mutate({ ...values, vertices: pendingVertices });
    } else if (mode === 'edit' && editingGeofence) {
      updateMutation.mutate({ id: editingGeofence.id, data: values });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;
  const title     = mode === 'create' ? 'Nueva geocerca' : 'Editar geocerca';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[2000] flex items-center justify-center"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className={cn(
        'relative w-full max-w-sm mx-4',
        'bg-[#161b22] border border-[#30363d] rounded-xl shadow-2xl',
        'flex flex-col',
      )}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#30363d]">
          <h2 className="text-base font-semibold text-[#e6edf3]">{title}</h2>
          <button
            type="button"
            aria-label="Cerrar modal"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#21262d] transition-colors"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="p-5 flex flex-col gap-5">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="geofence-name" className="text-xs font-medium text-[#8b949e]">
              Nombre
            </label>
            <input
              id="geofence-name"
              type="text"
              placeholder="Ej: Potrero norte"
              autoFocus
              {...register('name')}
              className={cn(
                'w-full bg-[#0d1117] border rounded-lg px-3 py-2 text-sm text-[#e6edf3]',
                'placeholder:text-[#6e7681] outline-none transition-colors',
                errors.name
                  ? 'border-[#f44336] focus:border-[#f44336]'
                  : 'border-[#30363d] focus:border-[#1a7a4a]',
              )}
            />
            {errors.name && (
              <p role="alert" className="text-xs text-[#f44336]">{errors.name.message}</p>
            )}
          </div>

          {/* Color */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-[#8b949e]">Color</p>
            <div className="flex items-center gap-2 flex-wrap">
              {PRESET_COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  aria-label={`Color ${color}`}
                  onClick={() => setValue('color', color)}
                  className={cn(
                    'w-7 h-7 rounded-full border-2 transition-transform hover:scale-110',
                    selectedColor === color
                      ? 'border-[#e6edf3] scale-110'
                      : 'border-transparent',
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
              <input
                type="color"
                aria-label="Color personalizado"
                value={selectedColor}
                onChange={e => setValue('color', e.target.value)}
                className="w-7 h-7 rounded cursor-pointer bg-transparent border border-[#30363d]"
              />
            </div>
          </div>

          {/* Vertices info (create only) */}
          {mode === 'create' && pendingVertices && (
            <p className="text-xs text-[#8b949e]">
              Polígono con {pendingVertices.length} vértices listo.
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className={cn(
                'flex-1 py-2 rounded-lg border border-[#30363d]',
                'text-sm text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#21262d]',
                'transition-colors',
              )}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className={cn(
                'flex-1 py-2 rounded-lg text-sm font-medium text-white transition-colors',
                isPending
                  ? 'bg-[#0f4d2e] cursor-not-allowed'
                  : 'bg-[#1a7a4a] hover:bg-[#22a05c]',
              )}
            >
              {isPending ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
