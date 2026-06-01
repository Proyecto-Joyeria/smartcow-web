import { ResponsiveContainer, LineChart, Line } from 'recharts';
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

export function VitalCard({ label, reading, className }: VitalCardProps) {
  const sparkData = reading.history.map((v, i) => ({ i, v }));

  return (
    <div className={cn('bg-surface-elevated rounded-lg p-3 flex flex-col gap-1', className)}>
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
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sparkData}>
            <Line
              type="monotone"
              dataKey="v"
              stroke="#1a7a4a"
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
