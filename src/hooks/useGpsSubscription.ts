import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useWebSocket } from './useWebSocket';
import { updateAnimalPosition } from '@/store/slices/gpsSlice';
import type { AppDispatch } from '@/store';
import type { GPSPosition } from '@/store/slices/gpsSlice';

export function useGpsSubscription(): void {
  const dispatch = useDispatch<AppDispatch>();
  const socket   = useWebSocket();

  useEffect(() => {
    socket.on('animal:position', (data: GPSPosition) => {
      dispatch(updateAnimalPosition(data));
    });

    return () => {
      socket.off('animal:position');
    };
  }, [socket, dispatch]);
}
