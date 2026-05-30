import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Map, Activity, Bell } from 'lucide-react';
import { cn } from '@/utils/cn';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/map',       icon: Map,             label: 'Mapa GPS'  },
  { to: '/cattle',    icon: Activity,         label: 'Ganado'    },
  { to: '/alerts',    icon: Bell,            label: 'Alertas'   },
] as const;

export function Sidebar() {
  return (
    <aside className="w-60 bg-surface-card border-r border-border flex flex-col py-4 shrink-0">
      <nav className="flex flex-col gap-1 px-2">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            aria-label={label}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-body transition-colors',
                isActive
                  ? 'bg-primary-dark text-brand font-medium'
                  : 'text-secondary hover:bg-surface-elevated hover:text-primary',
              )
            }
          >
            <Icon size={18} aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
