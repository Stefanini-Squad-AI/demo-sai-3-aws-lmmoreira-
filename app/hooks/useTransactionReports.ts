// app/hooks/useTransactionReports.ts
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from './useApi';
import { apiClient } from '~/services/api';
import type { 
  TransactionReportRequest, 
  TransactionReportResponse,
  TransactionReportState 
} from '~/types/transactionReports';

interface UseTransactionReportsOptions {
  onError?: (error: string) => void;
  onSuccess?: (data: TransactionReportResponse) => void;
}

export function useTransactionReports(options: UseTransactionReportsOptions = {}) {
  const navigate = useNavigate();
  
  const [state, setState] = useState<TransactionReportState>({
    reportType: null,
    startDate: '',
    endDate: '',
    confirmation: '',
    validationErrors: {},
    isConfirmationStep: false,
    reportData: null,
    showReport: false,
  });

  const createMutationOptions = useCallback((onSuccess: (data: TransactionReportResponse) => void) => ({
    onSuccess,
    ...(options.onError && { onError: options.onError }),
  }), [options.onError]);

  // Mutation for monthly report
  const { mutate: generateMonthlyReport, loading: loadingMonthly } = useMutation(
    async (request: TransactionReportRequest) => {
      const response = await apiClient.post<TransactionReportResponse>(
        '/v1/reports/transactions/monthly',
        request
      );
      return response;
    },
    createMutationOptions((data: TransactionReportResponse) => {
      if (data.success && data.reportData) {
        setState(prev => ({
          ...prev,
          reportData: data.reportData!,
          showReport: true,
          reportType: null,
          confirmation: '',
          validationErrors: {},
          isConfirmationStep: false,
        }));
      }
      options.onSuccess?.(data);
    })
  );

  // Mutation for yearly report
  const { mutate: generateYearlyReport, loading: loadingYearly } = useMutation(
    async (request: TransactionReportRequest) => {
      const response = await apiClient.post<TransactionReportResponse>(
        '/v1/reports/transactions/yearly',
        request
      );
      return response;
    },
    createMutationOptions((data: TransactionReportResponse) => {
      if (data.success && data.reportData) {
        setState(prev => ({
          ...prev,
          reportData: data.reportData!,
          showReport: true,
          reportType: null,
          confirmation: '',
          validationErrors: {},
          isConfirmationStep: false,
        }));
      }
      options.onSuccess?.(data);
    })
  );

  // Mutation for custom report
  const { mutate: generateCustomReport, loading: loadingCustom } = useMutation(
    async (request: TransactionReportRequest) => {
      const response = await apiClient.post<TransactionReportResponse>(
        '/v1/reports/transactions/custom',
        request
      );
      return response;
    },
    createMutationOptions((data: TransactionReportResponse) => {
      if (data.success && data.reportData) {
        setState(prev => ({
          ...prev,
          reportData: data.reportData!,
          showReport: true,
          startDate: '',
          endDate: '',
          reportType: null,
          confirmation: '',
          validationErrors: {},
          isConfirmationStep: false,
        }));
      }
      options.onSuccess?.(data);
    })
  );

  // Validations
  const validateCustomDates = useCallback((): boolean => {
    const errors: Record<string, string> = {};

    if (!state.startDate) {
      errors.startDate = 'Start Date can NOT be empty...';
    }

    if (!state.endDate) {
      errors.endDate = 'End Date can NOT be empty...';
    }

    if (state.startDate && state.endDate) {
      const startDate = new Date(state.startDate);
      const endDate = new Date(state.endDate);
      
      if (startDate > endDate) {
        errors.endDate = 'Start Date cannot be after End Date...';
      }
    }

    setState(prev => ({ ...prev, validationErrors: errors }));
    return Object.keys(errors).length === 0;
  }, [state.startDate, state.endDate]);

  // Handle report type selection
  const handleReportTypeSelect = useCallback((type: 'monthly' | 'yearly' | 'custom') => {
    setState(prev => ({
      ...prev,
      reportType: type,
      validationErrors: {},
      isConfirmationStep: false,
      confirmation: '',
      showReport: false,
    }));
  }, []);

  // Handle date changes
  const handleDateChange = useCallback((field: 'startDate' | 'endDate', value: string) => {
    setState(prev => ({
      ...prev,
      [field]: value,
      validationErrors: { ...prev.validationErrors, [field]: '' },
    }));
  }, []);

  // Handle confirmation
  const handleConfirmationChange = useCallback((value: 'Y' | 'N' | '') => {
    setState(prev => ({
      ...prev,
      confirmation: value,
      validationErrors: { ...prev.validationErrors, confirmation: '' },
    }));
  }, []);

  // Process submission
  const handleSubmit = useCallback(async () => {
    if (!state.reportType) {
      setState(prev => ({
        ...prev,
        validationErrors: { reportType: 'Please select a report type...' }
      }));
      return;
    }

    if (!state.confirmation || !/^[YyNn]$/.test(state.confirmation)) {
      setState(prev => ({
        ...prev,
        validationErrors: { confirmation: 'Please confirm to generate the report (Y/N)...' }
      }));
      return;
    }

    if (state.confirmation.toUpperCase() === 'N') {
      setState(prev => ({
        ...prev,
        reportType: null,
        startDate: '',
        endDate: '',
        confirmation: '',
        validationErrors: {},
        isConfirmationStep: false,
        showReport: false,
      }));
      
      options.onSuccess?.({
        success: true,
        message: 'Report generation cancelled by user.',
        reportType: state.reportType,
        jobId: '',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const request: TransactionReportRequest = {
      confirmed: true,
    };

    try {
      switch (state.reportType) {
        case 'monthly':
          await generateMonthlyReport(request);
          break;
        case 'yearly':
          await generateYearlyReport(request);
          break;
        case 'custom':
          if (!validateCustomDates()) return;
          request.startDate = state.startDate;
          request.endDate = state.endDate;
          await generateCustomReport(request);
          break;
      }
    } catch (error) {
      console.error('Error generating report:', error);
    }
  }, [state, generateMonthlyReport, generateYearlyReport, generateCustomReport, validateCustomDates, options]);

  // Clear form
  const handleClear = useCallback(() => {
    setState({
      reportType: null,
      startDate: '',
      endDate: '',
      confirmation: '',
      validationErrors: {},
      isConfirmationStep: false,
      reportData: null,
      showReport: false,
    });
  }, []);

  // Close report
  const handleCloseReport = useCallback(() => {
    setState(prev => ({
      ...prev,
      showReport: false,
      reportData: null,
    }));
  }, []);

  // Download TXT
  const handleDownloadPDF = useCallback(() => {
    if (!state.reportData) return;

    // Generate PDF content
    const generatePDFContent = () => {
      let content = `DETAILED TRANSACTION REPORT\n`;
      content += `Type: ${state.reportData!.reportType}\n`;
      content += `Period: ${state.reportData!.startDate} - ${state.reportData!.endDate}\n`;
      content += `Accounts: ${state.reportData!.accountCount} | Transactions: ${state.reportData!.totalTransactionCount}\n\n`;
      
      content += `${'TRANS ID'.padEnd(12)} ${'CARD'.padEnd(20)} ${'TYPE'.padEnd(6)} ${'TYPE DESC'.padEnd(15)} ${'CAT'.padEnd(5)} ${'CAT DESC'.padEnd(25)} ${'SOURCE'.padEnd(12)} ${'AMOUNT'.padStart(12)}\n`;
      content += `${'-'.repeat(12)} ${'-'.repeat(20)} ${'-'.repeat(6)} ${'-'.repeat(15)} ${'-'.repeat(5)} ${'-'.repeat(25)} ${'-'.repeat(12)} ${'-'.repeat(12)}\n`;

      state.reportData!.accountGroups.forEach((group, groupIndex) => {
        if (groupIndex > 0) {
          content += `${'-'.repeat(120)}\n`;
        }

        group.transactions.forEach(tx => {
          const txId = tx.transactionId.replace(/^0+/, '') || '0';
          const cardNumber = tx.cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
          const amount = new Intl.NumberFormat('en-US', { 
            style: 'currency', 
            currency: 'USD' 
          }).format(tx.amount);

          content += `${txId.padEnd(12)} ${cardNumber.padEnd(20)} ${tx.typeCode.padEnd(6)} ${tx.typeDescription.substring(0, 15).padEnd(15)} ${tx.categoryCode.toString().padStart(3, '0').padEnd(5)} ${tx.categoryDescription.substring(0, 25).padEnd(25)} ${tx.source.substring(0, 12).padEnd(12)} ${amount.padStart(12)}\n`;
        });

        const accountTotal = new Intl.NumberFormat('en-US', { 
          style: 'currency', 
          currency: 'USD' 
        }).format(group.accountTotal);
        
        content += `ACCOUNT TOTAL (${group.transactionCount} trans): ${accountTotal.padStart(12)}\n`;
      });

      const grandTotal = new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD' 
      }).format(state.reportData!.grandTotal);
      
      content += `${'='.repeat(120)}\n`;
      content += `GRAND TOTAL (${state.reportData!.totalTransactionCount} transactions): ${grandTotal.padStart(12)}\n`;

      return content;
    };

    // Download as text file (simulating PDF)
    const content = generatePDFContent();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transaction-report-${state.reportData.reportType}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }, [state.reportData]);

  // Exit
  const handleExit = useCallback(() => {
    navigate('/menu/main');
  }, [navigate]);

  return {
    // State
    ...state,
    loading: loadingMonthly || loadingYearly || loadingCustom,
    
    // Actions
    handleReportTypeSelect,
    handleDateChange,
    handleConfirmationChange,
    handleSubmit,
    handleClear,
    handleCloseReport,
    handleDownloadPDF,
    handleExit,
  };
}