// ===== app/hooks/useCreditCardUpdate.ts =====
import { useState, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from './useApi';
import { apiClient } from '~/services/api';
import type { 
  CreditCardUpdateRequest, 
  CreditCardUpdateResponse,
  CreditCardUpdateState
} from '../types/creditCardUpdate';

interface UseCreditCardUpdateOptions {
  onError?: (error: string) => void;
  onSuccess?: (data: CreditCardUpdateResponse) => void;
}

interface LocationState {
  accountNumber?: string;
  cardNumber?: string;
  fromList?: boolean;
}

export function useCreditCardUpdate(options: UseCreditCardUpdateOptions = {}) {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  
  const [updateState, setUpdateState] = useState<CreditCardUpdateState>({
    changeAction: 'NOT_FETCHED',
    validationErrors: {},
  });

  const hasAutoSearched = useRef(false);

  // ✅ CORRECCIÓN CRÍTICA: Mapeo correcto según la enumeración CardStatus del backend
  // Backend CardStatus enum: A (Active), B (Blocked), E (Expired), I (Inactive)
  const mapBackendStatusToUI = useCallback((backendStatus: string): 'A' | 'I' => {
    // Mapear diferentes formatos del backend a los valores de la enum
    switch (backendStatus.toUpperCase()) {
      case 'A':
      case 'ACTIVE':
        return 'A';
      case 'I':
      case 'INACTIVE':
      case 'N': // Por si viene del frontend anterior
        return 'I';
      case 'B':
      case 'BLOCKED':
        return 'I'; // Tratamos blocked como inactive para la UI
      case 'E':
      case 'EXPIRED':
        return 'I'; // Tratamos expired como inactive para la UI
      default:
        console.warn('⚠️ Unknown status:', backendStatus, 'defaulting to inactive');
        return 'I';
    }
  }, []);

  const mapUIStatusToBackend = useCallback((uiStatus: 'A' | 'I'): 'A' | 'I' => {
    // Ya están en el formato correcto para el backend
    return uiStatus;
  }, []);

  const getStatusDisplayName = useCallback((status: 'A' | 'I'): string => {
    return status === 'A' ? 'Active' : 'Inactive';
  }, []);

  // Mutation para búsqueda inicial
  const { mutate: searchCard, loading: searchLoading, error: searchError } = useMutation(
    async (request: { accountId: string; cardNumber: string }) => {
      const backendRequest = {
        accountId: parseInt(request.accountId, 10),
        cardNumber: request.cardNumber,
      };
      
      console.log('🔍 Search request:', backendRequest);
      return apiClient.post<CreditCardUpdateResponse>('/credit-cards/search', backendRequest);
    },
    {
      onSuccess: (data: CreditCardUpdateResponse) => {
        console.log('✅ Search success:', data);
        
        if (!data || !data.cardNumber) {
          console.error('❌ Invalid search response data:', data);
          setUpdateState((prev: CreditCardUpdateState) => ({
            ...prev,
            changeAction: 'NOT_FETCHED',
          }));
          options.onError?.('Invalid response from server');
          return;
        }

        setUpdateState((prev: CreditCardUpdateState) => ({
          ...prev,
          changeAction: 'SHOW_DETAILS',
          oldDetails: data,
          newDetails: {
            accountId: data.accountId.toString(),
            cardNumber: data.cardNumber,
            embossedName: data.embossedName,
            // ✅ CORRECCIÓN: Usar mapeo correcto para CardStatus enum
            activeStatus: mapBackendStatusToUI(data.activeStatus),
            expiryMonth: data.expiryMonth.toString().padStart(2, '0'),
            expiryYear: data.expiryYear.toString(),
            expiryDay: '01',
          },
          validationErrors: {},
        }));
        options.onSuccess?.(data);
      },
      onError: (error: string) => {
        console.error('❌ Search error:', error);
        setUpdateState((prev: CreditCardUpdateState) => ({
          ...prev,
          changeAction: 'NOT_FETCHED',
          validationErrors: {},
        }));
        options.onError?.(error);
      },
    }
  );

  // Mutation para actualización
  const { mutate: updateCard, loading: updateLoading, error: updateError } = useMutation(
    async (request: CreditCardUpdateRequest) => {
      // ✅ CORRECCIÓN CRÍTICA: Enviar activeStatus en el formato correcto del backend
      const backendRequest = {
        accountId: parseInt(request.accountId, 10),
        cardNumber: request.cardNumber,
        embossedName: request.embossedName.toUpperCase().trim(),
        activeStatus: mapUIStatusToBackend(request.activeStatus), // A o I
        expiryMonth: parseInt(request.expiryMonth, 10),
        expiryYear: parseInt(request.expiryYear, 10),
        expiryDay: parseInt(request.expiryDay || '1', 10),
      };
      
      console.log('💾 Update request:', backendRequest);
      return apiClient.put<CreditCardUpdateResponse>('/credit-cards/update', backendRequest);
    },
    {
      onSuccess: (data: CreditCardUpdateResponse) => {
        console.log('✅ Update success:', data);
        setUpdateState((prev: CreditCardUpdateState) => ({
          ...prev,
          changeAction: 'CHANGES_OKAYED_AND_DONE',
          oldDetails: data,
          validationErrors: {},
        }));
        options.onSuccess?.(data);
      },
      onError: (error: string) => {
        console.error('❌ Update error:', error);
        setUpdateState((prev: CreditCardUpdateState) => ({
          ...prev,
          changeAction: 'CHANGES_FAILED',
        }));
        options.onError?.(error);
      },
    }
  );

  // Auto-búsqueda cuando viene de la lista
  const handleAutoSearch = useCallback(() => {
    if (state?.accountNumber && 
        state?.cardNumber && 
        !hasAutoSearched.current && 
        updateState.changeAction === 'NOT_FETCHED') {
      
      hasAutoSearched.current = true;
      searchCard({
        accountId: state.accountNumber,
        cardNumber: state.cardNumber,
      });
    }
  }, [state, updateState.changeAction, searchCard]);

  // ✅ CORRECCIÓN: Validaciones actualizadas para CardStatus enum
  const validateInputs = useCallback((request: CreditCardUpdateRequest): boolean => {
    const errors: Record<string, string> = {};

    // Validación de Account ID
    if (!request.accountId || request.accountId.trim() === '') {
      errors.accountId = 'Account number not provided';
    } else if (!/^\d{1,11}$/.test(request.accountId) || request.accountId === '00000000000') {
      errors.accountId = 'Account number must be a non zero 11 digit number';
    }

    // Validación de Card Number
    if (!request.cardNumber || request.cardNumber.trim() === '') {
      errors.cardNumber = 'Card number not provided';
    } else if (!/^\d{16}$/.test(request.cardNumber)) {
      errors.cardNumber = 'Card number must be a 16 digit number';
    }

    // Validaciones adicionales solo si no es búsqueda inicial
    if (updateState.changeAction !== 'NOT_FETCHED') {
      // Validación de nombre
      if (!request.embossedName || request.embossedName.trim() === '') {
        errors.embossedName = 'Card name not provided';
      } else if (!/^[a-zA-Z\s]+$/.test(request.embossedName.trim())) {
        errors.embossedName = 'Card name can only contain alphabets and spaces';
      } else if (request.embossedName.trim().length > 50) {
        errors.embossedName = 'Card name cannot exceed 50 characters';
      }

      // ✅ CORRECCIÓN: Validación para CardStatus enum (A o I)
      if (!request.activeStatus || !['A', 'I'].includes(request.activeStatus)) {
        errors.activeStatus = 'Card Active Status must be A (Active) or I (Inactive)';
      }

      // Validación de mes
      const month = parseInt(request.expiryMonth);
      if (!request.expiryMonth || isNaN(month) || month < 1 || month > 12) {
        errors.expiryMonth = 'Card expiry month must be between 1 and 12';
      }

      // Validación de año
      const year = parseInt(request.expiryYear);
      const currentYear = new Date().getFullYear();
      if (!request.expiryYear || isNaN(year) || year < currentYear || year > 2099) {
        errors.expiryYear = `Card expiry year must be between ${currentYear} and 2099`;
      }

      // Validación de fecha de expiración no debe ser pasada
      if (!isNaN(month) && !isNaN(year) && year >= currentYear) {
        const currentMonth = new Date().getMonth() + 1;
        if (year === currentYear && month < currentMonth) {
          errors.expiryMonth = 'Card expiry date cannot be in the past';
        }
      }
    }

    console.log('🔍 Validation errors:', errors);
    setUpdateState((prev: CreditCardUpdateState) => ({ 
      ...prev, 
      validationErrors: errors 
    }));
    
    return Object.keys(errors).length === 0;
  }, [updateState.changeAction]);

  // Manejar búsqueda
  const handleSearch = useCallback(async (request: { accountId: string; cardNumber: string }) => {
    const searchRequest: CreditCardUpdateRequest = {
      ...request,
      embossedName: '',
      activeStatus: 'A', // ✅ Usar 'A' en lugar de 'Y'
      expiryMonth: '01',
      expiryYear: '2025'
    };

    if (!validateInputs(searchRequest)) {
      return;
    }

    await searchCard(request);
  }, [searchCard, validateInputs]);

  // Manejar cambios en los campos
  const handleFieldChange = useCallback((field: keyof CreditCardUpdateRequest, value: string) => {
    setUpdateState((prev: CreditCardUpdateState) => {
      if (!prev.newDetails || !prev.oldDetails) {
        return prev;
      }

      const newDetails = { ...prev.newDetails, [field]: value };
      
      // ✅ CORRECCIÓN: Comparación segura usando mapeo correcto
      const originalActiveStatus = mapBackendStatusToUI(prev.oldDetails.activeStatus);
      
      // Verificar si hay cambios respecto a los datos originales
      const hasChanges = (
        newDetails.embossedName.toUpperCase().trim() !== prev.oldDetails.embossedName.toUpperCase().trim() ||
        newDetails.activeStatus !== originalActiveStatus ||
        newDetails.expiryMonth !== prev.oldDetails.expiryMonth.toString().padStart(2, '0') ||
        newDetails.expiryYear !== prev.oldDetails.expiryYear.toString()
      );

      console.log('🔄 Field change:', { 
        field, 
        value, 
        hasChanges,
        originalActiveStatus,
        newActiveStatus: newDetails.activeStatus
      });

      return {
        ...prev,
        newDetails,
        changeAction: hasChanges ? 'CHANGES_NOT_OK' : 'SHOW_DETAILS',
        validationErrors: {},
      };
    });
  }, [mapBackendStatusToUI]);

  // Validar cambios
  const handleValidateChanges = useCallback(() => {
    if (!updateState.newDetails) {
      console.warn('⚠️ No details to validate');
      return;
    }

    console.log('🔍 Validating changes:', updateState.newDetails);

    if (validateInputs(updateState.newDetails)) {
      setUpdateState((prev: CreditCardUpdateState) => ({
        ...prev,
        changeAction: 'CHANGES_OK_NOT_CONFIRMED',
      }));
      console.log('✅ Validation passed');
    } else {
      setUpdateState((prev: CreditCardUpdateState) => ({
        ...prev,
        changeAction: 'CHANGES_NOT_OK',
      }));
      console.log('❌ Validation failed');
    }
  }, [updateState.newDetails, validateInputs]);

  // Confirmar y guardar cambios
  const handleSaveChanges = useCallback(async () => {
    if (!updateState.newDetails) {
      console.warn('⚠️ No details to save');
      return;
    }

    console.log('💾 Saving changes:', updateState.newDetails);
    await updateCard(updateState.newDetails);
  }, [updateState.newDetails, updateCard]);

  // Cancelar cambios
  const handleCancelChanges = useCallback(() => {
    if (updateState.oldDetails) {
      console.log('🔄 Canceling changes');
      const originalActiveStatus = mapBackendStatusToUI(updateState.oldDetails.activeStatus);
      
      setUpdateState((prev: CreditCardUpdateState) => ({
        ...prev,
        changeAction: 'SHOW_DETAILS',
        newDetails: {
          accountId: prev.oldDetails!.accountId.toString(),
          cardNumber: prev.oldDetails!.cardNumber,
          embossedName: prev.oldDetails!.embossedName,
          activeStatus: originalActiveStatus,
          expiryMonth: prev.oldDetails!.expiryMonth.toString().padStart(2, '0'),
          expiryYear: prev.oldDetails!.expiryYear.toString(),
          expiryDay: '01',
        },
        validationErrors: {},
      }));
    }
  }, [updateState.oldDetails, mapBackendStatusToUI]);

  // Salir
  const handleExit = useCallback(() => {
    navigate('/cards/list');
  }, [navigate]);

  return {
    // Estado
    updateState,
    loading: searchLoading || updateLoading,
    error: searchError || updateError,
    
    // Acciones
    handleAutoSearch,
    handleSearch,
    handleFieldChange,
    handleValidateChanges,
    handleSaveChanges,
    handleCancelChanges,
    handleExit,
    
    // Utilidades
    isFromList: !!state?.fromList,
    canSave: updateState.changeAction === 'CHANGES_OK_NOT_CONFIRMED',
    canEdit: ['SHOW_DETAILS', 'CHANGES_NOT_OK'].includes(updateState.changeAction),
    
    // ✅ Funciones helper expuestas
    mapBackendStatusToUI,
    mapUIStatusToBackend,
    getStatusDisplayName,
  };
}