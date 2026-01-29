// app/types/creditCard.ts
export interface CreditCard {
  accountNumber: string;
  cardNumber: string;
  cardStatus: 'ACTIVE' | 'INACTIVE' | 'BLOCKED' | 'EXPIRED';
}

export interface CreditCardFilter {
  accountId?: string;
  cardNumber?: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface CreditCardListResponse {
  content: CreditCard[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
}

export interface CreditCardSelection {
  cardIndex: number;
  action: 'S' | 'U'; // S = View, U = Update
}