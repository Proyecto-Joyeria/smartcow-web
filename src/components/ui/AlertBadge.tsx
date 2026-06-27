import { cn } from '@/utils/cn';

interface AlertBadgeProps {
  count:      number;
  className?: string;
}

export function AlertBadge({ count, className }: AlertBadgeProps) {
  if (count <= 0) return null;

  return (
    <span
      aria-label={`${count} alertas sin leer`}
      className={cn(
        'absolute -top-1 -right-1',
        'min-w-[16px] h-4 px-0.5',
        'bg-[#f44336] rounded-full',
        'text-[10px] font-bold text-white',
        'flex items-center justify-center',
        'pointer-events-none',
        className,
      )}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
}
