// app/services/creditCardDetailApi.ts
import { apiClient } from './api';
import type { CreditCardDetailRequest, CreditCardDetailResponse } from '~/types/creditCardDetail';

export const creditCardDetailApi = {
  getCreditCardDetails: async (request: CreditCardDetailRequest): Promise<CreditCardDetailResponse> => {
    // Convertir accountId a número para el backend
    const backendRequest = {
      accountId: parseInt(request.accountId),
      cardNumber: request.cardNumber,
    };

    const response = await apiClient.post<CreditCardDetailResponse>(
      '/credit-cards/details',
      backendRequest
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to fetch credit card details');
  },
};