// app/types/accountUpdate.ts
export interface AccountUpdateRequest {
  accountId: string; // String en frontend para manejo de input
}

export interface AccountUpdateData {
  // Account data
  accountId: number;
  activeStatus: string;
  currentBalance: number;
  creditLimit: number;
  cashCreditLimit: number;
  openDate: string; // ISO date string
  expirationDate: string;
  reissueDate: string;
  currentCycleCredit: number;
  currentCycleDebit: number;
  groupId: string;

  // Customer data
  customerId: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  addressLine3?: string;
  stateCode: string;
  countryCode: string;
  zipCode: string;
  phoneNumber1: string;
  phoneNumber2?: string;
  ssn: string;
  governmentIssuedId: string;
  dateOfBirth: string;
  eftAccountId: string;
  primaryCardIndicator: string;
  ficoScore: number;
}

export interface AccountUpdateResponse {
  success: boolean;
  data?: AccountUpdateData;
  message?: string;
  errors?: string[];
}

export interface AccountUpdateSubmission extends AccountUpdateData {
  // Campos que se pueden actualizar
}