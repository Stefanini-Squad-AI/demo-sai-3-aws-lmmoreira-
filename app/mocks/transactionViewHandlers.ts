// app/mocks/transactionViewHandlers.ts (exacto al backend Spring Boot)
import { http, HttpResponse } from 'msw';
import type { TransactionViewRequest, TransactionViewResponse } from '~/types/transactionView';

// ✅ Datos mock que coinciden exactamente con TransactionRecord del backend
const mockTransactionRecords: Record<string, any> = {
  '1000000000001': {
    transactionId: '1000000000001',
    cardNumber: '4111111111111111',
    transactionTypeCode: '01',
    transactionCategoryCode: '5411',
    transactionSource: 'ONLINE',
    transactionAmount: '125.50',              // ✅ BigDecimal como string
    transactionDescription: 'GROCERY STORE PURCHASE - SUPERMARKET XYZ',
    originalTimestamp: '2024-01-15T10:30:00', // ✅ LocalDateTime format
    processedTimestamp: '2024-01-15T10:31:00', // ✅ LocalDateTime format
    merchantId: '987654321',
    merchantName: 'SUPERMARKET XYZ',
    merchantCity: 'NEW YORK',
    merchantZip: '10001',
  },
  '1000000000002': {
    transactionId: '1000000000002',
    cardNumber: '4222222222222222',
    transactionTypeCode: '02',
    transactionCategoryCode: '5542',
    transactionSource: 'POS',
    transactionAmount: '75.25',
    transactionDescription: 'FUEL PURCHASE - SHELL STATION',
    originalTimestamp: '2024-01-14T14:15:00',
    processedTimestamp: '2024-01-14T14:16:00',
    merchantId: '123456789',
    merchantName: 'SHELL GAS STATION',
    merchantCity: 'LOS ANGELES',
    merchantZip: '90210',
  },
  '1000000000003': {
    transactionId: '1000000000003',
    cardNumber: '4333333333333333',
    transactionTypeCode: '03',
    transactionCategoryCode: '6011',
    transactionSource: 'ATM',
    transactionAmount: '-200.00',
    transactionDescription: 'CASH WITHDRAWAL - ATM TRANSACTION',
    originalTimestamp: '2024-01-13T16:45:00',
    processedTimestamp: '2024-01-13T16:46:00',
    merchantId: '999888777',
    merchantName: 'BANK ATM',
    merchantCity: 'MIAMI',
    merchantZip: '33101',
  },
  '1000000000004': {
    transactionId: '1000000000004',
    cardNumber: '4444444444444444',
    transactionTypeCode: '01',
    transactionCategoryCode: '5812',
    transactionSource: 'POS',
    transactionAmount: '45.80',
    transactionDescription: 'RESTAURANT DINING - ITALIAN BISTRO',
    originalTimestamp: '2024-01-12T19:20:00',
    processedTimestamp: '2024-01-12T19:21:00',
    merchantId: '456789123',
    merchantName: 'ITALIAN BISTRO',
    merchantCity: 'MIAMI',
    merchantZip: '33101',
  },
  '1000000000005': {
    transactionId: '1000000000005',
    cardNumber: '4555555555555555',
    transactionTypeCode: '02',
    transactionCategoryCode: '5999',
    transactionSource: 'ONLINE',
    transactionAmount: '250.00',
    transactionDescription: 'ONLINE PURCHASE - AMAZON.COM',
    originalTimestamp: '2024-01-11T11:05:00',
    processedTimestamp: '2024-01-11T11:06:00',
    merchantId: '789456123',
    merchantName: 'AMAZON.COM',
    merchantCity: 'SEATTLE',
    merchantZip: '98101',
  },
  '1000000000006': {
    transactionId: '1000000000006',
    cardNumber: '4666666666666666',
    transactionTypeCode: '01',
    transactionCategoryCode: '5411',
    transactionSource: 'POS',
    transactionAmount: '320.75',
    transactionDescription: 'DEPARTMENT STORE - MACYS',
    originalTimestamp: '2024-01-10T15:30:00',
    processedTimestamp: '2024-01-10T15:31:00',
    merchantId: '321654987',
    merchantName: 'MACYS DEPARTMENT STORE',
    merchantCity: 'BOSTON',
    merchantZip: '02101',
  },
  '1000000000007': {
    transactionId: '1000000000007',
    cardNumber: '4777777777777777',
    transactionTypeCode: '02',
    transactionCategoryCode: '5812',
    transactionSource: 'POS',
    transactionAmount: '85.40',
    transactionDescription: 'COFFEE SHOP - STARBUCKS',
    originalTimestamp: '2024-01-09T08:15:00',
    processedTimestamp: '2024-01-09T08:16:00',
    merchantId: '654987321',
    merchantName: 'STARBUCKS COFFEE',
    merchantCity: 'HOUSTON',
    merchantZip: '77001',
  },
  '1000000000008': {
    transactionId: '1000000000008',
    cardNumber: '4888888888888888',
    transactionTypeCode: '01',
    transactionCategoryCode: '5411',
    transactionSource: 'POS',
    transactionAmount: '52.30',
    transactionDescription: 'PHARMACY PURCHASE - CVS STORE',
    originalTimestamp: '2024-01-08T13:45:00',
    processedTimestamp: '2024-01-08T13:46:00',
    merchantId: '987321654',
    merchantName: 'CVS PHARMACY',
    merchantCity: 'PHOENIX',
    merchantZip: '85001',
  },
  '1000000000009': {
    transactionId: '1000000000009',
    cardNumber: '4999999999999999',
    transactionTypeCode: '02',
    transactionCategoryCode: '7011',
    transactionSource: 'ONLINE',
    transactionAmount: '450.00',
    transactionDescription: 'HOTEL BOOKING - MARRIOTT',
    originalTimestamp: '2024-01-07T20:30:00',
    processedTimestamp: '2024-01-07T20:31:00',
    merchantId: '159753486',
    merchantName: 'MARRIOTT HOTELS',
    merchantCity: 'SAN FRANCISCO',
    merchantZip: '94101',
  },
  '1000000000010': {
    transactionId: '1000000000010',
    cardNumber: '4101010101010101',
    transactionTypeCode: '01',
    transactionCategoryCode: '4511',
    transactionSource: 'ONLINE',
    transactionAmount: '275.90',
    transactionDescription: 'AIRLINE TICKET - DELTA AIRLINES',
    originalTimestamp: '2024-01-06T09:00:00',
    processedTimestamp: '2024-01-06T09:01:00',
    merchantId: '753159486',
    merchantName: 'DELTA AIRLINES',
    merchantCity: 'DENVER',
    merchantZip: '80201',
  },
};

