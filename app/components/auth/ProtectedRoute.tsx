import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '~/store/hooks';
import { 
  selectIsAuthenticated, 
  selectCurrentUser, 
  selectAuthLoading,
  validateToken 
} from '~/features/auth/authSlice';
import { LoadingSpinner } from '~/components/ui/LoadingSpinner';
import { useSecureSession } from '~/hooks/useSecureSession';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'back-office';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectCurrentUser);
  const isLoading = useAppSelector(selectAuthLoading);
  const { checkSessionExpiry } = useSecureSession();

  useEffect(() => {
    // Verificar token al cargar la ruta protegida
    const token = localStorage.getItem('auth-token');
    if (token && !isAuthenticated) {
      dispatch(validateToken());
    }
  }, [dispatch, isAuthenticated]);

  // Mostrar loading mientras se valida
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Verificar autenticación
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar expiración de sesión
  if (!checkSessionExpiry()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar rol si es requerido
  if (requiredRole && user.role !== requiredRole) {
    // Redirigir al menú correcto según el rol del usuario
    const redirectPath = user.role === 'admin' ? '/menu/admin' : '/menu/main';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}