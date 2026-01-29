// app/hooks/useCreditCardList.ts
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from './useApi';
import { apiClient } from '~/services/api';
import type { 
  CreditCardFilter, 
  CreditCardListResponse,
} from '~/types/creditCard';

interface UseCreditCardListOptions {
  onError?: (error: string) => void;
  onSuccess?: (data: CreditCardListResponse) => void;
}

export function useCreditCardList(options: UseCreditCardListOptions = {}) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<CreditCardFilter>({});
  const [selectedCards, setSelectedCards] = useState<Record<number, 'S' | 'U'>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Crear las opciones solo si existen los callbacks
  const mutationOptions = {} as any;
  if (options.onSuccess) {
    mutationOptions.onSuccess = (data: any) => options.onSuccess!(data);
  }
  if (options.onError) {
    mutationOptions.onError = (error: string) => options.onError!(error);
  }

  const { mutate: fetchCards, loading, error, data } = useMutation(
    (filterData: CreditCardFilter) => 
      apiClient.post<CreditCardListResponse>('/credit-cards/list', filterData),
    mutationOptions
  );

  const validateFilters = useCallback((filterData: CreditCardFilter): boolean => {
    const errors: Record<string, string> = {};

    // Validación de Account ID (11 dígitos)
    // if (filterData.accountId) {
    //   if (!/^\d{11}$/.test(filterData.accountId)) {
    //     errors.accountId = 'ACCOUNT FILTER, IF SUPPLIED MUST BE A 11 DIGIT NUMBER';
    //   }
    // }

    // Validación de Card Number (16 dígitos)
    if (filterData.cardNumber) {
      if (!/^\d{16}$/.test(filterData.cardNumber)) {
        errors.cardNumber = 'CARD ID FILTER, IF SUPPLIED MUST BE A 16 DIGIT NUMBER';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, []);

  const handleSearch = useCallback(async (filterData: CreditCardFilter) => {
    if (!validateFilters(filterData)) {
      return;
    }

    const searchData = {
      ...filterData,
      pageNumber: 1,
      pageSize: 7,
    };

    setFilters(searchData);
    setCurrentPage(1);
    setSelectedCards({});
    
    await fetchCards(searchData);
  }, [fetchCards, validateFilters]);

  const handlePageChange = useCallback(async (newPage: number) => {
    const pageData = {
      ...filters,
      pageNumber: newPage,
      pageSize: 7,
    };

    setCurrentPage(newPage);
    await fetchCards(pageData);
  }, [filters, fetchCards]);

  const handleCardSelection = useCallback((cardIndex: number, action: 'S' | 'U' | '') => {
    setSelectedCards(prev => {
      const newSelections = { ...prev };
      
      if (action === '') {
        delete newSelections[cardIndex];
      } else {
        // Solo permitir una selección a la vez (como en el COBOL original)
        Object.keys(newSelections).forEach(key => {
          delete newSelections[parseInt(key)];
        });
        newSelections[cardIndex] = action;
      }
      
      return newSelections;
    });
  }, []);

  const handleProcessSelection = useCallback(() => {
    const selectedEntries = Object.entries(selectedCards);
    
    if (selectedEntries.length === 0) {
      return;
    }

    if (selectedEntries.length > 1) {
      options.onError?.('PLEASE SELECT ONLY ONE RECORD TO VIEW OR UPDATE');
      return;
    }

    // Corregir la destructuración - selectedEntries[0] siempre existe aquí
    const firstEntry = selectedEntries[0];
    if (!firstEntry) {
      return;
    }

    const [cardIndexStr, action] = firstEntry;
    const cardIndex = parseInt(cardIndexStr);
    const selectedCard = data?.content[cardIndex];

    if (!selectedCard) {
      return;
    }

    // Navegar según la acción seleccionada
    if (action === 'S') {
      navigate('/cards/view', { 
        state: { 
          accountNumber: selectedCard.accountNumber,
          cardNumber: selectedCard.cardNumber 
        }
      });
    } else if (action === 'U') {
      navigate('/cards/update', { 
        state: { 
          accountNumber: selectedCard.accountNumber,
          cardNumber: selectedCard.cardNumber 
        }
      });
    }
  }, [selectedCards, data, navigate, options]);

  const handleExit = useCallback(() => {
    navigate('/menu/main');
  }, [navigate]);

  return {
    // Estado
    data,
    loading,
    error: error || (Object.keys(validationErrors).length > 0 ? 'Please correct the validation errors' : null),
    currentPage,
    filters,
    selectedCards,
    validationErrors,
    
    // Acciones
    handleSearch,
    handlePageChange,
    handleCardSelection,
    handleProcessSelection,
    handleExit,
    
    // Utilidades
    canGoNext: data ? !data.last : false,
    canGoPrev: data ? !data.first : false,
    totalPages: data?.totalPages || 0,
    totalElements: data?.totalElements || 0,
  };
}