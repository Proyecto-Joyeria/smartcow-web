import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { animalsService } from '@/services/animals.service';
import { cn } from '@/utils/cn';
import type { AnimalDetail, CreateAnimalDto } from '@/types/animal.types';

const animalSchema = z.object({
  code:         z.string().min(1, 'El código es requerido'),
  name:         z.string().optional(),
  breed:        z.string().min(1, 'La raza es requerida'),
  sex:          z.enum(['MALE', 'FEMALE']),
  healthStatus: z.enum(['HEALTHY', 'WARNING', 'CRITICAL', 'OFFLINE', 'PREGNANT']),
  birthDate:    z.string().optional(),
  weight:       z.preprocess(
    (v) => (v === '' || v === undefined || v === null ? undefined : Number(v)),
    z.number().positive('Debe ser mayor a 0').optional(),
  ),
  deviceId:     z.string().optional(),
  notes:        z.string().max(500, 'Máximo 500 caracteres').optional(),
});

type AnimalFormValues = z.infer<typeof animalSchema>;

interface AnimalFormProps {
  initialData?: AnimalDetail;
  onClose:      () => void;
}

const INPUT_BASE =
  'bg-surface-elevated border rounded-md px-3 py-2 text-body text-primary ' +
  'focus:outline-none focus:border-primary transition-colors w-full';

interface FieldProps {
  id:       string;
  label:    string;
  error?:   string;
  children: React.ReactNode;
}

function Field({ id, label, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-small text-secondary">{label}</label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-small text-status-critical">
          {error}
        </p>
      )}
    </div>
  );
}

export function AnimalForm({ initialData, onClose }: AnimalFormProps) {
  const queryClient = useQueryClient();
  const isEdit = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AnimalFormValues>({
    resolver: zodResolver(animalSchema),
    defaultValues: initialData
      ? {
          code:         initialData.code,
          name:         initialData.name ?? '',
          breed:        initialData.breed,
          sex:          initialData.sex,
          healthStatus: initialData.healthStatus,
          birthDate:    initialData.birthDate ?? '',
          weight:       initialData.weight,
          deviceId:     initialData.deviceId ?? '',
          notes:        initialData.notes ?? '',
        }
      : { healthStatus: 'HEALTHY', sex: 'FEMALE' },
  });

  const mutation = useMutation({
    mutationFn: (values: AnimalFormValues) => {
      const dto: CreateAnimalDto = {
        code:         values.code,
        name:         values.name      || undefined,
        breed:        values.breed,
        sex:          values.sex,
        healthStatus: values.healthStatus,
        birthDate:    values.birthDate  || undefined,
        weight:       values.weight,
        deviceId:     values.deviceId   || undefined,
        notes:        values.notes      || undefined,
      };
      return isEdit
        ? animalsService.update(initialData.id, dto)
        : animalsService.create(dto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['animals'] });
      onClose();
    },
  });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div className="relative bg-surface-card border border-border rounded-xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <h2 className="text-heading-lg text-primary">
            {isEdit ? 'Editar animal' : 'Registrar animal'}
          </h2>
          <button
            type="button"
            aria-label="Cerrar formulario"
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-md text-secondary hover:text-primary hover:bg-surface-elevated transition-colors"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit((v) => mutation.mutate(v))}
          noValidate
          className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <Field id="code" label="Código (tag) *" error={errors.code?.message}>
              <input
                id="code"
                type="text"
                aria-invalid={!!errors.code}
                aria-describedby={errors.code ? 'code-error' : undefined}
                {...register('code')}
                className={cn(INPUT_BASE, errors.code ? 'border-status-critical' : 'border-border')}
              />
            </Field>
            <Field id="name" label="Nombre" error={errors.name?.message}>
              <input
                id="name"
                type="text"
                {...register('name')}
                className={cn(INPUT_BASE, 'border-border')}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field id="breed" label="Raza *" error={errors.breed?.message}>
              <input
                id="breed"
                type="text"
                aria-invalid={!!errors.breed}
                aria-describedby={errors.breed ? 'breed-error' : undefined}
                {...register('breed')}
                className={cn(INPUT_BASE, errors.breed ? 'border-status-critical' : 'border-border')}
              />
            </Field>
            <Field id="sex" label="Sexo *" error={errors.sex?.message}>
              <select
                id="sex"
                {...register('sex')}
                className={cn(INPUT_BASE, 'border-border cursor-pointer')}
              >
                <option value="FEMALE">Hembra</option>
                <option value="MALE">Macho</option>
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field id="healthStatus" label="Estado *" error={errors.healthStatus?.message}>
              <select
                id="healthStatus"
                {...register('healthStatus')}
                className={cn(INPUT_BASE, 'border-border cursor-pointer')}
              >
                <option value="HEALTHY">Sano</option>
                <option value="WARNING">Alerta</option>
                <option value="CRITICAL">Crítico</option>
                <option value="OFFLINE">Sin señal</option>
                <option value="PREGNANT">Gestante</option>
              </select>
            </Field>
            <Field id="birthDate" label="Fecha nacimiento" error={errors.birthDate?.message}>
              <input
                id="birthDate"
                type="date"
                max={new Date().toISOString().split('T')[0]}
                {...register('birthDate')}
                className={cn(INPUT_BASE, 'border-border')}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field id="weight" label="Peso (kg)" error={errors.weight?.message}>
              <input
                id="weight"
                type="number"
                min="0"
                step="0.1"
                aria-invalid={!!errors.weight}
                aria-describedby={errors.weight ? 'weight-error' : undefined}
                {...register('weight')}
                className={cn(INPUT_BASE, errors.weight ? 'border-status-critical' : 'border-border')}
              />
            </Field>
            <Field id="deviceId" label="ID dispositivo" error={errors.deviceId?.message}>
              <input
                id="deviceId"
                type="text"
                {...register('deviceId')}
                className={cn(INPUT_BASE, 'border-border font-mono')}
              />
            </Field>
          </div>

          <Field id="notes" label="Notas (máx. 500 caracteres)" error={errors.notes?.message}>
            <textarea
              id="notes"
              rows={3}
              aria-invalid={!!errors.notes}
              aria-describedby={errors.notes ? 'notes-error' : undefined}
              {...register('notes')}
              className={cn(INPUT_BASE, 'resize-none', errors.notes ? 'border-status-critical' : 'border-border')}
            />
          </Field>

          {mutation.isError && (
            <p role="alert" className="text-small text-status-critical text-center">
              Error al guardar. Intenta de nuevo.
            </p>
          )}

          <div className="flex gap-3 pb-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 min-h-[44px] rounded-md border border-border text-body text-secondary hover:text-primary hover:bg-surface-elevated transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              aria-busy={mutation.isPending}
              className={cn(
                'flex-1 min-h-[44px] rounded-md text-body font-medium transition-colors',
                'bg-primary text-white hover:bg-primary-hover',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'focus:outline-none focus:ring-2 focus:ring-primary',
              )}
            >
              {mutation.isPending
                ? 'Guardando...'
                : isEdit ? 'Guardar cambios' : 'Registrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
