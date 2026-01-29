// app/mocks/transactionListHandlers.ts
import { http, HttpResponse } from 'msw';
import type { TransactionListRequest, TransactionListResponse, TransactionItem } from '~/types/transactionList';

// ✅ CORRECCIÓN COMPLETA: Crear función que garantiza tipos correctos
const createMockTransaction = (index: number): TransactionItem => {
  const descriptions = [
    'GROCERY STORE PURCHASE - SUPERMARKET XYZ',
    'FUEL PURCHASE - SHELL STATION',
    'RESTAURANT DINING - ITALIAN BISTRO',
    'CASH WITHDRAWAL - ATM TRANSACTION',
    'ONLINE PURCHASE - AMAZON.COM',
    'PHARMACY PURCHASE - CVS STORE',
    'COFFEE SHOP - STARBUCKS',
    'DEPARTMENT STORE - MACY\'S',
    'HOTEL BOOKING - MARRIOTT',
    'AIRLINE TICKET - DELTA AIRLINES',
  ];

  // ✅ CORRECCIÓN: Garantizar que description nunca sea undefined
  const description = descriptions[index % descriptions.length];
  if (!description) {
    throw new Error(`Description not found for index ${index}`);
  }

  return {
    transactionId: (1000000000000 + index).toString(),
    date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
      .toLocaleDateString('en-US', { 
        year: '2-digit', 
        month: '2-digit', 
        day: '2-digit' 
      }),
    description, // ✅ Siempre será string
    amount: parseFloat((Math.random() * 1000 - 200).toFixed(2)),
  };
};

// ✅ CORRECCIÓN: Generar datos mock con tipos correctos
const mockTransactions: TransactionItem[] = Array.from({ length: 50 }, (_, i) => 
  createMockTransaction(i)
);

