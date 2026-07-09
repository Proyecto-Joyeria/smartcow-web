import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { analyticsService } from '@/services/analytics.service';
import type { AnimalRisk } from '@/types/analytics.types';

const RISK_BADGE: Record<AnimalRisk['riskLabel'], string> = {
  LOW:    'bg-green-900/20 text-[#4caf50]',
  MEDIUM: 'bg-yellow-900/20 text-[#ffb300]',
  HIGH:   'bg-red-900/20 text-[#f44336]',
};

const RISK_LABEL: Record<AnimalRisk['riskLabel'], string> = {
  LOW:    'Bajo',
  MEDIUM: 'Medio',
  HIGH:   'Alto',
};

const SCORE_COLOR = (score: number) =>
  score > 70 ? '#f44336' : score > 40 ? '#ffb300' : '#4caf50';

function TableSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-12 bg-[#21262d] rounded-lg animate-pulse" />
      ))}
    </div>
  );
}

export function RiskTable() {
  const navigate = useNavigate();

  const { data: animals = [], isLoading } = useQuery({
    queryKey: ['analytics:risk'],
    queryFn:  analyticsService.getTopRisk,
    staleTime: 120_000,
  });

  if (isLoading) return <TableSkeleton />;

  if (animals.length === 0) {
    return (
      <p className="text-sm text-[#8b949e] text-center py-8">
        Sin datos de riesgo disponibles.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table
        className="w-full text-sm"
        role="table"
        aria-label="Top animales en riesgo"
      >
        <thead>
          <tr className="border-b border-[#30363d]">
            {['Animal', 'Raza', 'Score', 'Riesgo', 'Factores principales'].map(h => (
              <th
                key={h}
                scope="col"
                className="pb-2 pr-4 text-left text-xs font-medium text-[#8b949e] whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {animals.map(animal => (
            <tr
              key={animal.animalId}
              className="border-b border-[#21262d] hover:bg-[#1c2128] cursor-pointer transition-colors"
              onClick={() => navigate('/cattle')}
              aria-label={`Ver ${animal.animalName} en ganado`}
            >
              <td className="py-3 pr-4 font-medium text-[#e6edf3] whitespace-nowrap">
                {animal.animalName}
              </td>
              <td className="py-3 pr-4 text-[#8b949e] whitespace-nowrap">
                {animal.breed}
              </td>
              <td className="py-3 pr-4">
                <div className="flex items-center gap-2">
                  <div
                    role="meter"
                    aria-valuenow={animal.riskScore}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Score de riesgo: ${animal.riskScore}`}
                    className="w-20 h-1.5 bg-[#21262d] rounded-full overflow-hidden"
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width:           `${animal.riskScore}%`,
                        backgroundColor: SCORE_COLOR(animal.riskScore),
                      }}
                    />
                  </div>
                  <span className="text-xs text-[#8b949e] tabular-nums w-6 text-right">
                    {animal.riskScore}
                  </span>
                </div>
              </td>
              <td className="py-3 pr-4">
                <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', RISK_BADGE[animal.riskLabel])}>
                  {RISK_LABEL[animal.riskLabel]}
                </span>
              </td>
              <td className="py-3 text-xs text-[#8b949e]">
                {animal.topFactors.slice(0, 2).join(', ')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
