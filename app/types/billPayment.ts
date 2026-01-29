// app/types/billPayment.ts
export interface BillPaymentRequestDto {
  accountId: number; // Long en Java = number en TS
  confirmation: string; // "Y", "N", o vacío
}

export interface BillPaymentResponseDto {
  accountId: number;
  currentBalance: number;
  paymentAmount?: number | null;
  transactionId?: number | null;
  message?: string | null;
  success: boolean;
  errorMessage?: string | null;
}

// ✅ CORRECCIÓN: Actualizar el tipo de step para incluir 'already-paid'
export interface BillPaymentState {
  step: 'input' | 'confirm' | 'processing' | 'success' | 'error' | 'already-paid';
  accountId: string;
  accountData: BillPaymentResponseDto | null;
  error: string | null;
}

// ✅ NUEVO: Tipos adicionales para mejor manejo del estado
export type BillPaymentStep = 'input' | 'confirm' | 'processing' | 'success' | 'error' | 'already-paid';

export interface BillPaymentValidation {
  isValidAccountId: (accountId: string) => boolean;
  getAccountIdError: (accountId: string) => string | null;
}

// ✅ NUEVO: Constantes para los mensajes del sistema
export const BILL_PAYMENT_MESSAGES = {
  ACCOUNT_NOT_FOUND: 'Account ID NOT found...',
  ACCOUNT_EMPTY: 'Acct ID can NOT be empty...',
  NOTHING_TO_PAY: 'You have nothing to pay...',
  CONFIRM_PAYMENT: 'Confirm to make a bill payment...',
  PAYMENT_SUCCESSFUL: 'Payment successful.',
  PAYMENT_CANCELLED: 'Payment cancelled by user',
  INVALID_CONFIRMATION: 'Invalid value. Valid values are (Y/N)...',
  ALREADY_PAID: 'Your account balance is already paid in full. No payment is required at this time.',
} as const;