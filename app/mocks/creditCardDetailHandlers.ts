// app/mocks/creditCardDetailHandlers.ts
import { http, HttpResponse } from 'msw';
import type { CreditCardDetailResponse } from '~/types/creditCardDetail';

// Estado compartido que se puede modificar
export const mockCardDetails: Record<string, CreditCardDetailResponse> = {
  '4532123456789012': {
    accountId: 12345678901,
    cardNumber: '4532123456789012',
    cvvCode: 123, // ✅ Incluir cvvCode explícitamente
    embossedName: 'JOHN SMITH',
    activeStatus: 'ACTIVE',
    expiryMonth: '12',
    expiryYear: '2025',
    success: true,
  },
  '4532123456789013': {
    accountId: 12345678901,
    cardNumber: '4532123456789013',
    cvvCode: 456, // ✅ Incluir cvvCode explícitamente
    embossedName: 'JANE SMITH',
    activeStatus: 'INACTIVE',
    expiryMonth: '08',
    expiryYear: '2024',
    success: true,
  },
  '5555666677778888': {
    accountId: 98765432109,
    cardNumber: '5555666677778888',
    cvvCode: 789, // ✅ Incluir cvvCode explícitamente
    embossedName: 'ROBERT JOHNSON',
    activeStatus: 'ACTIVE',
    expiryMonth: '03',
    expiryYear: '2026',
    success: true,
  },
  '4111111111111111': {
    accountId: 11111111111,
    cardNumber: '4111111111111111',
    cvvCode: 321, // ✅ Incluir cvvCode explícitamente
    embossedName: 'MARIA GARCIA',
    activeStatus: 'EXPIRED',
    expiryMonth: '06',
    expiryYear: '2023',
    success: true,
  },
  '4222222222222222': {
    accountId: 22222222222,
    cardNumber: '4222222222222222',
    cvvCode: 654, // ✅ Incluir cvvCode explícitamente
    embossedName: 'ALICE BROWN',
    activeStatus: 'ACTIVE',
    expiryMonth: '09',
    expiryYear: '2025',
    success: true,
  },
  '4333333333333333': {
    accountId: 33333333333,
    cardNumber: '4333333333333333',
    cvvCode: 987, // ✅ Incluir cvvCode explícitamente
    embossedName: 'DAVID WILSON',
    activeStatus: 'ACTIVE',
    expiryMonth: '11',
    expiryYear: '2026',
    success: true,
  },
  '4777777777777777': {
    accountId: 77777777777,
    cardNumber: '4777777777777777',
    cvvCode: 147,
    embossedName: 'JENNIFER MARTINEZ',
    activeStatus: 'ACTIVE',
    expiryMonth: '06',
    expiryYear: '2027',
    success: true,
  },
  '4888888888888888': {
    accountId: 88888888888,
    cardNumber: '4888888888888888',
    cvvCode: 258,
    embossedName: 'CHRISTOPHER ANDERSON',
    activeStatus: 'ACTIVE',
    expiryMonth: '09',
    expiryYear: '2028',
    success: true,
  },
  '4999999999999999': {
    accountId: 99999999999,
    cardNumber: '4999999999999999',
    cvvCode: 369,
    embossedName: 'ELIZABETH TAYLOR',
    activeStatus: 'ACTIVE',
    expiryMonth: '12',
    expiryYear: '2026',
    success: true,
  },
  '4101010101010101': {
    accountId: 10101010101,
    cardNumber: '4101010101010101',
    cvvCode: 741,
    embossedName: 'MICHAEL HARRIS',
    activeStatus: 'INACTIVE',
    expiryMonth: '10',
    expiryYear: '2029',
    success: true,
  },
};

export const creditCardDetailHandlers = [
  http.post('/api/credit-cards/details', async ({ request }) => {
    const body = await request.json() as {
      accountId: number;
      cardNumber: string;
    };

    console.log('🔍 Credit Card Detail Request:', body);

    // Validaciones como en el COBOL original
    if (!body.accountId || body.accountId === 0) {
      return HttpResponse.json({
        success: false,
        errorMessage: 'Account number not provided',
        accountId: body.accountId,
        cardNumber: body.cardNumber,
      } as CreditCardDetailResponse, { status: 400 });
    }

    const accountIdStr = body.accountId.toString();
    if (!/^\d{11}$/.test(accountIdStr) || accountIdStr === '00000000000') {
      return HttpResponse.json({
        success: false,
        errorMessage: 'Account number must be a non zero 11 digit number',
        accountId: body.accountId,
        cardNumber: body.cardNumber,
      } as CreditCardDetailResponse, { status: 400 });
    }

    if (!body.cardNumber || body.cardNumber.trim() === '') {
      return HttpResponse.json({
        success: false,
        errorMessage: 'Card number not provided',
        accountId: body.accountId,
        cardNumber: body.cardNumber,
      } as CreditCardDetailResponse, { status: 400 });
    }

    if (!/^\d{16}$/.test(body.cardNumber)) {
      return HttpResponse.json({
        success: false,
        errorMessage: 'Card number if supplied must be a 16 digit number',
        accountId: body.accountId,
        cardNumber: body.cardNumber,
      } as CreditCardDetailResponse, { status: 400 });
    }

    // Usar el estado compartido
    const cardDetail = mockCardDetails[body.cardNumber];
    
    if (!cardDetail) {
      return HttpResponse.json({
        success: false,
        errorMessage: 'Did not find cards for this search condition',
        accountId: body.accountId,
        cardNumber: body.cardNumber,
      } as CreditCardDetailResponse, { status: 400 });
    }

    // Verificar que la cuenta coincida
    if (cardDetail.accountId !== body.accountId) {
      return HttpResponse.json({
        success: false,
        errorMessage: 'Did not find cards for this search condition',
        accountId: body.accountId,
        cardNumber: body.cardNumber,
      } as CreditCardDetailResponse, { status: 400 });
    }

    console.log('✅ Credit Card Detail Found:', cardDetail.cardNumber);

    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 600));

    return HttpResponse.json({
      ...cardDetail,
      infoMessage: 'Displaying requested details',
    });
  }),

  // Endpoint GET alternativo
  http.get('/api/credit-cards/details', ({ request }) => {
    const url = new URL(request.url);
    const accountId = url.searchParams.get('accountId');
    const cardNumber = url.searchParams.get('cardNumber');

    if (!accountId || !cardNumber) {
      return HttpResponse.json({
        success: false,
        errorMessage: 'Account ID and Card Number are required',
      } as CreditCardDetailResponse, { status: 400 });
    }

    // Redirigir al endpoint POST
    return HttpResponse.json({
      success: false,
      errorMessage: 'Use POST endpoint for card details',
    } as CreditCardDetailResponse, { status: 400 });
  }),
];