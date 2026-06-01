import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { X, Edit2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { VitalCard } from '@/components/charts/VitalCard';
import { animalsService } from '@/services/animals.service';
import type { AnimalVitals } from '@/types/animal.types';

const STATIC_VITALS: AnimalVitals = {
  temperature: { value: 38.5, unit: '°C',  trend: '↔', history: [38.2, 38.4, 38.5, 38.3, 38.5] },
  heartRate:   { value: 72,   unit: 'bpm', trend: '↓', history: [75, 74, 73, 72, 72]             },
  activity:    { value: 6.2,  unit: 'km',  trend: '↑', history: [4.1, 5.0, 5.8, 6.0, 6.2]       },
  battery:     { value: 87,   unit: '%',   trend: '↓', history: [95, 93, 91, 89, 87]             },
};

interface CattleDetailProps {
  animalId: string | null;
  onClose:  () => void;
  onEdit:   (id: string) => void;
}

export function CattleDetail({ animalId, onClose, onEdit }: CattleDetailProps) {
  const { data: animal, isLoading } = useQuery({
    queryKey: ['animals', animalId],
    queryFn:  () => animalsService.getById(animalId!),
    enabled:  !!animalId,
  });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const isOpen = !!animalId;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        aria-label="Ficha del animal"
        aria-hidden={!isOpen}
        className={cn(
          'fixed right-0 top-0 md:top-14 z-30',
          'h-full md:h-[calc(100vh-3.5rem)]',
          'w-full md:w-[360px]',
          'bg-surface-card border-l border-border shadow-2xl',
          'flex flex-col',
          'transition-transform duration-[250ms] ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
          <h2 className="text-heading-lg text-primary">Ficha del animal</h2>
          <div className="flex items-center gap-1">
            {animal && (
              <button
                type="button"
                aria-label="Editar animal"
                onClick={() => onEdit(animal.id)}
                className="w-9 h-9 flex items-center justify-center rounded-md text-secondary hover:text-primary hover:bg-surface-elevated transition-colors"
              >
                <Edit2 size={16} aria-hidden="true" />
              </button>
            )}
            <button
              type="button"
              aria-label="Cerrar panel"
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-md text-secondary hover:text-primary hover:bg-surface-elevated transition-colors"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {isLoading && (
            <div className="flex flex-col gap-3 animate-pulse">
              <div className="h-5 bg-surface-elevated rounded w-2/3" />
              <div className="h-4 bg-surface-elevated rounded w-1/3" />
              <div className="grid grid-cols-2 gap-3 mt-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-24 bg-surface-elevated rounded-lg" />
                ))}
              </div>
            </div>
          )}

          {animal && (
            <>
              {/* Identity */}
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="text-heading-md text-primary">
                    {animal.name ?? animal.code}
                  </h3>
                  <StatusBadge status={animal.healthStatus} />
                </div>
                {animal.name && (
                  <p className="text-small text-secondary font-mono">{animal.code}</p>
                )}
                <p className="text-small text-secondary">
                  {animal.breed} · {animal.sex === 'FEMALE' ? 'Hembra' : 'Macho'}
                </p>
              </div>

              {/* Vitals 2×2 */}
              <div>
                <p className="text-small text-secondary mb-2">Signos vitales</p>
                <div className="grid grid-cols-2 gap-3">
                  <VitalCard label="Temperatura"    reading={STATIC_VITALS.temperature} />
                  <VitalCard label="Ritmo cardíaco" reading={STATIC_VITALS.heartRate}   />
                  <VitalCard label="Actividad"      reading={STATIC_VITALS.activity}    />
                  <VitalCard label="Batería sensor" reading={STATIC_VITALS.battery}     />
                </div>
              </div>

              {/* Technical data */}
              <div className="bg-surface-elevated rounded-lg p-3 flex flex-col gap-2">
                <p className="text-small text-secondary font-medium">Datos técnicos</p>
                {animal.weight !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-small text-secondary">Peso</span>
                    <span className="text-small text-primary">{animal.weight} kg</span>
                  </div>
                )}
                {animal.birthDate && (
                  <div className="flex justify-between">
                    <span className="text-small text-secondary">Nacimiento</span>
                    <span className="text-small text-primary">
                      {new Date(animal.birthDate).toLocaleDateString('es-CO')}
                    </span>
                  </div>
                )}
                {animal.deviceId && (
                  <div className="flex justify-between">
                    <span className="text-small text-secondary">Dispositivo</span>
                    <span className="text-small text-primary font-mono">{animal.deviceId}</span>
                  </div>
                )}
                {animal.lastSeen && (
                  <div className="flex justify-between">
                    <span className="text-small text-secondary">Última señal</span>
                    <span className="text-small text-primary">
                      {new Date(animal.lastSeen).toLocaleTimeString('es-CO')}
                    </span>
                  </div>
                )}
              </div>

              {animal.notes && (
                <div className="bg-surface-elevated rounded-lg p-3">
                  <p className="text-small text-secondary mb-1">Notas</p>
                  <p className="text-body text-primary">{animal.notes}</p>
                </div>
              )}

              {animal.photoUrl && (
                <img
                  src={animal.photoUrl}
                  alt={`Foto de ${animal.name ?? animal.code}`}
                  className="w-full rounded-lg object-cover max-h-48"
                />
              )}

              {/* Map placeholder */}
              <div className="bg-surface-elevated rounded-lg p-4 flex items-center justify-center min-h-32">
                <p className="text-secondary text-small text-center">
                  Última ubicación GPS — próximo sprint
                </p>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
