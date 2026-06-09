import { useRef, useEffect, useState } from 'react';
import { cn } from '@/utils/cn';
import type { VitalReading } from '@/types/animal.types';

interface VitalCardProps {
  label:     string;
  reading:   VitalReading;
  className?: string;
}

const TREND_COLOR: Record<VitalReading['trend'], string> = {
  '↑': 'text-status-critical',
  '↓': 'text-status-warn',
  '↔': 'text-status-ok',
};

function Sparkline({ data }: { data: number[] }) {
  if (data.length < 2) return null;
  const min   = Math.min(...data);
  const max   = Math.max(...data);
  const range = max - min || 1;
  const W = 100;
  const H = 32;

  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * W;
      const y = H - ((v - min) / range) * H * 0.9 - H * 0.05;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-full"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <polyline
        points={points}
        fill="none"
        stroke="#1a7a4a"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function VitalCard({ label, reading, className }: VitalCardProps) {
  const prevValue      = useRef(reading.value);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (reading.value !== prevValue.current) {
      prevValue.current = reading.value;
      setFlash(true);
      const id = setTimeout(() => setFlash(false), 300);
      return () => clearTimeout(id);
    }
  }, [reading.value]);

  return (
    <div
      className={cn(
        'bg-surface-elevated rounded-lg p-3 flex flex-col gap-1 transition-colors',
        flash && 'animate-flash',
        className,
      )}
    >
      <p className="text-small text-secondary">{label}</p>
      <div className="flex items-end justify-between gap-2">
        <div>
          <span className="text-heading-lg text-primary">{reading.value}</span>
          <span className="text-small text-secondary ml-1">{reading.unit}</span>
        </div>
        <span
          className={cn('text-heading-md font-mono', TREND_COLOR[reading.trend])}
          aria-label={`Tendencia: ${reading.trend}`}
        >
          {reading.trend}
        </span>
      </div>
      <div className="h-10 -mx-1">
        <Sparkline data={reading.history} />
      </div>
    </div>
  );
}
