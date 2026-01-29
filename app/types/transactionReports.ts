// app/types/transactionReports.ts
export interface TransactionReportRequest {
  startDate?: string;
  endDate?: string;
  confirmed: boolean;
}

export interface Transaction {
  transactionId: string;
  accountId: number;
  cardNumber: string;
  typeCode: string;
  typeDescription: string;
  categoryCode: number;
  categoryDescription: string;
  source: string;
  amount: number;
  processedTimestamp: string;
}

export interface AccountGroup {
  cardNumber: string;
  accountId: number;
  transactions: Transaction[];
  accountTotal: number;
  transactionCount: number;
}

export interface ReportData {
  reportType: string;
  startDate: string;
  endDate: string;
  accountGroups: AccountGroup[];
  grandTotal: number;
  totalTransactionCount: number;
  accountCount: number;
}

export interface TransactionReportResponse {
  success: boolean;
  message: string;
  reportType?: string;
  jobId?: string;
  timestamp?: string;
  reportData?: ReportData;
}

export interface TransactionReportState {
  reportType: 'monthly' | 'yearly' | 'custom' | null;
  startDate: string;
  endDate: string;
  confirmation: 'Y' | 'N' | '';
  validationErrors: Record<string, string>;
  isConfirmationStep: boolean;
  reportData: ReportData | null;
  showReport: boolean;
}