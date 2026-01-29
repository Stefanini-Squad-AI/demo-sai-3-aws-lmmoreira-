// app/types/transactionView.ts (corregido para coincidir con el backend)
export interface TransactionViewRequest {
  transactionId: string;
}

export interface TransactionViewResponse {
  // Campos principales (coinciden con TransactionViewResponseDto)
  transactionId?: string;
  cardNumber?: string;
  transactionTypeCode?: string;
  transactionCategoryCode?: string;
  transactionSource?: string;
  transactionAmount?: string;              // ✅ BigDecimal viene como string desde Spring Boot
  transactionDescription?: string;
  originalTimestamp?: string;              // ✅ LocalDateTime como ISO string
  processedTimestamp?: string;             // ✅ LocalDateTime como ISO string
  merchantId?: string;
  merchantName?: string;
  merchantCity?: string;
  merchantZip?: string;
  errorMessage?: string;
  
  // Header info (equivalente a POPULATE-HEADER-INFO)
  currentDate?: string;                    // ✅ MM/dd/yy format
  currentTime?: string;                    // ✅ HH:mm:ss format
  programName?: string;                    // ✅ "COTRN01C"
  transactionName?: string;                // ✅ "CT01"
}

export interface TransactionViewState {
  searchTransactionId: string;
  transactionData: TransactionViewResponse | null;
  validationErrors: Record<string, string>;
}