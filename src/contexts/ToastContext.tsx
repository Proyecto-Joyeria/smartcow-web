import { createContext, useCallback, useContext, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

export type ToastVariant = 'info' | 'success' | 'warning' | 'error';

export interface Toast {
  id:       string;
  title:    string;
  message?: string;
  variant:  ToastVariant;
  duration: number;
}

interface ToastContextValue {
  addToast: (toast: Omit<Toast, 'id'>) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const VARIANT_STYLES: Record<ToastVariant, string> = {
  info:    'border-l-[#1a7a4a] bg-[#161b22]',
  success: 'border-l-[#4caf50] bg-[#161b22]',
  warning: 'border-l-[#ffb300] bg-[#161b22]',
  error:   'border-l-[#f44336] bg-[#161b22]',
};

const VARIANT_ICON_COLOR: Record<ToastVariant, string> = {
  info:    'text-[#1a7a4a]',
  success: 'text-[#4caf50]',
  warning: 'text-[#ffb300]',
  error:   'text-[#f44336]',
};

const VARIANT_DOT: Record<ToastVariant, string> = {
  info:    'bg-[#1a7a4a]',
  success: 'bg-[#4caf50]',
  warning: 'bg-[#ffb300]',
  error:   'bg-[#f44336]',
};

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        'flex items-start gap-3 w-80 rounded-lg border border-[#30363d] border-l-4 p-4 shadow-xl',
        'animate-slide-in',
        VARIANT_STYLES[toast.variant],
      )}
    >
      <span
        className={cn('mt-0.5 w-2 h-2 rounded-full shrink-0', VARIANT_DOT[toast.variant])}
        aria-hidden="true"
      />
      <div className="flex-1 min-w-0">
        <p className={cn('text-sm font-semibold', VARIANT_ICON_COLOR[toast.variant])}>
          {toast.title}
        </p>
        {toast.message && (
          <p className="text-xs text-[#8b949e] mt-0.5 leading-relaxed">{toast.message}</p>
        )}
      </div>
      <button
        type="button"
        aria-label="Cerrar notificación"
        onClick={() => onRemove(toast.id)}
        className="shrink-0 text-[#6e7681] hover:text-[#e6edf3] transition-colors"
      >
        <X size={14} aria-hidden="true" />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts(prev => [...prev, { ...toast, id }]);
    const timer = setTimeout(() => removeToast(id), toast.duration);
    timersRef.current.set(id, timer);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div
        aria-label="Notificaciones"
        className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none"
      >
        {toasts.map(toast => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} onRemove={removeToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToastContext(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToastContext must be used inside <ToastProvider>');
  return ctx;
}
