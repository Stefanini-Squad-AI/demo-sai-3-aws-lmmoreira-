// app/hooks/useTransactionView.ts (corregido para backend Spring Boot)
import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from './useApi';
import { apiClient } from '~/services/api';
import type { 
  TransactionViewRequest, 
  TransactionViewResponse,
  TransactionViewState 
} from '~/types/transactionView';

interface UseTransactionViewOptions {
  onError?: (error: string) => void;
  initialTransactionId?: string;
}

export function useTransactionView(options: UseTransactionViewOptions = {}) {
  const navigate = useNavigate();
  
  const [state, setState] = useState<TransactionViewState>({
    searchTransactionId: options.initialTransactionId || '',
    transactionData: null,
    validationErrors: {},
  });

  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);

  // ✅ CORRECCIÓN: Usar endpoints exactos del backend Spring Boot
  const { mutate: searchTransaction, loading, error } = useMutation(
    async (request: TransactionViewRequest) => {
      console.log('🔍 Searching transaction:', request.transactionId);
      // ✅ URL exacta del backend: @PostMapping("/transaction/search")
      const response = await apiClient.get<TransactionViewResponse>(
        `/transaction-view/search?transactionId=${request.transactionId}`,
       // ✅ Enviar como objeto con transactionId
      );
      return response;
    },
    {
      onSuccess: (data: TransactionViewResponse) => {
        console.log('✅ Transaction search result:', data);
        if (data.errorMessage) {
          const errorMessage = data.errorMessage as string;
          setState(prev => ({
            ...prev,
            validationErrors: { searchTransactionId: errorMessage },
            transactionData: null,
          }));
          return;
        }

        setState(prev => ({
          ...prev,
          transactionData: data,
          validationErrors: {},
        }));
      },
      onError: (error: string) => {
        console.error('❌ Transaction search error:', error);
        setState(prev => ({
          ...prev,
          validationErrors: { searchTransactionId: error },
          transactionData: null,
        }));
        options.onError?.(error);
      },
    }
  );

  // ✅ CORRECCIÓN: Usar endpoint exacto del backend
  const { mutate: clearScreen, loading: clearLoading } = useMutation(
    async () => {
      // ✅ URL exacta del backend: @PostMapping("/transaction/clear")
      const response = await apiClient.post<TransactionViewResponse>('/transaction/clear');
      return response;
    },
    {
      onSuccess: (data: TransactionViewResponse) => {
        setState(prev => ({
          ...prev,
          searchTransactionId: '',
          transactionData: data,
          validationErrors: {},
        }));
      },
    }
  );

  // Validar Transaction ID (igual que en el backend)
  const validateTransactionId = useCallback((transactionId: string): boolean => {
    const errors: Record<string, string> = {};

    // ✅ Validación exacta del backend: "Transaction ID cannot be empty..."
    if (!transactionId || transactionId.trim() === '') {
      errors.searchTransactionId = 'Transaction ID cannot be empty...';
    }

    setState(prev => ({ ...prev, validationErrors: errors }));
    return Object.keys(errors).length === 0;
  }, []);

  const handleSearch = useCallback(async () => {
    if (!validateTransactionId(state.searchTransactionId)) {
      return;
    }

    await searchTransaction({ transactionId: state.searchTransactionId.trim() });
  }, [state.searchTransactionId, validateTransactionId, searchTransaction]);

  const handleSearchChange = useCallback((value: string) => {
    setState(prev => ({ 
      ...prev, 
      searchTransactionId: value,
      validationErrors: { ...prev.validationErrors, searchTransactionId: '' }
    }));
  }, []);

  const handleClearScreen = useCallback(async () => {
    await clearScreen({});
  }, [clearScreen]);

  // ✅ CORRECCIÓN: Navegar usando el endpoint del backend
  const handleBrowseTransactions = useCallback(() => {
    // Equivalente a return "redirect:/transaction/list" del backend
    navigate('/transactions/list');
  }, [navigate]);

  // ✅ CORRECCIÓN: Navegar usando el endpoint del backend  
  const handleExit = useCallback(() => {
    // Equivalente a return "redirect:/menu" del backend
    navigate('/menu/main');
  }, [navigate]);

  const handleInitialLoad = useCallback(async () => {
    const initialId = options.initialTransactionId;
    
    if (initialId && !hasInitiallyLoaded) {
      console.log('🚀 Loading initial transaction:', initialId);
      setHasInitiallyLoaded(true);
      
      if (validateTransactionId(initialId)) {
        await searchTransaction({ transactionId: initialId });
      }
    }
  }, [options.initialTransactionId, hasInitiallyLoaded, validateTransactionId, searchTransaction]);

  useEffect(() => {
    if (options.initialTransactionId && !hasInitiallyLoaded) {
      handleInitialLoad();
    }
  }, [options.initialTransactionId, hasInitiallyLoaded, handleInitialLoad]);

  return {
    ...state,
    loading: loading || clearLoading,
    error,
    handleSearch,
    handleSearchChange,
    handleClearScreen,
    handleBrowseTransactions,
    handleExit,
    handleInitialLoad,
  };
}