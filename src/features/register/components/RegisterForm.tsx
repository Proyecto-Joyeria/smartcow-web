import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/auth.service';
import { TOKEN_STORAGE_KEY } from '@/services/api.client';
import { cn } from '@/utils/cn';

const registerSchema = z
  .object({
    name:            z.string().min(2, 'Mínimo 2 caracteres'),
    farmName:        z.string().min(2, 'Mínimo 2 caracteres'),
    email:           z.string().email('Email inválido'),
    password:        z.string().min(8, 'Mínimo 8 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const INPUT_BASE =
  'bg-surface-elevated border rounded-md px-3 py-2 text-body text-primary focus:outline-none focus:border-primary transition-colors';

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}

function Field({ id, label, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-small text-secondary">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-small text-status-critical">
          {error}
        </p>
      )}
    </div>
  );
}

export function RegisterForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async ({ name, farmName, email, password }: RegisterFormValues) => {
    setServerError('');
    try {
      const response = await authService.register({ name, farmName, email, password });
      localStorage.setItem(TOKEN_STORAGE_KEY, response.accessToken);
      await login({ email, password });
      navigate('/dashboard');
    } catch {
      setServerError('No se pudo crear la cuenta. Verifica los datos e intenta de nuevo.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="bg-surface-card border border-border rounded-lg p-6 flex flex-col gap-4"
    >
      <Field id="name" label="Nombre completo" error={errors.name?.message}>
        <input
          id="name"
          type="text"
          autoComplete="name"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
          {...register('name')}
          className={cn(INPUT_BASE, errors.name ? 'border-status-critical' : 'border-border')}
        />
      </Field>

      <Field id="farmName" label="Nombre de la hacienda" error={errors.farmName?.message}>
        <input
          id="farmName"
          type="text"
          autoComplete="organization"
          aria-invalid={!!errors.farmName}
          aria-describedby={errors.farmName ? 'farmName-error' : undefined}
          {...register('farmName')}
          className={cn(INPUT_BASE, errors.farmName ? 'border-status-critical' : 'border-border')}
        />
      </Field>

      <Field id="email" label="Email" error={errors.email?.message}>
        <input
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          {...register('email')}
          className={cn(INPUT_BASE, errors.email ? 'border-status-critical' : 'border-border')}
        />
      </Field>

      <Field id="password" label="Contraseña" error={errors.password?.message}>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? 'password-error' : undefined}
          {...register('password')}
          className={cn(INPUT_BASE, errors.password ? 'border-status-critical' : 'border-border')}
        />
      </Field>

      <Field id="confirmPassword" label="Confirmar contraseña" error={errors.confirmPassword?.message}>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          aria-invalid={!!errors.confirmPassword}
          aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
          {...register('confirmPassword')}
          className={cn(
            INPUT_BASE,
            errors.confirmPassword ? 'border-status-critical' : 'border-border',
          )}
        />
      </Field>

      {serverError && (
        <p role="alert" className="text-small text-status-critical text-center">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
        className={cn(
          'min-h-[44px] rounded-md text-body font-medium transition-colors',
          'bg-primary text-white hover:bg-primary-hover',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface-card',
        )}
      >
        {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
      </button>
    </form>
  );
}
