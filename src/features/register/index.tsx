import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { RegisterForm } from './components/RegisterForm';

export function RegisterPage() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-surface-primary flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-display text-primary mb-1">SmartCow</h1>
          <p className="text-secondary text-body">Crea tu cuenta para comenzar</p>
        </div>
        <RegisterForm />
        <p className="text-center text-small text-secondary mt-4">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-brand hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
