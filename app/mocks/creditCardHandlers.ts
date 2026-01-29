// app/mocks/creditCardHandlers.ts
import { http, HttpResponse } from 'msw';
import type { CreditCard, CreditCardFilter, CreditCardListResponse } from '~/types/creditCard';
import { mockCardDetails } from './creditCardDetailHandlers';

// Generar la lista desde el estado compartido
const generateMockCreditCards = (): CreditCard[] => {
  return Object.values(mockCardDetails).map(card => ({
    accountNumber: card.accountId.toString().padStart(11, '0'),
    cardNumber: card.cardNumber,
    cardStatus: card.activeStatus as 'ACTIVE' | 'INACTIVE' | 'BLOCKED' | 'EXPIRED',
  }));
};

export const creditCardHandlers = [
  http.post('/api/credit-cards/list', async ({ request }) => {
    const body = await request.json() as CreditCardFilter;
    const userType = request.headers.get('User-Type') || 'USER';

    console.log('🔍 Credit Card List Request:', { body, userType });

    // Simular validaciones del backend
    if (body.accountId && !/^\d{11}$/.test(body.accountId)) {
      return HttpResponse.json(
        { message: 'ACCOUNT FILTER, IF SUPPLIED MUST BE A 11 DIGIT NUMBER' },
        { status: 400 }
      );
    }

    if (body.cardNumber && !/^\d{16}$/.test(body.cardNumber)) {
      return HttpResponse.json(
        { message: 'CARD ID FILTER, IF SUPPLIED MUST BE A 16 DIGIT NUMBER' },
        { status: 400 }
      );
    }

    // Usar datos actualizados
    let filteredCards = generateMockCreditCards();

    // Si no es admin y no hay accountId, error
    if (userType !== 'ADMIN' && !body.accountId) {
      return HttpResponse.json(
        { message: 'Account ID is required for non-admin users' },
        { status: 400 }
      );
    }

    // Aplicar filtros
    if (body.accountId) {
      // ✅ CORRECCIÓN: Verificar que accountId existe antes de usar padStart
      const paddedAccountId = body.accountId.padStart(11, '0');
      filteredCards = filteredCards.filter(card => 
        card.accountNumber === paddedAccountId
      );
    }

    if (body.cardNumber) {
      filteredCards = filteredCards.filter(card => 
        card.cardNumber === body.cardNumber
      );
    }

    // Paginación
    const pageNumber = body.pageNumber || 1;
    const pageSize = body.pageSize || 7;
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedCards = filteredCards.slice(startIndex, endIndex);

    const response: CreditCardListResponse = {
      content: paginatedCards,
      totalElements: filteredCards.length,
      totalPages: Math.ceil(filteredCards.length / pageSize),
      number: pageNumber - 1, // Spring usa 0-based
      size: pageSize,
      first: pageNumber === 1,
      last: pageNumber >= Math.ceil(filteredCards.length / pageSize),
      numberOfElements: paginatedCards.length,
    };

    console.log('✅ Credit Card List Response:', {
      totalElements: response.totalElements,
      currentPage: pageNumber,
      totalPages: response.totalPages,
      resultsInPage: response.numberOfElements
    });

    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 800));

    return HttpResponse.json(response);
  }),
];