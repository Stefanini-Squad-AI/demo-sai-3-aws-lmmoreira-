// app/mocks/billPaymentHandlers.ts
import { http, HttpResponse } from 'msw';
import { BILL_PAYMENT_MESSAGES } from '~/types/billPayment';

// Mock data que coincide con el backend
const mockAccounts = [
  {
    accountId: 12345678901,
    currentBalance: 1250.75,
    creditLimit: 5000.00,
    accountStatus: 'A',
  },
  {
    accountId: 98765432109,
    currentBalance: 0.00,
    creditLimit: 3000.00,
    accountStatus: 'A',
  },
  {
    accountId: 11111111111,
    currentBalance: 2500.50,
    creditLimit: 10000.00,
    accountStatus: 'A',
  },
  {
    accountId: 22222222222,
    currentBalance: 0.00,
    creditLimit: 2500.00,
    accountStatus: 'A',
  },
  {
    accountId: 33333333333,
    currentBalance: 8750.25,
    creditLimit: 15000.00,
    accountStatus: 'A',
  },
  {
    accountId: 44444444444,
    currentBalance: 0.00,
    creditLimit: 1000.00,
    accountStatus: 'A',
  },
  {
    accountId: 55555555555,
    currentBalance: -500.00,
    creditLimit: 3000.00,
    accountStatus: 'A',
  },
  {
    accountId: 66666666666,
    currentBalance: 15750.50,
    creditLimit: 50000.00,
    accountStatus: 'A',
  },
  {
    accountId: 77777777777,
    currentBalance: 3250.00,
    creditLimit: 10000.00,
    accountStatus: 'A',
  },
  {
    accountId: 88888888888,
    currentBalance: 625.50,
    creditLimit: 2000.00,
    accountStatus: 'A',
  },
  {
    accountId: 99999999999,
    currentBalance: 12500.75,
    creditLimit: 25000.00,
    accountStatus: 'A',
  },
  {
    accountId: 10101010101,
    currentBalance: 0.00,
    creditLimit: 1500.00,
    accountStatus: 'A',
  },
  // ✅ NUEVO: Cuenta específica para testing del caso "already paid"
  {
    accountId: 50,
    currentBalance: 0.00,
    creditLimit: 2000.00,
    accountStatus: 'A',
  },
];

let transactionCounter = 1000000000000000;

