import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Map, Activity, Bell } from 'lucide-react';
import { cn } from '@/utils/cn';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/map',       icon: Map,             label: 'Mapa'      },
  { to: '/cattle',    icon: Activity,         label: 'Ganado'    },
  { to: '/alerts',    icon: Bell,            label: 'Alertas'   },
] as const;

export function BottomNav() {
  return (
    <nav className="bg-surface-card border-t border-border flex items-center justify-around px-2 h-16">
      {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          aria-label={label}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center gap-1 min-w-[44px] min-h-[44px] justify-center rounded-md text-badge transition-colors',
              isActive ? 'text-brand' : 'text-secondary',
            )
          }
        >
          <Icon size={20} aria-hidden="true" />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
