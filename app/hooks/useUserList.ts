// app/hooks/useUserList.ts (versión corregida)
import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from './useApi';
import { apiClient } from '~/services/api';
import { UserApiAdapter } from '~/services/userApi';
import type { UserListRequest, UserListResponse, UserSelectionAction } from '~/types/user';

interface UseUserListOptions {
  onError?: (error: string) => void;
  onUserAction?: (action: UserSelectionAction) => void;
}

export function useUserList(options: UseUserListOptions = {}) {
  const navigate = useNavigate();
  const [searchCriteria, setSearchCriteria] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // ✅ Detectar si usar mocks o backend real
  const useMocks = import.meta.env.VITE_USE_MOCKS === 'true';
  
  const fetchUsersRef = useRef<(request: UserListRequest) => Promise<any>>();
  
  if (!fetchUsersRef.current) {
    fetchUsersRef.current = async (request: UserListRequest) => {
      console.log('🔍 Fetching users with:', { useMocks, request });
      
      if (useMocks) {
        // ✅ Usar endpoint de mocks
        const params = new URLSearchParams();
        params.append('page', request.page.toString());
        params.append('limit', request.limit.toString());
        
        if (request.searchUserId) {
          params.append('searchUserId', request.searchUserId);
        }

        const endpoint = `/users/security?${params.toString()}`;
        console.log('🔍 Mock endpoint:', endpoint);
        
        return apiClient.get<UserListResponse>(endpoint);
      } else {
        // ✅ Usar adaptador para backend real
        console.log('🔍 Using real backend via adapter');
        return UserApiAdapter.getUserList(request);
      }
    };
  }

  // Hook para cargar datos
  const {
    data: userListData,
    loading,
    error,
    execute: loadUsers,
  } = useApi<UserListResponse>(
    () => fetchUsersRef.current!({
      searchUserId: searchCriteria || undefined,
      page: currentPage,
      limit: 10,
    }),
    {
      immediate: false,
      ...(options.onError && { onError: options.onError }),
    }
  );

  // ✅ CORRECCIÓN: Cargar datos solo una vez al montar
  useEffect(() => {
    if (!isInitialized) {
      console.log('🚀 Initial load of users');
      loadUsers();
      setIsInitialized(true);
    }
  }, [isInitialized, loadUsers]);

  // ✅ CORRECCIÓN: Manejar búsqueda (equivalente a PROCESS-ENTER-KEY cuando hay criterio)
  const handleSearch = useCallback((request: UserListRequest) => {
    console.log('🔍 Search triggered:', request);
    setSearchCriteria(request.searchUserId || '');
    setCurrentPage(request.page);
    
    // Ejecutar búsqueda inmediatamente
    setTimeout(() => {
      loadUsers();
    }, 0);
  }, [loadUsers]);

  // ✅ CORRECCIÓN: Manejar cambio de página (equivalente a PROCESS-PF7-KEY y PROCESS-PF8-KEY)
  const handlePageChange = useCallback((page: number) => {
    console.log('📄 Page change triggered:', page);
    
    // Validar límites de página como en COBOL
    if (page < 1) {
      options.onError?.('You are already at the top of the page...');
      return;
    }
    
    const totalPages = userListData?.pagination?.totalPages || 1;
    if (page > totalPages && !userListData?.pagination?.hasNext) {
      options.onError?.('You are already at the bottom of the page...');
      return;
    }
    
    setCurrentPage(page);
    
    setTimeout(() => {
      loadUsers();
    }, 0);
  }, [loadUsers, userListData?.pagination, options]);

  // ✅ CORRECCIÓN: Manejar acción de usuario (equivalente a PROCESS-ENTER-KEY con selección)
  const handleUserAction = useCallback((action: UserSelectionAction) => {
    console.log('🎯 Processing user action:', action);
    
    // ✅ Validar acción como en COBOL original
    if (!action.action || (action.action !== 'U' && action.action !== 'D')) {
      options.onError?.('Invalid selection. Valid values are U and D');
      return;
    }
    
    if (!action.userId || action.userId.trim() === '') {
      options.onError?.('User ID cannot be empty');
      return;
    }

    // ✅ Navegar directamente según la acción (como PROCESS-ENTER-KEY en COBOL)
    switch (action.action.toUpperCase()) {
      case 'U':
        console.log('🔄 Navigating to update user:', action.userId);
        navigate(`/admin/users/update?userId=${action.userId}`);
        break;
      case 'D':
        console.log('🗑️ Navigating to delete user:', action.userId);
        navigate(`/admin/users/delete?userId=${action.userId}`);
        break;
      default:
        options.onError?.('Invalid selection. Valid values are U and D');
        break;
    }
  }, [navigate, options]);

  // ✅ CORRECCIÓN: Manejar salida (equivalente a DFHPF3 en COBOL)
  const handleExit = useCallback(() => {
    console.log('🚪 Exiting to admin menu');
    // En el mainframe original, F3 vuelve a COADM01C (admin menu)
    navigate('/menu/admin');
  }, [navigate]);

  // ✅ CORRECCIÓN: Función para refrescar datos
  const refresh = useCallback(() => {
    console.log('🔄 Refreshing user list');
    loadUsers();
  }, [loadUsers]);

  // ✅ CORRECCIÓN: Función para limpiar búsqueda
  const clearSearch = useCallback(() => {
    console.log('🧹 Clearing search');
    setSearchCriteria('');
    setCurrentPage(1);
    setTimeout(() => {
      loadUsers();
    }, 0);
  }, [loadUsers]);

  // ✅ CORRECCIÓN: Función para ir a página anterior (F7)
  const handlePreviousPage = useCallback(() => {
    console.log('⬅️ Going to previous page');
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    } else {
      options.onError?.('You are already at the top of the page...');
    }
  }, [currentPage, handlePageChange, options]);

  // ✅ CORRECCIÓN: Función para ir a página siguiente (F8)
  const handleNextPage = useCallback(() => {
    console.log('➡️ Going to next page');
    const pagination = userListData?.pagination;
    
    if (pagination?.hasNext) {
      handlePageChange(currentPage + 1);
    } else {
      options.onError?.('You are already at the bottom of the page...');
    }
  }, [currentPage, handlePageChange, userListData?.pagination, options]);

  // ✅ CORRECCIÓN: Función para procesar ENTER (equivalente a PROCESS-ENTER-KEY completo)
  const handleEnterKey = useCallback((selectedActions: Record<string, string>) => {
    console.log('⏎ Processing ENTER key with selections:', selectedActions);
    
    // Buscar la primera selección válida (como en el mainframe)
    const selectedEntries = Object.entries(selectedActions).filter(([_, action]) => action !== '');
    
    if (selectedEntries.length === 0) {
      // Si no hay selección, es una búsqueda (como en COBOL cuando USRIDINI tiene valor)
      console.log('🔍 No selection found, treating as search');
      return false; // Indicar que no se procesó ninguna selección
    }

    // ✅ CORRECCIÓN: Procesar la primera selección con verificación de undefined
    const firstSelection = selectedEntries[0];
    if (firstSelection) {
      const [userId, action] = firstSelection;
      if (action === 'U' || action === 'D') {
        handleUserAction({ userId, action: action as 'U' | 'D' });
        return true; // Indicar que se procesó una selección
      }
    }

    return false;
  }, [handleUserAction]);

  return {
    // ✅ Datos
    users: userListData?.users || [],
    pagination: userListData?.pagination || {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
      hasNext: false,
      hasPrev: false,
    },
    searchCriteria,
    
    // ✅ Estados
    loading,
    error,
    
    // ✅ Acciones principales (como en COBOL)
    handleSearch,
    handlePageChange,
    handleUserAction,
    handleExit,
    
    // ✅ Acciones específicas de teclado
    handlePreviousPage, // F7
    handleNextPage,     // F8
    handleEnterKey,     // ENTER
    
    // ✅ Utilidades
    refresh,
    clearSearch,
    
    // ✅ Estados derivados
    isFirstPage: currentPage === 1,
    isLastPage: !userListData?.pagination?.hasNext,
    hasUsers: (userListData?.users?.length || 0) > 0,
    currentPage,
    
    // ✅ Funciones de validación
    validateSelection: useCallback((action: string) => {
      return action === 'U' || action === 'D';
    }, []),
    
    // ✅ Función para obtener mensaje de estado
    getStatusMessage: useCallback(() => {
      if (loading) return 'Loading users...';
      if (error) return error;
      if (!userListData?.users?.length) {
        return searchCriteria 
          ? 'No users found matching your search criteria' 
          : 'No users available';
      }
      return null;
    }, [loading, error, userListData?.users?.length, searchCriteria]),
  };
}