// app/mocks/transactionReportsHandlers.ts
import { http, HttpResponse } from 'msw';
import type { TransactionReportRequest, TransactionReportResponse } from '~/types/transactionReports';

// Datos mock que coinciden con la respuesta real
const mockReportData = {
  reportType: "Yearly",
  startDate: "2025-01-01",
  endDate: "2025-12-31",
  accountGroups: [
    {
      cardNumber: "0500024453765740",
      accountId: 50,
      transactions: [
        {
          transactionId: "0000000058866561",
          accountId: 50,
          cardNumber: "0500024453765740",
          typeCode: "01",
          typeDescription: "Purchase",
          categoryCode: 1,
          categoryDescription: "Regular Sales Draft",
          source: "POS TERM",
          amount: 183.87,
          processedTimestamp: "2025-10-23T19:26:00.697289"
        },
        {
          transactionId: "0000000685488982",
          accountId: 50,
          cardNumber: "0500024453765740",
          typeCode: "01",
          typeDescription: "Purchase",
          categoryCode: 1,
          categoryDescription: "Regular Sales Draft",
          source: "POS TERM",
          amount: 94.76,
          processedTimestamp: "2025-10-23T19:26:04.94626"
        },
        {
          transactionId: "0000000838587312",
          accountId: 50,
          cardNumber: "0500024453765740",
          typeCode: "01",
          typeDescription: "Purchase",
          categoryCode: 1,
          categoryDescription: "Regular Sales Draft",
          source: "POS TERM",
          amount: 241.65,
          processedTimestamp: "2025-10-23T19:26:06.773015"
        }
      ],
      accountTotal: 520.28,
      transactionCount: 3
    },
    {
      cardNumber: "0683586198171516",
      accountId: 27,
      transactions: [
        {
          transactionId: "0000000130111733",
          accountId: 27,
          cardNumber: "0683586198171516",
          typeCode: "01",
          typeDescription: "Purchase",
          categoryCode: 1,
          categoryDescription: "Regular Sales Draft",
          source: "POS TERM",
          amount: 777.32,
          processedTimestamp: "2025-10-23T19:26:01.541847"
        },
        {
          transactionId: "0000000925687557",
          accountId: 27,
          cardNumber: "0683586198171516",
          typeCode: "03",
          typeDescription: "Credit",
          categoryCode: 1,
          categoryDescription: "Credit to Account",
          source: "OPERATOR",
          amount: -372.98,
          processedTimestamp: "2025-10-23T19:26:07.411524"
        }
      ],
      accountTotal: 404.34,
      transactionCount: 2
    }
  ],
  grandTotal: 924.62,
  totalTransactionCount: 5,
  accountCount: 2
};

const simulateProcessingDelay = () => new Promise(resolve => setTimeout(resolve, 2000));

export const transactionReportsHandlers = [
  // Reporte mensual
  http.post('/api/v1/reports/transactions/monthly', async ({ request }) => {
    const body = await request.json() as TransactionReportRequest;
    
    console.log('🔍 Monthly Report Request (MSW):', body);
    
    await simulateProcessingDelay();

    if (!body.confirmed) {
      return HttpResponse.json({
        success: false,
        message: 'Please confirm to print the Monthly report...',
        timestamp: new Date().toISOString(),
      } as TransactionReportResponse);
    }

    return HttpResponse.json({
      success: true,
      message: 'Monthly report generated successfully',
      reportType: 'Monthly',
      jobId: `TRNRPT${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      reportData: {
        ...mockReportData,
        reportType: 'Monthly',
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
        endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0],
      }
    } as TransactionReportResponse);
  }),

  // Reporte anual
  http.post('/api/v1/reports/transactions/yearly', async ({ request }) => {
    const body = await request.json() as TransactionReportRequest;
    
    console.log('🔍 Yearly Report Request (MSW):', body);
    
    await simulateProcessingDelay();

    if (!body.confirmed) {
      return HttpResponse.json({
        success: false,
        message: 'Please confirm to print the Yearly report...',
        timestamp: new Date().toISOString(),
      } as TransactionReportResponse);
    }

    return HttpResponse.json({
      success: true,
      message: 'Yearly report generated successfully',
      reportType: 'Yearly',
      jobId: `TRNRPT${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      reportData: mockReportData
    } as TransactionReportResponse);
  }),

  // Reporte personalizado
  http.post('/api/v1/reports/transactions/custom', async ({ request }) => {
    const body = await request.json() as TransactionReportRequest;
    
    console.log('🔍 Custom Report Request (MSW):', body);
    
    await simulateProcessingDelay();

    // Validaciones del backend
    if (!body.startDate) {
      return HttpResponse.json({
        success: false,
        message: 'Start Date can NOT be empty...',
        timestamp: new Date().toISOString(),
      } as TransactionReportResponse, { status: 400 });
    }

    if (!body.endDate) {
      return HttpResponse.json({
        success: false,
        message: 'End Date can NOT be empty...',
        timestamp: new Date().toISOString(),
      } as TransactionReportResponse, { status: 400 });
    }

    if (new Date(body.startDate) > new Date(body.endDate)) {
      return HttpResponse.json({
        success: false,
        message: 'Start Date cannot be after End Date...',
        timestamp: new Date().toISOString(),
      } as TransactionReportResponse, { status: 400 });
    }

    if (!body.confirmed) {
      return HttpResponse.json({
        success: false,
        message: 'Please confirm to print the Custom report...',
        timestamp: new Date().toISOString(),
      } as TransactionReportResponse);
    }

    return HttpResponse.json({
      success: true,
      message: 'Custom report generated successfully',
      reportType: 'Custom',
      jobId: `TRNRPT${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      reportData: {
        ...mockReportData,
        reportType: 'Custom',
        startDate: body.startDate,
        endDate: body.endDate,
      }
    } as TransactionReportResponse);
  }),
];