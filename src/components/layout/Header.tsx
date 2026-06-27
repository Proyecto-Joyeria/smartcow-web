import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Bell, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AlertBadge } from '@/components/ui/AlertBadge';
import { selectUnreadCount, clearUnread } from '@/store/slices/alertsSlice';
import type { AppDispatch } from '@/store';

export function Header() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();
  const dispatch         = useDispatch<AppDispatch>();
  const unreadCount      = useSelector(selectUnreadCount);

  const handleBellClick = () => {
    dispatch(clearUnread());
    navigate('/alerts');
  };

  return (
    <header className="h-14 bg-surface-card border-b border-border flex items-center justify-between px-4 shrink-0 sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <span className="text-brand font-bold text-heading-lg">SmartCow</span>
        {user?.farmId && (
          <span className="text-secondary text-small">· {user.farmId}</span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label={unreadCount > 0 ? `${unreadCount} alertas sin leer` : 'Notificaciones'}
          onClick={handleBellClick}
          className="relative w-9 h-9 flex items-center justify-center rounded-md text-secondary hover:text-primary hover:bg-surface-elevated transition-colors"
        >
          <Bell size={18} aria-hidden="true" />
          <AlertBadge count={unreadCount} />
        </button>
        <button
          type="button"
          aria-label="Cerrar sesión"
          onClick={logout}
          className="w-9 h-9 flex items-center justify-center rounded-md text-secondary hover:text-primary hover:bg-surface-elevated transition-colors"
        >
          <LogOut size={18} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
