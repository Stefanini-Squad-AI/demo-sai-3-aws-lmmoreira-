// app/hooks/useAccountUpdate.ts
import { useState, useCallback } from 'react';
import { useMutation } from './useApi';
import { apiClient } from '~/services/api';
import type { 
  AccountUpdateRequest, 
  AccountUpdateData, 
  AccountUpdateSubmission,
  AccountUpdateResponse 
} from '~/types/accountUpdate';

export function useAccountUpdate() {
  const [accountData, setAccountData] = useState<AccountUpdateData | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalData, setOriginalData] = useState<AccountUpdateData | null>(null);

  // Buscar cuenta para actualización
  const {
    mutate: searchAccount,
    loading: searchLoading,
    error: searchError,
  } = useMutation<AccountUpdateData, AccountUpdateRequest>(
    async (request) => {
      const accountId = parseInt(request.accountId, 10);
      const response = await apiClient.get<AccountUpdateData>(`/accounts/${accountId}`);
      return response;
    },
    {
      onSuccess: (data) => {
        setAccountData(data);
        setOriginalData(data);
        setHasChanges(false);
      },
      onError: (error) => {
        console.error('Error searching account:', error);
        setAccountData(null);
        setOriginalData(null);
      },
    }
  );

  // Actualizar cuenta
  const {
    mutate: updateAccount,
    loading: updateLoading,
    error: updateError,
  } = useMutation<AccountUpdateResponse, AccountUpdateSubmission>(
    async (data) => {
      const response = await apiClient.put<AccountUpdateResponse>(
        `/accounts/${data.accountId}`,
        data
      );
      return response;
    },
    {
      onSuccess: (response) => {
        if (response.success && response.data) {
          setAccountData(response.data);
          setOriginalData(response.data);
          setHasChanges(false);
        }
      },
      onError: (error) => {
        console.error('Error updating account:', error);
      },
    }
  );

  // Actualizar datos localmente y detectar cambios
  const updateLocalData = useCallback((updates: Partial<AccountUpdateData>) => {
    if (!accountData) return;

    const newData = { ...accountData, ...updates };
    setAccountData(newData);
    
    // Detectar si hay cambios comparando con datos originales
    const hasChanges = originalData ? 
      JSON.stringify(newData) !== JSON.stringify(originalData) : false;
    setHasChanges(hasChanges);
  }, [accountData, originalData]);

  // Resetear formulario
  const resetForm = useCallback(() => {
    if (originalData) {
      setAccountData(originalData);
      setHasChanges(false);
    }
  }, [originalData]);

  // Limpiar datos
  const clearData = useCallback(() => {
    setAccountData(null);
    setOriginalData(null);
    setHasChanges(false);
  }, []);

  return {
    // Data
    accountData,
    hasChanges,
    
    // Actions
    searchAccount,
    updateAccount,
    updateLocalData,
    resetForm,
    clearData,
    
    // States
    searchLoading,
    updateLoading,
    searchError,
    updateError,
    loading: searchLoading || updateLoading,
    error: searchError || updateError,
  };
}