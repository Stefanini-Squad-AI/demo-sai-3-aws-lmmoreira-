// app/mocks/transactionAddHandlers.ts (corregido para coincidir con el backend)
import { http, HttpResponse } from 'msw';
import type { TransactionAddResponse } from '~/types/transactionAdd';

// Estado compartido para simular base de datos
let transactionCounter = 1000000000000;

export const transactionAddHandlers = [
  http.post('/api/transactions', async ({ request }) => {
    const body = await request.json() as {
      accountId?: string;
      cardNumber?: string;
      transactionTypeCode: string;
      transactionCategoryCode: string;
      transactionSource: string;
      transactionDescription: string;
      transactionAmount: number;
      originalDate: string; // ISO string
      processDate: string; // ISO string
      merchantId: string;
      merchantName: string;
      merchantCity: string;
      merchantZip: string;
      confirmation: string;
    };

    console.log('🔍 Transaction Add Request (MSW):', body);

    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1200));

    // ✅ CORRECCIÓN: Validaciones exactas del backend Spring Boot
    
    // Validación de confirmación (@Pattern(regexp = "[YyNn]"))
    if (!body.confirmation || !/^[YyNn]$/.test(body.confirmation)) {
      return HttpResponse.json({
        transactionId: null,
        message: 'Invalid value. Valid values are (Y/N)...',
        success: false,
      } as TransactionAddResponse, { status: 400 });
    }

    if (body.confirmation.toUpperCase() !== 'Y') {
      return HttpResponse.json({
        transactionId: null,
        message: 'Confirm to add this transaction...',
        success: false,
      } as TransactionAddResponse, { status: 400 });
    }

    // Validación de Account ID o Card Number
    if (!body.accountId && !body.cardNumber) {
      return HttpResponse.json({
        transactionId: null,
        message: 'Account or Card Number must be entered...',
        success: false,
      } as TransactionAddResponse, { status: 400 });
    }

    // Validaciones de campos obligatorios (@NotBlank)
    if (!body.transactionTypeCode) {
      return HttpResponse.json({
        transactionId: null,
        message: 'Type CD can NOT be empty...',
        success: false,
      } as TransactionAddResponse, { status: 400 });
    }

    if (!body.transactionCategoryCode) {
      return HttpResponse.json({
        transactionId: null,
        message: 'Category CD can NOT be empty...',
        success: false,
      } as TransactionAddResponse, { status: 400 });
    }

    // Validaciones de patrones (@Pattern)
    if (!/^\d{1,2}$/.test(body.transactionTypeCode)) {
      return HttpResponse.json({
        transactionId: null,
        message: 'Type CD must be Numeric...',
        success: false,
      } as TransactionAddResponse, { status: 400 });
    }

    if (!/^\d{1,4}$/.test(body.transactionCategoryCode)) {
      return HttpResponse.json({
        transactionId: null,
        message: 'Category CD must be Numeric...',
        success: false,
      } as TransactionAddResponse, { status: 400 });
    }

    if (!/^\d+$/.test(body.merchantId)) {
      return HttpResponse.json({
        transactionId: null,
        message: 'Merchant ID must be Numeric...',
        success: false,
      } as TransactionAddResponse, { status: 400 });
    }

    // Validación de monto (@DecimalMin, @DecimalMax)
    if (body.transactionAmount < -99999999.99 || body.transactionAmount > 99999999.99) {
      return HttpResponse.json({
        transactionId: null,
        message: 'Amount should be in format -99999999.99',
        success: false,
      } as TransactionAddResponse, { status: 400 });
    }

    // Simular validación de Account/Card en base de datos
    const validAccountIds = ['11111111111', '22222222222', '33333333333'];
    const validCardNumbers = ['4111111111111111', '4222222222222222', '4333333333333333'];

    if (body.accountId && !validAccountIds.includes(body.accountId)) {
      return HttpResponse.json({
        transactionId: null,
        message: 'Account ID NOT found...',
        success: false,
      } as TransactionAddResponse, { status: 400 });
    }

    if (body.cardNumber && !validCardNumbers.includes(body.cardNumber)) {
      return HttpResponse.json({
        transactionId: null,
        message: 'Card Number NOT found...',
        success: false,
      } as TransactionAddResponse, { status: 400 });
    }

    // Simular error ocasional del servicio (5% de probabilidad)
    if (Math.random() < 0.05) {
      return HttpResponse.json({
        transactionId: null,
        message: 'Unable to Add Transaction...',
        success: false,
      } as TransactionAddResponse, { status: 500 });
    }

    // ✅ CORRECCIÓN: Generar ID y respuesta exitosa exacta del backend
    transactionCounter++;
    const newTransactionId = transactionCounter.toString();

    console.log('✅ Transaction Added Successfully (MSW):', newTransactionId);

    // ✅ CORRECCIÓN: Respuesta exacta como TransactionAddResponseDto.success()
    return HttpResponse.json({
      transactionId: newTransactionId,
      message: `Transaction added successfully. Your Tran ID is ${newTransactionId}.`,
      success: true,
    } as TransactionAddResponse);
  }),
];