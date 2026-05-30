import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '@/services/auth.service';
import { cn } from '@/utils/cn';

const twoFASchema = z.object({
  code: z
    .string()
    .length(6, 'El código debe tener 6 dígitos')
    .regex(/^\d+$/, 'Solo números'),
});

type TwoFAFormValues = z.infer<typeof twoFASchema>;

export function TwoFASetup() {
  const navigate = useNavigate();
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [loadingQr, setLoadingQr] = useState(true);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TwoFAFormValues>({ resolver: zodResolver(twoFASchema) });

  useEffect(() => {
    authService
      .setup2FA()
      .then((res) => setQrCodeUrl(res.qrCodeUrl))
      .catch(() => setServerError('Error al generar el QR. Intenta de nuevo.'))
      .finally(() => setLoadingQr(false));
  }, []);

  const onSubmit = async ({ code }: TwoFAFormValues) => {
    setServerError('');
    try {
      await authService.verify2FA({ code });
      navigate('/dashboard');
    } catch {
      setServerError('Código incorrecto. Intenta de nuevo.');
    }
  };

  return (
    <div className="min-h-screen bg-surface-primary flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-surface-card border border-border rounded-lg p-6 flex flex-col gap-6">
        <div>
          <h1 className="text-heading-xl text-primary mb-1">Configurar 2FA</h1>
          <p className="text-body text-secondary">
            Escanea el código QR con tu app de autenticación.
          </p>
        </div>

        <div className="flex justify-center min-h-40 items-center">
          {loadingQr ? (
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          ) : qrCodeUrl ? (
            <img
              src={qrCodeUrl}
              alt="Código QR para autenticación de dos factores"
              className="w-40 h-40 rounded-md"
            />
          ) : null}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="code" className="text-small text-secondary">
              Código de verificación
            </label>
            <input
              id="code"
              type="text"
              inputMode="numeric"
              maxLength={6}
              autoComplete="one-time-code"
              placeholder="000000"
              aria-invalid={!!errors.code}
              aria-describedby={errors.code ? 'code-error' : undefined}
              {...register('code')}
              className={cn(
                'bg-surface-elevated border rounded-md px-3 py-2 text-body text-primary font-mono text-center tracking-widest',
                'focus:outline-none focus:border-primary transition-colors',
                errors.code ? 'border-status-critical' : 'border-border',
              )}
            />
            {errors.code && (
              <p id="code-error" role="alert" className="text-small text-status-critical">
                {errors.code.message}
              </p>
            )}
          </div>

          {serverError && (
            <p role="alert" className="text-small text-status-critical text-center">
              {serverError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting || loadingQr}
            aria-busy={isSubmitting}
            className={cn(
              'min-h-[44px] rounded-md text-body font-medium transition-colors',
              'bg-primary text-white hover:bg-primary-hover',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface-card',
            )}
          >
            {isSubmitting ? 'Verificando...' : 'Verificar y continuar'}
          </button>
        </form>
      </div>
    </div>
  );
}
