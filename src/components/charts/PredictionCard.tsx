import { useQuery } from '@tanstack/react-query';
import { cn } from '@/utils/cn';
import { aiService } from '@/services/ai.service';
import type { Prediction } from '@/types/analytics.types';

interface Props { animalId: string; }

const RISK_BADGE: Record<Prediction['riskLabel'], string> = {
  LOW:    'bg-green-900/20 text-[#4caf50]',
  MEDIUM: 'bg-yellow-900/20 text-[#ffb300]',
  HIGH:   'bg-red-900/20 text-[#f44336]',
};

const RISK_LABEL: Record<Prediction['riskLabel'], string> = {
  LOW:    'Riesgo bajo',
  MEDIUM: 'Riesgo medio',
  HIGH:   'Riesgo alto',
};

const RISK_BAR_COLOR: Record<Prediction['riskLabel'], string> = {
  LOW:    '#4caf50',
  MEDIUM: '#ffb300',
  HIGH:   '#f44336',
};

export function PredictionCard({ animalId }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ['ai:prediction', animalId],
    queryFn:  () => aiService.getPrediction(animalId),
    staleTime: 300_000,
    retry:     false,  // AI service puede estar offline — falla rápido
  });

  if (isLoading) {
    return (
      <div className="bg-[#21262d] rounded-lg p-3 flex flex-col gap-2 animate-pulse">
        <div className="h-3 bg-[#30363d] rounded w-1/3" />
        <div className="h-2 bg-[#30363d] rounded w-full" />
        <div className="h-3 bg-[#30363d] rounded w-2/3" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="bg-[#21262d] rounded-lg p-3 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-[#8b949e]">Predicción IA</p>
        <span
          className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', RISK_BADGE[data.riskLabel])}
        >
          {RISK_LABEL[data.riskLabel]}
        </span>
      </div>

      {/* Score meter — mark wears the color, label stays in text-secondary */}
      <div className="flex items-center gap-2">
        <div
          role="meter"
          aria-valuenow={data.riskScore}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Score de riesgo: ${data.riskScore} de 100`}
          className="flex-1 h-1.5 bg-[#30363d] rounded-full overflow-hidden"
        >
          <div
            className="h-full rounded-full transition-all"
            style={{
              width:           `${data.riskScore}%`,
              backgroundColor: RISK_BAR_COLOR[data.riskLabel],
            }}
          />
        </div>
        <span className="text-xs text-[#8b949e] tabular-nums w-8 text-right">
          {data.riskScore}
        </span>
      </div>

      {/* Top factors */}
      {data.topFactors.length > 0 && (
        <p className="text-xs text-[#6e7681] leading-relaxed">
          {data.topFactors.slice(0, 2).join(' · ')}
        </p>
      )}
    </div>
  );
}
