// app/types/creditCardDetail.ts
export interface CreditCardDetailRequest {
  accountId: string; // Se enviará como string pero el backend espera Long
  cardNumber: string;
}

export interface CreditCardDetailResponse {
  accountId: number;
  cardNumber: string;
  cvvCode?: number; // ✅ CORRECCIÓN: Hacer opcional para consistencia
  embossedName: string;
  activeStatus: 'ACTIVE' | 'INACTIVE' | 'BLOCKED' | 'EXPIRED';
  expiryMonth: string;
  expiryYear: string;
  errorMessage?: string;
  infoMessage?: string;
  success: boolean;
}

export interface CreditCardDetailState {
  inputValid: boolean;
  errorMessage?: string;
  infoMessage?: string;
}