export const transactionListHandlers = [
  // Obtener lista de transacciones
  http.post('/api/transactions/list', async ({ request }) => {
    const body = await request.json() as TransactionListRequest;
    
    console.log('🔍 Transaction List Request (MSW):', body);

    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 800));

    // Validar Transaction ID si se proporciona
    if (body.transactionId && !/^\d+$/.test(body.transactionId)) {
      return HttpResponse.json({
        transactions: [],
        currentPage: 1,
        hasNextPage: false,
        hasPreviousPage: false,
        errorMessage: 'Tran ID must be Numeric ...',
      } as TransactionListResponse);
    }

    // Manejar selección de transacción
    if (body.selectionFlag && body.selectedTransactionId) {
      if (body.selectionFlag.toUpperCase() === 'S') {
        return HttpResponse.json({
          transactions: [],
          currentPage: 1,
          hasNextPage: false,
          hasPreviousPage: false,
          message: `Transaction ${body.selectedTransactionId} selected for details`,
        } as TransactionListResponse);
      } else {
        return HttpResponse.json({
          transactions: [],
          currentPage: 1,
          hasNextPage: false,
          hasPreviousPage: false,
          errorMessage: 'Invalid selection. Valid value is S',
        } as TransactionListResponse, { status: 400 });
      }
    }

    // Filtrar transacciones si se proporciona ID
    let filteredTransactions = mockTransactions;
    if (body.transactionId) {
      const startIndex = mockTransactions.findIndex(t => 
        t.transactionId >= body.transactionId!
      );
      filteredTransactions = startIndex >= 0 
        ? mockTransactions.slice(startIndex) 
        : [];
    }

    // Paginación
    const pageSize = 10;
    const currentPage = body.pageNumber || 1;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pageTransactions = filteredTransactions.slice(startIndex, endIndex);

    // ✅ CORRECCIÓN: Construir respuesta con verificaciones de undefined
    const response: TransactionListResponse = {
      transactions: pageTransactions,
      currentPage,
      hasNextPage: endIndex < filteredTransactions.length,
      hasPreviousPage: currentPage > 1,
    };

    // ✅ CORRECCIÓN: Verificar que el array no esté vacío y los elementos existan
    if (pageTransactions.length > 0) {
      const firstTransaction = pageTransactions[0];
      const lastTransaction = pageTransactions[pageTransactions.length - 1];
      
      if (firstTransaction) {
        response.firstTransactionId = firstTransaction.transactionId;
      }
      if (lastTransaction) {
        response.lastTransactionId = lastTransaction.transactionId;
      }
    }

    console.log('✅ Transaction List Response (MSW):', response);
    return HttpResponse.json(response);
  }),

  // Página siguiente
  http.post('/api/transactions/next-page', async ({ request }) => {
    const body = await request.json() as TransactionListRequest;
    
    console.log('🔍 Next Page Request (MSW):', body);

    // Simular delay
    await new Promise(resolve => setTimeout(resolve, 600));

    // Encontrar índice de la última transacción
    const lastIndex = mockTransactions.findIndex(t => 
      t.transactionId === body.transactionId
    );

    if (lastIndex === -1 || lastIndex >= mockTransactions.length - 1) {
      return HttpResponse.json({
        transactions: [],
        currentPage: body.pageNumber || 1,
        hasNextPage: false,
        hasPreviousPage: true,
        errorMessage: 'You are already at the bottom of the page...',
      } as TransactionListResponse);
    }

    // Obtener siguiente página
    const pageSize = 10;
    const startIndex = lastIndex + 1;
    const endIndex = startIndex + pageSize;
    const pageTransactions = mockTransactions.slice(startIndex, endIndex);

    // ✅ CORRECCIÓN: Construir respuesta con verificaciones
    const response: TransactionListResponse = {
      transactions: pageTransactions,
      currentPage: (body.pageNumber || 1) + 1,
      hasNextPage: endIndex < mockTransactions.length,
      hasPreviousPage: true,
    };

    // ✅ CORRECCIÓN: Verificar que el array no esté vacío y los elementos existan
    if (pageTransactions.length > 0) {
      const firstTransaction = pageTransactions[0];
      const lastTransaction = pageTransactions[pageTransactions.length - 1];
      
      if (firstTransaction) {
        response.firstTransactionId = firstTransaction.transactionId;
      }
      if (lastTransaction) {
        response.lastTransactionId = lastTransaction.transactionId;
      }
    }

    return HttpResponse.json(response);
  }),

  // Página anterior
  http.post('/api/transactions/previous-page', async ({ request }) => {
    const body = await request.json() as TransactionListRequest;
    
    console.log('🔍 Previous Page Request (MSW):', body);

    // Simular delay
    await new Promise(resolve => setTimeout(resolve, 600));

    const currentPage = body.pageNumber || 1;
    if (currentPage <= 1) {
      return HttpResponse.json({
        transactions: [],
        currentPage: 1,
        hasNextPage: true,
        hasPreviousPage: false,
        errorMessage: 'You are already at the top of the page...',
      } as TransactionListResponse);
    }

    // Obtener página anterior
    const pageSize = 10;
    const newPage = currentPage - 1;
    const startIndex = (newPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pageTransactions = mockTransactions.slice(startIndex, endIndex);

    // ✅ CORRECCIÓN: Construir respuesta con verificaciones
    const response: TransactionListResponse = {
      transactions: pageTransactions,
      currentPage: newPage,
      hasNextPage: true,
      hasPreviousPage: newPage > 1,
    };

    // ✅ CORRECCIÓN: Verificar que el array no esté vacío y los elementos existan
    if (pageTransactions.length > 0) {
      const firstTransaction = pageTransactions[0];
      const lastTransaction = pageTransactions[pageTransactions.length - 1];
      
      if (firstTransaction) {
        response.firstTransactionId = firstTransaction.transactionId;
      }
      if (lastTransaction) {
        response.lastTransactionId = lastTransaction.transactionId;
      }
    }

    return HttpResponse.json(response);
  }),
];