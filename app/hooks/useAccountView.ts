// ===== app/hooks/useAccountView.ts =====
import { useState, useCallback } from 'react';
import { useMutation } from './useApi';
import { apiClient } from '~/services/api';
import type { AccountViewRequest, AccountViewResponse } from '~/types/account';

export function useAccountView() {
  const [data, setData] = useState<AccountViewResponse | null>(null);

  const {
    mutate: searchAccount,
    loading,
    error,
    reset,
  } = useMutation<AccountViewResponse, AccountViewRequest>(
    async (request) => {
      // ✅ CORRECCIÓN: Cambiar de POST a GET con query parameters
      const accountId = parseInt(request.accountId, 10);
      
      const response = await apiClient.get<AccountViewResponse>(
        `/account-view?accountId=${accountId.toString().padStart(11, '0')}`
      );
      return response;
    },
    {
      onSuccess: (response) => {
        console.log('✅ Account search successful:', response);
        setData(response);
      },
      onError: (error) => {
        console.error('❌ Error searching account:', error);
        setData(null);
      },
    }
  );

  const initializeScreen = useCallback(async () => {
    try {
      // ✅ CORRECCIÓN: Mantener el endpoint de inicialización como estaba
      const response = await apiClient.get<AccountViewResponse>('/account-view/initialize');
      console.log('🔧 Initialize response:', response);
      
      // Manejar tanto respuestas de MSW como del backend real
      if (response && typeof response === 'object') {
        if ('success' in response && response.success && response.data) {
          // Respuesta de MSW
          setData(response.data);
        } else if ('currentDate' in response && 'transactionId' in response) {
          // Respuesta directa del backend real
          setData(response as AccountViewResponse);
        }
      }
    } catch (error) {
      console.error('❌ Error initializing screen:', error);
    }
  }, []);

  const clearData = useCallback(() => {
    setData(null);
    reset();
  }, [reset]);

  return {
    data,
    loading,
    error,
    searchAccount,
    initializeScreen,
    clearData,
  };
}