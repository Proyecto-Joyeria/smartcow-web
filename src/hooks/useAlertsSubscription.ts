import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useWebSocket } from './useWebSocket';
import { useToast } from './useToast';
import { addAlert } from '@/store/slices/alertsSlice';
import type { AppDispatch } from '@/store';
import type { Alert } from '@/types/alert.types';

export function useAlertsSubscription(): void {
  const dispatch = useDispatch<AppDispatch>();
  const socket   = useWebSocket();
  const { error } = useToast();

  useEffect(() => {
    socket.on('alert:new', (alert: Alert) => {
      dispatch(addAlert(alert));
      if (alert.severity === 'CRITICAL') {
        error('Alerta crítica', alert.title);
      }
    });

    return () => {
      socket.off('alert:new');
    };
  }, [socket, dispatch, error]);
}
