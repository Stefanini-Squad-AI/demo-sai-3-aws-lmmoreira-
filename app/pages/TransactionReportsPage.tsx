// app/pages/TransactionReportsPage.tsx
import React, { useState } from 'react';
import { Alert, Snackbar } from '@mui/material';
import { TransactionReportsScreen } from '~/components/transaction/TransactionReportsScreen';
import type { TransactionReportResponse } from '~/types/transactionReports';

export default function TransactionReportsPage() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSuccess = (data: TransactionReportResponse) => {
    if (data.success) {
      setSuccessMessage(data.message);
    } else {
      setErrorMessage(data.message);
    }
  };

  const handleError = (error: string) => {
    setErrorMessage(error);
  };

  return (
    <>
      <TransactionReportsScreen
        onSuccess={handleSuccess}
        onError={handleError}
      />
      
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSuccessMessage(null)}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setErrorMessage(null)}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
}