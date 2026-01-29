// app/pages/TransactionViewPage.tsx
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, Snackbar } from '@mui/material';
import { TransactionViewScreen } from '~/components/transaction/TransactionViewScreen';

export default function TransactionViewPage() {
  const { transactionId } = useParams<{ transactionId?: string }>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleError = (error: string) => {
    setErrorMessage(error);
  };

  return (
    <>
      <TransactionViewScreen
        {...(transactionId && { initialTransactionId: transactionId })}
        onError={handleError}
      />
      
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