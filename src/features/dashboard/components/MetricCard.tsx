import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  variant?: 'default' | 'ok' | 'warn' | 'critical';
  className?: string;
}

const VARIANT_ICON_STYLES: Record<NonNullable<MetricCardProps['variant']>, string> = {
  default:  'text-secondary',
  ok:       'text-status-ok',
  warn:     'text-status-warn',
  critical: 'text-status-critical',
};

export function MetricCard({ label, value, icon, variant = 'default', className }: MetricCardProps) {
  return (
    <div className={cn('bg-surface-card border border-border rounded-lg p-4 flex flex-col gap-2', className)}>
      <div className={cn('flex items-center gap-2', VARIANT_ICON_STYLES[variant])}>
        {icon}
        <span className="text-small text-secondary">{label}</span>
      </div>
      <p className="text-display text-primary">{value}</p>
    </div>
  );
}
