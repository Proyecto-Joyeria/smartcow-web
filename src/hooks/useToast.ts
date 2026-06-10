import { useToastContext } from '@/contexts/ToastContext';
import type { ToastVariant } from '@/contexts/ToastContext';

export function useToast() {
  const { addToast } = useToastContext();

  return {
    toast: (title: string, message?: string, variant: ToastVariant = 'info', duration = 4000) =>
      addToast({ title, message, variant, duration }),
    success: (title: string, message?: string) =>
      addToast({ title, message, variant: 'success', duration: 4000 }),
    warning: (title: string, message?: string) =>
      addToast({ title, message, variant: 'warning', duration: 5000 }),
    error: (title: string, message?: string) =>
      addToast({ title, message, variant: 'error', duration: 6000 }),
  };
}
