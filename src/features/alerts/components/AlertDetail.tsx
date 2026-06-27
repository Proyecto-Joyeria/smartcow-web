import { useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, CheckCircle, UserCheck, XCircle, AlertTriangle, Info } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/utils/cn';
import { alertsService } from '@/services/alerts.service';
import { useToast } from '@/hooks/useToast';
import type { Alert, AlertSeverity } from '@/types/alert.types';

const SEVERITY_COLOR: Record<AlertSeverity, string> = {
  CRITICAL: 'text-[#f44336]',
  WARNING:  'text-[#ffb300]',
  INFO:     'text-[#1a7a4a]',
};

const SEVERITY_LABEL: Record<AlertSeverity, string> = {
  CRITICAL: 'Crítico',
  WARNING:  'Alerta',
  INFO:     'Info',
};

function SeverityIcon({ severity, size = 16 }: { severity: AlertSeverity; size?: number }) {
  if (severity === 'INFO') return <Info size={size} aria-hidden="true" />;
  return <AlertTriangle size={size} aria-hidden="true" />;
}

interface AlertDetailProps {
  alert:   Alert | null;
  onClose: () => void;
}

export function AlertDetail({ alert, onClose }: AlertDetailProps) {
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const isOpen = !!alert;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const acknowledgeMutation = useMutation({
    mutationFn: () => alertsService.acknowledge(alert!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      success('Alerta reconocida', 'El estado fue actualizado correctamente.');
    },
    onError: () => error('Error', 'No se pudo reconocer la alerta.'),
  });

  const resolveMutation = useMutation({
    mutationFn: () => alertsService.resolve(alert!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      success('Alerta cerrada', 'La alerta fue marcada como resuelta.');
      onClose();
    },
    onError: () => error('Error', 'No se pudo cerrar la alerta.'),
  });

  const assignMutation = useMutation({
    mutationFn: () => alertsService.assign(alert!.id, 'me'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      success('Alerta asignada', 'La alerta fue asignada a ti.');
    },
    onError: () => error('Error', 'No se pudo asignar la alerta.'),
  });

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
        aria-label="Detalle de alerta"
        aria-hidden={!isOpen}
        className={cn(
          'fixed right-0 top-0 md:top-14 z-30',
          'h-full md:h-[calc(100vh-3.5rem)]',
          'w-full md:w-[360px]',
          'bg-[#161b22] border-l border-[#30363d] shadow-2xl',
          'flex flex-col',
          'transition-transform duration-[250ms] ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#30363d] shrink-0">
          <h2 className="text-sm font-semibold text-[#e6edf3]">Detalle de alerta</h2>
          <button
            type="button"
            aria-label="Cerrar panel"
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-md text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#21262d] transition-colors"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {alert && (
            <>
              {/* Severidad + título */}
              <div className="flex items-start gap-3">
                <span className={cn('mt-0.5', SEVERITY_COLOR[alert.severity])}>
                  <SeverityIcon severity={alert.severity} size={20} />
                </span>
                <div>
                  <p className={cn('text-xs font-semibold uppercase tracking-wide mb-0.5', SEVERITY_COLOR[alert.severity])}>
                    {SEVERITY_LABEL[alert.severity]}
                  </p>
                  <h3 className="text-base font-semibold text-[#e6edf3] leading-snug">
                    {alert.title}
                  </h3>
                </div>
              </div>

              {/* Descripción */}
              <p className="text-sm text-[#8b949e] leading-relaxed">{alert.description}</p>

              {/* Metadatos */}
              <div className="bg-[#21262d] rounded-lg p-3 flex flex-col gap-2">
                <DetailRow label="Estado">
                  <span className={cn('text-xs font-medium', {
                    'text-[#f44336]': alert.status === 'OPEN',
                    'text-[#ffb300]': alert.status === 'ACKNOWLEDGED',
                    'text-[#4caf50]': alert.status === 'RESOLVED',
                  })}>
                    {alert.status === 'OPEN' ? 'Abierta' : alert.status === 'ACKNOWLEDGED' ? 'Reconocida' : 'Resuelta'}
                  </span>
                </DetailRow>
                <DetailRow label="Creada">
                  <time dateTime={alert.createdAt} className="text-xs text-[#e6edf3]">
                    {format(new Date(alert.createdAt), "d MMM yyyy, HH:mm", { locale: es })}
                  </time>
                </DetailRow>
                {alert.animalName && (
                  <DetailRow label="Animal">
                    <span className="text-xs text-[#e6edf3]">{alert.animalName}</span>
                  </DetailRow>
                )}
                {alert.geofenceName && (
                  <DetailRow label="Geocerca">
                    <span className="text-xs text-[#e6edf3]">{alert.geofenceName}</span>
                  </DetailRow>
                )}
                {alert.assignedTo && (
                  <DetailRow label="Asignada a">
                    <span className="text-xs text-[#e6edf3]">{alert.assignedTo}</span>
                  </DetailRow>
                )}
              </div>

              {/* Acciones */}
              {alert.status !== 'RESOLVED' && (
                <div className="flex flex-col gap-2">
                  {alert.status === 'OPEN' && (
                    <button
                      type="button"
                      disabled={acknowledgeMutation.isPending}
                      onClick={() => acknowledgeMutation.mutate()}
                      className={cn(
                        'flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-medium transition-colors',
                        acknowledgeMutation.isPending
                          ? 'bg-[#0f4d2e] text-[#4caf50] cursor-not-allowed'
                          : 'bg-[#1a7a4a] hover:bg-[#22a05c] text-white',
                      )}
                    >
                      <CheckCircle size={16} aria-hidden="true" />
                      {acknowledgeMutation.isPending ? 'Reconociendo…' : 'Reconocer'}
                    </button>
                  )}

                  {!alert.assignedTo && (
                    <button
                      type="button"
                      disabled={assignMutation.isPending}
                      onClick={() => assignMutation.mutate()}
                      className={cn(
                        'flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-medium border transition-colors',
                        assignMutation.isPending
                          ? 'border-[#21262d] text-[#6e7681] cursor-not-allowed'
                          : 'border-[#30363d] text-[#8b949e] hover:border-[#8b949e] hover:text-[#e6edf3]',
                      )}
                    >
                      <UserCheck size={16} aria-hidden="true" />
                      {assignMutation.isPending ? 'Asignando…' : 'Asignarme'}
                    </button>
                  )}

                  <button
                    type="button"
                    disabled={resolveMutation.isPending}
                    onClick={() => resolveMutation.mutate()}
                    className={cn(
                      'flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-medium border transition-colors',
                      resolveMutation.isPending
                        ? 'border-[#21262d] text-[#6e7681] cursor-not-allowed'
                        : 'border-[#30363d] text-[#8b949e] hover:border-[#f44336] hover:text-[#f44336]',
                    )}
                  >
                    <XCircle size={16} aria-hidden="true" />
                    {resolveMutation.isPending ? 'Cerrando…' : 'Cerrar alerta'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </aside>
    </>
  );
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-[#8b949e]">{label}</span>
      {children}
    </div>
  );
}
