import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useWebSocket } from './useWebSocket';
import { updateAnimalVitals, selectAnimalVitals } from '@/store/slices/gpsSlice';
import type { AppDispatch } from '@/store';
import type { AnimalVitals } from '@/types/animal.types';

interface VitalsPayload extends AnimalVitals {
  animalId: string;
}

export function useAnimalVitals(animalId: string): AnimalVitals | null {
  const dispatch = useDispatch<AppDispatch>();
  const socket   = useWebSocket();
  const vitals   = useSelector(selectAnimalVitals(animalId));

  useEffect(() => {
    socket.emit('subscribe:animal', { animalId });

    socket.on('animal:vitals', (data: VitalsPayload) => {
      if (data.animalId === animalId) {
        dispatch(updateAnimalVitals(data));
      }
    });

    return () => {
      socket.emit('unsubscribe:animal', { animalId });
      socket.off('animal:vitals');
    };
  }, [animalId, socket, dispatch]);

  return vitals;
}
