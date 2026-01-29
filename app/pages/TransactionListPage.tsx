// app/pages/TransactionListPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Snackbar } from '@mui/material';
import { TransactionListScreen } from '~/components/transaction/TransactionListScreen';

export default function TransactionListPage() {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleTransactionSelect = (transactionId: string) => {
    setSuccessMessage(`Navigating to transaction details: ${transactionId}`);
    // La navegación real se maneja en el hook
  };

  const handleError = (error: string) => {
    setErrorMessage(error);
  };

  return (
    <>
      <TransactionListScreen
        onTransactionSelect={handleTransactionSelect}
        onError={handleError}
      />
      
      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
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