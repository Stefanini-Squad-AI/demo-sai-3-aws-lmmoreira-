// app/hooks/useBillPayment.ts
import { useState, useCallback } from 'react';
import { useMutation } from './useApi';
import { apiClient } from '~/services/api';
import type { 
  BillPaymentRequestDto, 
  BillPaymentResponseDto, 
  BillPaymentStep,
  BILL_PAYMENT_MESSAGES 
} from '~/types/billPayment';

export function useBillPayment() {
  const [step, setStep] = useState<BillPaymentStep>('input');
  const [accountId, setAccountId] = useState('');
  const [accountData, setAccountData] = useState<BillPaymentResponseDto | null>(null);

  // ✅ FUNCIÓN AUXILIAR: Determinar el paso correcto basado en la respuesta
  const determineStepFromResponse = useCallback((data: BillPaymentResponseDto, isProcessingPayment: boolean = false) => {
    console.log('🎯 Determining step from response:', { data, isProcessingPayment });

    if (!data.success) {
      return 'error';
    }

    // Si estamos procesando un pago y hay transactionId, es exitoso
    if (isProcessingPayment && data.transactionId && data.paymentAmount) {
      return 'success';
    }

    // Si el balance es 0 y no hay transacción reciente, ya está pagado
    if (data.currentBalance === 0 && !data.transactionId && !data.paymentAmount) {
      // Verificar si el mensaje indica que ya está pagado
      if (data.message?.includes('Confirm to make a bill payment') || 
          data.message?.includes('already paid') ||
          data.message?.includes('nothing to pay')) {
        return 'already-paid';
      }
    }

    // Si hay balance pendiente, mostrar confirmación
    if (data.currentBalance && data.currentBalance > 0) {
      return 'confirm';
    }

    // Caso por defecto para balances en 0 sin contexto claro
    return 'already-paid';
  }, []);

  // Consultar cuenta (primer paso - sin confirmación)
  const {
    mutate: lookupAccount,
    loading: lookupLoading,
    error: lookupError,
  } = useMutation<BillPaymentResponseDto, BillPaymentRequestDto>(
    (request) => apiClient.get('/bill-payment/consult?accountId=' + request.accountId),
    {
      onSuccess: (data) => {
        console.log('✅ Lookup account success:', data);
        setAccountData(data);
        const nextStep = determineStepFromResponse(data, false);
        setStep(nextStep);
      },
      onError: (error) => {
        console.error('❌ Lookup account error:', error);
        setStep('error');
      },
    }
  );

  // Procesar pago (con confirmación)
  const {
    mutate: processPayment,
    loading: paymentLoading,
    error: paymentError,
  } = useMutation<BillPaymentResponseDto, BillPaymentRequestDto>(
    (request) => apiClient.post('/bill-payment/process', request),
    {
      onSuccess: (data) => {
        console.log('✅ Process payment success:', data);
        setAccountData(data);
        const nextStep = determineStepFromResponse(data, true);
        setStep(nextStep);
      },
      onError: (error) => {
        console.error('❌ Process payment error:', error);
        setStep('error');
      },
    }
  );

  const handleAccountLookup = useCallback((accountIdInput: string) => {
    if (!accountIdInput.trim()) {
      return;
    }
    
    const accountIdNumber = parseInt(accountIdInput, 10);
    if (isNaN(accountIdNumber)) {
      return;
    }

    console.log('🔍 Looking up account:', accountIdNumber);
    setAccountId(accountIdInput);
    setStep('processing');
    
    // Primer llamada sin confirmación para obtener el saldo
    lookupAccount({
      accountId: accountIdNumber,
      confirmation: '', // Vacío para solo consultar
    });
  }, [lookupAccount]);

  const handlePaymentConfirm = useCallback((confirm: boolean) => {
    if (!accountId || !accountData) return;

    const accountIdNumber = parseInt(accountId, 10);
    console.log('💳 Processing payment confirmation:', { accountId: accountIdNumber, confirm });
    setStep('processing');

    processPayment({
      accountId: accountIdNumber,
      confirmation: confirm ? 'Y' : 'N',
    });
  }, [accountId, accountData, processPayment]);

  const resetForm = useCallback(() => {
    console.log('🔄 Resetting form');
    setStep('input');
    setAccountId('');
    setAccountData(null);
  }, []);

  const getCurrentError = () => {
    return accountData?.errorMessage || lookupError || paymentError;
  };

  return {
    // Estado
    step,
    accountId,
    accountData,
    
    // Loading states
    loading: lookupLoading || paymentLoading,
    
    // Error
    error: getCurrentError(),
    
    // Acciones
    handleAccountLookup,
    handlePaymentConfirm,
    resetForm,
  };
}