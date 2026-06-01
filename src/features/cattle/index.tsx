import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Upload } from 'lucide-react';
import { animalsService } from '@/services/animals.service';
import { CattleList }    from './components/CattleList';
import { CattleFilters } from './components/CattleFilters';
import { CattleDetail }  from './components/CattleDetail';
import { AnimalForm }    from './components/AnimalForm';
import { ImportModal }   from './components/ImportModal';
import type { CattleFilterValues } from './components/CattleFilters';
import type { HealthStatus } from '@/types/animal.types';

export function CattlePage() {
  const [filters,     setFilters]     = useState<CattleFilterValues>({ search: '', status: '' });
  const [selectedId,  setSelectedId]  = useState<string | null>(null);
  const [showForm,    setShowForm]    = useState(false);
  const [editId,      setEditId]      = useState<string | null>(null);
  const [showImport,  setShowImport]  = useState(false);

  const { data: animals = [], isLoading } = useQuery({
    queryKey: ['animals', filters],
    queryFn:  () =>
      animalsService.getAll({
        search: filters.search || undefined,
        status: (filters.status as HealthStatus) || undefined,
      }),
    staleTime: 30_000,
  });

  const { data: editAnimal } = useQuery({
    queryKey: ['animals', editId],
    queryFn:  () => animalsService.getById(editId!),
    enabled:  !!editId,
  });

  const handleEdit = (id: string) => {
    setSelectedId(null);
    setEditId(id);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditId(null);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <h1 className="text-heading-xl text-primary">Ganado</h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowImport(true)}
            aria-label="Importar desde CSV"
            className="min-h-[44px] px-3 rounded-md border border-border text-body text-secondary hover:text-primary hover:bg-surface-elevated transition-colors flex items-center gap-2"
          >
            <Upload size={16} aria-hidden="true" />
            <span className="hidden sm:inline">Importar CSV</span>
          </button>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            aria-label="Registrar nuevo animal"
            className="min-h-[44px] px-4 rounded-md bg-primary text-white text-body font-medium hover:bg-primary-hover transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <Plus size={16} aria-hidden="true" />
            <span>Nuevo animal</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <CattleFilters values={filters} onChange={setFilters} />

      {/* List */}
      <CattleList
        animals={animals}
        isLoading={isLoading}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onCreateNew={() => setShowForm(true)}
      />

      {/* Detail panel */}
      <CattleDetail
        animalId={selectedId}
        onClose={() => setSelectedId(null)}
        onEdit={handleEdit}
      />

      {/* Create form */}
      {showForm && <AnimalForm onClose={handleCloseForm} />}

      {/* Edit form */}
      {editId && editAnimal && (
        <AnimalForm initialData={editAnimal} onClose={handleCloseForm} />
      )}

      {/* Import modal */}
      {showImport && <ImportModal onClose={() => setShowImport(false)} />}
    </div>
  );
}
