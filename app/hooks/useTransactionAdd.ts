// app/hooks/useTransactionAdd.ts (corregido para el backend Spring Boot)
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from './useApi';
import { apiClient } from '~/services/api';
import type { 
  TransactionAddRequest, 
  TransactionAddResponse,
  TransactionAddState 
} from '~/types/transactionAdd';

interface UseTransactionAddOptions {
  onError?: (error: string) => void;
  onSuccess?: (data: TransactionAddResponse) => void;
}

export function useTransactionAdd(options: UseTransactionAddOptions = {}) {
  const navigate = useNavigate();
  
  const [state, setState] = useState<TransactionAddState>({
    formData: {
      accountId: '',
      cardNumber: '',
      transactionTypeCode: '',
      transactionCategoryCode: '',
      transactionSource: '',
      transactionDescription: '',
      transactionAmount: '',
      originalDate: '',
      processDate: '',
      merchantId: '',
      merchantName: '',
      merchantCity: '',
      merchantZip: '',
      confirmation: '',
    },
    validationErrors: {},
    isConfirmationStep: false,
  });

  // ✅ CORRECCIÓN: Mutation que coincide con el backend Spring Boot
  const { mutate: addTransaction, loading, error } = useMutation(
    async (request: TransactionAddRequest) => {
      // ✅ CORRECCIÓN: Convertir datos exactamente como espera el backend
      const backendRequest = {
        // Campos de identificación - enviar solo si tienen valor
        ...(request.accountId && { accountId: request.accountId }),
        ...(request.cardNumber && { cardNumber: request.cardNumber }),
        
        // Datos de transacción - nombres exactos del DTO
        transactionTypeCode: request.transactionTypeCode,
        transactionCategoryCode: request.transactionCategoryCode,
        transactionSource: request.transactionSource,
        transactionDescription: request.transactionDescription,
        transactionAmount: parseFloat(request.transactionAmount), // BigDecimal en backend
        
        // ✅ CORRECCIÓN: Fechas en formato ISO para LocalDateTime
        originalDate: new Date(request.originalDate + 'T00:00:00.000Z').toISOString(),
        processDate: new Date(request.processDate + 'T00:00:00.000Z').toISOString(),
        
        // Datos del comerciante - nombres exactos del DTO
        merchantId: request.merchantId,
        merchantName: request.merchantName,
        merchantCity: request.merchantCity,
        merchantZip: request.merchantZip,
        
        // Confirmación
        confirmation: request.confirmation,
      };
      
      console.log('🔄 Sending to backend:', backendRequest);
      
      // ✅ CORRECCIÓN: El backend devuelve directamente TransactionAddResponseDto
      const response = await apiClient.post<TransactionAddResponse>(
        '/transactions',
        backendRequest
      );
      
      console.log('📦 Backend response:', response);
      return response;
    },
    {
      onSuccess: (data: TransactionAddResponse) => {
        console.log('✅ Transaction add success:', data);
        
        if (data.success) {
          // Limpiar formulario después del éxito
          setState(prev => ({
            ...prev,
            formData: {
              accountId: '',
              cardNumber: '',
              transactionTypeCode: '',
              transactionCategoryCode: '',
              transactionSource: '',
              transactionDescription: '',
              transactionAmount: '',
              originalDate: '',
              processDate: '',
              merchantId: '',
              merchantName: '',
              merchantCity: '',
              merchantZip: '',
              confirmation: '',
            },
            validationErrors: {},
            isConfirmationStep: false,
          }));
        }
        
        options.onSuccess?.(data);
      },
      onError: (error: string) => {
        console.error('❌ Transaction add error:', error);
        options.onError?.(error);
      },
    }
  );

  // ✅ CORRECCIÓN: Validaciones que coinciden con las del backend
  const validateForm = useCallback((data: TransactionAddRequest): boolean => {
    const errors: Record<string, string> = {};

    // Validar Account ID o Card Number (uno obligatorio)
    if (!data.accountId && !data.cardNumber) {
      errors.accountId = 'Account or Card Number must be entered...';
    }

    if (data.accountId) {
      if (!/^\d{1,11}$/.test(data.accountId)) {
        errors.accountId = 'Account ID must be Numeric...';
      }
    }

    if (data.cardNumber) {
      if (!/^\d{1,16}$/.test(data.cardNumber)) {
        errors.cardNumber = 'Card Number must be Numeric...';
      }
    }

    // ✅ CORRECCIÓN: Validaciones exactas del backend (@NotBlank + @Pattern)
    if (!data.transactionTypeCode) {
      errors.transactionTypeCode = 'Type CD can NOT be empty...';
    } else if (!/^\d{1,2}$/.test(data.transactionTypeCode)) {
      errors.transactionTypeCode = 'Type CD must be Numeric...';
    }

    if (!data.transactionCategoryCode) {
      errors.transactionCategoryCode = 'Category CD can NOT be empty...';
    } else if (!/^\d{1,4}$/.test(data.transactionCategoryCode)) {
      errors.transactionCategoryCode = 'Category CD must be Numeric...';
    }

    if (!data.transactionSource) {
      errors.transactionSource = 'Source can NOT be empty...';
    }

    if (!data.transactionDescription) {
      errors.transactionDescription = 'Description can NOT be empty...';
    }

    if (!data.transactionAmount) {
      errors.transactionAmount = 'Amount can NOT be empty...';
    } else {
      const amount = parseFloat(data.transactionAmount);
      if (isNaN(amount) || amount < -99999999.99 || amount > 99999999.99) {
        errors.transactionAmount = 'Amount should be in format -99999999.99';
      }
    }

    if (!data.originalDate) {
      errors.originalDate = 'Orig Date can NOT be empty...';
    }

    if (!data.processDate) {
      errors.processDate = 'Proc Date can NOT be empty...';
    }

    if (!data.merchantId) {
      errors.merchantId = 'Merchant ID can NOT be empty...';
    } else if (!/^\d+$/.test(data.merchantId)) {
      errors.merchantId = 'Merchant ID must be Numeric...';
    }

    if (!data.merchantName) {
      errors.merchantName = 'Merchant Name can NOT be empty...';
    }

    if (!data.merchantCity) {
      errors.merchantCity = 'Merchant City can NOT be empty...';
    }

    if (!data.merchantZip) {
      errors.merchantZip = 'Merchant Zip can NOT be empty...';
    }

    setState(prev => ({ ...prev, validationErrors: errors }));
    return Object.keys(errors).length === 0;
  }, []);

  // Manejar cambios en campos
  const handleFieldChange = useCallback((field: keyof TransactionAddRequest, value: string) => {
    setState(prev => ({
      ...prev,
      formData: { ...prev.formData, [field]: value },
      validationErrors: { ...prev.validationErrors, [field]: '' },
    }));
  }, []);

  // Procesar envío del formulario
  const handleSubmit = useCallback(async () => {
    if (!validateForm(state.formData)) {
      return;
    }

    // Si no está en paso de confirmación, mostrar confirmación
    if (!state.isConfirmationStep) {
      setState(prev => ({ ...prev, isConfirmationStep: true }));
      return;
    }

    // ✅ CORRECCIÓN: Validar confirmación exactamente como el backend
    if (!state.formData.confirmation || !/^[YyNn]$/.test(state.formData.confirmation)) {
      setState(prev => ({
        ...prev,
        validationErrors: { confirmation: 'Invalid value. Valid values are (Y/N)...' }
      }));
      return;
    }

    if (state.formData.confirmation.toUpperCase() !== 'Y') {
      setState(prev => ({
        ...prev,
        validationErrors: { confirmation: 'Confirm to add this transaction...' }
      }));
      return;
    }

    try {
      await addTransaction(state.formData);
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    }
  }, [state.formData, state.isConfirmationStep, validateForm, addTransaction]);

  // Copiar última transacción (F5) - simplificado ya que no hay endpoint en el backend
  const handleCopyLastTransaction = useCallback(() => {
    // ✅ CORRECCIÓN: Por ahora solo mostrar mensaje, ya que no hay endpoint en el backend
    setState(prev => ({
      ...prev,
      validationErrors: { 
        accountId: 'Copy last transaction feature not available yet' 
      }
    }));
  }, []);

  // Limpiar formulario (F4)
  const handleClearForm = useCallback(() => {
    setState(prev => ({
      ...prev,
      formData: {
        accountId: '',
        cardNumber: '',
        transactionTypeCode: '',
        transactionCategoryCode: '',
        transactionSource: '',
        transactionDescription: '',
        transactionAmount: '',
        originalDate: '',
        processDate: '',
        merchantId: '',
        merchantName: '',
        merchantCity: '',
        merchantZip: '',
        confirmation: '',
      },
      validationErrors: {},
      isConfirmationStep: false,
    }));
  }, []);

  // Salir (F3)
  const handleExit = useCallback(() => {
    navigate('/menu/main');
  }, [navigate]);

  return {
    // Estado
    formData: state.formData,
    validationErrors: state.validationErrors,
    isConfirmationStep: state.isConfirmationStep,
    loading,
    error,
    
    // Acciones
    handleFieldChange,
    handleSubmit,
    handleCopyLastTransaction,
    handleClearForm,
    handleExit,
    
    // Utilidades
    canCopyLast: false, // Deshabilitado hasta implementar endpoint
  };
}