import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from './components/LoginForm';

export function LoginPage() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-surface-primary flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-display text-primary mb-1">SmartCow</h1>
          <p className="text-secondary text-body">Gestión inteligente de ganado</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
