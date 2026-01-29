// ===== app/mocks/creditCardUpdateHandlers.ts =====
import { http, HttpResponse } from 'msw';
import type { CreditCardUpdateResponse } from '~/types/creditCardUpdate';

// Estado compartido que se puede modificar para simular actualizaciones
export const mockCardUpdateDetails: Record<string, CreditCardUpdateResponse> = {
  '4532123456789012': {
    accountId: 12345678901,
    cardNumber: '4532123456789012',
    cvvCode: 123,
    embossedName: 'JOHN SMITH',
    activeStatus: 'A', // ✅ Usar CardStatus enum: A = Active
    expiryMonth: '12',
    expiryYear: '2025',
    success: true,
  },
  '4532123456789013': {
    accountId: 12345678901,
    cardNumber: '4532123456789013',
    cvvCode: 456,
    embossedName: 'JANE SMITH',
    activeStatus: 'I', // ✅ Usar CardStatus enum: I = Inactive
    expiryMonth: '08',
    expiryYear: '2024',
    success: true,
  },
  '5555666677778888': {
    accountId: 98765432109,
    cardNumber: '5555666677778888',
    cvvCode: 789,
    embossedName: 'ROBERT JOHNSON',
    activeStatus: 'A', // ✅ Active
    expiryMonth: '03',
    expiryYear: '2026',
    success: true,
  },
  '4111111111111111': {
    accountId: 11111111111,
    cardNumber: '4111111111111111',
    cvvCode: 321,
    embossedName: 'MARIA GARCIA',
    activeStatus: 'E', // ✅ Usar CardStatus enum: E = Expired
    expiryMonth: '06',
    expiryYear: '2023',
    success: true,
  },
  '4222222222222222': {
    accountId: 22222222222,
    cardNumber: '4222222222222222',
    cvvCode: 654,
    embossedName: 'ALICE BROWN',
    activeStatus: 'A', // ✅ Active
    expiryMonth: '09',
    expiryYear: '2025',
    success: true,
  },
  '4333333333333333': {
    accountId: 33333333333,
    cardNumber: '4333333333333333',
    cvvCode: 987,
    embossedName: 'DAVID WILSON',
    activeStatus: 'B', // ✅ Usar CardStatus enum: B = Blocked
    expiryMonth: '11',
    expiryYear: '2026',
    success: true,
  },
  // ✅ Agregar más tarjetas de prueba con diferentes estados
  '0500024453765740': {
    accountId: 50,
    cardNumber: '0500024453765740',
    cvvCode: 555,
    embossedName: 'ANIYA VON',
    activeStatus: 'A', // ✅ Active
    expiryMonth: '03',
    expiryYear: '2023',
    success: true,
  },
  '4000000000000002': {
    accountId: 12345678902,
    cardNumber: '4000000000000002',
    cvvCode: 222,
    embossedName: 'TEST USER TWO',
    activeStatus: 'I', // ✅ Inactive
    expiryMonth: '12',
    expiryYear: '2024',
    success: true,
  },
};

