// app/components/billPayment/BillPaymentScreen.tsx
import { useState, useCallback } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Stack,
  Card,
  CardContent,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  AccountBalance,
  Payment,
  CheckCircle,
  Cancel,
  ArrowBack,
  Receipt,
  Info,
} from '@mui/icons-material';
import { SystemHeader } from '~/components/layout/SystemHeader';
import { LoadingSpinner } from '~/components/ui/LoadingSpinner';
import { useBillPayment } from '~/hooks/useBillPayment';
import { formatCurrency } from '~/utils';

export function BillPaymentScreen() {
  const theme = useTheme();
  const [accountInput, setAccountInput] = useState('');
  
  const {
    step,
    accountData,
    loading,
    error,
    handleAccountLookup,
    handlePaymentConfirm,
    resetForm,
  } = useBillPayment();

  const handleAccountSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault();
    handleAccountLookup(accountInput);
  }, [accountInput, handleAccountLookup]);

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // Limitar a 11 caracteres y solo números
    if (value.length <= 11 && /^\d*$/.test(value)) {
      setAccountInput(value);
    }
  }, []);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'F3' || event.key === 'Escape') {
      event.preventDefault();
      resetForm();
      setAccountInput('');
    } else if (event.key === 'F4') {
      event.preventDefault();
      setAccountInput('');
    }
  }, [resetForm]);

  const renderInputStep = () => (
    <Paper
      elevation={2}
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.default, 0.1)})`,
      }}
    >
      <Box
        sx={{
          p: 3,
          textAlign: 'center',
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          color: 'white',
        }}
      >
        <Payment sx={{ fontSize: 48, mb: 2 }} />
        <Typography variant="h5" fontWeight={600}>
          Bill Payment
        </Typography>
      </Box>

      <Box sx={{ p: 4 }}>
        <Typography
          variant="h6"
          color="primary.main"
          textAlign="center"
          gutterBottom
          sx={{ mb: 3 }}
        >
          Enter Account ID to view current balance
        </Typography>

        <Box
          component="form"
          onSubmit={handleAccountSubmit}
          sx={{ maxWidth: 400, mx: 'auto' }}
        >
          <Stack spacing={3}>
            <TextField
              label="Enter Acct ID"
              value={accountInput}
              onChange={handleInputChange}
              disabled={loading}
              autoFocus
              placeholder="12345678901"
              helperText="Enter the 11-digit account number"
              inputProps={{
                maxLength: 11,
                style: { textAlign: 'center', fontSize: '1.1rem', fontWeight: 600 },
              }}
              InputProps={{
                startAdornment: <AccountBalance color="primary" sx={{ mr: 1 }} />,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={!accountInput || loading}
              startIcon={loading ? <LoadingSpinner size={20} /> : <Payment />}
              sx={{
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
              }}
            >
              {loading ? 'Looking up account...' : 'Continue'}
            </Button>
          </Stack>
        </Box>
      </Box>
    </Paper>
  );

  const renderConfirmStep = () => (
    <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
      {/* Account Info */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="primary.main">
            Account Information
          </Typography>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body1">
              Account ID: <strong>{accountData?.accountId}</strong>
            </Typography>
            <Chip label="Active" color="success" size="small" />
          </Stack>
        </CardContent>
      </Card>

      {/* Balance Display */}
      <Box
        sx={{
          p: 3,
          textAlign: 'center',
          bgcolor: alpha(theme.palette.info.main, 0.1),
          border: `1px solid ${theme.palette.info.main}`,
          borderRadius: 2,
          mb: 3,
        }}
      >
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Your current balance is:
        </Typography>
        <Typography
          variant="h4"
          color="primary.main"
          fontWeight={700}
          sx={{ mb: 2 }}
        >
          {formatCurrency(accountData?.currentBalance || 0)}
        </Typography>
      </Box>

      {/* Confirmation */}
      <Box sx={{ p: 3 }}>
        <Typography
          variant="h6"
          textAlign="center"
          color="text.primary"
          gutterBottom
        >
          Do you want to pay your balance now? Please confirm:
        </Typography>

        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
          <Button
            variant="contained"
            color="success"
            size="large"
            startIcon={<CheckCircle />}
            onClick={() => handlePaymentConfirm(true)}
            disabled={loading}
            sx={{ minWidth: 120 }}
          >
            Yes (Y)
          </Button>
        </Stack>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <LoadingSpinner />
            <Typography variant="body2" sx={{ ml: 2 }}>
              Processing payment...
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );

  const renderProcessingStep = () => (
    <Paper elevation={2} sx={{ borderRadius: 3, p: 4, textAlign: 'center' }}>
      <LoadingSpinner size={64} />
      <Typography variant="h6" sx={{ mt: 2 }}>
        Processing your request...
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Please wait while we process your bill payment
      </Typography>
    </Paper>
  );

  const renderSuccessStep = () => (
    <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden', textAlign: 'center' }}>
      <Box
        sx={{
          p: 4,
          background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
          color: 'white',
        }}
      >
        <CheckCircle sx={{ fontSize: 64, mb: 2 }} />
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Payment Successful!
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          {accountData?.message}
        </Typography>
      </Box>

      <Box sx={{ p: 4 }}>
        <Card sx={{ mb: 3, bgcolor: alpha(theme.palette.success.main, 0.1) }}>
          <CardContent>
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body1">Transaction ID:</Typography>
                <Typography variant="body1" fontWeight={600}>
                  {accountData?.transactionId}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body1">Amount Paid:</Typography>
                <Typography variant="body1" fontWeight={600}>
                  {formatCurrency(accountData?.paymentAmount || 0)}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body1">New Balance:</Typography>
                <Typography variant="body1" fontWeight={600} color="success.main">
                  {formatCurrency(accountData?.currentBalance || 0)}
                </Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="contained"
            startIcon={<Receipt />}
            onClick={() => {
              console.log('Print receipt for transaction:', accountData?.transactionId);
            }}
          >
            Print Receipt
          </Button>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => {
              resetForm();
              setAccountInput('');
            }}
          >
            New Payment
          </Button>
        </Stack>
      </Box>
    </Paper>
  );

  const renderAlreadyPaidStep = () => (
    <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden', textAlign: 'center' }}>
      <Box
        sx={{
          p: 4,
          background: `linear-gradient(135deg, ${theme.palette.info.main}, ${theme.palette.info.dark})`,
          color: 'white',
        }}
      >
        <Info sx={{ fontSize: 64, mb: 2 }} />
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Account Already Paid
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          This account has no outstanding balance
        </Typography>
      </Box>

      <Box sx={{ p: 4 }}>
        <Card sx={{ mb: 3, bgcolor: alpha(theme.palette.info.main, 0.1) }}>
          <CardContent>
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body1">Account ID:</Typography>
                <Typography variant="body1" fontWeight={600}>
                  {accountData?.accountId}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body1">Current Balance:</Typography>
                <Typography variant="body1" fontWeight={600} color="success.main">
                  {formatCurrency(accountData?.currentBalance || 0)}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body1">Status:</Typography>
                <Chip label="Paid in Full" color="success" size="small" />
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
          <Typography variant="body1">
            {accountData?.message || 'Your account balance is already paid in full. No payment is required at this time.'}
          </Typography>
        </Alert>

        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => {
            resetForm();
            setAccountInput('');
          }}
        >
          Check Another Account
        </Button>
      </Box>
    </Paper>
  );

  const renderErrorStep = () => (
    <Paper elevation={2} sx={{ borderRadius: 3, p: 4, textAlign: 'center' }}>
      <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Payment Error
        </Typography>
        <Typography variant="body1">
          {error || 'An unexpected error occurred'}
        </Typography>
      </Alert>

      <Button
        variant="outlined"
        startIcon={<ArrowBack />}
        onClick={() => {
          resetForm();
          setAccountInput('');
        }}
      >
        Try Again
      </Button>
    </Paper>
  );

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Box onKeyDown={handleKeyDown} tabIndex={-1}>
        <SystemHeader
          transactionId="CB00"
          programName="COBIL00C"
          title="CardDemo - Bill Payment"
          subtitle="Pay Account Balance in Full"
        />

        {step === 'input' && renderInputStep()}
        {step === 'confirm' && renderConfirmStep()}
        {step === 'processing' && renderProcessingStep()}
        {step === 'success' && renderSuccessStep()}
        {step === 'already-paid' && renderAlreadyPaidStep()}
        {step === 'error' && renderErrorStep()}

        {/* Footer */}
        <Box
          sx={{
            mt: 3,
            p: 2,
            bgcolor: alpha(theme.palette.grey[100], 0.5),
            borderRadius: 2,
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            ENTER = Continue • F3 = Back • F4 = Clear
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}