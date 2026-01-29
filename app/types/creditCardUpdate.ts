// ===== app/types/creditCardUpdate.ts =====
export interface CreditCardUpdateRequest {
  accountId: string; // Se enviará como string pero el backend espera Long
  cardNumber: string;
  embossedName: string;
  activeStatus: 'A' | 'I'; // ✅ CORRECCIÓN: Usar valores de CardStatus enum (A=Active, I=Inactive)
  expiryMonth: string;
  expiryYear: string;
  expiryDay?: string; // Opcional, por defecto '01'
}

export interface CreditCardUpdateResponse {
  accountId: number;
  cardNumber: string;
  cvvCode?: number;
  embossedName: string;
  activeStatus: string; // Flexible para manejar diferentes formatos del backend
  expiryMonth: string;
  expiryYear: string;
  errorMessage?: string;
  infoMessage?: string;
  success: boolean;
}

export interface CreditCardUpdateState {
  changeAction: 'NOT_FETCHED' | 'SHOW_DETAILS' | 'CHANGES_NOT_OK' | 'CHANGES_OK_NOT_CONFIRMED' | 'CHANGES_OKAYED_AND_DONE' | 'CHANGES_FAILED';
  oldDetails?: CreditCardUpdateResponse;
  newDetails?: CreditCardUpdateRequest;
  validationErrors: Record<string, string>;
}