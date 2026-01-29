import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '~/store/hooks';
import { 
  refreshToken, 
  immediateLogout, 
  selectAuthToken,
  selectIsAuthenticated,
  selectCurrentUser
} from '~/features/auth/authSlice';

interface SessionData {
  userId: string;
  userType: string;
  role: string;
  loginTime: number;
}

export function useSecureSession() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const token = useAppSelector(selectAuthToken);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectCurrentUser);

  // Verificar si la sesión ha expirado
  const checkSessionExpiry = useCallback(() => {
    // Si no está autenticado, no verificar sesión
    if (!isAuthenticated || !user) {
      return true; // Considerar válido para evitar bucles
    }

    const sessionData = sessionStorage.getItem('user-session');
    
    if (!sessionData) {
      console.log('🔍 No session data found, but user is authenticated in Redux');
      // Si el usuario está autenticado en Redux pero no hay sessionStorage,
      // recrear los datos de sesión en lugar de limpiar todo
      const newSessionData: SessionData = {
        userId: user.userId,
        userType: user.role === 'admin' ? 'A' : 'U',
        role: user.role,
        loginTime: Date.now()
      };
      sessionStorage.setItem('user-session', JSON.stringify(newSessionData));
      console.log('✅ Recreated session data from Redux state');
      return true;
    }

    try {
      const session: SessionData = JSON.parse(sessionData);
      const now = Date.now();
      const sessionAge = now - session.loginTime;
      
      // Sesión expira después de 8 horas (como en mainframe)
      const MAX_SESSION_TIME = 8 * 60 * 60 * 1000; // 8 horas
      
      const isValid = sessionAge < MAX_SESSION_TIME;
      
      if (!isValid) {
        console.warn('⏰ Session expired:', {
          sessionAge: Math.floor(sessionAge / 1000 / 60), // minutos
          maxTime: Math.floor(MAX_SESSION_TIME / 1000 / 60), // minutos
        });
      }
      
      return isValid;
    } catch (error) {
      console.error('❌ Error parsing session data:', error);
      // En caso de error, recrear sesión en lugar de limpiar
      if (user) {
        const newSessionData: SessionData = {
          userId: user.userId,
          userType: user.role === 'admin' ? 'A' : 'U',
          role: user.role,
          loginTime: Date.now()
        };
        sessionStorage.setItem('user-session', JSON.stringify(newSessionData));
        console.log('✅ Recreated session data after parse error');
        return true;
      }
      return false;
    }
  }, [isAuthenticated, user]);

  // Intentar refrescar el token automáticamente
  const attemptTokenRefresh = useCallback(async () => {
    try {
      console.log('🔄 Attempting token refresh...');
      await dispatch(refreshToken()).unwrap();
      console.log('✅ Token refreshed successfully');
      return true;
    } catch (error) {
      console.error('❌ Token refresh failed:', error);
      dispatch(immediateLogout());
      navigate('/login');
      return false;
    }
  }, [dispatch, navigate]);

  // ✅ CORRECCIÓN: Limpiar sesión con navegación automática
  const clearSession = useCallback(() => {
    console.log('🧹 Clearing session and redirecting to login...');
    dispatch(immediateLogout());
    // ✅ CORRECCIÓN: Usar replace para evitar que el usuario pueda volver atrás
    navigate('/login', { replace: true });
  }, [dispatch, navigate]);

  // ✅ CORRECCIÓN: Logout inmediato sin confirmación
  const performImmediateLogout = useCallback(() => {
    console.log('🚪 Performing immediate logout...');
    dispatch(immediateLogout());
    // ✅ CORRECCIÓN: Usar replace para evitar que el usuario pueda volver atrás
    navigate('/login', { replace: true });
  }, [dispatch, navigate]);

  // Solo verificar sesión periódicamente si está autenticado Y tiene token
  useEffect(() => {
    if (!isAuthenticated || !token || !user) {
      return;
    }

    console.log('⏱️ Starting session monitoring for user:', user.userId);

    const interval = setInterval(() => {
      if (!checkSessionExpiry()) {
        console.warn('⚠️ Session expired, clearing credentials');
        clearSession();
        return;
      }

      // Verificar que el refresh token existe antes de intentar refrescar
      const refreshTokenValue = localStorage.getItem('refresh-token');
      if (refreshTokenValue && refreshTokenValue.startsWith('mock-refresh-token-')) {
        // Solo intentar refrescar si el token parece válido
        attemptTokenRefresh().catch(() => {
          console.warn('⚠️ Failed to refresh token, session may expire soon');
        });
      }
    }, 5 * 60 * 1000); // Verificar cada 5 minutos

    return () => {
      console.log('🛑 Stopping session monitoring for user:', user.userId);
      clearInterval(interval);
    };
  }, [isAuthenticated, token, user, checkSessionExpiry, attemptTokenRefresh, clearSession]);

  // Limpiar sesión al cerrar ventana/pestaña
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Solo limpiar sessionStorage, mantener localStorage para remember me
      console.log('👋 Window closing, cleaning session storage');
      sessionStorage.removeItem('user-session');
    };

    const handleVisibilityChange = () => {
      // Verificar sesión cuando la pestaña vuelve a ser visible
      if (document.visibilityState === 'visible' && isAuthenticated && user) {
        if (!checkSessionExpiry()) {
          console.warn('⚠️ Session expired while tab was hidden');
          clearSession();
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated, user, checkSessionExpiry, clearSession]);

  return {
    checkSessionExpiry,
    attemptTokenRefresh,
    clearSession,
    performImmediateLogout,
  };
}