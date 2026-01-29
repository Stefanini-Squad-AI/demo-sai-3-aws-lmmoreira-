// app/types/transactionAdd.ts (corregido para coincidir con el backend)
export interface TransactionAddRequest {
  // Identificación (uno obligatorio) - coincide con el DTO del backend
  accountId?: string;
  cardNumber?: string;
  
  // Datos de transacción - nombres exactos del backend
  transactionTypeCode: string;
  transactionCategoryCode: string;
  transactionSource: string;
  transactionDescription: string;
  transactionAmount: string; // Se convertirá a BigDecimal en el backend
  originalDate: string; // Se convertirá a LocalDateTime en el backend
  processDate: string; // Se convertirá a LocalDateTime en el backend
  
  // Datos del comerciante - nombres exactos del backend
  merchantId: string;
  merchantName: string;
  merchantCity: string;
  merchantZip: string;
  
  // Confirmación
  confirmation: 'Y' | 'N' | '';
}

// ✅ CORRECCIÓN: Response que coincide exactamente con TransactionAddResponseDto
export interface TransactionAddResponse {
  transactionId: string | null;
  message: string;
  success: boolean;
}

export interface TransactionAddState {
  formData: TransactionAddRequest;
  validationErrors: Record<string, string>;
  isConfirmationStep: boolean;
  lastTransactionData?: TransactionAddRequest;
}