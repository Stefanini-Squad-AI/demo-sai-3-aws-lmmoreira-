// app/hooks/useCreditCardDetail.ts
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from './useApi';
import { apiClient } from '~/services/api';
import type { 
  CreditCardDetailRequest, 
  CreditCardDetailResponse 
} from '~/types/creditCardDetail';

interface UseCreditCardDetailOptions {
  onError?: ((error: string) => void) | undefined;
  onSuccess?: ((data: CreditCardDetailResponse) => void) | undefined;
}

export function useCreditCardDetail(options: UseCreditCardDetailOptions = {}) {
  const navigate = useNavigate();
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const { mutate: fetchCardDetail, loading, error, data } = useMutation(
    async (request: CreditCardDetailRequest): Promise<CreditCardDetailResponse> => {
      // Convertir accountId a número correctamente
      const accountIdNumber = parseInt(request.accountId, 10);
      
      console.log('🔄 Converting request:', {
        original: request,
        converted: {
          accountId: accountIdNumber,
          cardNumber: request.cardNumber,
        }
      });

      const backendRequest = {
        accountId: accountIdNumber,
        cardNumber: request.cardNumber,
      };
      
      // ✅ CORRECCIÓN: Hacer la llamada y manejar la respuesta correctamente
      const response = await apiClient.post<CreditCardDetailResponse>('/credit-cards/details', backendRequest);
      
      console.log('🎯 API Response received:', response);
      
      // ✅ CORRECCIÓN CRÍTICA: Manejar la respuesta de MSW
      // MSW puede devolver directamente los datos o en formato ApiResponse
      
      // Si es una ApiResponse con success y data
      if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
        if (response.success && response.data) {
          console.log('📦 Returning ApiResponse.data:', response.data);
          return response.data;
        } else {
          console.error('❌ ApiResponse failed:', response.error);
          throw new Error(response.error || 'Request failed');
        }
      }
      
      // Si MSW devuelve directamente los datos (con success: true incluido)
      if (response && typeof response === 'object' && 'accountId' in response && 'cardNumber' in response) {
        // Verificar si tiene success: false (error de MSW)
        if ('success' in response && response.success === false) {
          console.error('❌ MSW error response:', response);
          const errorMsg = (response as any).errorMessage || 'Request failed';
          throw new Error(errorMsg);
        }
        
        console.log('📦 Returning direct MSW response:', response);
        return response as CreditCardDetailResponse;
      }
      
      console.error('❌ Invalid response structure:', response);
      throw new Error('Invalid response structure');
    },
    {
      onSuccess: (data: CreditCardDetailResponse) => {
        console.log('✅ useMutation onSuccess called with:', data);
        if (data && options.onSuccess) {
          options.onSuccess(data);
        }
      },
      onError: (error: string) => {
        console.error('❌ useMutation onError called with:', error);
        if (options.onError) {
          options.onError(error);
        }
      },
    }
  );

  const validateInputs = useCallback((request: CreditCardDetailRequest): boolean => {
    const errors: Record<string, string> = {};

    // Validación de Account ID (como en 2210-EDIT-ACCOUNT)
    if (!request.accountId || request.accountId.trim() === '') {
      errors.accountId = 'Account number not provided';
    } else if (!/^\d{11}$/.test(request.accountId) || request.accountId === '00000000000') {
      errors.accountId = 'Account number must be a non zero 11 digit number';
    }

    // Validación de Card Number (como en 2220-EDIT-CARD)
    if (!request.cardNumber || request.cardNumber.trim() === '') {
      errors.cardNumber = 'Card number not provided';
    } else if (!/^\d{16}$/.test(request.cardNumber)) {
      errors.cardNumber = 'Card number if supplied must be a 16 digit number';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, []);

  const handleSearch = useCallback(async (request: CreditCardDetailRequest) => {
    console.log('🔍 handleSearch called with:', request);
    
    if (!validateInputs(request)) {
      console.log('❌ Validation failed');
      return;
    }

    console.log('✅ Validation passed, calling fetchCardDetail');
    try {
      await fetchCardDetail(request);
    } catch (error) {
      console.error('❌ Error in handleSearch:', error);
    }
  }, [fetchCardDetail, validateInputs]);

  const handleExit = useCallback(() => {
    navigate('/cards/list');
  }, [navigate]);

  const formatExpiryDate = useCallback((expiryMonth?: string, expiryYear?: string) => {
    return {
      month: expiryMonth || '',
      year: expiryYear || ''
    };
  }, []);

  // Log del estado del hook para debug
  console.log('🎯 useCreditCardDetail state:', {
    data,
    loading,
    error,
    validationErrors
  });

  return {
    // Estado
    data,
    loading,
    error: error || (Object.keys(validationErrors).length > 0 ? 'Please correct the validation errors' : null),
    validationErrors,
    
    // Acciones
    handleSearch,
    handleExit,
    
    // Utilidades
    formatExpiryDate,
  };
}