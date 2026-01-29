import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProviders } from './providers/AppProviders';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { useSecureSession } from './hooks/useSecureSession';
import { useAppSelector } from './store/hooks';
import { selectIsAuthenticated, selectCurrentUser } from './features/auth/authSlice';

const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const MainMenuPage = React.lazy(() => import('./pages/MainMenuPage'));
const AdminMenuPage = React.lazy(() => import('./pages/AdminMenuPage'));
const NotFoundPage = React.lazy(() => import('./pages/not-found'));
const AccountViewPage = React.lazy(() => import('./pages/AccountViewPage'));
const AccountUpdatePage = React.lazy(() => import('./pages/AccountUpdatePage'));
const CreditCardListPage = React.lazy(() => import('./pages/CreditCardListPage'));
const CreditCardViewPage = React.lazy(() => import('./pages/CreditCardViewPage'));
const CreditCardUpdatePage = React.lazy(() => import('./pages/CreditCardUpdatePage'));
const TransactionAddPage = React.lazy(() => import('./pages/TransactionAddPage'));
const TransactionListPage = React.lazy(() => import('./pages/TransactionListPage'));
const TransactionViewPage = React.lazy(() => import('./pages/TransactionViewPage'));
const TransactionReportsPage = React.lazy(() => import('./pages/TransactionReportsPage'));
const BillPaymentPage = React.lazy(() => import('./pages/BillPaymentPage'));
const UserListPage = React.lazy(() => import('./pages/UserListPage'));
const UserAddPage = React.lazy(() => import('./pages/UserAddPage'));
const UserUpdatePage = React.lazy(() => import('./pages/UserUpdatePage'));
const UserDeletePage = React.lazy(() => import('./pages/UserDeletePage'));

// Componente para redirección inteligente desde la raíz o rutas no encontradas
function SmartRedirect() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectCurrentUser);
  const location = useLocation();

  // Si no está autenticado, enviar a login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si está autenticado, redirigir al menú apropiado según su rol
  const defaultPath = user.role === 'admin' ? '/menu/admin' : '/menu/main';
  return <Navigate to={defaultPath} replace />;
}

function AppContent() {
  useSecureSession(); // Activar gestión de sesión segura

  return (
    <ErrorBoundary>
      <React.Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Ruta raíz con redirección inteligente */}
          <Route path="/" element={<SmartRedirect />} />
          
          {/* Ruta de login */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Rutas protegidas para back-office */}
          <Route 
            path="/menu/main" 
            element={
              <ProtectedRoute requiredRole="back-office">
                <MainMenuPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Rutas protegidas para admin */}
          <Route 
            path="/menu/admin" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminMenuPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Rutas de funcionalidades (requieren autenticación) */}
          <Route 
            path="/accounts/view" 
            element={
              <ProtectedRoute>
                <AccountViewPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/accounts/update" 
            element={
              <ProtectedRoute>
                <AccountUpdatePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/cards/list" 
            element={
              <ProtectedRoute>
                <CreditCardListPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/cards/view" 
            element={
              <ProtectedRoute>
                <CreditCardViewPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/cards/update" 
            element={
              <ProtectedRoute>
                <CreditCardUpdatePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/transactions/list" 
            element={
              <ProtectedRoute>
                <TransactionListPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/transactions/view/:transactionId?" 
            element={
              <ProtectedRoute>
                <TransactionViewPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/transactions/add" 
            element={
              <ProtectedRoute>
                <TransactionAddPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/reports/transactions" 
            element={
              <ProtectedRoute>
                <TransactionReportsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/payments/bills" 
            element={
              <ProtectedRoute>
                <BillPaymentPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users/list" 
            element={
              <ProtectedRoute requiredRole="admin">
                <UserListPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users/add" 
            element={
              <ProtectedRoute requiredRole="admin">
                <UserAddPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users/update" 
            element={
              <ProtectedRoute requiredRole="admin">
                <UserUpdatePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users/delete" 
            element={
              <ProtectedRoute requiredRole="admin">
                <UserDeletePage />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch-all: redirigir según autenticación */}
          <Route path="*" element={<SmartRedirect />} />
        </Routes>
      </React.Suspense>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}

export default App;