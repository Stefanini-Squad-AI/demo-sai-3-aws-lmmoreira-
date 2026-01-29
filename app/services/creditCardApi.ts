// app/services/creditCardApi.ts
import { apiClient } from './api';
import type { CreditCardFilter, CreditCardListResponse } from '~/types/creditCard';

export const creditCardApi = {
  listCreditCards: async (
    filters: CreditCardFilter,
    userType: 'ADMIN' | 'USER' = 'USER'
  ): Promise<CreditCardListResponse> => {
    const response = await apiClient.post<CreditCardListResponse>(
      '/credit-cards/list',
      filters,
      {
        headers: {
          'User-Type': userType,
        },
      }
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to fetch credit cards');
  },
};