export const billPaymentHandlers = [
  // ✅ CORRECCIÓN: Agregar endpoint de consulta separado
  http.get('/api/bill-payment/consult', async ({ request }) => {
    const url = new URL(request.url);
    const accountIdParam = url.searchParams.get('accountId');

    console.log('🔄 Bill Payment Consult Request:', { accountId: accountIdParam });

    // Validación de Account ID
    if (!accountIdParam) {
      return HttpResponse.json({
        accountId: null,
        currentBalance: null,
        paymentAmount: null,
        transactionId: null,
        message: null,
        success: false,
        errorMessage: BILL_PAYMENT_MESSAGES.ACCOUNT_EMPTY,
      });
    }

    const accountId = parseInt(accountIdParam, 10);
    if (isNaN(accountId)) {
      return HttpResponse.json({
        accountId: null,
        currentBalance: null,
        paymentAmount: null,
        transactionId: null,
        message: null,
        success: false,
        errorMessage: BILL_PAYMENT_MESSAGES.ACCOUNT_EMPTY,
      });
    }

    const account = mockAccounts.find(acc => acc.accountId === accountId);
    
    if (!account) {
      return HttpResponse.json({
        accountId: accountId,
        currentBalance: null,
        paymentAmount: null,
        transactionId: null,
        message: null,
        success: false,
        errorMessage: BILL_PAYMENT_MESSAGES.ACCOUNT_NOT_FOUND,
      });
    }

    // ✅ CORRECCIÓN CRÍTICA: Lógica para manejar cuentas ya pagadas
    if (account.currentBalance <= 0) {
      return HttpResponse.json({
        accountId: account.accountId,
        currentBalance: account.currentBalance,
        paymentAmount: null,
        transactionId: null,
        message: BILL_PAYMENT_MESSAGES.CONFIRM_PAYMENT,
        success: true, // ✅ SUCCESS = TRUE para cuentas ya pagadas
        errorMessage: null,
      });
    }

    // Cuenta con balance pendiente
    return HttpResponse.json({
      accountId: account.accountId,
      currentBalance: account.currentBalance,
      paymentAmount: null,
      transactionId: null,
      message: BILL_PAYMENT_MESSAGES.CONFIRM_PAYMENT,
      success: true,
      errorMessage: null,
    });
  }),

  // Endpoint real del backend para procesar pagos
  http.post('/api/bill-payment/process', async ({ request }) => {
    const body = await request.json() as {
      accountId: number;
      confirmation: string;
    };

    console.log('🔄 Bill Payment Process Request:', body);

    // Validación de Account ID
    if (!body.accountId) {
      return HttpResponse.json({
        accountId: null,
        currentBalance: null,
        paymentAmount: null,
        transactionId: null,
        message: null,
        success: false,
        errorMessage: BILL_PAYMENT_MESSAGES.ACCOUNT_EMPTY,
      });
    }

    const account = mockAccounts.find(acc => acc.accountId === body.accountId);
    
    if (!account) {
      return HttpResponse.json({
        accountId: body.accountId,
        currentBalance: null,
        paymentAmount: null,
        transactionId: null,
        message: null,
        success: false,
        errorMessage: BILL_PAYMENT_MESSAGES.ACCOUNT_NOT_FOUND,
      });
    }

    // Si no hay confirmación, solo devolver el saldo
    if (!body.confirmation || body.confirmation.trim() === '') {
      // ✅ CORRECCIÓN: Manejar caso de cuenta ya pagada
      if (account.currentBalance <= 0) {
        return HttpResponse.json({
          accountId: account.accountId,
          currentBalance: account.currentBalance,
          paymentAmount: null,
          transactionId: null,
          message: BILL_PAYMENT_MESSAGES.CONFIRM_PAYMENT,
          success: true, // ✅ SUCCESS = TRUE para indicar que la consulta fue exitosa
          errorMessage: null,
        });
      }

      return HttpResponse.json({
        accountId: account.accountId,
        currentBalance: account.currentBalance,
        paymentAmount: null,
        transactionId: null,
        message: BILL_PAYMENT_MESSAGES.CONFIRM_PAYMENT,
        success: true,
        errorMessage: null,
      });
    }

    // Procesar confirmación
    if (body.confirmation.toUpperCase() === 'Y') {
      // ✅ CORRECCIÓN: Verificar si ya está pagado antes de procesar
      if (account.currentBalance <= 0) {
        return HttpResponse.json({
          accountId: account.accountId,
          currentBalance: account.currentBalance,
          paymentAmount: null,
          transactionId: null,
          message: BILL_PAYMENT_MESSAGES.ALREADY_PAID,
          success: true, // ✅ SUCCESS = TRUE porque la operación fue exitosa (informar que ya está pagado)
          errorMessage: null,
        });
      }

      // Simular procesamiento
      await new Promise(resolve => setTimeout(resolve, 2000));

      const transactionId = ++transactionCounter;
      const paymentAmount = account.currentBalance;
      
      // Actualizar balance
      account.currentBalance = 0;

      return HttpResponse.json({
        accountId: account.accountId,
        currentBalance: 0,
        paymentAmount: paymentAmount,
        transactionId: transactionId,
        message: `${BILL_PAYMENT_MESSAGES.PAYMENT_SUCCESSFUL} Your Transaction ID is ${transactionId}.`,
        success: true,
        errorMessage: null,
      });

    } else if (body.confirmation.toUpperCase() === 'N') {
      return HttpResponse.json({
        accountId: account.accountId,
        currentBalance: account.currentBalance,
        paymentAmount: null,
        transactionId: null,
        message: null,
        success: false,
        errorMessage: BILL_PAYMENT_MESSAGES.PAYMENT_CANCELLED,
      });

    } else {
      return HttpResponse.json({
        accountId: account.accountId,
        currentBalance: account.currentBalance,
        paymentAmount: null,
        transactionId: null,
        message: null,
        success: false,
        errorMessage: BILL_PAYMENT_MESSAGES.INVALID_CONFIRMATION,
      });
    }
  }),
];