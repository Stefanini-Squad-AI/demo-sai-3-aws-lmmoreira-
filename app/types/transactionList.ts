// app/types/transactionList.ts
export interface TransactionListRequest {
  transactionId?: string;
  pageNumber?: number;
  selectionFlag?: string;
  selectedTransactionId?: string;
}

export interface TransactionItem {
  transactionId: string;
  date: string; // MM/DD/YY format
  description: string;
  amount: number;
}

export interface TransactionListResponse {
  transactions: TransactionItem[];
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  firstTransactionId?: string;
  lastTransactionId?: string;
  message?: string;
  errorMessage?: string;
}

// ✅ CORRECCIÓN CRÍTICA: Hacer firstTransactionId y lastTransactionId opcionales
export interface TransactionListState {
  searchTransactionId: string;
  currentPage: number;
  transactions: TransactionItem[];
  selectedTransaction: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  firstTransactionId?: string; // ✅ Opcional
  lastTransactionId?: string;  // ✅ Opcional
}