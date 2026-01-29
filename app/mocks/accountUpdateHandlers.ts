// app/mocks/accountUpdateHandlers.ts
import { http, HttpResponse } from 'msw';
import type { AccountUpdateData } from '~/types/accountUpdate';

// Mock data que coincide con el backend
const mockAccountUpdateData: Record<number, AccountUpdateData> = {
  11111111111: {
    // Account data
    accountId: 11111111111,
    activeStatus: "Y",
    currentBalance: 1250.75,
    creditLimit: 5000.00,
    cashCreditLimit: 1000.00,
    openDate: "2020-01-15",
    expirationDate: "2025-12-31",
    reissueDate: "2023-06-15",
    currentCycleCredit: 500.00,
    currentCycleDebit: 1750.75,
    groupId: "PREMIUM",
    
    // Customer data
    customerId: 1000000001,
    firstName: "JOHN",
    middleName: "MICHAEL",
    lastName: "SMITH",
    addressLine1: "123 MAIN STREET",
    addressLine2: "APT 4B",
    addressLine3: "",
    stateCode: "NY",
    countryCode: "USA",
    zipCode: "10001",
    phoneNumber1: "555-123-4567",
    phoneNumber2: "555-987-6543",
    ssn: "123-45-6789",
    governmentIssuedId: "DL123456789",
    dateOfBirth: "1985-03-20",
    eftAccountId: "EFT001122334",
    primaryCardIndicator: "Y",
    ficoScore: 750,
  },
  22222222222: {
    accountId: 22222222222,
    activeStatus: "N",
    currentBalance: 0.00,
    creditLimit: 2500.00,
    cashCreditLimit: 500.00,
    openDate: "2019-05-10",
    expirationDate: "2024-05-31",
    reissueDate: "2022-03-10",
    currentCycleCredit: 0.00,
    currentCycleDebit: 0.00,
    groupId: "STANDARD",
    
    customerId: 1000000002,
    firstName: "JANE",
    middleName: "",
    lastName: "DOE",
    addressLine1: "456 OAK AVENUE",
    addressLine2: "",
    addressLine3: "",
    stateCode: "CA",
    countryCode: "USA",
    zipCode: "90210",
    phoneNumber1: "555-555-1234",
    phoneNumber2: "",
    ssn: "987-65-4321",
    governmentIssuedId: "DL987654321",
    dateOfBirth: "1990-07-15",
    eftAccountId: "EFT998877665",
    primaryCardIndicator: "Y",
    ficoScore: 680,
  },
};

export const accountUpdateHandlers = [
  // GET /api/accounts/{accountId} - Obtener datos para actualización
  http.get('/api/accounts/:accountId', async ({ params }) => {
    const { accountId } = params;
    const id = parseInt(accountId as string, 10);
    
    await new Promise(resolve => setTimeout(resolve, 800)); // Simular delay
    
    const accountData = mockAccountUpdateData[id];
    
    if (!accountData) {
      return HttpResponse.json(
        { error: `Account not found: Account ${id} does not exist in master file` },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      success: true,
      data: accountData,
    });
  }),

  // PUT /api/accounts/{accountId} - Actualizar cuenta
  http.put('/api/accounts/:accountId', async ({ params, request }) => {
    const { accountId } = params;
    const id = parseInt(accountId as string, 10);
    const updateData = await request.json() as AccountUpdateData;
    
    await new Promise(resolve => setTimeout(resolve, 1200)); // Simular delay de actualización
    
    // Validaciones básicas
    const errors: string[] = [];
    
    if (!updateData.activeStatus || !['Y', 'N'].includes(updateData.activeStatus)) {
      errors.push('Active status must be Y or N');
    }
    
    if (updateData.creditLimit && updateData.creditLimit < 0) {
      errors.push('Credit limit cannot be negative');
    }
    
    if (updateData.zipCode && !/^\d{5}(-\d{4})?$/.test(updateData.zipCode)) {
      errors.push('Invalid ZIP code format');
    }
    
    if (updateData.ficoScore && (updateData.ficoScore < 300 || updateData.ficoScore > 850)) {
      errors.push('FICO score must be between 300 and 850');
    }

    if (errors.length > 0) {
      return HttpResponse.json(
        { 
          success: false,
          errors 
        },
        { status: 400 }
      );
    }

    // Simular actualización exitosa
    const updatedData = { ...updateData, accountId: id };
    mockAccountUpdateData[id] = updatedData;

    return HttpResponse.json({
      success: true,
      data: updatedData,
      message: "Changes committed to database",
    });
  }),

  // Endpoint para simular errores específicos
  http.put('/api/accounts/99999999999', async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return HttpResponse.json(
      { 
        success: false,
        error: "Changes unsuccessful: Database connection timeout" 
      },
      { status: 500 }
    );
  }),
];