import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '~/store/hooks';
import { logoutUser, selectCurrentUser } from '~/features/auth/authSlice';
import type { MenuOption } from '~/types/menu';

interface UseMenuOptions {
  onError?: (error: string) => void;
  onSuccess?: (option: MenuOption) => void;
}

export function useMenu(options: UseMenuOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);

  const handleOptionSelect = useCallback(async (option: MenuOption) => {
    setLoading(true);
    setError(null);

    try {
      // Simular validación/procesamiento
      await new Promise(resolve => setTimeout(resolve, 300));

      if (option.path) {
        navigate(option.path);
      } else if (option.action) {
        // Manejar acciones específicas
        console.log(`Ejecutando acción: ${option.action}`);
      }

      options.onSuccess?.(option);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al procesar la opción';
      setError(errorMessage);
      options.onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [navigate, options]);

  const handleExit = useCallback(() => {
    // Redirigir al login en lugar de cerrar la aplicación
    dispatch(logoutUser());
    navigate('/login');
  }, [navigate, dispatch]);

  const handleHome = useCallback(() => {
    // Navegar al menú apropiado según el rol del usuario
    if (user?.role === 'admin') {
      navigate('/menu/admin');
    } else {
      navigate('/menu/main');
    }
  }, [navigate, user]);

  const handleLogout = useCallback(() => {
    // Logout sin confirmación como se requiere
    dispatch(logoutUser());
    navigate('/login');
  }, [dispatch, navigate]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    handleOptionSelect,
    handleExit,
    handleHome,
    handleLogout,
    clearError,
  };
}