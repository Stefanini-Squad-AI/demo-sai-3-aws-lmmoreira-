// ===== app/types/account.ts =====
export interface AccountViewRequest {
  accountId: string; // Frontend usa string, se convierte a number para el backend
}

export interface AccountViewResponse {
  // Campos de control (siempre presentes)
  currentDate: string;
  currentTime: string;
  transactionId: string;
  programName: string;
  
  // Entrada
  accountId?: number;
  
  // Datos de cuenta
  accountStatus?: string; // ✅ CORREGIDO: era activeStatus en mock
  currentBalance?: number;
  creditLimit?: number;
  cashCreditLimit?: number;
  currentCycleCredit?: number;
  currentCycleDebit?: number;
  openDate?: string;
  expirationDate?: string;
  reissueDate?: string;
  groupId?: string;
  
  // Datos de cliente
  customerId?: number;
  customerSsn?: string; // ✅ CORREGIDO: backend usa customerSsn, no ssn
  ficoScore?: number;
  dateOfBirth?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  addressLine1?: string;
  addressLine2?: string;
  addressLine3?: string; // Campo adicional del mock
  city?: string; // ✅ AGREGADO: campo faltante
  state?: string; // ✅ CORREGIDO: backend usa state, no stateCode
  zipCode?: string;
  country?: string; // ✅ CORREGIDO: backend usa country, no countryCode
  phoneNumber1?: string;
  phoneNumber2?: string;
  governmentId?: string; // ✅ CORREGIDO: backend usa governmentId, no governmentIssuedId
  eftAccountId?: string;
  primaryCardHolderFlag?: string; // ✅ CORREGIDO: backend usa primaryCardHolderFlag, no primaryCardIndicator
  cardNumber?: string;
  
  // Mensajes y control
  errorMessage?: string;
  infoMessage?: string;
  inputValid: boolean;
  accountFilterValid?: boolean;
  customerFilterValid?: boolean;
  foundAccountInMaster?: boolean;
  foundCustomerInMaster?: boolean;
}