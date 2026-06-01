import { useState, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Upload, X, FileText, AlertCircle } from 'lucide-react';
import { animalsService } from '@/services/animals.service';
import type { ImportError } from '@/services/animals.service';
import { cn } from '@/utils/cn';

interface ImportModalProps {
  onClose: () => void;
}

function parseCsvPreview(text: string): { headers: string[]; rows: string[][] } {
  const lines = text.trim().split('\n').slice(0, 6);
  const headers = (lines[0] ?? '').split(',').map(h => h.trim());
  const rows    = lines.slice(1).map(l => l.split(',').map(c => c.trim()));
  return { headers, rows };
}

export function ImportModal({ onClose }: ImportModalProps) {
  const queryClient = useQueryClient();
  const inputRef    = useRef<HTMLInputElement>(null);

  const [file,      setFile]      = useState<File | null>(null);
  const [preview,   setPreview]   = useState<{ headers: string[]; rows: string[][] } | null>(null);
  const [progress,  setProgress]  = useState(0);
  const [uploading, setUploading] = useState(false);
  const [errors,    setErrors]    = useState<ImportError[]>([]);
  const [success,   setSuccess]   = useState<number | null>(null);
  const [dragOver,  setDragOver]  = useState(false);

  const handleFile = (f: File) => {
    if (!f.name.endsWith('.csv')) return;
    setFile(f);
    setErrors([]);
    setSuccess(null);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(parseCsvPreview(e.target?.result as string));
    reader.readAsText(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setProgress(0);
    try {
      const result = await animalsService.importCSV(file, setProgress);
      setSuccess(result.created);
      setErrors(result.errors);
      queryClient.invalidateQueries({ queryKey: ['animals'] });
    } catch {
      setErrors([{ row: 0, field: '', message: 'Error de conexión. Intenta de nuevo.' }]);
    } finally {
      setUploading(false);
    }
  };

  const downloadErrorReport = () => {
    const csv  = ['Fila,Campo,Error', ...errors.map(e => `${e.row},${e.field},${e.message}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'errores_importacion.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div className="relative bg-surface-card border border-border rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <h2 className="text-heading-lg text-primary">Importar desde CSV</h2>
          <button
            type="button"
            aria-label="Cerrar"
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-md text-secondary hover:text-primary hover:bg-surface-elevated transition-colors"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
          {/* Drop zone */}
          <div
            role="button"
            tabIndex={0}
            aria-label="Área de carga — arrastra un CSV o haz clic para seleccionar"
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
            className={cn(
              'border-2 border-dashed rounded-lg p-8 flex flex-col items-center gap-3 cursor-pointer transition-colors',
              dragOver ? 'border-primary bg-primary-dark/20' : 'border-border hover:border-primary',
            )}
          >
            <Upload size={32} className="text-secondary" aria-hidden="true" />
            <p className="text-body text-secondary text-center">
              {file ? (
                <span className="text-primary inline-flex items-center gap-2">
                  <FileText size={16} aria-hidden="true" />
                  {file.name}
                </span>
              ) : (
                <>Arrastra un archivo <strong>.csv</strong> o haz clic para seleccionar</>
              )}
            </p>
            <input
              ref={inputRef}
              type="file"
              accept=".csv"
              className="sr-only"
              aria-label="Seleccionar archivo CSV"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            />
          </div>

          {/* CSV preview */}
          {preview && preview.headers.length > 0 && (
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-small">
                <thead className="bg-surface-elevated">
                  <tr>
                    {preview.headers.map((h) => (
                      <th key={h} className="px-3 py-2 text-left text-secondary font-medium whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.rows.map((row, i) => (
                    <tr key={i} className="border-t border-border">
                      {row.map((cell, j) => (
                        <td key={j} className="px-3 py-2 text-primary">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="px-3 py-2 text-small text-secondary border-t border-border">
                Vista previa — primeras 5 filas
              </p>
            </div>
          )}

          {/* Progress bar */}
          {uploading && (
            <div>
              <div className="flex justify-between text-small text-secondary mb-1">
                <span>Subiendo...</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 bg-surface-elevated rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%` }}
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </div>
          )}

          {/* Success */}
          {success !== null && (
            <p className="text-small text-status-ok text-center">
              {success} {success === 1 ? 'animal importado' : 'animales importados'} correctamente.
            </p>
          )}

          {/* Error table */}
          {errors.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-small text-status-critical flex items-center gap-1">
                  <AlertCircle size={14} aria-hidden="true" />
                  {errors.length} {errors.length === 1 ? 'error encontrado' : 'errores encontrados'}
                </p>
                <button
                  type="button"
                  onClick={downloadErrorReport}
                  className="text-small text-brand hover:underline"
                >
                  Descargar reporte
                </button>
              </div>
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-small">
                  <thead className="bg-surface-elevated">
                    <tr>
                      <th className="px-3 py-2 text-left text-secondary font-medium">Fila</th>
                      <th className="px-3 py-2 text-left text-secondary font-medium">Campo</th>
                      <th className="px-3 py-2 text-left text-secondary font-medium">Error</th>
                    </tr>
                  </thead>
                  <tbody>
                    {errors.map((err, i) => (
                      <tr key={i} className="border-t border-border">
                        <td className="px-3 py-2 text-primary">{err.row || '—'}</td>
                        <td className="px-3 py-2 text-primary font-mono">{err.field || '—'}</td>
                        <td className="px-3 py-2 text-status-critical">{err.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-border shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 min-h-[44px] rounded-md border border-border text-body text-secondary hover:text-primary hover:bg-surface-elevated transition-colors"
          >
            Cerrar
          </button>
          <button
            type="button"
            disabled={!file || uploading}
            onClick={handleUpload}
            aria-busy={uploading}
            className={cn(
              'flex-1 min-h-[44px] rounded-md text-body font-medium transition-colors',
              'bg-primary text-white hover:bg-primary-hover',
              'disabled:opacity-50 disabled:cursor-not-allowed',
            )}
          >
            {uploading ? `Importando... ${progress}%` : 'Importar'}
          </button>
        </div>
      </div>
    </div>
  );
}
