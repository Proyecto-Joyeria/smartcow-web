import { useEffect } from 'react';
import { useWebSocket } from './useWebSocket';
import { useToast } from './useToast';
import type { GeofenceBreachEvent } from '@/types/geofence.types';

export function useGeofenceEvents(): void {
  const socket = useWebSocket();
  const { warning } = useToast();

  useEffect(() => {
    socket.on('geofence:breach', (event: GeofenceBreachEvent) => {
      const action  = event.type === 'enter' ? 'entró en' : 'salió de';
      const animal  = event.animalName || 'Animal desconocido';
      warning(
        'Cruce de geocerca',
        `${animal} ${action} "${event.geofenceName}"`,
      );
    });

    return () => {
      socket.off('geofence:breach');
    };
  }, [socket, warning]);
}
