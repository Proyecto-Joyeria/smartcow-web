import { useEffect, useRef } from 'react';
import { io, type Socket } from 'socket.io-client';
import { TOKEN_STORAGE_KEY } from '@/services/api.client';
import { useAuth } from '@/contexts/AuthContext';

const WS_URL = import.meta.env.VITE_WS_URL as string;

let socketInstance: Socket | null = null;

export function useWebSocket(): Socket {
  const { user } = useAuth();
  const socketRef = useRef<Socket | null>(null);

  if (!socketRef.current) {
    if (!socketInstance) {
      const token  = localStorage.getItem(TOKEN_STORAGE_KEY);
      const farmId = user?.farmId ?? 'default';

      socketInstance = io(`${WS_URL}/farms/${farmId}`, {
        auth:       { token },
        transports: ['websocket'],
        autoConnect: true,
      });
    }
    socketRef.current = socketInstance;
  }

  useEffect(() => {
    return () => {
      // No desconectar aquí — el socket es singleton por sesión
    };
  }, []);

  return socketRef.current;
}

export function disconnectSocket(): void {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
}