// ✅ Función que replica exactamente TransactionViewService.populateHeaderInfo()
const populateHeaderInfo = (): Pick<TransactionViewResponse, 'currentDate' | 'currentTime' | 'programName' | 'transactionName'> => {
  const now = new Date();
  
  return {
    currentDate: now.toLocaleDateString('en-US', { 
      year: '2-digit', 
      month: '2-digit', 
      day: '2-digit' 
    }), // MM/dd/yy format
    currentTime: now.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }), // HH:mm:ss format
    programName: 'COTRN01C',
    transactionName: 'CT01',
  };
};

// ✅ Función que replica exactamente TransactionViewService.initializeEmptyView()
const createEmptyResponse = (): TransactionViewResponse => {
  return {
    ...populateHeaderInfo(),
  };
};

export const transactionViewHandlers = [
  // ✅ Endpoint exacto: @PostMapping("/transaction/search")
  http.post('/api/transaction/search', async ({ request }) => {
    const body = await request.json() as { transactionId: string };
    
    console.log('🔍 Transaction View Search Request (MSW):', body);

    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 800));

    // ✅ Validación exacta del backend: TransactionViewService.getTransactionDetails()
    if (!body.transactionId || body.transactionId.trim() === '') {
      return HttpResponse.json({
        ...createEmptyResponse(),
        errorMessage: 'Transaction ID cannot be empty...',
      } as TransactionViewResponse);
    }

    const transactionId = body.transactionId.trim();

    try {
      // ✅ Simular: Optional<TransactionRecord> transactionOpt = transactionRecordRepository.findById(transactionId)
      const transactionRecord = mockTransactionRecords[transactionId];
      
      if (transactionRecord) {
        console.log('✅ Transaction found (MSW):', transactionId);
        
        // ✅ Mapeo exacto como en el backend
        const response: TransactionViewResponse = {
          transactionId: transactionRecord.transactionId,
          cardNumber: transactionRecord.cardNumber,
          transactionTypeCode: transactionRecord.transactionTypeCode,
          transactionCategoryCode: transactionRecord.transactionCategoryCode,
          transactionSource: transactionRecord.transactionSource,
          transactionAmount: transactionRecord.transactionAmount,
          transactionDescription: transactionRecord.transactionDescription,
          originalTimestamp: transactionRecord.originalTimestamp,
          processedTimestamp: transactionRecord.processedTimestamp,
          merchantId: transactionRecord.merchantId,
          merchantName: transactionRecord.merchantName,
          merchantCity: transactionRecord.merchantCity,
          merchantZip: transactionRecord.merchantZip,
          ...populateHeaderInfo(),
        };
        
        return HttpResponse.json(response);
      } else {
        // ✅ Equivalente a DFHRESP(NOTFND) del backend
        console.log('❌ Transaction not found (MSW):', transactionId);
        return HttpResponse.json({
          ...createEmptyResponse(),
          errorMessage: 'Transaction ID NOT found...',
        } as TransactionViewResponse);
      }
    } catch (error) {
      // ✅ Equivalente al catch del backend
      console.error('❌ Error retrieving transaction (MSW):', error);
      return HttpResponse.json({
        ...createEmptyResponse(),
        errorMessage: 'Unable to lookup Transaction...',
      } as TransactionViewResponse);
    }
  }),

  // ✅ Endpoint exacto: @PostMapping("/transaction/clear")
  http.post('/api/transaction/clear', async () => {
    console.log('🧹 Transaction View Clear Request (MSW)');
    
    // Simular delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // ✅ Equivalente exacto a TransactionViewService.initializeEmptyView()
    return HttpResponse.json(createEmptyResponse());
  }),

  // ✅ Endpoint exacto: @GetMapping("/transaction/view") (opcional para inicialización)
  http.get('/api/transaction/view', async ({ request }) => {
    const url = new URL(request.url);
    const transactionId = url.searchParams.get('transactionId');
    
    console.log('🔍 Transaction View GET Request (MSW):', transactionId);
    
    if (transactionId) {
      // Reutilizar la lógica de búsqueda
      const transactionRecord = mockTransactionRecords[transactionId];
      if (transactionRecord) {
        const response: TransactionViewResponse = {
          transactionId: transactionRecord.transactionId,
          cardNumber: transactionRecord.cardNumber,
          transactionTypeCode: transactionRecord.transactionTypeCode,
          transactionCategoryCode: transactionRecord.transactionCategoryCode,
          transactionSource: transactionRecord.transactionSource,
          transactionAmount: transactionRecord.transactionAmount,
          transactionDescription: transactionRecord.transactionDescription,
          originalTimestamp: transactionRecord.originalTimestamp,
          processedTimestamp: transactionRecord.processedTimestamp,
          merchantId: transactionRecord.merchantId,
          merchantName: transactionRecord.merchantName,
          merchantCity: transactionRecord.merchantCity,
          merchantZip: transactionRecord.merchantZip,
          ...populateHeaderInfo(),
        };
        return HttpResponse.json(response);
      } else {
        return HttpResponse.json({
          ...createEmptyResponse(),
          errorMessage: 'Transaction ID NOT found...',
        } as TransactionViewResponse);
      }
    }
    
    return HttpResponse.json(createEmptyResponse());
  }),
];