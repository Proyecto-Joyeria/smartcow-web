import { useState } from 'react';
import { Download } from 'lucide-react';
import { cn } from '@/utils/cn';
import { analyticsService } from '@/services/analytics.service';
import { useToast } from '@/hooks/useToast';
import type { AnalyticsFilters } from '@/types/analytics.types';

interface Props { filters: AnalyticsFilters; }

export function ExportButton({ filters }: Props) {
  const [loading, setLoading] = useState(false);
  const { success, error }    = useToast();

  const handleExport = async () => {
    setLoading(true);
    try {
      await analyticsService.exportReport(filters);
      success('Reporte descargado', 'El archivo se guardó en tu carpeta de descargas.');
    } catch {
      error('Error al exportar', 'No se pudo generar el reporte. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      disabled={loading}
      onClick={handleExport}
      aria-label={loading ? 'Exportando reporte…' : 'Exportar reporte'}
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors',
        loading
          ? 'border-[#21262d] text-[#6e7681] cursor-not-allowed'
          : 'border-[#30363d] text-[#8b949e] hover:border-[#1a7a4a] hover:text-[#22a05c]',
      )}
    >
      <Download size={16} aria-hidden="true" />
      {loading ? 'Exportando…' : 'Exportar reporte'}
    </button>
  );
}
