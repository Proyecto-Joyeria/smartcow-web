import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppShell } from '@/components/layout/AppShell';
import { LoginPage } from '@/features/login';
import { RegisterPage } from '@/features/register';
import { DashboardPage } from '@/features/dashboard';
import { CattlePage } from '@/features/cattle';
import { MapPage }          from '@/features/map';
import { AlertCenterPage }  from '@/features/alerts';
import { TwoFASetup } from '@/features/login/components/TwoFASetup';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1 },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <AppShell />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<ErrorBoundary><DashboardPage /></ErrorBoundary>} />
                <Route path="cattle"    element={<ErrorBoundary><CattlePage /></ErrorBoundary>} />
                <Route path="map"       element={<ErrorBoundary><MapPage /></ErrorBoundary>}           />
                <Route path="alerts"    element={<ErrorBoundary><AlertCenterPage /></ErrorBoundary>} />
                <Route path="2fa-setup" element={<TwoFASetup />} />
              </Route>
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