export const creditCardUpdateHandlers = [
  // ✅ Endpoint para búsqueda de tarjeta (search)
  http.post('/api/credit-cards/search', async ({ request }) => {
    const body = await request.json() as {
      accountId: number;
      cardNumber: string;
    };

    console.log('🔍 Credit Card Update Search Request:', body);

    // Validaciones como en el COBOL original
    if (!body.accountId || body.accountId === 0) {
      return HttpResponse.json({
        success: false,
        errorMessage: 'Account number not provided',
        accountId: body.accountId,
        cardNumber: body.cardNumber,
      } as CreditCardUpdateResponse, { status: 400 });
    }

    const accountIdStr = body.accountId.toString();
    if (!/^\d{1,11}$/.test(accountIdStr) || accountIdStr === '00000000000') {
      return HttpResponse.json({
        success: false,
        errorMessage: 'Account number must be a non zero 11 digit number',
        accountId: body.accountId,
        cardNumber: body.cardNumber,
      } as CreditCardUpdateResponse, { status: 400 });
    }

    if (!body.cardNumber || body.cardNumber.trim() === '') {
      return HttpResponse.json({
        success: false,
        errorMessage: 'Card number not provided',
        accountId: body.accountId,
        cardNumber: body.cardNumber,
      } as CreditCardUpdateResponse, { status: 400 });
    }

    if (!/^\d{16}$/.test(body.cardNumber)) {
      return HttpResponse.json({
        success: false,
        errorMessage: 'Card number must be a 16 digit number',
        accountId: body.accountId,
        cardNumber: body.cardNumber,
      } as CreditCardUpdateResponse, { status: 400 });
    }

    // Buscar la tarjeta en el estado compartido
    const cardDetail = mockCardUpdateDetails[body.cardNumber];
    
    if (!cardDetail) {
      return HttpResponse.json({
        success: false,
        errorMessage: 'Did not find cards for this search condition',
        accountId: body.accountId,
        cardNumber: body.cardNumber,
      } as CreditCardUpdateResponse, { status: 400 });
    }

    // Verificar que la cuenta coincida
    if (cardDetail.accountId !== body.accountId) {
      return HttpResponse.json({
        success: false,
        errorMessage: 'Did not find cards for this search condition',
        accountId: body.accountId,
        cardNumber: body.cardNumber,
      } as CreditCardUpdateResponse, { status: 400 });
    }

    console.log('✅ Credit Card Update Search Found:', cardDetail.cardNumber);

    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 600));

    return HttpResponse.json({
      ...cardDetail,
      infoMessage: 'Details of selected card shown above',
    });
  }),

  // ✅ Endpoint para actualización de tarjeta (update)
  http.put('/api/credit-cards/update', async ({ request }) => {
    const body = await request.json() as {
      accountId: number;
      cardNumber: string;
      embossedName: string;
      activeStatus: 'A' | 'B' | 'E' | 'I'; // ✅ CardStatus enum values
      expiryMonth: number;
      expiryYear: number;
      expiryDay: number;
    };

    console.log('💾 Credit Card Update Request:', body);

    // Validaciones completas como en el COBOL original
    const errors: string[] = [];

    // Validación de Account ID
    if (!body.accountId || body.accountId === 0) {
      errors.push('Account number not provided');
    } else {
      const accountIdStr = body.accountId.toString();
      if (!/^\d{1,11}$/.test(accountIdStr) || accountIdStr === '00000000000') {
        errors.push('Account number must be a non zero 11 digit number');
      }
    }

    // Validación de Card Number
    if (!body.cardNumber || body.cardNumber.trim() === '') {
      errors.push('Card number not provided');
    } else if (!/^\d{16}$/.test(body.cardNumber)) {
      errors.push('Card number must be a 16 digit number');
    }

    // Validación de nombre
    if (!body.embossedName || body.embossedName.trim() === '') {
      errors.push('Card name not provided');
    } else if (!/^[a-zA-Z\s]+$/.test(body.embossedName.trim())) {
      errors.push('Card name can only contain alphabets and spaces');
    } else if (body.embossedName.trim().length > 50) {
      errors.push('Card name cannot exceed 50 characters');
    }

    // ✅ Validación de activeStatus con CardStatus enum
    if (!body.activeStatus || !['A', 'B', 'E', 'I'].includes(body.activeStatus)) {
      errors.push('Card Active Status must be A, B, E, or I');
    }

    // Validación de mes
    if (!body.expiryMonth || body.expiryMonth < 1 || body.expiryMonth > 12) {
      errors.push('Card expiry month must be between 1 and 12');
    }

    // Validación de año
    const currentYear = new Date().getFullYear();
    if (!body.expiryYear || body.expiryYear < currentYear || body.expiryYear > 2099) {
      errors.push(`Card expiry year must be between ${currentYear} and 2099`);
    }

    // Validación de fecha de expiración no debe ser pasada
    if (body.expiryMonth && body.expiryYear && body.expiryYear >= currentYear) {
      const currentMonth = new Date().getMonth() + 1;
      if (body.expiryYear === currentYear && body.expiryMonth < currentMonth) {
        errors.push('Card expiry date cannot be in the past');
      }
    }

    // Si hay errores de validación, devolver error
    if (errors.length > 0) {
      return HttpResponse.json({
        success: false,
        errorMessage: errors.join('. '),
        accountId: body.accountId,
        cardNumber: body.cardNumber,
      } as CreditCardUpdateResponse, { status: 400 });
    }

    // Buscar la tarjeta existente
    const existingCard = mockCardUpdateDetails[body.cardNumber];
    
    if (!existingCard) {
      return HttpResponse.json({
        success: false,
        errorMessage: 'Card not found for update',
        accountId: body.accountId,
        cardNumber: body.cardNumber,
      } as CreditCardUpdateResponse, { status: 404 });
    }

    // Verificar que la cuenta coincida
    if (existingCard.accountId !== body.accountId) {
      return HttpResponse.json({
        success: false,
        errorMessage: 'Card does not belong to the specified account',
        accountId: body.accountId,
        cardNumber: body.cardNumber,
      } as CreditCardUpdateResponse, { status: 400 });
    }

    // ✅ Actualizar la tarjeta en el estado compartido
    const updatedCard: CreditCardUpdateResponse = {
      ...existingCard,
      embossedName: body.embossedName.toUpperCase().trim(),
      activeStatus: body.activeStatus, // ✅ Mantener el valor de CardStatus enum
      expiryMonth: body.expiryMonth.toString().padStart(2, '0'),
      expiryYear: body.expiryYear.toString(),
      success: true,
    };

    // Actualizar en el estado compartido
    mockCardUpdateDetails[body.cardNumber] = updatedCard;

    console.log('✅ Credit Card Updated Successfully:', updatedCard.cardNumber);

    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 800));

    return HttpResponse.json({
      ...updatedCard,
      infoMessage: 'Changes committed to database',
    });
  }),

  // ✅ Endpoint adicional para obtener detalles (GET)
  http.get('/api/credit-cards/update/:cardNumber', async ({ params }) => {
    const { cardNumber } = params;

    console.log('🔍 Get Credit Card Update Details:', cardNumber);

    if (!cardNumber || typeof cardNumber !== 'string') {
      return HttpResponse.json({
        success: false,
        errorMessage: 'Card number is required',
      } as CreditCardUpdateResponse, { status: 400 });
    }

    const cardDetail = mockCardUpdateDetails[cardNumber];
    
    if (!cardDetail) {
      return HttpResponse.json({
        success: false,
        errorMessage: 'Card not found',
        cardNumber: cardNumber,
      } as CreditCardUpdateResponse, { status: 404 });
    }

    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 400));

    return HttpResponse.json({
      ...cardDetail,
      infoMessage: 'Card details retrieved successfully',
    });
  }),

  // ✅ Endpoint para resetear datos de prueba (solo para desarrollo)
  http.post('/api/credit-cards/update/reset-test-data', async () => {
    console.log('🔄 Resetting credit card update test data');

    // Resetear a valores originales
    mockCardUpdateDetails['4532123456789012'] = {
      accountId: 12345678901,
      cardNumber: '4532123456789012',
      cvvCode: 123,
      embossedName: 'JOHN SMITH',
      activeStatus: 'A',
      expiryMonth: '12',
      expiryYear: '2025',
      success: true,
    };

    mockCardUpdateDetails['4111111111111111'] = {
      accountId: 11111111111,
      cardNumber: '4111111111111111',
      cvvCode: 321,
      embossedName: 'MARIA GARCIA',
      activeStatus: 'E',
      expiryMonth: '06',
      expiryYear: '2023',
      success: true,
    };

    return HttpResponse.json({
      success: true,
      message: 'Test data reset successfully',
    });
  }),

  // ✅ Endpoint para listar todas las tarjetas disponibles para testing
  http.get('/api/credit-cards/update/test-cards', async () => {
    console.log('📋 Getting test cards for credit card update');

    const testCards = Object.values(mockCardUpdateDetails).map(card => ({
      accountId: card.accountId,
      cardNumber: card.cardNumber,
      embossedName: card.embossedName,
      activeStatus: card.activeStatus,
      expiryMonth: card.expiryMonth,
      expiryYear: card.expiryYear,
      // ✅ Agregar descripción del estado para mejor UX
      statusDescription: getStatusDescription(card.activeStatus),
    }));

    return HttpResponse.json({
      success: true,
      data: testCards,
      message: 'Test cards retrieved successfully',
    });
  }),
];

// ✅ Función helper para describir los estados
function getStatusDescription(status: string): string {
  switch (status) {
    case 'A':
      return 'Active';
    case 'I':
      return 'Inactive';
    case 'B':
      return 'Blocked';
    case 'E':
      return 'Expired';
    default:
      return 'Unknown';
  }
}

// ✅ Función helper para validar CardStatus enum
export function isValidCardStatus(status: string): status is 'A' | 'B' | 'E' | 'I' {
  return ['A', 'B', 'E', 'I'].includes(status);
}

// ✅ Función helper para obtener una tarjeta específica (para testing)
export function getMockCardForTesting(cardNumber: string): CreditCardUpdateResponse | null {
  return mockCardUpdateDetails[cardNumber] || null;
}

// ✅ Función helper para actualizar una tarjeta específica (para testing)
export function updateMockCardForTesting(
  cardNumber: string, 
  updates: Partial<CreditCardUpdateResponse>
): boolean {
  if (mockCardUpdateDetails[cardNumber]) {
    mockCardUpdateDetails[cardNumber] = {
      ...mockCardUpdateDetails[cardNumber],
      ...updates,
    };
    return true;
  }
  return false;
}