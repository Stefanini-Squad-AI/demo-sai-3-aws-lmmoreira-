// app/hooks/useTransactionList.ts
import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from './useApi';
import { apiClient } from '~/services/api';
import type { 
  TransactionListRequest, 
  TransactionListResponse,
  TransactionListState 
} from '~/types/transactionList';

interface UseTransactionListOptions {
  onError?: (error: string) => void;
  onTransactionSelect?: (transactionId: string) => void;
}

export function useTransactionList(options: UseTransactionListOptions = {}) {
  const navigate = useNavigate();
  
  // ✅ CORRECCIÓN: Estado inicial sin firstTransactionId y lastTransactionId
  const [state, setState] = useState<TransactionListState>({
    searchTransactionId: '',
    currentPage: 1,
    transactions: [],
    selectedTransaction: null,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  // ✅ CORRECCIÓN: Usar ref para evitar bucles infinitos
  const hasInitiallyLoaded = useRef(false);

  // ✅ CORRECCIÓN: Crear opciones de API con tipos correctos
  const createApiOptions = useCallback((onSuccess: (data: TransactionListResponse) => void) => ({
    onSuccess,
    ...(options.onError && { onError: options.onError }),
  }), [options.onError]);

  // Mutation para obtener lista de transacciones
  const { mutate: fetchTransactions, loading, error } = useMutation(
    async (request: TransactionListRequest) => {
      const response = await apiClient.post<TransactionListResponse>(
        '/transactions/list',
        request
      );
      return response;
    },
    createApiOptions((data: TransactionListResponse) => {
      if (data.errorMessage) {
        setValidationErrors({ searchTransactionId: data.errorMessage });
        return;
      }

      // ✅ CORRECCIÓN: Construir nuevo estado correctamente
      setState(prevState => {
        const newState: TransactionListState = {
          ...prevState,
          transactions: data.transactions || [],
          currentPage: data.currentPage || 1,
          hasNextPage: data.hasNextPage || false,
          hasPreviousPage: data.hasPreviousPage || false,
        };

        // ✅ CORRECCIÓN: Solo agregar IDs si existen
        if (data.firstTransactionId) {
          newState.firstTransactionId = data.firstTransactionId;
        }
        if (data.lastTransactionId) {
          newState.lastTransactionId = data.lastTransactionId;
        }

        return newState;
      });
      
      setValidationErrors({});
    })
  );

  // Mutation para página siguiente
  const { mutate: fetchNextPage, loading: loadingNext } = useMutation(
    async (request: TransactionListRequest) => {
      const response = await apiClient.post<TransactionListResponse>(
        '/transactions/next-page',
        request
      );
      return response;
    },
    createApiOptions((data: TransactionListResponse) => {
      if (data.errorMessage) {
        options.onError?.(data.errorMessage);
        return;
      }

      // ✅ CORRECCIÓN: Construir nuevo estado correctamente
      setState(prevState => {
        const newState: TransactionListState = {
          ...prevState,
          transactions: data.transactions || [],
          currentPage: data.currentPage || prevState.currentPage + 1,
          hasNextPage: data.hasNextPage || false,
          hasPreviousPage: data.hasPreviousPage || true,
        };

        // ✅ CORRECCIÓN: Solo agregar IDs si existen
        if (data.firstTransactionId) {
          newState.firstTransactionId = data.firstTransactionId;
        }
        if (data.lastTransactionId) {
          newState.lastTransactionId = data.lastTransactionId;
        }

        return newState;
      });
    })
  );

  // Mutation para página anterior
  const { mutate: fetchPreviousPage, loading: loadingPrev } = useMutation(
    async (request: TransactionListRequest) => {
      const response = await apiClient.post<TransactionListResponse>(
        '/transactions/previous-page',
        request
      );
      return response;
    },
    createApiOptions((data: TransactionListResponse) => {
      if (data.errorMessage) {
        options.onError?.(data.errorMessage);
        return;
      }

      // ✅ CORRECCIÓN: Construir nuevo estado correctamente
      setState(prevState => {
        const newState: TransactionListState = {
          ...prevState,
          transactions: data.transactions || [],
          currentPage: data.currentPage || prevState.currentPage - 1,
          hasNextPage: data.hasNextPage || true,
          hasPreviousPage: data.hasPreviousPage || false,
        };

        // ✅ CORRECCIÓN: Solo agregar IDs si existen
        if (data.firstTransactionId) {
          newState.firstTransactionId = data.firstTransactionId;
        }
        if (data.lastTransactionId) {
          newState.lastTransactionId = data.lastTransactionId;
        }

        return newState;
      });
    })
  );

  // Validar Transaction ID (solo numérico como en COBOL)
  const validateTransactionId = useCallback((transactionId: string): boolean => {
    const errors: Record<string, string> = {};

    if (transactionId && !/^\d+$/.test(transactionId)) {
      errors.searchTransactionId = 'Tran ID must be Numeric ...';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, []);

  // Manejar búsqueda (ENTER key)
  const handleSearch = useCallback(async () => {
    if (!validateTransactionId(state.searchTransactionId)) {
      return;
    }

    // ✅ CORRECCIÓN: Construir request condicionalmente
    const request: TransactionListRequest = {
      pageNumber: 1,
    };

    if (state.searchTransactionId.trim()) {
      request.transactionId = state.searchTransactionId;
    }

    await fetchTransactions(request);
  }, [state.searchTransactionId, validateTransactionId, fetchTransactions]);

  // Manejar selección de transacción
  const handleTransactionSelect = useCallback((transactionId: string, action: string) => {
    if (action.toUpperCase() === 'S') {
      setState(prev => ({ ...prev, selectedTransaction: transactionId }));
      options.onTransactionSelect?.(transactionId);
      // ✅ CORRECCIÓN: Navegar a la nueva pantalla de detalles
      navigate(`/transactions/view/${transactionId}`);
    } else {
      setValidationErrors({ 
        [`selection_${transactionId}`]: 'Invalid selection. Valid value is S' 
      });
    }
  }, [navigate, options.onTransactionSelect]);

  // Manejar página siguiente (F8)
  const handleNextPage = useCallback(async () => {
    if (!state.hasNextPage) {
      options.onError?.('You are already at the bottom of the page...');
      return;
    }

    // ✅ CORRECCIÓN: Construir request condicionalmente
    const request: TransactionListRequest = {
      pageNumber: state.currentPage,
    };

    if (state.lastTransactionId) {
      request.transactionId = state.lastTransactionId;
    }

    await fetchNextPage(request);
  }, [state.hasNextPage, state.lastTransactionId, state.currentPage, fetchNextPage, options.onError]);

  // Manejar página anterior (F7)
  const handlePreviousPage = useCallback(async () => {
    if (!state.hasPreviousPage) {
      options.onError?.('You are already at the top of the page...');
      return;
    }

    // ✅ CORRECCIÓN: Construir request condicionalmente
    const request: TransactionListRequest = {
      pageNumber: state.currentPage,
    };

    if (state.firstTransactionId) {
      request.transactionId = state.firstTransactionId;
    }

    await fetchPreviousPage(request);
  }, [state.hasPreviousPage, state.firstTransactionId, state.currentPage, fetchPreviousPage, options.onError]);

  // Manejar cambio en campo de búsqueda
  const handleSearchChange = useCallback((value: string) => {
    setState(prev => ({ ...prev, searchTransactionId: value }));
    // Limpiar errores cuando el usuario empiece a escribir
    if (validationErrors.searchTransactionId) {
      setValidationErrors(prev => ({ ...prev, searchTransactionId: '' }));
    }
  }, [validationErrors.searchTransactionId]);

  // Salir (F3)
  const handleExit = useCallback(() => {
    navigate('/menu/main');
  }, [navigate]);

  // ✅ CORRECCIÓN: Cargar datos iniciales solo una vez
  const handleInitialLoad = useCallback(async () => {
    // Evitar cargar si ya se cargó o si ya hay transacciones
    if (hasInitiallyLoaded.current || state.transactions.length > 0) {
      return;
    }

    hasInitiallyLoaded.current = true;
    
    const request: TransactionListRequest = {
      pageNumber: 1,
    };
    
    await fetchTransactions(request);
  }, [fetchTransactions, state.transactions.length]);

  return {
    // Estado
    ...state,
    validationErrors,
    loading: loading || loadingNext || loadingPrev,
    error,
    
    // Acciones
    handleSearch,
    handleTransactionSelect,
    handleNextPage,
    handlePreviousPage,
    handleSearchChange,
    handleExit,
    handleInitialLoad,
  };
}